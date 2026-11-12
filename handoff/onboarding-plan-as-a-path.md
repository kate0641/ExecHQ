# Onboarding: the plan, as a path

12 November 2026 · Kate Hester

The plan's two pages ("This week", then "Three stages") become one: a path to her goal, with this week's step drawn as the Plan page's move card. Each stage's finish line is now a sign it's working, rather than a task completed. The full rules are in the Onboarding spec, section 3.9, Appendix C and decision 31.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Pages | Two: This week · Three stages | **One** |
| Heading | This week | **Your path to {the goal}** ("…to the C-suite within three years") |
| Under it | — | The Plan page's line and stage bar: **Step Up · Stage 1 of 3 · Say what you lead** |
| This week | A dark card under the read-back list, often below the fold | First on the path, as the Plan page's move card: **You are here · This week**, the step, "ExecEngine drafts it with you next." |
| Stages | A list: name, what she'll have, "Done when:" | On the path, numbered: name and **Done when** + a sign it's working |
| Goal | "Stage by stage, toward {goal}" | The last point on the path, with a star |
| Read-back | Open, first on the page | Folded: **Built from your 3 answers · See or change** opens it (and **Hide**) |
| Why now, outcomes, closing paragraph | Shown | Removed here; kept on the Plan page |

## Done when

Each now says what she'd notice when the stage is working. The same lines are the **Plan page's stage milestones**, so they change there too.

| Plan | Before (first stage) | Now (first stage) |
| --- | --- | --- |
| Step Up | You can describe your scope in a sentence, and your bio is ready to send. | Someone repeats your one-line story back to you. |
| Make Your Mark | You can say what you stand for in one sentence, without mentioning where you work. | A colleague can say what you stand for. |
| Make the Move | You can say what's being decided, who decides, and what they'll push back on. | You know their pushback before they say it. |
| Lead Where You Are | Your role and one win are written in your leadership's language, ready to use. | Your boss describes your work the way you would. |
| Find your next direction | You have a short list of strengths that would matter anywhere. | You can name the strengths you'd take anywhere in the business. |

All fifteen are in the spec, Appendix C. Some depend on other people ("asks to talk to you"), so the Plan page should let her mark a stage done herself.

## Layout and motion

- **The move card:** the Plan page's top card: `--color-surface-quiet-on-inverse`, 1px `--color-border-inverse` edge, 20px corners, 16px inside; label in the eyebrow style, headline 22px Kulim Park bold in `--color-headline-on-inverse`.
- **The path:** a 3px line in `--color-border-inverse`; numbered markers 26px; this week's marker filled yellow; the goal's in lime with a star.
- **Done when** in lime semibold, then the sentence in muted light blue, 14px.
- **Motion:** each point rises into place, 0.2s then 0.4s apart, 320ms each; at rest with reduced motion.
- **Progress line:** 16 pages now (the second plan page is gone).

## The 40-word rule

The plan page is exempt (Kate, 12 November). It runs to about 85 words with all three finish lines showing.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The component | `components/onboarding/PlanPath` |
| The page | the `plan-week` page in `flows/onboarding/concept-3/OnboardingConcept3.tsx` (the `plan-stages` page is removed) |
| The words | `GUIDE_C3.plan`; each plan's `stages[].done` in `mock/onboarding.ts` |
| Styles | `.plan-path` in `styles/app.css` |
| In the catalogue | PlanPath: "Building in", "At rest", "Long text" |
