# Onboarding: Done starts the step

13 November 2026 · Kate Hester

From the 13 November walkthrough: "Write the story of what you lead" didn't look like something to press, and "Your plan… saved" came last, after the action. The full rules are in the Onboarding spec, section 3.11 and decision 38.

## The page, top to bottom

| Part | Words | Notes |
| --- | --- | --- |
| Saved line | ✓ Your plan: {plan}, saved | In the label's place: body face, 14px semibold, light text; the tick in yellow |
| Heading | Momentum starts this week | Unchanged |
| First step card | Your first step · {this week's step} · ExecEngine drafts it with you, now or later. | The Plan page's move card, title at `--text-2xl` |
| In the card | **Start your first step** | The yellow button, full width; goes to the story question (was "Get started with your plan" at the foot) |
| Foot | Go to my homepage | The secondary button; Home with its first-visit tour |

## Spacing

The page's parts sit 32px apart (`--space-xl`, was 12 on the phone). Inside the card: 24px padding, 12px between its lines, 16px more above the button. It fits the phone's browser without scrolling.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | `case "done"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `GUIDE_C3.done` in `mock/onboarding.ts` |
| Styles | `.guide--done`, `.done__saved`, `.done__first` in `styles/app.css` |
| The label slot | `GuidePage`'s `kicker` now takes a line with a tick, not only words |
