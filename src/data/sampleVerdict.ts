import type { Verdict } from "../types";

/** Shown on the landing page's "See a sample verdict" path — no API call. */
export const sampleVerdict: Verdict = {
  score: 88,
  verdict: "strong",
  headline: "This role points straight at where you said you want to go.",
  bottomLine:
    "Take this one seriously. It builds the exact muscles you named for this term and sits squarely on your three-year path — the kind of co-op you can point back to later and say it mattered.",
  sections: [
    {
      title: "Where it aligns",
      tone: "pos",
      points: [
        "Backend-heavy scope matches your target role",
        "You’d ship real features, exactly what you named",
      ],
    },
    {
      title: "Where it diverges",
      tone: "neu",
      points: [
        "Team is small, so less formal mentorship",
        "Cloud infra exposure is lighter than hoped",
      ],
    },
    {
      title: "What you’d grow",
      tone: "pos",
      points: [
        "Production code review habits",
        "Owning a feature from spec to release",
      ],
    },
    {
      title: "Watch out for",
      tone: "warn",
      points: [
        "On-call rotation may cut into learning time",
        "Confirm the mentor is still on the team",
      ],
    },
  ],
  questions: [
    { n: 1, t: "What would I own end-to-end by the last month, and who reviews it?" },
    { n: 2, t: "How much of the work is the systems side you want, versus support tasks?" },
    { n: 3, t: "What have past interns gone on to do after this team?" },
  ],
};
