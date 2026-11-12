# Onboarding: a short tour of Home

12 November 2026 · Kate Hester

After onboarding, Home opens with a three-stop tour of how to get around: the Ask or go pill, Go to, and chatting with ExecEngine. Home and the Ask or go panel don't change; the tour is drawn over them. The full rules are in the Onboarding spec, section 3.12 and decision 32.

## The stops

| Stop | Lit | Card title | Card line |
| --- | --- | --- | --- |
| 1 of 3 | The Ask or go pill | Everything starts here | Tap to go anywhere, or ask ExecEngine anything. |
| 2 of 3 | Go to (the six places), in the panel, which opens for this stop | Six places, one tap away | Your plan, your signals, your Playbook, the daily briefing and your profile. |
| 3 of 3 | Ask me and the field to type in, as one box | Chat with ExecEngine | Ask anything about your plan, or tap a question to start. It knows what you've told it. |

## Rules

- **Buttons:** Next (Got it on the last) and Skip the tour, 44px tall.
- **Got it** ends the tour, leaves the panel open and puts the cursor in its field. **Skip the tour** or **Escape** ends it and closes the panel.
- **Where the card goes:** above what is lit if that sits in the lower half of the screen, below it otherwise; 14px from it, 16px from the screen's sides.
- **The lit part:** a clear box 6px larger than what it lights on every side, its corners matching (the pill 26px, the panel's sections 16px, plus 6px), with a 3px yellow ring (`--color-headline-on-inverse`). The rest of the screen dims (`--color-overlay`).
- **It follows what it lights** as the panel slides in, and when the window changes.
- **Accessibility:** a native dialog, named "A quick tour", described by its card's title; focus moves to the main button at each stop; nothing behind can be pressed.
- **Once per account** in production. In the prototype, whenever Home is opened with `?tour=1`; Done's "Go to my homepage" adds it, and the address loses it when the tour ends.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card and dimming | `components/navigation/FirstVisitTour` |
| Running it | `Tour` in `flows/navigation/concept-1/ConciergeConcept.tsx` |
| The words | `TOUR_COPY` in `mock/onboarding.ts` |
| Styles | `.tour` in `styles/app.css` |
| Starting it | Done's button in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| In the catalogue | FirstVisitTour: each stop, and nothing found to light |

## Not part of it

- **The Plan page.** A stop on it was considered and dropped.
- **A replay link** (in Profile, say) is not built.
