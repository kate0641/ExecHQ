# Onboarding: a progress line, and forty words a screen

12 November 2026 · Kate Hester

Two rules for every onboarding page. Both reverse earlier decisions: "no progress" (24 September) and the explaining voice. The full rules are in the Onboarding spec, sections 4.9 and 4.10.

## What to do

1. **Add a progress line** at the top of every onboarding page after the Welcome.
2. **Hold every screen to 40 words.** Screens are being cut one at a time as each edit is approved; this brief sets the rule.

## The progress line

| | Before | Now |
| --- | --- | --- |
| Welcome | Nothing | Nothing |
| Every later page | Nothing | A thin line across the top, filled to how far she is |
| Words, counts, percentages | None | Still none |

Rules:

- **What it measures:** the pages she moves on through, Welcome excluded. What ExecEngine is is the first; Done is the last and full. The prototype has 17, so each fills about 6%.
- **Fill** = (the page's place among those pages) ÷ (how many there are). What ExecEngine is: 1 ÷ 17 = 6%. Direction: 4 ÷ 17 = 24%. Done: 17 ÷ 17 = 100%.
- **Pages reached from another page** keep the fill of the page they came from: Check your email (Account's), the LinkedIn upload (Signals'), the other plans (the Recommendation's), Add more detail and Longer versions (the First draft's).
- **Pages a path passes move it on.** A direction with no deciding question, or fewer than three questions, skips pages, so the line jumps. Some paths are shorter than others, which is why it shows no number.
- **Not in edit mode** (changing direction from the Plan).
- **Size:** 3px tall (`--border-width-thick`), pill ends, the full width of the page's content. On web it spans the question's column only, not the answer card.
- **Colour:** the track is `--color-border` and the fill `--color-text-primary`, so on a navy page both switch to the inverse set without extra rules.
- **Motion:** the fill grows over 200ms (`--duration-base`); no animation with reduced motion.
- **Accessibility:** a native `<progress>`, max 100, named "Onboarding progress". A screen reader reads "Onboarding progress, 24%". It never takes focus.

## Forty words a screen

| Counts | Doesn't count |
| --- | --- |
| The label, heading and line | Answer options, buttons and links |
| "Why this matters" | Her own words: what she picked, her draft, what she typed |
| Every card, reply and "Worth knowing" fact | A fact's source line |

Today most screens are over: What ExecEngine is, the Recommendation and the First draft each run to about 120 words. A reflection is about 56. Nothing is cut in this change.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The line | `progress` on `components/onboarding/GuidePage` |
| How far each page is | `progressAt()` and `ASIDE_FROM` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| Styles | `.guide__progress` in `styles/app.css` |
| In the catalogue | GuidePage: "With the progress line", and "On a navy page" |

## Still open

- **Paths will change.** Later edits add "Where are you today?" and take the LinkedIn step out. The fill is worked out from the page list, so it follows without new rules.
