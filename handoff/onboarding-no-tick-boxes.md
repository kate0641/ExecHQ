# Onboarding: no tick boxes on Where are you today?

13 November 2026 · Kate Hester

From the 13 November walkthrough: ZM noted the tick boxes on "Where are you today?" were never part of the design system. They are removed. The full rules are in the Onboarding spec, section 3.4a and decision 37.

- **The answers are the drawer's usual pills**, as on Direction and every other question: outlined at rest, white with navy words when picked (`--color-selected-on-inverse`, `--color-text-on-selected-inverse`).
- **Unchanged:** as many answers as are true; **Other** opens a field for her own words under the list, with the cursor in it, and unpicking Other closes and clears it.
- **ChipGroup** loses its `ticks` option, which nothing else used; it matches main's again.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The page | `TodayPage` in `flows/onboarding/concept-3/OnboardingConcept3.tsx` |
| The pills | `components/form/ChipGroup` |
