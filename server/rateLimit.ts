/**
 * A small fixed-window rate limiter, keyed by client IP.
 *
 * Deliberately in-memory: it needs no external service and costs nothing. The
 * tradeoff is that it only limits within a single warm instance — Vercel may run
 * several concurrently, and memory resets on cold start, so a determined abuser
 * can exceed the nominal limit. It stops loops and accidents, not an attacker.
 *
 * If this endpoint ever needs real protection, swap the Map for a shared store
 * (Vercel KV / Upstash Redis); the call signature here stays the same.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
/** Bounds memory if many distinct IPs hit a long-lived instance. */
const MAX_TRACKED_IPS = 5000;

type Window = { count: number; resetAt: number };

const hits = new Map<string, Window>();

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string, now = Date.now()): RateLimitResult {
  const existing = hits.get(ip);

  if (existing === undefined || now >= existing.resetAt) {
    if (hits.size >= MAX_TRACKED_IPS) {
      for (const [key, win] of hits) if (now >= win.resetAt) hits.delete(key);
      if (hits.size >= MAX_TRACKED_IPS) hits.clear();
    }
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true };
}

/** Vercel sets x-forwarded-for; the client's own IP is the first entry. */
export function clientIp(forwardedFor: string | undefined, fallback: string | undefined): string {
  const first = forwardedFor?.split(",")[0]?.trim();
  return first !== undefined && first !== "" ? first : (fallback ?? "unknown");
}
