# Onboarding: Your plan groups each horizon

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review. Your plan showed every step of every horizon at once, in boxes of the same weight, and the reviewers found it too much to take in. Each horizon is now one group with its count of steps, the short-term stays open, and the medium-term and long-term fold away until opened. The full rules are in the Onboarding spec, section 3.9 and decision 46.

## What changed

| Where | Was | Now |
| --- | --- | --- |
| Each horizon | A heading line, then its steps as separate outlined boxes | One outlined group: name, how far it looks and a count ("3 steps", "1 step") on its top line, then its steps |
| The first step's label | Your first step · This week | Start here |
| The short-term's other steps | Outlined boxes under the card | Under **Then, this week**, plain rows on hairlines inside the group |
| Medium-term and long-term | Shown, each with its step | Folded to the heading, with a chevron; open to show the step |

## How it behaves

- The short-term is always open. Its count includes the first step: one card plus two rows is "3 steps".
- A folded group's heading is a native disclosure (`details`/`summary`): it takes focus, opens and folds with Enter or Space, and is at least 44px tall. Both start folded every time the page opens.
- The heading underlines on hover and draws the focus ring, as The stages ahead does.
- The groups rise in one after another when the page arrives, as the rows did; at rest with reduced motion.
- In Change your direction the card has no button, as before.
- **Start here** and **Then, this week** may change in Eric's copy pass.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The words | `GUIDE_C3.plan` (`firstLabel`, `thenLabel`, `stepCount`) in `mock/onboarding.ts` |
| The groups | `components/onboarding/PlanPath/PlanPath.tsx`, styles under `.plan-path__group` in `styles/app.css` |
| In the catalogue | PlanPath, with the new "Medium-term and long-term open" example |
