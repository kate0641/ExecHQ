import type { ReactElement } from "react";
import { OnboardingConcept3 } from "./onboarding/concept-3";
import { HomepageConcept4 } from "./homepage/concept-4";
import { PlanConcept3 } from "./plan/concept-3";
import { PlanTemplates } from "./plan/templates";
import { SignalsConcept2 } from "./signals/concept-2";
import { ProfileConcept1 } from "./profile/concept-1";
import { LoginConcept1 } from "./login/concept-1";

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
  "onboarding/concept-3": <OnboardingConcept3 />,
  "homepage/concept-4": <HomepageConcept4 />,
  "plan/concept-3": <PlanConcept3 />,
  "plan/templates": <PlanTemplates />,
  "signals/concept-2": <SignalsConcept2 />,
  "profile/concept-1": <ProfileConcept1 />,
  "login/concept-1": <LoginConcept1 />,
};

/** Every built concept, as manifest slugs, in the order they are listed above. */
export function getBuiltConceptKeys(): { flow: string; concept: string }[] {
  return Object.keys(BUILT_CONCEPTS).map((key) => {
    const [flow, concept] = key.split("/");
    return { flow, concept };
  });
}

export function getBuiltConcept(
  flowSlug: string,
  conceptSlug: string
): ReactElement | undefined {
  return BUILT_CONCEPTS[`${flowSlug}/${conceptSlug}`];
}
