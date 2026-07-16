import { field, ink, ink72, pillButton, serif } from "../theme";
import type { JobPosting } from "../types";
import { StepHeader } from "./StepHeader";

type Props = {
  job: JobPosting;
  analyzing: boolean;
  error: string | null;
  onChange: (patch: Partial<JobPosting>) => void;
  onBack: () => void;
  onAnalyze: () => void;
};

export function TheJob({ job, analyzing, error, onChange, onBack, onAnalyze }: Props) {
  const ready = job.title.trim().length > 0 && job.desc.trim().length > 0;
  const canSubmit = ready && !analyzing;

  return (
    <div
      style={{
        animation: "floatIn .5s ease both",
        maxWidth: 660,
        width: "100%",
        margin: "0 auto",
        padding: "clamp(8px,2vw,24px) clamp(22px,5vw,32px) 60px",
      }}
    >
      <StepHeader step={2} onBack={onBack} />

      <h2
        style={{
          fontFamily: serif,
          fontWeight: 500,
          fontSize: "clamp(30px,4.5vw,44px)",
          lineHeight: 1.05,
          letterSpacing: "-.02em",
          margin: "0 0 8px",
          color: ink,
        }}
      >
        Now, the job you’re weighing.
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.5, color: ink72, margin: "0 0 30px" }}>
        Paste the posting as-is. The more detail, the sharper the read.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <label style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>Job title</span>
            <input
              value={job.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Data Analyst Intern"
              style={field}
            />
          </label>
          <label style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>
              Company{" "}
              <span style={{ fontWeight: 400, color: "rgba(61,21,52,.45)" }}>· optional</span>
            </span>
            <input
              value={job.company}
              onChange={(e) => onChange({ company: e.target.value })}
              placeholder="e.g. Government of Canada"
              style={field}
            />
          </label>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>Job description</span>
          <textarea
            value={job.desc}
            onChange={(e) => onChange({ desc: e.target.value })}
            rows={8}
            placeholder="Paste the full posting here — responsibilities, requirements, team, tech stack…"
            style={{ ...field, lineHeight: 1.55, resize: "none" }}
          />
        </label>
      </div>

      {error !== null && (
        <p
          role="alert"
          style={{
            margin: "20px 0 0",
            fontSize: 14.5,
            lineHeight: 1.5,
            color: "#A23B3B",
            background: "#F6E1DE",
            border: "1px solid rgba(162,59,59,.4)",
            borderRadius: 13,
            padding: "12px 16px",
          }}
        >
          {error}
        </p>
      )}

      <button
        onClick={onAnalyze}
        disabled={!canSubmit}
        style={{
          ...pillButton,
          marginTop: 30,
          width: "100%",
          padding: 16,
          opacity: canSubmit ? 1 : 0.5,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        {analyzing ? "Reading the posting…" : "Analyze this job"}
      </button>
    </div>
  );
}
