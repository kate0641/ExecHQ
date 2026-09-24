"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  CUSTOM_PLAN_STEPS,
  GENERATING_MS,
  REFINEMENT_QUESTIONS,
  artifactFor,
  assumptionFor,
  firstAction,
  interpretDirection,
  recommendPlan,
} from "@/mock/onboarding";
import { makeReducer, initialState } from "./state";

/**
 * Binds the onboarding state machine to React and adds the simulated
 * "thinking" delay. Nothing is kept between visits: a refresh or a fresh visit
 * always opens on the first step, so every review walks the flow from the start.
 *
 * Still presentation-free: it returns state and callbacks, and draws nothing.
 * All three concepts use this hook, so a change to how the flow behaves lands
 * in every concept at once and a change to how it looks lands in one.
 */
export type Generating = "interpreting" | "planning" | "drafting" | null;

export interface UseOnboardingFlowOptions {
  /** Feeds the user's edited interpretation into the artifact, so a concept
   *  that lets them rewrite that sentence does not then quote the version they
   *  replaced. Opt-in: concepts that do not offer the edit are unaffected. */
  followInterpretation?: boolean;
}

export function useOnboardingFlow({
  followInterpretation = false,
}: UseOnboardingFlowOptions = {}) {
  const reducer = useMemo(
    () => makeReducer(REFINEMENT_QUESTIONS.length, CUSTOM_PLAN_STEPS.length),
    []
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const [generating, setGenerating] = useState<Generating>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  /** Runs the fake work: show the state, wait, then apply the change. */
  const withDelay = useCallback((kind: Exclude<Generating, null>, then: () => void) => {
    setGenerating(kind);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setGenerating(null);
      then();
    }, GENERATING_MS);
  }, []);

  const direction = state.answers.direction ?? "";

  const derived = useMemo(() => {
    if (!direction) return null;
    return {
      interpretation: state.answers.interpretation ?? interpretDirection(direction),
      recommended: recommendPlan(direction),
      assumption: assumptionFor(direction),
      action: firstAction(direction),
      artifact: artifactFor(
        direction,
        followInterpretation ? (state.answers.interpretation ?? undefined) : undefined
      ),
    };
  }, [direction, state.answers.interpretation, followInterpretation]);

  const restart = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    state,
    dispatch,
    derived,
    generating,
    withDelay,
    restart,
    refinementQuestions: REFINEMENT_QUESTIONS,
    customPlanSteps: CUSTOM_PLAN_STEPS,
  };
}

export type OnboardingFlow = ReturnType<typeof useOnboardingFlow>;
