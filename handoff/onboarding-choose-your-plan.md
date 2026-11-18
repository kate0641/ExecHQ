# Onboarding: she chooses her plan

12 November 2026 · Kate Hester

The Recommendation becomes **Choose your plan**. The person chooses from all five plans on one page; ExecEngine's pick comes first, is marked and is chosen to start with, with its reason on it. "See other plans" and its page are removed. The full rules are in the Onboarding spec, section 3.7 and decision 27.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Heading | The plan's name ("Make the Move") | **Choose your plan** |
| Label | ExecEngine's recommendation | **Your plan** |
| Line | (at the foot) "Next, a few quick questions to make it yours." | Under the heading: **"Whichever you choose, the next few questions make it yours."** |
| The plans | One, in a card; four more behind **See other plans** on a page of their own | **All five as cards**, ExecEngine's pick first, marked **Recommended**, chosen to start with |
| Reason | In the card | On ExecEngine's pick only |
| Also on the page | What a plan is and its two parts; "You also picked…" | Removed (the plan page shows both parts; the other picks are said on its Built from what you said) |
| Buttons | Use this plan · See other plans | **Use this plan** |
| Words | About 110 | 13, plus the reason |
| Step bar | Recommendation | Choose your plan |

## Rules

- **One choice** (a radio group named "Choose your plan"). Each card: the plan's name and when it is for; the plan's focus line is not shown here.
- **Order:** ExecEngine's pick first, then the other four in their usual order.
- **Use this plan** chooses the selected plan and goes straight on to the first reflection.
- **Cards:** 8px apart, 12px × 16px inside (`.plan-set--choose`), on the navy page. About three show on a phone; the list scrolls under the pinned button.
- **"For when" lines shortened** to fit: Step Up "You're ready for a bigger role and want the remit to match."; Make the Move "A promotion, review, presentation or negotiation is coming up."

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | the `rec` page in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `GUIDE_C3.rec` in `mock/onboarding.ts` |
| The cards | `PlanTemplateCard` (comparison mode) |
| Styles | `.plan-set--choose` in `styles/app.css` |
| Removed | the `plan-others` page |
