import type { AnalyzeRequest, Verdict } from "./types";

export async function analyzeJob(body: AnalyzeRequest, signal?: AbortSignal): Promise<Verdict> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    ...(signal ? { signal } : {}),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    const message =
      detail !== null && typeof detail === "object" && "error" in detail
        ? String((detail as { error: unknown }).error)
        : `The analysis failed (HTTP ${res.status}). Try again in a moment.`;
    throw new Error(message);
  }

  return (await res.json()) as Verdict;
}
