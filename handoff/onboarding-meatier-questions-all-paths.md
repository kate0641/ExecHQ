# Onboarding: meatier questions on every path

12 November 2026 · Kate Hester

The questions for the other four paths get the same treatment as the influence path: each is about a real role, person, moment or decision, and each answer is a situation she would recognise. Some now take one answer, so the plan has one target. The full lists are in the Onboarding spec, Appendix B, sections 5.2 and 5.3, and decision 30.

## Before and now

| Path | Before | Now |
| --- | --- | --- |
| **Step Up** | What kind of step up? (many) | **Which role are you going for?** (one) My boss's job · One level up, in my area · Running a whole function · A seat on the exec team · A role that doesn't exist yet |
| | When do you want to get there? | **When is the next real chance at it?** The next promotion round · When my boss moves on · At the next reorganization · Within a year, no set moment · I don't know when |
| | What's in the way? (before the plan) | **What would the people deciding say you're missing?** Proof I can run something bigger · Being known above my boss · A clear case for why me · My boss behind me · A role to step into |
| **Make Your Mark** | Who needs to see you differently? (many) | **Whose view of you matters most right now?** (one) The exec team · My boss's peers · The board · Leaders across the company · People in my industry |
| | How do they see you now? | **If you asked them, what would they say you are?** A strong operator, not a strategist · The expert in one area · Reliable, but not one to watch · More junior than I am · They don't really know me |
| | Where do you show up today? (many) | **When did people outside your team last hear your view?** (one) This month, in a meeting I led · This quarter, at a company-wide moment · This year, somewhere public · Over a year ago · I can't remember |
| **Make the Move** | What's coming up? · When is it? | Unchanged |
| | How ready do you feel? (one) | **What's the hardest part of it?** (many) Making the case for myself · One person in the room · The question I can't answer · Keeping it short · Not knowing what they want |
| **Find your next direction** | What's making you want a change? (before the plan) | **What's made you think about a move?** I've hit a ceiling in my area · My work doesn't use my strengths · My area is shrinking · A new boss or a reorganization · I was passed over |
| | What would you keep? | **Which part of the business are you curious about?** (many) Sales or commercial · Product · Operations · Strategy · A newer part of the business |
| | How soon? | **Who have you talked to about it?** (one) No one yet · My boss · Someone in the area I'm curious about · HR or talent · A mentor outside my line |

Each question keeps four more answers behind "Show me more options"; each answer has its own read-back and first-draft line (`mock/onboarding.ts`).

## Routing

| Answer | ExecEngine's pick becomes |
| --- | --- |
| Being known above my boss | Make Your Mark (was "Nobody sees my work") |
| I've hit a ceiling in my area | Step Up (was "Hit a ceiling") |

## Not changed

- **"When is it?"** keeps its order (This week first, Tomorrow last); reordering it was left out.
- **"Who have you talked to about it?"** is always asked; the old "How soon?" was skipped when the direction gave a time.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| Questions, answers, read-backs | `REFINEMENT_BY_NEED` in `mock/onboarding.ts` |
| First-draft lines | the draft-line table in the same file |
| Why each is asked | `GUIDE_C3.questions.why` |
| Routing | `SWITCHES_C3` |
| Catalogue sample answers | `StoryDraft.states.ts` |
