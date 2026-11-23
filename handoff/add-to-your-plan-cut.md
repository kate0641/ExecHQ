# Plan: Add to your plan is cut

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review (edit 18). Asking someone to add their own talks, meetings and deadlines to the plan is a blank-page problem that adds stress; the plan already offers each move. It is not in V1. The rule is in the Plan spec, 7.4.

## What went

| Where | What |
| --- | --- |
| The roadmap, phone and tablet | The floating **+** |
| The roadmap, web | The **Add to your plan** button at its foot |
| The sheet it opened | What is it? (A talk, a meeting, a deadline), When, Add to my plan, Cancel, and "Added to {stage}, {when}." |
| The roadmap's stages | Items she added, marked "· Yours" |
| The last page of the check-in | The **Add to your plan** button beside Go through them again |
| No moves at all | **Add to your plan** was its button; the page now has none |

## What stays

- The roadmap shows the plan's moves, each in its stage.
- After she uses a draft, ExecEngine can still offer a specific move from her plan with **Add it to your plan**. That is ExecEngine offering a move, not a blank form, and is unchanged.

## In the prototype

The `AddToPlanDrawer` component, her stored calendar items and their sample data, the words and the styles are removed. `PlanAgenda` and `PlanGuided` no longer take `onAdd`.
