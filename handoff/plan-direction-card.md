# Plan: See your plan is gone; change your direction from the direction card

9 November 2026 · Kate Hester

One change to Plan Concept 3, the same on every width. **The plan sheet is removed.** Its link, **See your plan →** beside the Your roadmap heading, is removed with it. Why they have this plan, and the way to change their direction, move onto the Your direction card above the roadmap. The full behavior is in the Plan spec, sections 6, 7.1 and 8.

## What to do

1. **Remove** the plan sheet, and **See your plan →** beside the Your roadmap heading.
2. **Add to the Your direction card,** under their words: "Edited by you." (when it applies), why they have this plan, and a **Change your direction** link.
3. **Add one line** to the first page of the change-your-direction flow: "Everything you've done stays, whichever plan you choose."

## Why

Most of the sheet repeated the page:

| In the sheet | Where it already is |
| --- | --- |
| The plan's name | The top of every Plan page |
| The stages, with You are here | The roadmap |
| Their direction | The Your direction card |
| Why this plan | Nowhere else: **moves to the direction card** |
| Change my direction, and what it means | Nowhere else: **moves to the direction card** |

The plan's formal name ("Increase leadership scope") was shown only in the sheet, and is dropped.

## Before

- **Your direction:** their words, read only.
- **Your roadmap:** with **See your plan →** at its right, which opened a sheet. The sheet rose from the foot on phone and tablet, and sat centered on web.
- **Change my direction:** a full-width button at the foot of that sheet.

## Now

The Your direction card, top to bottom:

1. "YOUR DIRECTION" on the soft band. Unchanged.
2. Their words in the serif. Unchanged.
3. "Edited by you.", small and secondary, only when they have changed their direction since onboarding. It used to be in the sheet.
4. A hairline, then why they have this plan, as a quiet paragraph in secondary text with **no heading**. The reason comes from onboarding and starts "You said …", so it explains itself ("You said … so this plan starts with …"). When they chose the plan themselves, it says "You chose this plan on {date}."
5. **Change your direction**, a text link, on its own.

The card says nothing about what changing their direction means. The edit flow's first page does (below).

The Your roadmap heading has nothing beside it.

## Rules

- **Change your direction** goes where **Change my direction** went: the onboarding questions again, filled in, ending back on the Plan, where they choose their plan and can keep this one. The flow gains one line on its first page (below) and is otherwise unchanged.
- **The link's target is 44px tall,** drawn at the text's height; the extra reaches into the space around it.
- On the navy page (the stage check-in, and the move on web), the card keeps its white body and light-surface colors, link included, as it already did.
- Spacing inside the card: 16px padding, and 12px between the reason and the link.
- No sheet, scrim or dialog is opened from the Plan for this any more.

## The edit flow's first page

One line is added to the first page of the edit flow (the direction page, opened by the link), under "Right now it says: “{their direction}”" and above **Keep it as it is**:

"Everything you've done stays, whichever plan you choose."

It is the same size as the line above it. Nothing else in the edit flow changes.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card | `components/plan/PlanDirection` |
| Its copy | `PLAN_DIRECTION_COPY` in `mock/plan.ts` |
| The edit flow's new line | `EDIT_FLOW_COPY.stays` in `mock/onboarding.ts`, shown in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| Wiring (the reason, edited, the link) | `flows/plan/usePlanPage.tsx` |
| Styles | `.plan-direction__*` in `styles/app.css` |
| Removed | `components/plan/PlanDetailLink`, `components/plan/PlanDetailSheet`, `PLAN_DETAIL_COPY`, the roadmap heading's `action` slot, and the playground's "See your plan" screen |
