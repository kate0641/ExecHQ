# Onboarding: a move within the company, not out of it

12 November 2026 · Kate Hester

Direction's answers change so nothing leads out of the person's company. ExecEngine doesn't steer anyone out of it, but a move inside it, like marketing to sales, is in. "Board" also comes out of the presentation answer. The full rules are in the Onboarding spec, section 3.5, Appendix A and decision 25.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Answer 4 | Nail an upcoming board presentation | **Nail an upcoming presentation** |
| …narrower versions | Win the board's backing for a proposal · Present results and the plan ahead with confidence | **Win backing for a proposal** · unchanged |
| Answer 5 | Find my next move | **Make a move within my company** |
| …narrower versions | Move to a new company in my field · Move into a different role or industry | **Move into another function, like marketing to sales** · **Move to another part of the business** |
| Behind "Show me more options" | Lead a bigger organization · Carry more weight where I am · Get out of where I am | Lead a bigger organization · Carry more weight where I am |
| Find your next direction, "This plan is for when…" | you feel stuck but can't yet name the next role. | **you want a different role here, or aren't sure yet which.** |

## Rules

- **The plans don't change.** Nail an upcoming presentation still leads to Get ready for a big moment; Make a move within my company and I'm not sure yet still lead to Find your next direction.
- **Said back** as "a move within your company" (Recommendation), "You want to make a move within your company." and, in her voice, "I'm working out my next move within my company." (first draft).
- **No answer, plan or line in Direction suggests leaving** the company or industry.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The answers | `DIRECTION_PROMPTS_C1`, `DIRECTION_MORE_C3` and `DIRECTION_NARROWER_C3` in `mock/onboarding.ts` |
| The ways they're said back | the tables keyed by answer in the same file |
| The plan's line | Find your next direction's `bestFor` |
| In the catalogue | ChipGroup: "With a line under each" uses the new answer |

## Still open

- **Later questions that still assume she's leaving** (spec, open question 11): "A move to another company", "Wrong company for it", "Actively looking", "Job interview", "Negotiation or offer" and others. To be changed with the questions.
