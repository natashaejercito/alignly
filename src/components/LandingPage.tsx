import { butter, hairline, ink, ink50, ink60, ink72, ink78, pillButton, serif } from "../theme";

const steps = [
  {
    n: "1",
    title: "Set your compass",
    body: "Your program, your three-year goal, and what you actually want to build this term.",
  },
  {
    n: "2",
    title: "Paste the posting",
    body: "Drop in any job description — no reformatting, no account, no noise.",
  },
  {
    n: "3",
    title: "Get an honest read",
    body: "A fit score, a plain verdict, and the questions worth asking before you say yes.",
  },
];

/**
 * Decorative bubbles flanking the headline, revealed one at a time on load.
 *
 * `points` is the direction the bubble's tail faces — always inward, toward the
 * headline, so it is the opposite of the side the bubble sits on.
 *
 * `top`/`left`/`right` only apply on wide screens. Below 1023px the bubbles drop
 * out of the absolute layer and become a centered row above the hero, so these
 * positions are ignored (see .bubble-field in index.css).
 */
const bubbles = [
  { text: "New job posting", points: "right", top: "26%", left: "0%", delay: 0.5 },
  { text: "Apply now", points: "left", top: "58%", right: "0%", delay: 1 },
] as const;

type Props = {
  onStart: () => void;
  onSeeSample: () => void;
};

export function LandingPage({ onStart, onSeeSample }: Props) {
  return (
    <div style={{ animation: "fadeUp .55s ease both" }}>
      <section
        className="hero"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "clamp(34px,7vw,86px) clamp(22px,5vw,32px) clamp(30px,5vw,54px)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(18px,2.4vw,26px)",
        }}
      >
        {/* Decorative: the headline already states the value, so these are
            hidden from screen readers rather than read as stray fragments. */}
        <div className="bubble-field" aria-hidden="true">
          {bubbles.map((b) => (
            <span
              key={b.text}
              className={`bubble bubble--points-${b.points}`}
              style={{
                top: b.top,
                ...("left" in b ? { left: b.left } : { right: b.right }),
                animationDelay: `${b.delay}s`,
              }}
            >
              {b.text}
            </span>
          ))}
        </div>

        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: ink60,
            padding: "7px 15px",
            border: `1px solid ${hairline}`,
            borderRadius: 999,
            background: "rgba(255,244,235,.7)",
          }}
        >
          For interns &amp; co-op students
        </span>

        <h1
          style={{
            fontFamily: serif,
            fontWeight: 500,
            fontSize: "clamp(40px,7vw,78px)",
            lineHeight: 1.02,
            letterSpacing: "-.02em",
            margin: 0,
            color: ink,
            textWrap: "balance",
            maxWidth: "15ch",
          }}
        >
          Direct your internship to your{" "}
          <em style={{ fontStyle: "italic", fontWeight: 500 }}>career goal</em>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px,1.7vw,20px)",
            lineHeight: 1.55,
            color: ink78,
            margin: 0,
            maxWidth: "52ch",
            textWrap: "pretty",
          }}
        >
          Paste any job posting. Alignly reads it against your goals and tells you, honestly,
          whether it moves you forward.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 6,
          }}
        >
          <button
            onClick={onStart}
            style={{ ...pillButton, transition: "transform .18s ease, box-shadow .18s ease" }}
          >
            Try it now
          </button>
          <button
            onClick={onSeeSample}
            style={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 15.5,
              fontWeight: 600,
              color: ink,
              background: "none",
              border: "none",
              borderBottom: "1.5px solid rgba(61,21,52,.28)",
              padding: "14px 12px",
            }}
          >
            See a sample verdict →
          </button>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "clamp(24px,4vw,44px) clamp(22px,5vw,32px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(14px,2vw,22px)",
            justifyContent: "center",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.n}
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                background: "rgba(255,244,235,.7)",
                border: `1px solid ${hairline}`,
                borderRadius: 20,
                padding: "26px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                backdropFilter: "blur(3px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flex: "none",
                    borderRadius: "50%",
                    background: butter,
                    border: `1px solid ${hairline}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: serif,
                    fontWeight: 600,
                    fontSize: 16,
                    color: ink,
                  }}
                >
                  {step.n}
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: "-.01em",
                    color: ink,
                  }}
                >
                  {step.title}
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: ink72 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "clamp(28px,4vw,52px) clamp(22px,5vw,32px) clamp(40px,6vw,72px)",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: ink50,
            margin: "0 0 18px",
          }}
        >
          Verdict in a few seconds
        </p>
        <div
          className="verdict-peek"
          style={{
            background: "rgba(255,244,235,.82)",
            border: `1px solid ${hairline}`,
            borderRadius: 24,
            padding: "clamp(24px,3vw,34px)",
            boxShadow: "0 14px 44px rgba(61,21,52,.1)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="verdict-peek__ring">
            <svg viewBox="0 0 132 132" aria-hidden="true">
              <circle
                cx="66"
                cy="66"
                r="56"
                fill="none"
                stroke="rgba(61,21,52,.14)"
                strokeWidth="11"
              />
              <circle
                cx="66"
                cy="66"
                r="56"
                fill="none"
                stroke="#2E5A3E"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray="351.86"
                strokeDashoffset="42.22"
                transform="rotate(-90 66 66)"
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
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: "clamp(28px,7vw,38px)",
                  lineHeight: 1,
                  color: ink,
                }}
              >
                88
              </span>
              <span
                style={{
                  fontSize: 10.5,
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

          <span
            className="verdict-peek__token"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".03em",
              color: "#2E5A3E",
              background: "#E4EFE6",
              border: "1px solid rgba(46,90,62,.45)",
              borderRadius: 999,
              padding: "6px 14px",
              whiteSpace: "nowrap",
            }}
          >
            Strong fit
          </span>
          <p
            className="verdict-peek__quote"
            style={{
              margin: 0,
              fontFamily: serif,
              fontSize: "clamp(18px,2.4vw,22px)",
              lineHeight: 1.28,
              fontWeight: 500,
              color: ink,
            }}
          >
            “This role points straight at where you said you want to go — the kind of co-op
            you’ll point back to and say it mattered.”
          </p>
        </div>
      </section>
    </div>
  );
}
