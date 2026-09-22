import {
  ONBOARDING_STEPS,
  PROGRESS_TOTAL,
  stepIndex,
  type OnboardingStep,
} from "./steps";

/**
 * The onboarding flow's state and the reducer that moves it.
 *
 * Presentation-free on purpose: no React, no classes, no copy. All three
 * concepts run this same machine and differ only in what they draw for a given
 * state, which is what makes them comparable as design directions rather than
 * as three different products.
 */

export type ConnectionState = "offered" | "connected" | "declined" | "failed";
export type PlanSource = "recommended" | "switched" | "custom";
export type DirectionSource = "prompted" | "free";

export interface OnboardingAnswers {
  inviteCode: string | null;
  email: string | null;
  direction: string | null;
  directionSource: DirectionSource | null;
  /** The read-back sentence. Editable, so it is stored rather than derived. */
  interpretation: string | null;
  /** Refinement question id to chosen value. Missing means unanswered. */
  refinement: Record<string, string>;
  planId: string | null;
  planSource: PlanSource | null;
  /** Custom-plan wizard answers. Kept even when the wizard is left early, so
   *  exiting preserves a draft rather than discarding one. */
  customPlan: Record<string, string>;
  customPlanDraftSaved: boolean;
  artifactSaved: boolean;
  connections: Record<string, ConnectionState>;
}

export interface OnboardingState {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  /** Which refinement question is showing. */
  refinementIndex: number;
  /** Which custom-plan question is showing, or null when the wizard is closed. */
  customPlanIndex: number | null;
  /** Ids of anything the user skipped: step names and refinement question ids. */
  skipped: string[];
  /** Every step the user has reached, so a resumed session can say where it is. */
  visited: OnboardingStep[];
  /** True once state has been restored from a previous session. */
  resumed: boolean;
}

export const initialState: OnboardingState = {
  step: "account",
  answers: {
    inviteCode: null,
    email: null,
    direction: null,
    directionSource: null,
    interpretation: null,
    refinement: {},
    planId: null,
    planSource: null,
    customPlan: {},
    customPlanDraftSaved: false,
    artifactSaved: false,
    connections: {},
  },
  refinementIndex: 0,
  customPlanIndex: null,
  skipped: [],
  visited: ["account"],
  resumed: false,
};

export type OnboardingAction =
  | { type: "set-invite-code"; code: string | null }
  | { type: "set-email"; email: string }
  | { type: "set-direction"; direction: string; source: DirectionSource }
  | { type: "edit-interpretation"; interpretation: string }
  | { type: "answer-refinement"; id: string; value: string }
  | { type: "skip-refinement"; id: string }
  | { type: "skip-all-refinement" }
  | { type: "select-plan"; planId: string; source: PlanSource }
  | { type: "open-custom-plan" }
  | { type: "answer-custom-plan"; id: string; value: string }
  | { type: "exit-custom-plan" }
  | { type: "save-artifact" }
  | { type: "set-connection"; id: string; state: ConnectionState }
  | { type: "next" }
  | { type: "back" }
  | { type: "go-to"; step: OnboardingStep }
  | { type: "restore"; state: OnboardingState }
  | { type: "reset" };

function withVisit(state: OnboardingState, step: OnboardingStep): OnboardingState {
  return {
    ...state,
    step,
    visited: state.visited.includes(step) ? state.visited : [...state.visited, step],
  };
}

function addSkip(skipped: string[], id: string): string[] {
  return skipped.includes(id) ? skipped : [...skipped, id];
}

/**
 * Moves forward one step. Refinement is the only step that holds several
 * questions, so it advances internally until it runs out.
 */
function advance(state: OnboardingState, refinementCount: number): OnboardingState {
  if (state.step === "refinement" && state.refinementIndex < refinementCount - 1) {
    return { ...state, refinementIndex: state.refinementIndex + 1 };
  }
  const next = ONBOARDING_STEPS[Math.min(stepIndex(state.step) + 1, PROGRESS_TOTAL)];
  return withVisit(state, next);
}

function retreat(state: OnboardingState): OnboardingState {
  // Inside the custom-plan wizard, back walks the wizard, not the flow.
  if (state.customPlanIndex !== null && state.customPlanIndex > 0) {
    return { ...state, customPlanIndex: state.customPlanIndex - 1 };
  }
  if (state.customPlanIndex === 0) {
    return { ...state, customPlanIndex: null };
  }
  if (state.step === "refinement" && state.refinementIndex > 0) {
    return { ...state, refinementIndex: state.refinementIndex - 1 };
  }
  const previous = ONBOARDING_STEPS[Math.max(stepIndex(state.step) - 1, 0)];
  return { ...state, step: previous };
}

export function makeReducer(refinementCount: number, customPlanCount: number) {
  return function reducer(
    state: OnboardingState,
    action: OnboardingAction
  ): OnboardingState {
    switch (action.type) {
      case "set-invite-code":
        return { ...state, answers: { ...state.answers, inviteCode: action.code } };

      case "set-email":
        return { ...state, answers: { ...state.answers, email: action.email } };

      case "set-direction":
        return {
          ...state,
          answers: {
            ...state.answers,
            direction: action.direction,
            directionSource: action.source,
            // A changed direction invalidates everything derived from it.
            interpretation: null,
          },
        };

      case "edit-interpretation":
        return {
          ...state,
          answers: { ...state.answers, interpretation: action.interpretation },
        };

      case "answer-refinement":
        return {
          ...state,
          answers: {
            ...state.answers,
            refinement: { ...state.answers.refinement, [action.id]: action.value },
          },
          skipped: state.skipped.filter((id) => id !== action.id),
        };

      case "skip-refinement":
        return advance(
          { ...state, skipped: addSkip(state.skipped, action.id) },
          refinementCount
        );

      // Skipping leaves the refinement step entirely and lands on whatever comes
      // next in the list, rather than naming a destination — the step order has
      // moved once already and a hard-coded target would have gone stale silently.
      case "skip-all-refinement":
        return withVisit(
          { ...state, skipped: addSkip(state.skipped, "refinement") },
          ONBOARDING_STEPS[stepIndex("refinement") + 1]
        );

      case "select-plan":
        return {
          ...state,
          answers: {
            ...state.answers,
            planId: action.planId,
            planSource: action.source,
          },
          customPlanIndex: null,
        };

      case "open-custom-plan":
        return { ...state, customPlanIndex: 0 };

      case "answer-custom-plan": {
        const customPlan = { ...state.answers.customPlan, [action.id]: action.value };
        const atEnd =
          state.customPlanIndex !== null &&
          state.customPlanIndex >= customPlanCount - 1;
        return {
          ...state,
          answers: { ...state.answers, customPlan, customPlanDraftSaved: true },
          customPlanIndex: atEnd
            ? state.customPlanIndex
            : (state.customPlanIndex ?? 0) + 1,
        };
      }

      // Leaving the wizard keeps whatever was answered. A draft plan survives
      // the exit; that is the difference between leaving and cancelling.
      case "exit-custom-plan":
        return {
          ...state,
          customPlanIndex: null,
          answers: {
            ...state.answers,
            customPlanDraftSaved:
              state.answers.customPlanDraftSaved ||
              Object.keys(state.answers.customPlan).length > 0,
          },
        };

      case "save-artifact":
        return { ...state, answers: { ...state.answers, artifactSaved: true } };

      case "set-connection":
        return {
          ...state,
          answers: {
            ...state.answers,
            connections: { ...state.answers.connections, [action.id]: action.state },
          },
          skipped:
            action.state === "declined"
              ? addSkip(state.skipped, action.id)
              : state.skipped.filter((id) => id !== action.id),
        };

      case "next":
        return advance(state, refinementCount);

      case "back":
        return retreat(state);

      case "go-to":
        return withVisit(state, action.step);

      case "restore":
        return { ...action.state, resumed: true };

      case "reset":
        return initialState;

      default:
        return state;
    }
  };
}

/** Whether the user has skipped everything optional so far. Used to assert the
 *  skip-through path stays open, and to decide whether to state an assumption. */
export function hasSkippedRefinement(state: OnboardingState): boolean {
  return (
    state.skipped.includes("refinement") ||
    Object.keys(state.answers.refinement).length === 0
  );
}

export function progressStep(state: OnboardingState): number {
  return stepIndex(state.step) + 1;
}
