"use client";

import { useEffect, useId, useRef } from "react";
import {
  stepNavItems,
  useOnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
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
import { CompleteScreen, ConnectScreen } from "./screens/OutputScreens";
import {
  PositioningBuildScreen,
  PositioningOutputScreen,
} from "./screens/BuilderScreens";
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
 * The shell owns two things the screens should not: which step renders and
 * where focus goes when the step changes. It never resumes: a refresh or a
 * fresh visit always opens on the first screen, so every review walks the
 * flow from the start. Everything else lives in the screens, and the flow's behaviour lives
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

/** The Positioning Builder is one step in the flow and two pages on screen:
 *  inputs, then outputs. The step bar and the progress marks both show two. */
const BUILDER_PAGES = [
  { id: "artifact-build", label: "Build" },
  { id: "artifact-story", label: "Your story" },
];

const STEP_NAV = stepNavItems(SHOWN_STEPS).flatMap((item) =>
  item.id === "artifact" ? BUILDER_PAGES : [item]
);

/**
 * The steps the progress marks count. The welcome and the privacy promise are
 * the opening, not work to get through, so the marks start at Direction and
 * the first question is "1 of 7" rather than "3 of 9".
 */
const PROGRESS_STEPS = SHOWN_STEPS.slice(SHOWN_STEPS.indexOf("direction"));
/** One more mark than steps: the builder's two pages each have one. */
const PROGRESS_TOTAL = PROGRESS_STEPS.length + 1;

/** 1-based progress position, counting the builder as two marks. */
function progressPosition(step: OnboardingStep, built: boolean): number {
  const index = Math.max(PROGRESS_STEPS.indexOf(step), 0);
  const builderIndex = PROGRESS_STEPS.indexOf("artifact");
  const pastBuild = index > builderIndex || (index === builderIndex && built);
  return index + 1 + (pastBuild ? 1 : 0);
}

/** Which step bar entry the flow is on. The steps this concept steps over
 *  render the draft screen, so that is where the bar says the user is. */
function shownStep(step: OnboardingStep): OnboardingStep {
  return step === "plan-confirmed" || step === "action" ? "artifact" : step;
}

export function OnboardingConcept1() {
  const flow = useOnboardingFlow();
  const { state } = flow;
  const headingId = useId();
  const built = state.answers.positioning.built;
  const stepKey = `${state.step}-${state.refinementIndex}-${state.customPlanIndex}-${built}`;
  const previousKey = useRef(stepKey);

  const current = shownStep(state.step);
  useStepNav(
    STEP_NAV,
    current === "artifact" ? (built ? "artifact-story" : "artifact-build") : current,
    (id) => {
      if (id.startsWith("artifact-")) {
        flow.jumpTo("artifact");
        flow.dispatch({ type: "set-positioning", patch: { built: id === "artifact-story" } });
        return;
      }
      flow.jumpTo(id as OnboardingStep);
    }
  );

  // Move focus to the new step's heading when the step changes, so focus is
  // never left on a control that has just been replaced. Not on first paint:
  // stealing focus before the user has done anything is its own problem.
  useEffect(() => {
    if (previousKey.current === stepKey) return;
    previousKey.current = stepKey;
    document.getElementById(headingId)?.focus();
  }, [stepKey, headingId]);

  const screenProps: ScreenProps = {
    flow,
    step: progressPosition(current, built),
    total: PROGRESS_TOTAL,
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
      return built ? (
        <PositioningOutputScreen {...screenProps} />
      ) : (
        <PositioningBuildScreen {...screenProps} />
      );
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
