import { field, ink, ink60, ink72, pillButton, serif } from "../theme";
import type { UserProfile } from "../types";
import { StepHeader } from "./StepHeader";

type Props = {
  user: UserProfile;
  onChange: (patch: Partial<UserProfile>) => void;
  onBack: () => void;
  onNext: () => void;
};

export function AboutTheUser({ user, onChange, onBack, onNext }: Props) {
  const ready = user.goal.trim().length > 0 && user.role.trim().length > 0;

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
      <StepHeader step={1} onBack={onBack} />

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
        First, tell us where you’re headed.
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.5, color: ink72, margin: "0 0 30px" }}>
        No wrong answers — this is the compass we’ll measure every job against.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>Your program</span>
          <input
            value={user.program}
            onChange={(e) => onChange({ program: e.target.value })}
            placeholder="e.g. Computer Science"
            style={field}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>Your career goal</span>
            <span style={{ fontSize: 13, fontWeight: 400, color: ink60 }}>
              Where do you want your career to be heading?
            </span>
          </span>
          <textarea
            value={user.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
            rows={3}
            placeholder="e.g. A backend engineer working on large-scale systems at a product company."
            style={{ ...field, lineHeight: 1.5, resize: "none" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>Role you’re aiming for</span>
          <input
            value={user.role}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="e.g. Software Engineering Intern"
            style={field}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>
            What do you want to build this term?
          </span>
          <textarea
            value={user.build}
            onChange={(e) => onChange({ build: e.target.value })}
            rows={3}
            placeholder="e.g. Ship a real feature end-to-end, get comfortable with cloud infra, learn code review."
            style={{ ...field, lineHeight: 1.5, resize: "none" }}
          />
        </label>
      </div>

      <button
        onClick={onNext}
        disabled={!ready}
        style={{
          ...pillButton,
          marginTop: 30,
          width: "100%",
          padding: 16,
          opacity: ready ? 1 : 0.5,
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        Next: the job →
      </button>
    </div>
  );
}
