## ALIGNLY

A career alignment tool for interns and co-op students. Paste a job posting, and Alignly reads it
against your stated goals and tells you honestly whether it moves you forward.

See [DESIGN_BRIEF.md](DESIGN_BRIEF.md) for the product and design intent.

## Setup

```sh
npm install
cp .env.example .env      # then add your key from https://platform.claude.com/settings/keys
npm run dev
```

The app runs at http://localhost:5173. The analysis API runs at http://localhost:8787 and Vite
proxies `/api` to it, so you only need the one URL.

Without an `ANTHROPIC_API_KEY` the API server refuses to start. The landing page's
"See a sample verdict" link uses a canned verdict and works without a key.

## How it works

The four screens are a single-page flow with no router — `App.tsx` holds the screen state, the
user's profile, and the job posting, and renders one screen component at a time.

| Path | What's there |
| --- | --- |
| [src/App.tsx](src/App.tsx) | Screen state, profile/job state, the analyze call |
| [src/components/](src/components/) | One component per screen, plus the shared step header |
| [src/theme.ts](src/theme.ts) | Colors, type, and the verdict/tone palettes |
| [server/analyze.ts](server/analyze.ts) | The prompt, the schema, and the Claude call |
| [server/rateLimit.ts](server/rateLimit.ts) | Per-IP request cap |
| [server/index.ts](server/index.ts) | Local dev server — thin wrapper, not deployed |
| [api/analyze.ts](api/analyze.ts) | Production Vercel function — thin wrapper |

The verdict comes from Claude via `POST /api/analyze`. The API key lives only on the server —
it is never shipped to the browser, which is why the backend exists at all.

That route has two wrappers over one core. Locally it's an Express server; in production it's a
Vercel function. Both call the same `analyze()` in `server/analyze.ts`, so the prompt and schema
cannot drift between dev and prod. Change behaviour there, not in a wrapper.

The response shape is pinned with a Zod schema and the Claude API's structured outputs, so the
model must return a score, verdict, headline, bottom line, exactly four feedback sections, and
three questions. The frontend can render the result without defensive parsing.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Frontend and API together, both watching |
| `npm run typecheck` | `tsc --noEmit` across `src/`, `server/`, and `api/` |
| `npm run build` | Production frontend build into `dist/` |

## Deploying to Vercel

```sh
npx vercel        # first run links the project
npx vercel --prod
```

Vercel auto-detects Vite, builds to `dist/`, and serves `api/analyze.ts` as a function. No
`vercel.json` is needed.

**Set the key in Vercel, not in a file.** In the dashboard, go to Settings → Environment
Variables and add `ANTHROPIC_API_KEY` for the Production and Preview environments. `.env` is
gitignored and never reaches Vercel — that's deliberate. Deploying without this variable gives a
site where every analysis fails with "the server is misconfigured".

**Don't lower `maxDuration`.** [api/analyze.ts](api/analyze.ts) sets it to 60 seconds because a
real analysis takes 12–14s and Vercel's default cap is 10s. At the default, every analysis times
out in production while working perfectly on localhost.

### Before sharing the URL publicly

The endpoint is unauthenticated, and each analysis spends real credit from your Anthropic
balance. [server/rateLimit.ts](server/rateLimit.ts) caps each IP at 5 analyses per 10 minutes,
which stops accidents and casual loops. It is in-memory, so it only limits within one warm
instance and resets on cold start — it is not protection against someone deliberately draining
your balance. If this goes anywhere genuinely public, move the limiter to a shared store
(Vercel KV / Upstash) or put auth in front of the route.
