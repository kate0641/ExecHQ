"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/primitives/Button";
import { Notice } from "@/components/onboarding/Notice";
import { useOnboardingFlow, type OnboardingStep } from "@/flows/onboarding/shared";
import {
  AccountScreen,
  DirectionScreen,
  InterpretationScreen,
  PrivacyScreen,
} from "./screens/EntryScreens";
import {
  CustomPlanScreen,
  PlanScreen,
  RefinementScreen,
} from "./screens/PlanScreens";
import {
  ArtifactScreen,
  CompleteScreen,
  ConnectScreen,
} from "./screens/OutputScreens";
import type { ScreenProps } from "./screens/types";

/**
 * Concept 1 — the paged wizard.
 *
 * One decision per screen, explicit progress, nothing below the fold. This is
 * the baseline the other two concepts are measured against, so it is
 * deliberately the plain version: no motion, no illustration, no novel layout.
 * If a later concept is not clearly better than this for a given step, this is
 * the one that should win.
 *
 * The shell owns three things the screens should not: which step renders, where
 * focus goes when the step changes, and the offer to resume an abandoned
 * session. Everything else lives in the screens, and the flow's behaviour lives
 * in the shared state machine.
 */
/**
 * The steps this concept actually puts on screen.
 *
 * `plan-confirmed` and `action` stay in the shared list because Concepts 2 and 3
 * still use them, and this concept steps over them rather than forking the flow.
 * Progress has to be counted against what the user will actually see, or the
 * last screens report themselves as 9 and 10 of 10 while two marks never light.
 */
const SHOWN_STEPS: OnboardingStep[] = [
  "account",
  "privacy",
  "direction",
  "refinement",
  "interpretation",
  "plan",
  "artifact",
  "connect",
  "complete",
];

export function OnboardingConcept1() {
  const flow = useOnboardingFlow({ conceptId: "concept-1" });
  const { state, pendingResume } = flow;
  const headingId = useId();
  const stepKey = `${state.step}-${state.refinementIndex}-${state.customPlanIndex}`;
  const previousKey = useRef(stepKey);

  // Move focus to the new step's heading when the step changes, so focus is
  // never left on a control that has just been replaced. Not on first paint:
  // stealing focus before the user has done anything is its own problem.
  useEffect(() => {
    if (previousKey.current === stepKey) return;
    previousKey.current = stepKey;
    document.getElementById(headingId)?.focus();
  }, [stepKey, headingId]);

  if (pendingResume) {
    return (
      <div className="wizard">
        <Notice tone="info" title="You were part way through">
          We kept your answers. You can pick up where you stopped, or start again
          from the beginning.
          <div className="wizard__resume-actions">
            <Button variant="primary" onClick={flow.acceptResume}>
              Pick up where I stopped
            </Button>
            <Button variant="secondary" onClick={flow.declineResume}>
              Start again
            </Button>
          </div>
        </Notice>
      </div>
    );
  }

  const shownIndex = SHOWN_STEPS.indexOf(state.step);

  const screenProps: ScreenProps = {
    flow,
    step: (shownIndex === -1 ? 0 : shownIndex) + 1,
    total: SHOWN_STEPS.length,
    headingId,
  };

  // The custom-plan wizard is nested inside plan selection rather than being a
  // step of its own, so it takes over the canvas while it is open.
  if (state.customPlanIndex !== null) {
    return <CustomPlanScreen {...screenProps} />;
  }

  switch (state.step) {
    case "account":
      return <AccountScreen {...screenProps} />;
    case "privacy":
      return <PrivacyScreen {...screenProps} />;
    case "direction":
      return <DirectionScreen {...screenProps} />;
    case "interpretation":
      return <InterpretationScreen {...screenProps} />;
    case "refinement":
      return <RefinementScreen {...screenProps} />;
    case "plan":
      return <PlanScreen {...screenProps} />;
    // plan-confirmed and action are no longer screens in this concept:
    // confirming a plan builds the draft immediately. They stay in the shared
    // step list because Concepts 2 and 3 still use them, so this concept steps
    // over them with go-to rather than forking the flow.
    case "plan-confirmed":
    case "action":
    case "artifact":
      return <ArtifactScreen {...screenProps} />;
    case "connect":
      return <ConnectScreen {...screenProps} />;
    case "complete":
      return <CompleteScreen {...screenProps} />;
    default:
      // Every step is handled above; this keeps the switch exhaustive if the
      // shared step list ever grows without this file being updated.
      return <AccountScreen {...screenProps} />;
  }
}

export default OnboardingConcept1;
