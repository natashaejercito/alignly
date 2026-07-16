import type { CSSProperties } from "react";

export const ink = "#3D1534";
export const cream = "#FFF4EB";
export const butter = "#F6E0B6";

export const ink78 = "rgba(61,21,52,.78)";
export const ink72 = "rgba(61,21,52,.72)";
export const ink60 = "rgba(61,21,52,.6)";
export const ink50 = "rgba(61,21,52,.5)";
export const hairline = "rgba(61,21,52,.5)";

export const serif = "'Newsreader', serif";

export type VerdictKey = "strong" | "partial" | "misaligned";

export type VerdictPalette = {
  label: string;
  accent: string;
  soft: string;
  border: string;
};

export const verdictPalette: Record<VerdictKey, VerdictPalette> = {
  strong: {
    label: "Strong fit",
    accent: "#2E5A3E",
    soft: "#E4EFE6",
    border: "rgba(46,90,62,.45)",
  },
  partial: {
    label: "Partial fit",
    accent: "#9A6A1E",
    soft: "#FBEFD7",
    border: "rgba(154,106,30,.45)",
  },
  misaligned: {
    label: "Misaligned",
    accent: "#A23B3B",
    soft: "#F6E1DE",
    border: "rgba(162,59,59,.45)",
  },
};

export type Tone = "pos" | "neu" | "warn";

export const tonePalette: Record<Tone, { bg: string; border: string; fg: string; mark: string }> = {
  pos: { bg: "#E4EFE6", border: "rgba(46,90,62,.4)", fg: "#2E5A3E", mark: "+" },
  neu: { bg: "#FBEFD7", border: "rgba(154,106,30,.4)", fg: "#9A6A1E", mark: "~" },
  warn: { bg: "#F6E1DE", border: "rgba(162,59,59,.4)", fg: "#A23B3B", mark: "!" },
};

export const card: CSSProperties = {
  background: "rgba(255,244,235,.72)",
  border: `1px solid ${hairline}`,
  borderRadius: 18,
  backdropFilter: "blur(3px)",
};

export const field: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: 15.5,
  fontFamily: "inherit",
  color: ink,
  background: "rgba(255,244,235,.85)",
  border: `1px solid ${hairline}`,
  borderRadius: 13,
  outline: "none",
};

export const pillButton: CSSProperties = {
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 16.5,
  fontWeight: 600,
  color: ink,
  background: butter,
  border: `1px solid ${hairline}`,
  borderRadius: 999,
  padding: "15px 32px",
  boxShadow: "0 6px 20px rgba(61,21,52,.13)",
};
