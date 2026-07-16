import type { VercelRequest, VercelResponse } from "@vercel/node";
// The .js extensions are required, not stylistic: package.json sets "type": "module",
// so this compiles to ESM, and Node's ESM loader rejects extensionless relative
// imports at runtime. tsx and Vite tolerate them locally, so dropping these fails
// only in production, as ERR_MODULE_NOT_FOUND.
import { AnalyzeError, analyze, RequestSchema } from "../server/analyze.js";
import { checkRateLimit, clientIp } from "../server/rateLimit.js";

/**
 * Timeout note: a real analysis takes 12-14s (Opus with adaptive thinking on a
 * judgment task), which blows past Vercel's 10s default and would time out in
 * production while working fine locally.
 *
 * The 60s override lives in vercel.json, NOT here — an `export const maxDuration`
 * in this file is silently ignored on a Vite project (verified: it never reached
 * the built .vc-config.json). Change it there.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const parsed = RequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Please fill in your goal, target role, job title, and the posting." });
    return;
  }

  // Checked after validation: only calls that reach the model cost money, and a
  // student fumbling the form shouldn't burn their own quota.
  const ip = clientIp(
    typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"] : undefined,
    req.socket?.remoteAddress,
  );
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({ error: "You've run a few analyses just now — give it a few minutes." });
    return;
  }

  try {
    res.status(200).json(await analyze(parsed.data));
  } catch (err) {
    if (err instanceof AnalyzeError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("Unexpected failure:", err);
    res.status(500).json({ error: "The analysis failed. Try again in a moment." });
  }
}
