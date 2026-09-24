import {
  DIRECTION_PROMPTS_C1,
  PROMPTED_DIRECTIONS,
  REFINEMENT_BY_NEED,
  REFINEMENT_QUESTIONS,
  SAMPLE_ANSWERS,
  recommendPlan,
  refinementFor,
} from "@/mock/onboarding";

/** Sample answers for a jump past refinement: the first option of each
 *  question this direction is asked, so the read-back has something real. */
function sampleRefinement(direction: string): Record<string, string> {
  return Object.fromEntries(
    refinementFor(direction).map((question) => [question.id, question.options[0].value])
  );
}
import { initialState, type OnboardingState } from "./state";
import { ONBOARDING_STEPS, stepIndex, type OnboardingStep } from "./steps";

/**
 * The state a reviewer lands in when they jump straight to a step from the
 * prototype's step bar.
 *
 * It is the state someone would be in had they just walked there: every step
 * before the target answered, nothing after it. Answers the reviewer already
 * gave are kept; any that are missing come from the mock data, so a jump past
 * an unanswered step still leaves every later screen with something real to
 * show. Answers belonging to the target step or later are cleared, so the
 * target opens as a first arrival rather than a revisit.
 *
 * Review scaffolding only. The product has no way to skip ahead.
 */
export function jumpState(current: OnboardingState, step: OnboardingStep): OnboardingState {
  const target = stepIndex(step);
  /** True when the target is past `answeredAt`, so its answer should exist. */
  const past = (answeredAt: OnboardingStep) => target > stepIndex(answeredAt);
  const was = current.answers;

  const sampleDirection =
    [...DIRECTION_PROMPTS_C1, ...PROMPTED_DIRECTIONS].find(
      (p) => p.id === SAMPLE_ANSWERS.directionId
    ) ?? PROMPTED_DIRECTIONS[0];
  const hasDirection = past("direction") && was.direction !== null;
  const direction = past("direction")
    ? hasDirection
      ? was.direction
      : sampleDirection.text
    : null;

  // Past the builder with no story built: a sample one, so the ending has
  // something real to show.
  const hasStory = was.positioning.built;
  const refinementTouched =
    Object.keys(was.refinement).length > 0 || current.skipped.includes("refinement");
  const hasPlan = past("plan") && was.planId !== null;
  const keepCustom = hasPlan && was.planSource === "custom";

  const answers: OnboardingState["answers"] = {
    ...initialState.answers,
    inviteCode: past("account") ? was.inviteCode : null,
    email: past("account") ? (was.email ?? SAMPLE_ANSWERS.email) : null,
    direction,
    directionSource: past("direction")
      ? hasDirection
        ? was.directionSource
        : "prompted"
      : null,
    interpretation: past("interpretation") && hasDirection ? was.interpretation : null,
    refinement: past("refinement")
      ? refinementTouched
        ? was.refinement
        : sampleRefinement(direction ?? "")
      : {},
    planId: past("plan")
      ? hasPlan
        ? was.planId
        : recommendPlan(direction ?? "").id
      : null,
    planSource: past("plan") ? (hasPlan ? was.planSource : "recommended") : null,
    customPlan: keepCustom ? was.customPlan : {},
    customPlanDraftSaved: keepCustom ? was.customPlanDraftSaved : false,
    artifactSaved: past("artifact") ? (hasStory ? was.artifactSaved : true) : false,
    positioning: past("artifact")
      ? hasStory
        ? was.positioning
        : {
            ...SAMPLE_ANSWERS.positioning,
            strengths: [...SAMPLE_ANSWERS.positioning.strengths],
            edits: {},
            approved: [...SAMPLE_ANSWERS.positioning.approved],
          }
      : initialState.answers.positioning,
    connections: past("connect") ? was.connections : {},
    signalLinks: past("connect") ? was.signalLinks : {},
  };

  // Skips are ids of steps, refinement questions and connections. Keep only
  // those that belong to steps the target has passed.
  const refinementIds = new Set([
    ...REFINEMENT_QUESTIONS.map((q) => q.id),
    ...Object.values(REFINEMENT_BY_NEED).flatMap((set) => set.map((q) => q.id)),
  ]);
  const skipped = current.skipped.filter((id) => {
    if (refinementIds.has(id)) return past("refinement");
    // The builder's own skips belong to the story, kept or dropped with it.
    if (id.startsWith("positioning:")) return past("artifact") && hasStory;
    if ((ONBOARDING_STEPS as readonly string[]).includes(id)) {
      return past(id as OnboardingStep);
    }
    return past("connect");
  });

  // The sample story had nothing to start from, and stopped at two
  // strengths: both passed, not left open.
  if (past("artifact") && !hasStory) skipped.push("positioning:source", "positioning:strengths");

  return {
    ...initialState,
    step,
    answers,
    skipped,
    visited: ONBOARDING_STEPS.slice(0, target + 1),
  };
}
