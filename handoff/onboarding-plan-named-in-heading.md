# Onboarding: Your plan is named in the heading

17 November 2026 · Kate Hester

Your plan had too much going on at the top: a saved line, a long goal heading, the plan and stage line, and a stage bar, all before the work. The top is now the plan's name and the stage she is in. The full rules are in the Onboarding spec, section 3.9 and decision 42.

## The top of the page

| Part | Was | Now |
| --- | --- | --- |
| Label | ✓ Your plan: Step Up, saved | ✓ Saved |
| Heading | Your path to the C‑suite within three years | Your plan: Step Up |
| Stage line | STEP UP · STAGE 1 OF 3 · SAY WHAT YOU LEAD, with the stage bar under it | Gone from here |
| Section heading | What you're working on now | Unchanged, with STAGE 1 OF 3 · SAY WHAT YOU LEAD under it |

Everything below is unchanged: the three rows, Start your first step, The stages ahead (her goal is still its last line, with a star), See or change and the link home. The onboarding progress line at the very top stays.

In Change your direction there is no label over the heading.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The words | `GUIDE_C3.plan.title`, `.stage`, `.saved` in `mock/onboarding.ts` |
| The page | `case "plan-week"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The component | `components/onboarding/PlanPath`: `stage` replaces `where`; no stage bar |
| Styles | `.plan-path__now-head`, `.plan-path__now-stage` in `styles/app.css`; the stage bar's styles are removed |
