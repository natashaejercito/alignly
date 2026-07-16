import type { Tone, VerdictKey } from "./theme";

export type UserProfile = {
  program: string;
  goal: string;
  role: string;
  build: string;
};

export type JobPosting = {
  title: string;
  company: string;
  desc: string;
};

export type Section = {
  title: string;
  tone: Tone;
  points: string[];
};

export type Question = {
  n: number;
  t: string;
};

export type Verdict = {
  score: number;
  verdict: VerdictKey;
  headline: string;
  bottomLine: string;
  sections: Section[];
  questions: Question[];
};

export type AnalyzeRequest = {
  user: UserProfile;
  job: JobPosting;
};
