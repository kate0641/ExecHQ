import type { ReactElement } from "react";
import { OnboardingConcept3 } from "./onboarding/concept-3";
import { HomepageConcept4 } from "./homepage/concept-4";
import { HomepageConcept4b } from "./homepage/concept-4b";
import { PlanConcept3 } from "./plan/concept-3";
import { SignalsConcept2 } from "./signals/concept-2";
import { ProfileConcept1 } from "./profile/concept-1";
import { LoginConcept1 } from "./login/concept-1";
import { BriefingConcept2 } from "./daily-briefing/concept-2";
import { PlaybookConcept2 } from "./playbook/concept-2";
import { ToolFlowConcept3 } from "./playbook-flow/concept-3";
import { ToolFlowGate } from "./playbook-flow/ToolFlowGate";
import { EnterpriseConcept1b } from "./enterprise/concept-1b";
import { EnterpriseConcept3 } from "./enterprise/concept-3";
import { SponsorProfileConcept1 } from "./sponsor-profile/concept-1";
import { SponsorLoginConcept1 } from "./sponsor-login/concept-1";

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
  "homepage/concept-4b": <HomepageConcept4b />,
  "plan/concept-3": <PlanConcept3 />,
  "signals/concept-2": <SignalsConcept2 />,
  "profile/concept-1": <ProfileConcept1 />,
  "login/concept-1": <LoginConcept1 />,
  "daily-briefing/concept-2": <BriefingConcept2 />,
  "playbook/concept-2": <PlaybookConcept2 />,
  "playbook-flow/concept-3": <ToolFlowGate concept="concept-3"><ToolFlowConcept3 /></ToolFlowGate>,
  "enterprise/concept-1b": <EnterpriseConcept1b />,
  "enterprise/concept-3": <EnterpriseConcept3 />,
  "sponsor-profile/concept-1": <SponsorProfileConcept1 />,
  "sponsor-login/concept-1": <SponsorLoginConcept1 />,
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
