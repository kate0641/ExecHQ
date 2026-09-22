"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
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
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  invalidateSession,
  isResumable,
  subscribeSession,
  writeSession,
} from "./storage";

/**
 * Binds the onboarding state machine to React, adds the simulated "thinking"
 * delay, and handles resume.
 *
 * Still presentation-free: it returns state and callbacks, and draws nothing.
 * All three concepts use this hook, so a change to how the flow behaves lands
 * in every concept at once and a change to how it looks lands in one.
 */
export type Generating = "interpreting" | "planning" | "drafting" | null;

export interface UseOnboardingFlowOptions {
  /** Namespaces stored sessions so concepts do not read each other's state. */
  conceptId: string;
  /** Feeds the user's edited interpretation into the artifact, so a concept
   *  that lets them rewrite that sentence does not then quote the version they
   *  replaced. Opt-in: concepts that do not offer the edit are unaffected. */
  followInterpretation?: boolean;
}

export function useOnboardingFlow({
  conceptId,
  followInterpretation = false,
}: UseOnboardingFlowOptions) {
  const reducer = useMemo(
    () => makeReducer(REFINEMENT_QUESTIONS.length, CUSTOM_PLAN_STEPS.length),
    []
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const [generating, setGenerating] = useState<Generating>(null);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read during render rather than in an effect, so there is no setState on
  // mount and no flash of the wrong screen before the offer appears.
  const stored = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(conceptId),
    getServerSessionSnapshot
  );

  /** An abandoned session worth offering, until the user answers the offer or
   *  starts moving through the flow themselves. */
  const pendingResume =
    !resumeDismissed && state === initialState && stored && isResumable(stored)
      ? stored
      : null;

  // Persist after every change, except the untouched initial state.
  useEffect(() => {
    if (state === initialState) return;
    writeSession(conceptId, state);
  }, [conceptId, state]);

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

  const acceptResume = useCallback(() => {
    if (!pendingResume) return;
    dispatch({ type: "restore", state: pendingResume });
    setResumeDismissed(true);
  }, [pendingResume]);

  const discard = useCallback(() => {
    clearSession(conceptId);
    invalidateSession(conceptId);
    setResumeDismissed(true);
    dispatch({ type: "reset" });
  }, [conceptId]);

  const declineResume = discard;

  const restart = useCallback(() => {
    clearSession(conceptId);
    invalidateSession(conceptId);
    setResumeDismissed(false);
    dispatch({ type: "reset" });
  }, [conceptId]);

  return {
    state,
    dispatch,
    derived,
    generating,
    withDelay,
    pendingResume,
    acceptResume,
    declineResume,
    restart,
    refinementQuestions: REFINEMENT_QUESTIONS,
    customPlanSteps: CUSTOM_PLAN_STEPS,
  };
}

export type OnboardingFlow = ReturnType<typeof useOnboardingFlow>;
