# Positioning Builder: the moment first

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review (edits 10, 11, 13 and 14). Onboarding no longer has the person write a statement, so the Positioning Builder stops leaning on one, and it says plainly that a statement is made for each moment. The full rules are in the Playbook flow spec, 3 and 4.4, and the Positioning builder brief, 2.2.

## What changed

| Where | Was | Now |
| --- | --- | --- |
| Start screen, under what it makes | Use it before anything that introduces you: a promotion conversation, a new boss, a conference program. | Make one for each moment that introduces you: a promotion conversation, a new boss, a conference program. Each is kept in your library, ready to build again. |
| Start screen, You'll need | Your statement from onboarding (ExecEngine has it) · A few recent accomplishments, if you want them in | A few recent accomplishments, if you want them in |
| Start screen, the green box | Your statement from onboarding, and the statement | Gone |
| Start screen, the moments | Introductions for particular moments, Pick any, or none., three chips | Gone from the start screen |
| The interview's first question | What are you known for? | **Which moments is this one for?** (pick all that apply, Other, Skip). Step bar: Moments |
| Check what ExecEngine has | Your positioning statement · From onboarding, your role, where you're headed | Your role, where you're headed |
| Paste a bio you already have | A four-line field; Built with your positioning statement, role and direction. | An eight-line field; Built with your role and direction. |

## How it behaves

- **The moments are optional,** as before, and each one picked gets its own introduction in the draft. Kept one a line.
- **With no statement of her own,** the draft's Positioning statement is written from her answers: "I'm known for {what she's known for}, and I'm building toward {where she's headed}."
- **Building out the statement she already has** (her onboarding story, if she wrote it): it is still version 1, and still the draft's statement. It is carried quietly, not asked or shown on the start screen.
- The other three builders keep their first question on the start screen.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The questions and the start screen's words | `POSITIONING_INPUTS` and `TOOLS.positioning` in `mock/playbook.ts` |
| The moment leading, not on the start screen | `leads` on the input; `firstChoice` in `flows/playbook-flow/useToolFlow.tsx`; the order in `flows/playbook-flow/concept-3/ToolFlowConcept3.tsx` |
| The written statement | `positioningDraft` in `lib/playbook-draft.ts` |
