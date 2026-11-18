# Onboarding: LinkedIn moves to Signals

12 November 2026 · Kate Hester

Onboarding no longer asks for LinkedIn numbers. Its Signals step and LinkedIn upload page are removed, and Done no longer lists LinkedIn as a next step. The Signals page's own upload ("Add more LinkedIn data", Signals spec 5.4) is unchanged and is now the only place to add it. The full rules are in the Onboarding spec, sections 2, 3.4 and 3.11.

## Before and now

| | Before | Now |
| --- | --- | --- |
| After Account | Signals ("Start from how you already show up"), optional, with the LinkedIn upload page behind it | Direction |
| Step bar | 12 steps | 11 steps |
| Done, "What to do next" | Ended with "Bring in your LinkedIn numbers" when no file was in | No LinkedIn line |
| Progress line | 17 pages, about 5.9% each | 16 pages, about 6.25% each (Direction at 19%) |
| Where LinkedIn is added | Onboarding, or the Signals page | The Signals page only |

## Why

The step asked for social-media numbers before she had said what she wants, and on a phone it usually meant "do this later on a computer". Eric's why statement sets ExecEngine against platforms that reward attention, so the first thing it asks about shouldn't be her LinkedIn reach.

## Rules

- **Account goes straight to Direction:** with Google or Apple at once; with a typed address after Check your email.
- **Nothing in onboarding mentions LinkedIn,** Done included.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The flow | `PAGES` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` (no `signals` or `linkedin`) |
| Done's list | the `done` page in the same file |
| Kept, unused in onboarding | `SignalSources`, `LinkedInUpload`, `LinkedInSteps` stay in the catalogue until Kate says to remove them |
