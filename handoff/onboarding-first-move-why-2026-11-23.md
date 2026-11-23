# Onboarding: why the story comes first

23 November 2026 · Kate Hester

Two screens didn't say why. The Your plan page offered "Write the story of what you lead" as the first move without saying why it comes first, what it is or what it gives her. The next screen asked what she leads now, with nothing linking today's role to where she's going. Both now say it: understanding the role she has now is what her story of what's next is built on.

## Your plan, the Start here card

| | Before | Now |
| --- | --- | --- |
| Title (Step Up) | Write the story of what you lead | Say what you lead today |
| Line | ExecEngine drafts it with you, now or later. | Everything toward {her goal} starts here, with the role you have now. You'll come away with one sentence that says what you lead, ready for your next 1:1 or introduction. ExecEngine drafts it with you, now or later. |

The line does three things in order: why this move comes first, tied to her own goal; what she comes away with; and that ExecEngine drafts it with her, now or later.

**{her goal}** is the goal that ends the page's stages ahead, in lowercase: her answer to the plan's goal question ("a seat on the exec team", "your exec presentation"), or her direction ("the C-suite within three years"). It is the same goal as the end of the stages ahead, so the card and the end of the path always agree. Example: "Everything toward a seat on the exec team starts here, with the role you have now."

The button (Start your first move) is unchanged. The plan's other first moves (Make Your Mark, Make the Move, Lead Where You Are) keep their titles; they share the line.

## Your story, the question

| | Before | Now |
| --- | --- | --- |
| Question | Could you say what you lead in one sentence, right now? | Could you say what you lead today in one sentence? |
| Under the question | Out loud, to someone who's never met you. | Your story of where you're going starts with the role you have now. Knowing what you lead today lets ExecEngine build that story with you. |
| Why this matters | Every next move, a promotion conversation, a post, an introduction, starts with this sentence. | Where you're going only lands once people know what you lead now. Every next move, a promotion conversation, a post, an introduction, starts with this sentence. |
| Worth knowing | Only 46% of U.S. employees clearly know what is expected of them at work. (Gallup, 2025) | 46% of professionals said they would not feel confident describing their achievements to their dream employer if they met them on the street. (LinkedIn @Work study) |

The answers (Yes, easily · Roughly · Not really) and the replies are unchanged. The new fact is the one Step Up already cites for this move.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card's line | `GUIDE_C3.plan.firstLine(goal)` in `mock/onboarding.ts`, given the plan page's goal in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The card's title | `PLAN_TEMPLATES` Step Up `thisWeek.title` in `mock/onboarding.ts` |
| The question | `GUIDE_C3.story.reflect` in `mock/onboarding.ts` |
| Spec | Onboarding spec, 3.9 Your plan, 3.10 Your story, the reflections table and Appendix C |
| In the catalogue | PlanPath, every example |
