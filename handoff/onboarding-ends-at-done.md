# Onboarding: it ends at Done, with two ways on

12 November 2026 · Kate Hester

Onboarding now ends right after the plan. Done shows this week's step and offers two equal ways on: **Get started with your plan** or **Go to my homepage**. The story question and the first draft, which every person used to go through, are now the plan's first step and optional. The full rules are in the Onboarding spec, sections 2, 3.10, 3.11, 4.9 and decision 33.

## The order

| Before | Now |
| --- | --- |
| Your plan → Your story → First draft → Done → Home | Your plan → Done → Home, or Done → Your story → First draft → Home |

## Done

| Part | Words |
| --- | --- |
| Label | You're set up |
| Heading | Momentum starts this week |
| Card label | Your first step |
| Card title | This week's step from the plan, e.g. "Write the story of what you lead" |
| Card line | ExecEngine drafts it with you, now or later. |
| Tick | Your plan: {plan name}, saved |
| Buttons | Get started with your plan · Go to my homepage |

- **The card** is the Plan page's move card, a size up: title at `--text-2xl`, more padding.
- **The buttons are equal:** the primary and the onboarding skip button, same size and weight.
- **The "What to do next" list is gone.** The plan page shows the path, and the Plan page carries what is left.

## The story, now optional

- **Get started with your plan** opens the story question, then the first draft. In production it begins whatever the plan's first step is; in the prototype every plan's first step opens the same story builder.
- **No progress line** on the story pages: they come after onboarding. The line now runs over 14 pages, with Done full.
- **The draft's third choice** is now **Save it and go to my homepage** (was "Save it and come back later"), and Longer versions' save button is the same. Both open Home with its tour.

## The tour of Home

It shows the first time she reaches Home, whichever way: from Done, or after saving the first draft. Nothing else about it changes (see "Onboarding: a short tour of Home").

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page order and progress | `PAGES`, `branch`, `PROGRESS_PAGES` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| Done | `case "done"` in the same file |
| Going home with the tour | `goHome` in the same file |
| The words | `GUIDE_C3.done` and `GUIDE_C3.story.draft` in `mock/onboarding.ts` |
| Styles | `.done__first`, `.done__saved` in `styles/app.css` |
