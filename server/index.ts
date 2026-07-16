import "dotenv/config";
import express from "express";
import { AnalyzeError, analyze, RequestSchema } from "./analyze";
import { checkRateLimit, clientIp } from "./rateLimit";

/**
 * Local dev server. In production this route is served by api/analyze.ts as a
 * Vercel function — both are thin wrappers over the same analyze() core, so the
 * prompt and schema stay identical. This file is not deployed.
 */

const PORT = Number(process.env.PORT ?? 8787);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key from\n" +
      "https://platform.claude.com/settings/keys — the server cannot analyze jobs without it.",
  );
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/api/analyze", async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Please fill in your goal, target role, job title, and the posting." });
    return;
  }

  // Checked after validation: only calls that reach the model cost money, and a
  // student fumbling the form shouldn't burn their own quota.
  const ip = clientIp(req.headers["x-forwarded-for"] as string | undefined, req.socket.remoteAddress);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({ error: "You've run a few analyses just now — give it a few minutes." });
    return;
  }

  try {
    res.json(await analyze(parsed.data));
  } catch (err) {
    if (err instanceof AnalyzeError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("Unexpected failure:", err);
    res.status(500).json({ error: "The analysis failed. Try again in a moment." });
  }
});

app.listen(PORT, () => {
  console.log(`Alignly API listening on http://localhost:${PORT}`);
});
