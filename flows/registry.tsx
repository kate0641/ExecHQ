import type { ReactElement } from "react";
import { OnboardingConcept1 } from "./onboarding/concept-1";
import { OnboardingConcept2 } from "./onboarding/concept-2";
import { OnboardingConcept3 } from "./onboarding/concept-3";

/**
 * Concept pages that have been built.
 *
 * The manifest declares every concept; this says which of them have a design
 * behind them yet. Anything not listed here renders the "Not yet built" state,
 * so adding a concept to the manifest never means touching a route, and
 * building one never means touching the manifest.
 *
 * These are elements rather than component types on purpose. A page that looked
 * up a component type and then rendered it would be creating a component during
 * its own render, which defeats React's identity tracking and remounts the
 * whole concept on every parent render — taking the user's place in the flow
 * with it. Elements are inert descriptors, so building them once at module
 * scope is free and stable.
 */
const BUILT_CONCEPTS: Record<string, ReactElement> = {
  "onboarding/concept-1": <OnboardingConcept1 />,
  "onboarding/concept-2": <OnboardingConcept2 />,
  "onboarding/concept-3": <OnboardingConcept3 />,
};

export function getBuiltConcept(
  flowSlug: string,
  conceptSlug: string
): ReactElement | undefined {
  return BUILT_CONCEPTS[`${flowSlug}/${conceptSlug}`];
}
