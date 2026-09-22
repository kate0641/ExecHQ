/**
 * The onboarding step order.
 *
 * Fixed across all three concepts: the concepts differ in how a step is
 * presented, never in which steps exist or what order they come in. Changing
 * this list changes every concept, which is the point of it living here.
 *
 * Account creation comes before the privacy promise, and the promise comes
 * before any career information is asked for. That ordering is a decision on
 * record, not an accident of the list.
 */
export const ONBOARDING_STEPS = [
  "account",
  "privacy",
  "direction",
  "interpretation",
  "refinement",
  "plan",
  "plan-confirmed",
  "action",
  "artifact",
  "connect",
  "complete",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** Steps the user can leave without answering. Used for skip tracking and for
 *  asserting the skip-through path stays open end to end. */
export const SKIPPABLE_STEPS: readonly OnboardingStep[] = [
  "refinement",
  "connect",
];

export function stepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.indexOf(step);
}

/** Total steps shown in progress. `complete` is an end state, not a step the
 *  user works through, so it is not counted. */
export const PROGRESS_TOTAL = ONBOARDING_STEPS.length - 1;
