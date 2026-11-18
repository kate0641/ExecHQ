# No boards

18 November 2026 · Kate Hester

The people ExecEngine is for are not in board meetings and don't present to the board, so nothing in the product mentions the board any more. Board seats elsewhere were already out (Inside the company only). The rule is in the Onboarding spec, decision 60.

## What changed on screen

| Where | Was | Now |
| --- | --- | --- |
| Situation Brief, What is the moment? | A review · A board meeting · A negotiation · An executive conversation · Something else | A review · A negotiation · An executive conversation · Something else |
| Situation Brief, when to use it | …before a review, a board meeting, a negotiation or a hard conversation | …before a review, a negotiation or a hard conversation |
| Situation Brief, the sample brief | Brief for your board meeting | Brief for your executive conversation (the same CEO, CFO and manager) |
| Onboarding, Make the Move's signs | …a promotion talk, a review, the board, a negotiation | …a promotion talk, a review, a big presentation, a negotiation |
| Onboarding, What's coming up? | Board or exec presentation | Exec presentation |
| Onboarding, Whose view of you matters most? | The board | My boss's boss |
| Onboarding, Who decides it? (more options) | The board | HR and talent |
| Enterprise Dashboard, sample cohort | Northgate Board Readiness | Northgate Leadership Readiness |
| Signals, a sample LinkedIn post | How I prepare for a board conversation | How I prepare for a leadership review |

ExecEngine's replies and the first draft's lines follow each answer. Saying "board" to the advisor no longer opens a Situation Brief as a board meeting.

## Where it is in the prototype

`mock/playbook.ts`, `mock/onboarding.ts`, `mock/enterprise.ts`, `mock/linkedin-export.ts`, `flows/playbook-flow/useToolFlow.tsx`, `lib/builder-briefs.ts`. Specs: Onboarding (3.4b, 3.6, Appendix B, decision 60), Playbook flow (3). Briefs: Situation Brief, Make the Move.
