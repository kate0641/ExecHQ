# Onboarding: a plan opens before it's chosen

13 November 2026 · Kate Hester

From the 13 November walkthrough: with no recommendation up front, each plan has to say why it's hers before she chooses it. On both plans pages, Where do you want to start? and (after I can't decide) Choose your plan, pressing a plan opens it in place. The full rules are in the Onboarding spec, sections 3.4b and 3.7 and decision 36.

## The card

| State | What it shows |
| --- | --- |
| Closed | The plan's name, and when it's for |
| Open | The same, then **Pick this if** and three signs, what she comes away with, and **Use this plan** |
| ExecEngine's pick (after I can't decide) | Marked **Recommended**, open from the start, its reason above the signs |

- **Pressing** the card opens it; pressing again closes it; opening another closes the first. One open at a time.
- **No chevron and no Cancel.** The whole card is the control: a disclosure button with `aria-expanded`.
- **Use this plan** chooses the plan and moves straight on to the first reflection. There is no chosen state and no button at the page's foot.
- **I can't decide** is a link at the foot of the list, scrolling with it.
- **Open** is drawn as a second border width, as a chosen plan card was, never colour alone.

## The words

Each plan's signs and outcome are new copy drafted from its plan brief ("Intended user situation", "Common constraints", "Desired outcome"), **for Eric's sign-off**. The full table is in the spec, section 3.4b; in the prototype they are `pickIf` and `comeAway` on each plan in `PLAN_TEMPLATES`.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card | `components/onboarding/PlanOption` (catalogue: closed, open, ExecEngine's pick, long text) |
| The two pages | `case "pick"` and `case "rec"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `pickIf`, `comeAway` in `mock/onboarding.ts`; labels in `GUIDE_C3.pick` |
| Styles | `.plan-option` and `.plan-set__unsure` in `styles/app.css` |
