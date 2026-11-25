# Advisor: no Why me

25 November 2026 · Kate Hester

Following the cut of Why you from Home's next-step card ("Home: no Why you on the next-step card"), the advisor stops giving a "why you" reason for a step as well.

## What changes

- **"Why this move?"** on a Plan step is answered with why this, why now and what it moves. The sentence on why it suits her is gone.
- **"Why me?"** is gone from the step questions the advisor offers to follow up with. The others stay: Why this?, Why now?, What does it move?, How long will it take?, When am I done?
- The steps' `whyYou` lines are no longer shown anywhere. They stay in the mock data for now.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The questions | `CARD_QUESTIONS` in `mock/plan.ts` |
| The "Why this move?" answer | `STEP_ANSWERS.why` in `mock/plan.ts` |
| The advisor's answers | `step-question` in `lib/concierge.ts` |
