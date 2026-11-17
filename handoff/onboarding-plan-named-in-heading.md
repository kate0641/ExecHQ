# Onboarding: Your plan is named in the heading

17 November 2026 · Kate Hester

Your plan had too much going on at the top: a saved line, a long goal heading, the plan and stage line, and a stage bar, all before the work. The top is now the plan's name and the stage she is in. The full rules are in the Onboarding spec, section 3.9 and decision 42.

## The top of the page

| Part | Was | Now |
| --- | --- | --- |
| Label | ✓ Your plan: Step Up, saved | None: the heading says it |
| Heading | Your path to the C‑suite within three years | Your plan: Step Up |
| Stage line | STEP UP · STAGE 1 OF 3 · SAY WHAT YOU LEAD, with the stage bar under it | Gone from here |
| Section heading | What you're working on now | Unchanged, with STAGE 1 OF 3 · SAY WHAT YOU LEAD under it |
| Onboarding progress line | Full, at the very top | Gone on this page. The pages before it keep theirs, so the last question is the last with a line |

Everything below is unchanged: the three rows, Start your first step, The stages ahead (her goal is still its last line, with a star), See or change and the link home. 


## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The words | `GUIDE_C3.plan.title`, `.stage` in `mock/onboarding.ts` |
| The page | `case "plan-week"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx`; `progress={undefined}` drops the line |
| The component | `components/onboarding/PlanPath`: `stage` replaces `where`; no stage bar |
| Styles | `.plan-path__now-head`, `.plan-path__now-stage` in `styles/app.css`; the stage bar's and the saved line's styles are removed |

## Home's heading

Home's section heading, Your Progress Tracker, is now **What you're working on now**, the same words as this page's section, so Home picks up where onboarding left off. The lines that named it follow:

| Where | Was | Now |
| --- | --- | --- |
| Heading | Your Progress Tracker | What you're working on now |
| Nothing started | Nothing in progress yet. Open a ring to read about what is in your Progress Tracker and start one. | Nothing in progress yet. Open a ring to read about what is in it and start one. |
| An empty ring | Nothing in this part of your Progress Tracker yet. | Nothing in this part yet. |
| Added | Added to your Progress Tracker: {action}. … | Added to what you're working on now: {action}. … |
| Skipped | Skipped: {action}. It is off your Progress Tracker. | Skipped: {action}. It is off what you're working on now. |
| An empty ring's spoken name | Short-term: nothing in your Progress Tracker yet. | Short-term: nothing here yet. |

The client chose Your Progress Tracker on 6 October, so this needs his sign-off. The words are `MAP_COPY` in `mock/homepage.ts` and `mapRingText` in `lib/map.ts`. Homepage spec 2.1.
