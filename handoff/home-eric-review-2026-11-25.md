# Home: Eric's review edits

25 November 2026 · Kate Hester

Eric reviewed Home's five screens on 24 November. Three were approved as they are (Follow-up due, Drafted, Nothing pending); two had copy edits, accepted here.

| Screen | Before | Now |
| --- | --- | --- |
| 1 First return, under What you're working on now | Stage 1 of 4 · Say what you lead | Stage 1 of 4 · Your leadership story |
| 1 First return, the next-step card | Use your leadership story in your next 1:1 | Build momentum in your next 1:1. Share your leadership story |
| 5 Just answered, the Done card | Use your leadership story in your next 1:1 | Share your leadership story in your next 1:1 (already in, from the Plan review) |

## The stage is renamed everywhere

A stage has one name, so Stage 1 of Step Up is **Your leadership story** wherever it shows: Home, the Plan's road and agenda, the stage check-in, and Your plan at the end of onboarding. Its line under it is unchanged ("Put what you lead into words, and say it to the person who decides."). The separator stays the dot ("·"); Eric's review used a colon.

The plan's first move keeps its own name, **Say what you lead today**.

## The step keeps one name; Home says it its own way

The step is **Share your leadership story in your next 1:1** everywhere: the Plan, the Playbook's "For:", the check-ins and Home's Done card. Only Home's next-step card shows Eric's wording, **Build momentum in your next 1:1. Share your leadership story**. A step can carry Home's own wording for this, used only by that card.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The stage name | `ROADMAP` in `mock/plan-stub.ts`; Step Up's stages in `mock/onboarding.ts` |
| Home's wording for a step | `homeTitle` on the step in `mock/plan-stub.ts`, read in `flows/homepage/concept-4b/HomepageConcept4b.tsx` |
| Specs | `specs/homepage.md`, `specs/plan.md`, `specs/onboarding.md` |
