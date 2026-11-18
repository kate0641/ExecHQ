# Plan: folding the drawer leaves no bar; the move card asks instead

11 November 2026 · Kate Hester

One change to Plan Concept 3's move pages, on **phone and tablet** only. Web is unchanged: there the answers always sit beside the move and never fold. The full behavior is in the Plan spec, section 5.

## What to do

1. **Remove the peek bar.** Folding the answer drawer takes it off the screen completely.
2. **Add a "Where are you with this?" button to the move card**, under the lede. It opens and folds the drawer, and shows which it is.

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
| Open | The drawer (unchanged) | Kicker, headline, lede, then **Where are you with this?**, filled (may sit under the drawer on a phone) |
| Folded | The pill, with the add button in its usual place above it | Kicker, headline, lede, then **Where are you with this?**, outlined |

Once they have answered a move, the drawer and the button are both gone.

## Rules

- **The button:** full width of the card's content, 44px tall, "Where are you with this?" and no icon.
  - **Folded:** outlined. Its text and 2px edge use the light text on the dark card; hover fills it with the page navy.
  - **Open:** filled with the light text color, navy words (the card's color), the way a chosen pill looks on navy.
- **Spacing:** 16px between the lede and the button.
- **When it shows:** until the move is answered, open or folded. On a phone the open drawer can cover it; that is intended.
- **Pressing it** opens the drawer when folded and folds it when open.
- **The drawer still opens on arrival** at each move, as before.
- **Focus:** pressing the card's button leaves focus on it. Folding with the drawer's handle moves focus to the card's button. Both buttons carry `aria-expanded`.
- **The Ask or go pill floats over the page.** With the drawer folded, the page scrolls on under the pill: no plain band behind it. The page keeps 128px of room at its foot (its own 32px plus the pill's 96px), so its last card can scroll clear of the pill.
- **The stage check-in is not changed.** Its drawer still folds to a peek bar.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The button and folding | `components/plan/PlanGuided/PlanGuided.tsx` |
| The card's slot for it | `headFoot` on `components/onboarding/GuidePage` |
| Folding off the screen | `noPeek` on `components/onboarding/AnswerDrawer` |
| Styles | `.guide__head-foot`, `.plan-guided__ask`, and the folded page's room for the pill (under THE GUIDED CHECK-IN) in `styles/app.css` |
| In the catalogue | Plan guided check-in: the default variant (open, filled) and "Folded: the card’s “Where are you with this?” outlined" |
| Removed | `GUIDED_COPY.peek` ("Tap to answer") in `mock/plan.ts` |
