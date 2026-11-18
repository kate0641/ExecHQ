# The plans take the plan briefs' names

12 November 2026 · Kate Hester

Four of the five plans are renamed to match the plan briefs (`plans/`), everywhere a person sees a plan's name: onboarding (the Recommendation's heading, the other plans, the plan page), Home, the Plan page and Profile. Stages and first steps don't change yet.

## Before and now

| Before | Now | Template (unchanged) |
| --- | --- | --- |
| Step up | **Step Up** | Increase leadership scope |
| Build your executive presence | **Make Your Mark** | Build executive presence |
| Get ready for a big moment | **Make the Move** | Prepare for a career inflection point |
| Grow your influence where you are | **Lead Where You Are** | Strengthen influence in the current organization |
| Find your next direction | **Find your next direction** (unchanged) | Explore and clarify a next direction |

## The fifth plan

Its brief calls it **Chart a New Course**, but the brief is written for leaving the company, which ExecEngine doesn't do (12 November). It keeps the name **Find your next direction** until the brief is rewritten for a move within the company; the brief now says so at its top.

## Not changed yet

- **Stages and first steps.** Onboarding's plans have three stages each; the briefs have three to five, and three plans start with a different first step. Lining them up changes the Plan page's roadmap, so it is its own piece of work (Onboarding spec, open question 12).
- **Plan ids**, used in code and saved state, are unchanged.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The names | each plan's `name` in `mock/onboarding.ts` |
| Elsewhere | `mock/plan.ts`, `mock/account.ts`, and catalogue examples in `components/` |
| Specs | Onboarding spec 5.1, Appendix C, decision 26; Plan spec |
| The fifth plan's brief | `plans/chart-a-new-course.md`, `plans/shared.md` |
