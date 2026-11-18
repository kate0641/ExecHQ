# Onboarding: meatier influence questions, and nothing that assumes leaving

12 November 2026 · Kate Hester

Two changes to the questions after the plan is chosen. The influence path's two "Making it yours" questions are about a real decision and the person who makes it. And answers across onboarding that assumed she would leave her company are swapped for ones inside it. The full lists are in the Onboarding spec, Appendix B, and decision 29.

## The influence path

| | Before | Now |
| --- | --- | --- |
| Question 1 | Where do you want more say? (as many as are true) | **Which decision in the next few months do you most want a say in?** (one) |
| Answers | My team's direction · Company strategy · Budget and headcount · Across other teams · Hiring and promotions | Next year's budget · A reorganization · Who gets promoted or hired · Which projects get funded · Where the company is heading |
| More | Customers and partners · What we make and sell · How we're organized · Which projects get funded | A big customer or partner deal · How my function is run · Pricing or go-to-market · Where we invest in AI |
| Question 2 | Who do you most need on side? (as many as are true) | **Who decides it, and how well do they know your work?** (one) |
| Answers | My boss · My boss's peers · The exec team · My own team · Peers across the company | My boss, and they know it well · My boss, but they undersell me · My boss's boss, who barely knows me · A group of execs I rarely see · I don't know who decides |
| More | The CEO · The board · Finance · People outside the company | The CEO · Finance · A peer who sees me as a rival · The board |

Each answer has its own line on the plan page and in the first draft (`mock/onboarding.ts`).

## Answers that assumed leaving

| Question | Before | Now |
| --- | --- | --- |
| What kind of step up? | A move to another company | A bigger role in another part of the business |
| What's in the way? | Wrong company for it | The company isn't growing |
| Who needs to see you differently? | Recruiters and boards | The board |
| What's coming up? | Negotiation or offer · Job interview | A negotiation · An interview for a role here |
| What's making you want a change? | Industry is shrinking · The culture doesn't fit | My area is shrinking · My work doesn't use my strengths |
| What would you keep? | My function · My industry (first five) | My team · My boss (first five); My function moves behind "more", My industry goes |
| How soon? | Actively looking · Only if the offer's right | As soon as a role opens · Only if the right role opens |

- **"Wrong company for it" no longer sends the pick to Find your next direction**; "The company isn't growing" keeps Step Up.
- Kept, as they're not about leaving: "Peers at other companies", "My industry", "The press and conferences" (who sees her), "Better pay or flexibility".

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| Questions, answers, read-backs | `REFINEMENT_BY_NEED` in `mock/onboarding.ts` |
| First-draft lines | the draft-line table, keyed by question, in the same file |
| Routing | `SWITCHES_C3` |
