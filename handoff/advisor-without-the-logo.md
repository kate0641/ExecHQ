# Ask your advisor, without the logo

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review (edit 6). The Ask or go panel's start screen carried the ExecEngine logo over the suggested questions. The reviewers asked to keep the advisor and lose the logo: the person already knows which app they are in. The full rule is in the Navigation spec, 3, part 3.

## What changed

| Where | Was | Now |
| --- | --- | --- |
| Ask or go, over the suggested questions | The ExecEngine wordmark and "Your advisor" on one line, then a small "Ask me" | One heading, **Ask your advisor**, in the display face at 16px |
| Home's first-visit tour, stop 3 | Lights "Ask me" and the field | Lights "Ask your advisor" and the field; the card's words are unchanged |

## How it behaves

- The heading is the section's level-2 heading, as "Ask me" was, so the suggestions keep their name for screen readers.
- Nothing else in the panel changes: Go to, Pick up where you left off, the suggestions and the field.
- Once a conversation starts, the panel's top bar still says ExecEngine · Your advisor, as before.
- The Enterprise Dashboard's advisor is not changed. Its start screen says "About your cohort", not "Your advisor", and it was not part of the review.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The heading's words | `CONCIERGE_COPY.askMe` in `mock/concierge.ts` |
| The start screen | `flows/navigation/concept-1/ConciergeConcept.tsx` |
| The heading's size | `.concierge-start__title--lead` in `styles/app.css` |
