import type { OnboardingFlow } from "@/flows/onboarding/shared";

/** What every screen in the paged wizard needs: the flow, where it sits in the
 *  progress, and the id the shell moves focus to when the step changes. */
export interface ScreenProps {
  flow: OnboardingFlow;
  step: number;
  total: number;
  headingId: string;
}
