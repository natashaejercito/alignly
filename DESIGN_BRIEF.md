# Design Brief

## Project Overview
Alignly is a career alignment tool for interns and co-op students in tech. Instead of applying to jobs "just for experience", users define their goals, program, and target roles then Alignlyanalyzes any job posting against their profile and gives feedback such as is it the right fit. The goal is to turn disconnected career path into intentional ones, benefiting both interns and the employers who will hire them.

## Goals
- An honest career advisor for co-op students: paste a job posting, find out if it actually moves you toward your goals.
- Trustworthy but warm. It should deliver hard truths ("this job is misaligned") so it should feel like an advice from a mentor, not a rejection from a system.
- Avoid corporate-job-board energy (LinkedIn blue, dense tables)
- Think: calm, encouraging, a little personal
- Suggested exploration: pick adjectives such as honest, warm, focused, etc. and make every visual decision defend them.

## Target Audience
The audience would be students who are in search for an internship or co-op during their study.

## Key Screens

There are four screen designs for this app:

**1 - Landing Page:**
App name, one-line catch phrase, "try it now" button

**2 - Know the user:**
Program (text), career goal (textarea), target role (text), what you want to build this term (textarea)

**3 - The job:**
Title (text), Company (optional text), job description (large textarea), "Analyze this job" button

**4 - Result:**
- Verdict header: fit score 0 - 100 (currently a ring), verdict token (Strong fit / Partial fit / Misaligned), one-sentence headline
- Four feedback sections: Where it aligns | Where it diverges | What you'd grow | Watch out for
- Questions to ask the employer (list)
- "Bottom line" recommendation block (most important element. Give it weight)
- **State to design:** at least one of each verdict (the color story for strong/partial/misaligned matters)

## Design Contraints
- The verdict must be readable in 5 seconds: score + token + headline
- Accessibility: AODA must + WCAG AA contrast; verdict colors must not be the only signal (token text carries meaning)
- One page, no navigation needed yet, but put smooth transitions

## Deliverables
1- Frame per screen/state, mobile and desktop
<br/>
2- Color styles + text styles
