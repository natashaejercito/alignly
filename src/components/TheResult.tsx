import { useEffect, useRef, useState } from "react";
import { cream, hairline, ink, ink50, ink60, serif, tonePalette, verdictPalette } from "../theme";
import type { Question, Verdict } from "../types";

const RING_RADIUS = 63;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Numbered plain-text lines — the shape you'd want pasted into interview notes. */
function questionsAsText(questions: Question[]): string {
  return questions.map((q) => `${q.n}. ${q.t}`).join("\n");
}

type CopyState = "idle" | "copied" | "failed";

function CopyQuestions({ questions }: { questions: Question[] }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(questionsAsText(questions));
      setState("copied");
    } catch {
      // Clipboard can be blocked by permissions or a non-secure origin.
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  }

  const label =
    state === "copied" ? "Copied ✓" : state === "failed" ? "Press ⌘C to copy" : "Copy all";

  return (
    <button
      onClick={() => void copy()}
      aria-label="Copy all questions to clipboard"
      style={{
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12.5,
        fontWeight: 600,
        letterSpacing: ".02em",
        color: state === "copied" ? "#2E5A3E" : ink60,
        background: state === "copied" ? "#E4EFE6" : "rgba(255,244,235,.6)",
        border: `1px solid ${state === "copied" ? "rgba(46,90,62,.45)" : "rgba(61,21,52,.28)"}`,
        borderRadius: 999,
        padding: "6px 13px",
        transition: "background .2s ease, color .2s ease, border-color .2s ease",
      }}
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}

type Props = {
  verdict: Verdict;
  backLabel: string;
  onBack: () => void;
};

export function TheResult({ verdict, backLabel, onBack }: Props) {
  const palette = verdictPalette[verdict.verdict];
  const score = Math.max(0, Math.min(100, verdict.score));
  const ringOffset = RING_CIRCUMFERENCE * (1 - score / 100);

  return (
    <div
      style={{
        animation: "floatIn .55s ease both",
        maxWidth: 760,
        width: "100%",
        margin: "0 auto",
        padding: "clamp(8px,2vw,24px) clamp(22px,5vw,32px) 70px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            color: ink60,
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {backLabel}
        </button>
      </div>

      {/* verdict header — score, token, headline */}
      <div
        style={{
          background: "rgba(255,244,235,.86)",
          border: `1px solid ${hairline}`,
          borderRadius: 26,
          padding: "clamp(24px,3.4vw,38px)",
          boxShadow: "0 16px 48px rgba(61,21,52,.1)",
          backdropFilter: "blur(5px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "clamp(22px,3.4vw,38px)",
          }}
        >
          <div style={{ flex: "none", position: "relative", width: 150, height: 150 }}>
            <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
              <circle
                cx="75"
                cy="75"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(61,21,52,.13)"
                strokeWidth="12"
              />
              <circle
                cx="75"
                cy="75"
                r={RING_RADIUS}
                fill="none"
                stroke={palette.accent}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE.toFixed(2)}
                strokeDashoffset={ringOffset.toFixed(2)}
                transform="rotate(-90 75 75)"
                style={{
                  transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1), stroke .4s ease",
                }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, lineHeight: 1, color: ink }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: ink50,
                }}
              >
                / 100
              </span>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 280px",
              minWidth: 240,
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: ".03em",
                color: palette.accent,
                background: palette.soft,
                border: `1px solid ${palette.border}`,
                borderRadius: 999,
                padding: "7px 16px",
              }}
            >
              {palette.label}
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 500,
                fontSize: "clamp(23px,3vw,30px)",
                lineHeight: 1.24,
                letterSpacing: "-.01em",
                color: ink,
              }}
            >
              {verdict.headline}
            </h2>
          </div>
        </div>
      </div>

      {/* four feedback sections */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
        {verdict.sections.map((sec) => {
          const tone = tonePalette[sec.tone];
          return (
            <div
              key={sec.title}
              style={{
                flex: "1 1 300px",
                background: "rgba(255,244,235,.72)",
                border: `1px solid ${hairline}`,
                borderRadius: 18,
                padding: 22,
                backdropFilter: "blur(3px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 26,
                    height: 26,
                    flex: "none",
                    borderRadius: 8,
                    background: tone.bg,
                    border: `1px solid ${tone.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: tone.fg,
                    fontWeight: 700,
                  }}
                >
                  {tone.mark}
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15.5,
                    fontWeight: 700,
                    letterSpacing: "-.01em",
                    color: ink,
                  }}
                >
                  {sec.title}
                </h3>
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                {sec.points.map((pt) => (
                  <li
                    key={pt}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "rgba(61,21,52,.8)",
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 9,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(61,21,52,.4)",
                      }}
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* questions to ask */}
      <div
        style={{
          marginTop: 20,
          background: "rgba(255,244,235,.72)",
          border: `1px solid ${hairline}`,
          borderRadius: 18,
          padding: 24,
          backdropFilter: "blur(3px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 15.5,
              fontWeight: 700,
              letterSpacing: "-.01em",
              color: ink,
            }}
          >
            Questions to ask the employer
          </h3>
          <CopyQuestions questions={verdict.questions} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {verdict.questions.map((q) => (
            <div key={q.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "rgba(61,21,52,.45)",
                  lineHeight: 1.4,
                  flex: "none",
                }}
              >
                Q{q.n}
              </span>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: "rgba(61,21,52,.85)" }}>
                {q.t}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* bottom line — the heaviest element on the page */}
      <div
        style={{
          marginTop: 20,
          background: ink,
          color: cream,
          borderRadius: 22,
          padding: "clamp(24px,3.4vw,34px)",
          boxShadow: "0 18px 50px rgba(61,21,52,.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#F6E0B6",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#F6E0B6",
            }}
          >
            The bottom line
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(20px,2.6vw,27px)",
            lineHeight: 1.4,
            color: cream,
            textWrap: "pretty",
          }}
        >
          {verdict.bottomLine}
        </p>
      </div>
    </div>
  );
}
