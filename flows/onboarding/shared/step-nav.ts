import type { StepNavItem } from "@/lib/step-nav";
import type { OnboardingStep } from "./steps";

/**
 * Names for the prototype's step bar. Reviewer vocabulary, not product copy:
 * short enough that a whole flow fits across the top of a laptop screen, and
 * the same across every concept so "the Plan step" means one thing in review.
 */
export const STEP_LABELS: Record<OnboardingStep, string> = {
  account: "Account",
  privacy: "Privacy",
  direction: "Direction",
  refinement: "Refinement",
  interpretation: "Interpretation",
  plan: "Plan",
  "plan-confirmed": "Plan confirmed",
  action: "First step",
  artifact: "Draft",
  connect: "Connections",
  complete: "Done",
};

/** Step bar items for a concept that shows these steps as its screens. Call at
 *  module scope, so the list keeps one identity for the life of the page. */
export function stepNavItems(steps: readonly OnboardingStep[]): StepNavItem[] {
  return steps.map((step) => ({ id: step, label: STEP_LABELS[step] }));
}
