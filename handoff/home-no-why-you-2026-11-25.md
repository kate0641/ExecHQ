# Home: no Why you on the next-step card

25 November 2026 · Kate Hester

From Eric's Ask or go review: the Why you section isn't needed. It is cut from every next-step card, not only the one on his screen. The rule is in the Homepage spec, section 3.

## What changes

- **The next-step card has two reasons, not three:** **Why this** and **Why now**. Either is left out when it has no text, as before.
- This covers Home's next step and the card under each ring.
- **The advisor drops it too** (later the same day): no "Why me?" question, and its answer to "Why this move?" no longer says why her. See "Advisor: no Why me".

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card | `components/homepage/NextStepCard/NextStepCard.tsx` (no `you` in `why`) |
| Home | `flows/homepage/concept-4b/HomepageConcept4b.tsx` |
| Catalogue | `NextStepCard.states.ts`, `MapRings.states.ts` |
