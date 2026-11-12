# Onboarding: a personal email, and everyone has a code

12 November 2026 · Kate Hester

The Account page asks for a personal email and makes the invite code a required field. "I don't have a code" is gone. The full rules are in the Onboarding spec, section 3.3.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Heading | First, somewhere to keep all this | Unchanged |
| Line | "Your plan and your story are saved to your account, so you can come back to them." | None |
| Why this matters | "Everything you tell ExecEngine builds on what came before…" | None |
| Email field | **What's your email?** | **Your personal email**, hint "Not your work one, so it stays yours wherever your career goes." |
| Invite code | **Do you have an invite code?** with **I have an invite code** / **I don't have a code**, then a field | **Your invite code**, a required field, hint "From your invitation." |
| Continue is on when | An email, and a code or "I don't have a code" | An email (or a Google or Apple account) and a code |
| Unrecognised code | "…If you don't have one, choose 'I don't have a code'. A code only changes who pays…" | The middle sentence is gone |
| Words on the page | 55 | 29 |

The line and "Why this matters" were cut because the drawer covered them on a phone; the reason for a personal address now sits under the field, where she is looking.

## Rules

- **A work address is asked against, not refused.** A work domain can't be told from a personal one reliably, so a work address still makes an account. This replaces "any email is accepted" (22 September).
- **Google and Apple stay**, before the email field. A work Google account gets past the hint; that is accepted.
- **Both fields are required** (`required`, announced as such). Order: email, then code. Both hints are tied to their fields (`aria-describedby`).
- **The code is kept** when she comes back to the page, as is the way in.
- **Unchanged:** Google or Apple goes straight to Signals; a typed address goes to Check your email.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | `AccountPage` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The words | `GUIDE_C3.account` in `mock/onboarding.ts` |
| The notice | Notice: "Explain — invite code" in the catalogue |

## Still open

- **What the invite code is,** who issues it and how it is checked (spec, open question 4). In production the invitation's link could fill the code in.
