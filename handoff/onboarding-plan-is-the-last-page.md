# Onboarding: Your plan is the last page

16 November 2026 · Kate Hester

From the 16 November onboarding review with Eric. Home's Progress Tracker opens on short-term, medium-term and long-term work, all at nothing done, when onboarding had only ever shown one step. New people read it as falling behind before they had started. Your plan now shows stage 1's work the way Home does, and Done is folded into it. The full rules are in the Onboarding spec, section 3.9 and decision 40.

## The page, top to bottom

| Part | Words | Notes |
| --- | --- | --- |
| Saved line | ✓ Your plan: {plan}, saved | In the label's place, as Done had it |
| Heading | Your path to {goal} | Unchanged |
| Where she is | {Plan} · Stage 1 of {n} · {first stage} | With the stage bar, unchanged |
| Section heading | What you're working on now | New |
| Short-term · Quick wins, this week | Your first step · This week: {this week's step} · ExecEngine drafts it with you, now or later. **Start your first step** | The move card, with the yellow button, then the stage's other short-term actions |
| Medium-term · Over the next month | The stage's medium-term action | Outlined row |
| Long-term · A quarter or more | The stage's long-term milestone | Outlined row |
| Line | These run side by side. Do the quick wins now, and chip away at the bigger pieces when you have time. | Quiet panel |
| The stages ahead · {n} more | Folded. Open: stages 2 on, each with Done when…, the goal with a star, then "When stage 1 is done, ExecEngine plans the next with you, from how it went." | A native disclosure; folded when the page opens |
| Built from your {n} answers · See or change | Unchanged | |
| Foot | Later, take me to my homepage | A text link (was the Go to my homepage button on Done). Home, with its first-visit tour |

**Start your first step** is the page's one button. In Change your direction, the label stays "Your plan", the card has no button, and the page's button is Save my plan.

## What went

- The Done page, with "Momentum starts this week".
- Continue at the foot of Your plan.
- The path's "You are here · This week" step: the first step now leads the short-term row.

## The actions

The rows name the stage's actions as Home's Progress Tracker does: short-term (1 to 3 actions), medium-term (1), long-term (1 milestone). In the prototype they read the example plan Home reads, so every plan shows the same ones. In production they are her plan's own stage-1 actions, the same ones Home shows.

## Progress

Your plan is now the last page, so its progress line is full: 10 pages on a plan she picks, 14 after I can't decide.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | `case "plan-week"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `GUIDE_C3.plan` in `mock/onboarding.ts` (`GUIDE_C3.done` is gone) |
| The actions | `ACTIONS` and `HORIZONS` in `mock/plan-stub.ts`, accepted ones only |
| The component | `components/onboarding/PlanPath`, reworked |
| Styles | `.plan-path__now`, `.plan-path__horizon`, `.plan-path__ahead`, `.guide--plan`, `.guide__home-link` in `styles/app.css` |
| In the catalogue | PlanPath: "Building in", "At rest", "Stages ahead open", "Hover, focus and pressed", "Changing her direction", "Long text" |
