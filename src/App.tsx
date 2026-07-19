import { useState } from "react";
import { analyzeJob } from "./api";
import { AboutTheUser } from "./components/AboutTheUser";
import { LandingPage } from "./components/LandingPage";
import { TheJob } from "./components/TheJob";
import { TheResult } from "./components/TheResult";
import { sampleVerdict } from "./data/sampleVerdict";
import { cream, hairline, ink, ink50, serif } from "./theme";
import type { JobPosting, UserProfile, Verdict } from "./types";

type Screen = "landing" | "user" | "job" | "result";

/** Whether the result screen was reached via the flow or the landing-page sample. */
type ResultOrigin = "flow" | "sample";

const emptyUser: UserProfile = { program: "", goal: "", role: "", build: "" };
const emptyJob: JobPosting = { title: "", company: "", desc: "" };

export function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<UserProfile>(emptyUser);
  const [job, setJob] = useState<JobPosting>(emptyJob);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [resultOrigin, setResultOrigin] = useState<ResultOrigin>("flow");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function go(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0 });
  }

  function seeSample() {
    setVerdict(sampleVerdict);
    setResultOrigin("sample");
    go("result");
  }

  async function analyze() {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeJob({ user, job });
      setVerdict(result);
      setResultOrigin("flow");
      go("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: cream,
      }}
    >
      {/*
        The Figma backdrop. The cream `background` on the wrapper above shows
        through until this loads, and stays as the fallback if it 404s, so the
        page is never bare white.
      */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/assets/alignly-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Light scrim toward the edges. Kept gentle — the artwork is already pale,
          and the design's heavier version flattened it. */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 90% at 50% 12%, rgba(255,244,235,0) 55%, rgba(255,244,235,.35) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "clamp(20px,3vw,30px) clamp(22px,5vw,64px)",
            gap: 16,
          }}
        >
          <button
            onClick={() => go("landing")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "baseline",
              gap: 9,
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <span
              style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: "clamp(23px,2.4vw,27px)",
                letterSpacing: "-.01em",
                color: ink,
              }}
            >
              Alignly
            </span>
          </button>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              color: "rgba(61,21,52,.55)",
            }}
          >
            Career alignment tool for students
          </span>
        </header>

        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {screen === "landing" && <LandingPage onStart={() => go("user")} onSeeSample={seeSample} />}

          {screen === "user" && (
            <AboutTheUser
              user={user}
              onChange={(patch) => setUser((u) => ({ ...u, ...patch }))}
              onBack={() => go("landing")}
              onNext={() => go("job")}
            />
          )}

          {screen === "job" && (
            <TheJob
              job={job}
              analyzing={analyzing}
              error={error}
              onChange={(patch) => setJob((j) => ({ ...j, ...patch }))}
              onBack={() => go("user")}
              onAnalyze={() => void analyze()}
            />
          )}

          {screen === "result" && verdict !== null && (
            <TheResult
              verdict={verdict}
              backLabel={resultOrigin === "sample" ? "← Back" : "← Edit the job"}
              onBack={() => go(resultOrigin === "sample" ? "landing" : "job")}
            />
          )}
        </main>

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "26px 22px 34px",
            fontSize: 13,
            color: ink50,
            borderTop: `1px solid ${hairline}00`,
          }}
        >
          <span style={{ fontFamily: serif, fontWeight: 500 }}>Alignly</span> 2026 &nbsp;·&nbsp; Built by
          Nat
        </footer>
      </div>
    </div>
  );
}
