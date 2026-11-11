# Plan: folding the drawer leaves no bar; the move card asks instead

11 November 2026 · Kate Hester

One change to Plan Concept 3's move pages, on **phone and tablet** only. Web is unchanged: there the answers always sit beside the move and never fold. The full behavior is in the Plan spec, section 5.

## What to do

1. **Remove the peek bar.** Folding the answer drawer takes it off the screen completely.
2. **Add a "Where are you with this?" button to the move card**, under the lede. It opens the drawer again.

## Why

Folded, four things stacked at the foot of the phone: the roadmap's add button, the peek bar ("Where are you with this?" · "Tap to answer"), the Ask or go pill, and the browser's toolbar. The peek bar only repeated the move's question. Moving the question onto the move itself leaves the foot with the pill and the add button.

## Before

| Drawer | At the foot of the screen | On the move card |
| --- | --- | --- |
| Open | The drawer | Covered by the drawer |
| Folded | Peek bar, with the add button raised above it and the pill under it | Kicker, headline, lede |

## Now

| Drawer | At the foot of the screen | On the move card |
| --- | --- | --- |
| Open | The drawer (unchanged) | Covered by the drawer |
| Folded | The pill, with the add button in its usual place above it | Kicker, headline, lede, then **Where are you with this?** |

Once they have answered a move, the drawer and the button are both gone, as before.

## Rules

- **The button:** full width of the card's content, outline style, 44px tall. "Where are you with this?" at its left, an up chevron (18px) at its right. Its text and 2px edge use the light text on the dark card; hover fills it with the page navy.
- **Spacing:** 16px between the lede and the button.
- **When it shows:** only while the drawer is folded and the move is not yet answered.
- **The drawer still opens on arrival** at each move, as before.
- **Focus:** folding moves focus to the card's button; the button opens the drawer and moves focus to its handle. Both buttons carry `aria-expanded`.
- **The stage check-in is not changed.** Its drawer still folds to a peek bar.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The button and folding | `components/plan/PlanGuided/PlanGuided.tsx` |
| The card's slot for it | `headFoot` on `components/onboarding/GuidePage` |
| Folding off the screen | `noPeek` on `components/onboarding/AnswerDrawer` |
| Styles | `.guide__head-foot` and `.plan-guided__ask` in `styles/app.css` |
| In the catalogue | Plan guided check-in, "Folded: the move card asks “Where are you with this?”" |
| Removed | `GUIDED_COPY.peek` ("Tap to answer") in `mock/plan.ts` |
