import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * The analysis core. Shared by the local Express dev server (server/index.ts)
 * and the deployed Vercel function (api/analyze.ts) so the prompt and schema
 * can't drift between them.
 */

/**
 * The four sections are fixed by the design, so the model fills them rather than
 * inventing its own. `tone` drives the chip colour on the result card.
 */
const VerdictSchema = z.object({
  score: z.number().describe("Fit score from 0 to 100."),
  verdict: z
    .enum(["strong", "partial", "misaligned"])
    .describe("strong is roughly 75-100, partial 45-74, misaligned 0-44."),
  headline: z.string().describe("One sentence, under 120 characters, addressed to the student."),
  bottomLine: z
    .string()
    .describe(
      "Two to three sentences of direct advice. The most important text on the page — say the honest thing.",
    ),
  sections: z
    .array(
      z.object({
        title: z.enum(["Where it aligns", "Where it diverges", "What you'd grow", "Watch out for"]),
        tone: z.enum(["pos", "neu", "warn"]),
        points: z.array(z.string()).describe("Two short bullets, each under 90 characters."),
      }),
    )
    .describe(
      "Exactly four sections in this order: Where it aligns (pos), Where it diverges (neu), What you'd grow (pos), Watch out for (warn).",
    ),
  questions: z
    .array(
      z.object({
        n: z.number().describe("1, 2, or 3."),
        t: z.string().describe("A question the student should ask the employer."),
      }),
    )
    .describe("Exactly three questions."),
});

export const RequestSchema = z.object({
  user: z.object({
    program: z.string(),
    goal: z.string().min(1),
    role: z.string().min(1),
    build: z.string(),
  }),
  job: z.object({
    title: z.string().min(1),
    company: z.string(),
    desc: z.string().min(1),
  }),
});

export type AnalyzeInput = z.infer<typeof RequestSchema>;
export type AnalyzeOutput = z.infer<typeof VerdictSchema>;

const SYSTEM = `You are Alignly, an honest career advisor for university interns and co-op students.

A student gives you their goals and a job posting. You judge whether that job moves them toward
their stated goal — not whether it is a good job in the abstract.

How to judge:
- Measure the posting against what the student actually said they want. Their goal is the ruler.
- Be honest above all. If the job is misaligned, say so plainly and score it low. A student who
  takes a bad-fit role because you were vague is worse off than one you told the truth to.
- Ground every point in the posting's own text. Do not invent responsibilities, tech, or team
  details that are not there. If the posting is vague on something the student cares about, that
  is itself a finding — say it is unstated rather than assuming.
- Warm, not soft. You are a mentor who respects them enough to be straight with them.

How to write:
- Second person, direct, no corporate hedging and no cheerleading.
- Concrete over generic: "no backend work in scope" beats "some skills may not align."
- The bottom line carries the most weight — it should be the sentence they remember.`;

/** An error carrying the HTTP status and the message safe to show the student. */
export class AnalyzeError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AnalyzeError";
  }
}

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient === null) cachedClient = new Anthropic();
  return cachedClient;
}

export async function analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
  const { user, job } = input;

  let message;
  try {
    message = await getClient().messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      output_config: { format: zodOutputFormat(VerdictSchema) },
      messages: [
        {
          role: "user",
          content: `<student>
Program: ${user.program || "(not given)"}
Three-year career goal: ${user.goal}
Role they're aiming for: ${user.role}
What they want to build this term: ${user.build || "(not given)"}
</student>

<job_posting>
Title: ${job.title}
Company: ${job.company || "(not given)"}

${job.desc}
</job_posting>

Judge this posting against this student's goals.`,
        },
      ],
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw new AnalyzeError(429, "Too many requests right now. Wait a moment and try again.");
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic auth failed — check ANTHROPIC_API_KEY.");
      throw new AnalyzeError(500, "The server is misconfigured. Check the server logs.");
    }
    console.error("Analysis failed:", err);
    throw new AnalyzeError(500, "The analysis failed. Try again in a moment.");
  }

  // Usage lands in the logs so you can watch real spend rather than estimate it.
  const u = message.usage;
  console.log(
    `[analyze] in=${u.input_tokens} out=${u.output_tokens} ` +
      `cache_read=${u.cache_read_input_tokens ?? 0} stop=${message.stop_reason}`,
  );

  if (message.stop_reason === "refusal") {
    throw new AnalyzeError(422, "This posting couldn't be analyzed. Try a different one.");
  }
  if (message.parsed_output === null) {
    throw new AnalyzeError(502, "The analysis came back malformed. Try again.");
  }

  return message.parsed_output;
}
