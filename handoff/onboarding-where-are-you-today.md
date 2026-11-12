# Onboarding: Where are you today?

12 November 2026 · Kate Hester

A new question before "Where do you want to go next?": where the person is now. It is the first question in onboarding to take tick boxes and the person's own words. On Direction, "I'm not sure yet" moves out from behind "Show me more options". The full rules are in the Onboarding spec, sections 3.4a and 3.5.

## Before and now

| | Before | Now |
| --- | --- | --- |
| After Account | Direction | **Where are you today?**, then Direction |
| Step bar | 11 steps | 12 steps ("Where you are" is 4) |
| Progress line | 16 pages | 17 pages |
| Direction's first list | Five, with "I do not know yet" behind "Show me more options" | Six: the five, then **I'm not sure yet** |
| Narrowing "I'm not sure yet" on its own | "A little more detail gives ExecEngine a clearer first step." | "That's what ExecEngine is for: it will help you figure it out." |
| Recommendation's reason | Opens with where she's going | Opens with where she is: "Today, you're new in your role and you're going through a restructure or merger." |
| Plan page, Built from what you said | Starts with Where you're going | Starts with **Where you are today** |

## The page

- Label **Where you are**, heading **Where are you today?**, line "Pick as many as are true.", Why this matters "Your plan starts from where you are, not from a template." 25 words.
- Six answers, each with a tick box, as many as are true: Doing well, and ready for more · New in my role · Stuck, or passed over · Going through a restructure or merger · My role is changing with AI · **Other**.
- **Other** replaces "None of these? Show me more options"; there are no held-back answers. Ticked, it opens **In your own words** under the list and puts the cursor in it. Unticked, the field closes and is cleared.
- **Next** is off until something is ticked, and while Other is ticked with an empty field. The peek bar says "{n} picked".
- Said back on the plan page in the list's order, her own words last, with **Change** (which returns to the plan page once answered).
- **The Recommendation's reason opens with them**, one phrase per answer joined with "and": Doing well → "you're doing well and ready for more"; New in my role → "you're new in your role"; Stuck → "you feel stuck, or passed over"; Restructure → "you're going through a restructure or merger"; AI → "your role is changing with AI"; Other → "you said “{her words}”". Then the reason as before. Not when she chose a different plan ("You chose this one instead…").
- **They don't change which plan is recommended.**

## Only this page

Tick boxes and Other are used here only, by Kate's decision. Direction, the deciding question and the "Making it yours" questions keep their pattern (equal-width options, five and "Show me more options"); the reflections keep one answer.

## The tick box

- A new `ticks` option on `ChipGroup`: a 18px square box (2px border, 6px corners) before the label, 12px gap, in the chip's own text colour, so it follows the drawer's colours. The tick shows when the chip is chosen.
- The chip stays a toggle button (`aria-pressed`); the box is decorative (`aria-hidden`).

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | `TodayPage` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `GUIDE_C3.today` in `mock/onboarding.ts` |
| "I'm not sure yet" | `DIRECTION_MORE_C3` (`unsure`), shown with the first five by `DirectionPage` |
| Tick boxes | `ticks` on `components/form/ChipGroup`; `.chip-group--ticks` in `styles/app.css` |
| In the catalogue | ChipGroup: "With tick boxes" |

## Still open

- **Whether the answers should change which plan is recommended** (a restructure toward Lead Where You Are, say), and how her own words are read in production. Not decided.
