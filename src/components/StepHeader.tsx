import { ink, ink50, ink60 } from "../theme";

type Props = {
  step: 1 | 2;
  onBack: () => void;
};

/** Back link, "step N of 2" label, and the progress bar shared by the two form screens. */
export function StepHeader({ step, onBack }: Props) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
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
          ← Back
        </button>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".08em", color: ink50 }}>
          STEP {step} OF 2
        </span>
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(61,21,52,.14)",
          overflow: "hidden",
          marginBottom: 28,
        }}
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={2}
        aria-label={`Step ${step} of 2`}
      >
        <div
          style={{
            width: step === 1 ? "50%" : "100%",
            height: "100%",
            background: ink,
            borderRadius: 2,
            transition: "width .4s ease",
          }}
        />
      </div>
    </>
  );
}
