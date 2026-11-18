# Inside the company only

18 November 2026 · Kate Hester

ExecEngine only helps a person grow or move sideways inside her own company. It never suggests leaving, recruiters, an outside search or a board elsewhere (Kate, 12 and 18 November; the 18 November UX review asked for boards and recruiters to go). A sweep of the product found words that still pointed outside, and they are changed here.

## What changed on screen

| Where | Was | Now |
| --- | --- | --- |
| Positioning Builder, Who is it mainly for? | Senior leaders where I work · An external audience · Recruiters and boards | Senior leaders where I work · An external audience |
| The bio's audience, Who will hear it first? | My manager · The exec team · Recruiters · A board · My industry · None for now | My manager · The exec team · Leaders across the company · My industry · None for now |
| The bio's why, on the Plan page, in onboarding and in the showroom | It's what goes ahead of you: to a recruiter, an event, a new boss. | It's what goes ahead of you: to the exec team, an event, a new team. |
| Onboarding, Step Up's Which role are you going for? (more options) | A board seat | A company-wide role |
| Onboarding, I'm not sure yet, narrowed | Explore what else is out there | Explore other parts of the business |
| Onboarding, where to use your story (Find your next direction) | In a first coffee with someone in a field you're curious about | In a first coffee with someone in a part of the business you're curious about |

## What went

- The unused "Get out of where I am" direction and its two narrower versions ("Leave my industry for something new", "Leave my company, but stay in my field"), with every line written for it. No page showed it since 12 November; it was still in the words file and the Homepage spec. The Homepage's weekly check-in now counts 16 directions, not 18.
- The Plan briefs' Make the Move summary no longer mentions a board seat.

## What stays

- "An external audience" in the Positioning Builder, and "My industry", "Peers at other companies" and "Be seen as an executive beyond my company": being known in her field is not leaving it.
- "A board meeting" in the Situation Brief: her own company's board.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| Positioning Builder's audience | `mock/playbook.ts` (two places), `lib/playbook-draft.ts` |
| The bio's audience and why, onboarding's options | `mock/onboarding.ts` |
| The bio's why on the Plan page and in the showroom | `mock/plan.ts`, `mock/snapshots.ts` |
| Specs | Onboarding (Appendices A and B), Homepage 4.6, `builders/positioning.md` |
