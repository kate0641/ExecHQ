# Onboarding: she picks her plan first

13 November 2026 · Kate Hester

Straight after Account, onboarding now shows the five plans: **Where do you want to start?** She picks one and its own questions make it hers, or she presses **I can't decide** and goes the long way, through the questions that were there before, to ExecEngine's pick. The full rules are in the Onboarding spec, sections 2, 3.4b, 3.8, 3.9, 4.9 and decision 34.

## The two ways

| She… | Then |
| --- | --- |
| Picks a plan | Reflection → the plan's own questions (the first sets her goal) → Your plan |
| Presses I can't decide | Where are you today? → Direction → the question before the plan → Choose your plan (ExecEngine's pick marked) → Reflection → questions → Your plan, all as before |

## Where do you want to start?

| Part | Words |
| --- | --- |
| Label | Your plan |
| Heading | Where do you want to start? |
| Line | Pick the one that sounds most like you. The next few questions make it yours. |
| Cards | The five plans, as on Choose your plan, none marked or chosen to start with |
| Buttons | Use this plan (off until one is picked) · I can't decide, equal |

## A plan she picked

- **Questions:** the plan's own, all after it, in the order of its matching direction: Step Up a bigger role's, Make Your Mark being seen's, Make the Move a coming moment's, Lead Where You Are influence, Find your next direction a move's. Nothing switches the plan.
- **Label:** "Making it yours · {plan name}".
- **The goal question** (Step Up's "Which role are you going for?", Make the Move's "What's coming up?") has no Skip, and its "Why this matters" says it's what the plan builds toward.

| Plan | Plan page title "Your path to …" |
| --- | --- |
| Step Up | her role answer, e.g. "a seat on the exec team"; else "a bigger leadership role" |
| Make the Move | her moment, e.g. "your exec presentation"; else "your next big moment" |
| Make Your Mark | "being seen as an executive" |
| Lead Where You Are | "more weight where you are" |
| Find your next direction | "your next step" |

The full answer-to-goal list is `GOAL_FROM_ANSWER` in `mock/onboarding.ts`.

## Not changed

- **I can't decide's pages** are exactly as they were.
- **Changing her direction from the Plan** (Edit) still opens on Direction, the long way.
- **The progress line** is 11 pages on a picked plan and 15 after I can't decide.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page and its two buttons | `case "pick"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| Which way she went | `route` and `UNSURE_PAGES` in the same file |
| The plan's questions and goal | `questionsForPlan`, `goalForPlan`, `setsGoal` in `mock/onboarding.ts` |
| The words | `GUIDE_C3.pick`, `GUIDE_C3.questions.goalWhy` in `mock/onboarding.ts` |
