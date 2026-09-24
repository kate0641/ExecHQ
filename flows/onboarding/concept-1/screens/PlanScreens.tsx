"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { AnswerList } from "@/components/onboarding/AnswerList";
import { PlanTimeline } from "@/components/onboarding/PlanTimeline";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  CUSTOM_PLAN_DRAFT_NAME,
  GENERATING_COPY,
  PLAN_TEMPLATES,
  PLAN_C1,
  REFINEMENT_C1,
  builtFrom,
  planById,
  refinementFor,
  towardFor,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/** How long a chosen answer shows as pressed before the next question. */
const ANSWER_SETTLE_MS = 250;

/**
 * The refinement questions, tailored to the plan the direction points at.
 *
 * Three per plan, minus any the direction already answers — "C-suite in 3
 * years" is not asked when. Because the count varies, it is never shown: the
 * progress marks stay on the flow's own step.
 *
 * Tapping an answer answers and moves on, so there is no Next button. The one
 * pinned action is a per-question skip, by decision on 2026-09-24: skipping
 * one question keeps the others, rather than one exit that throws them all
 * away. Leaving the last question, answered or skipped, starts the reading.
 */
export function RefinementScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, withDelay } = flow;
  const questions = refinementFor(state.answers.direction ?? "");
  const index = Math.min(state.refinementIndex, questions.length - 1);
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (settle.current) clearTimeout(settle.current);
    };
  }, []);

  function leave() {
    dispatch({ type: "go-to", step: "interpretation" });
    withDelay("interpreting", () => {});
  }

  function choose(value: string) {
    if (settle.current) return;
    dispatch({ type: "answer-refinement", id: question.id, value });
    // A beat on the pressed answer, so the choice is seen before it moves on.
    settle.current = setTimeout(() => {
      settle.current = null;
      if (isLast) leave();
      else dispatch({ type: "refinement-to", index: index + 1 });
    }, ANSWER_SETTLE_MS);
  }

  function skip() {
    if (settle.current) return;
    dispatch({ type: "note-skip", id: question.id });
    if (isLast) leave();
    else dispatch({ type: "refinement-to", index: index + 1 });
  }

  return (
    <WizardStep
      step={step}
      total={total}
      title={question.question}
      description={REFINEMENT_C1.instruction}
      headingId={headingId}
      primaryLabel={REFINEMENT_C1.skip}
      primaryVariant="secondary"
      onPrimary={skip}
      className="wizard--centred"
    >
      <AnswerList
        label={question.question}
        options={question.options}
        value={state.answers.refinement[question.id]}
        onChoose={choose}
      />
    </WizardStep>
  );
}

/**
 * Plan selection, recommended-first.
 *
 * One recommendation with its reason, and the other four behind a disclosure.
 * Showing all five at once would make the recommendation just the first of a
 * list; keeping the others one press away makes it a recommendation the user
 * can overrule, which is the brand position — intelligence to decide with, not
 * an instruction.
 *
 * When refinement was skipped, the assumption is stated here rather than on the
 * skip itself, because this is the first screen where the assumption has
 * actually done anything.
 */
export function PlanScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, derived, generating } = flow;
  const [showOthers, setShowOthers] = useState(false);
  const othersId = useId();

  if (generating === "planning") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={GENERATING_COPY.planning} />
      </WizardStep>
    );
  }

  const recommended = derived?.recommended;
  if (!recommended) return null;

  const selectedId = state.answers.planId ?? recommended.id;
  const chosen = planById(selectedId) ?? recommended;
  const recommendedId = recommended.id;
  const direction = state.answers.direction ?? "";
  const tags = builtFrom(direction, state.answers.refinement);
  const toward = towardFor(direction);

  /** Confirming a plan goes straight to building the draft. There is no screen
   *  in between: the user has just decided, and the fastest way to prove the
   *  decision was worth making is to hand them the first piece of work. */
  function confirm() {
    dispatch({
      type: "select-plan",
      planId: selectedId,
      source: selectedId === recommendedId ? "recommended" : "switched",
    });
    // Straight to the builder's inputs; the writing pause comes when they
    // press "Build my story".
    dispatch({ type: "go-to", step: "artifact" });
  }

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={PLAN_C1.eyebrow}
      title={chosen.name}
      description={chosen.formalName}
      headingId={headingId}
      primaryLabel={PLAN_C1.confirm}
      onPrimary={confirm}
    >
      {/* The way to a different plan sits under the title, where it is seen
          without scrolling, and stays quiet so it never competes with using
          this one. Building your own is not offered: out of scope for the
          MVP, by decision on 2026-09-24. */}
      <div className="plan-others">
        <button
          type="button"
          className="plan-others__toggle"
          aria-expanded={showOthers}
          aria-controls={othersId}
          onClick={() => setShowOthers((open) => !open)}
        >
          {showOthers ? PLAN_C1.hideOthers : PLAN_C1.others}
        </button>
        <div
          className="plan-set"
          id={othersId}
          role="radiogroup"
          aria-label="Plans"
          hidden={!showOthers}
        >
          {PLAN_TEMPLATES.map((plan) => (
            <PlanTemplateCard
              key={plan.id}
              plan={plan}
              recommended={plan.id === recommendedId}
              selected={selectedId === plan.id}
              name="plan"
              onSelect={(planId) =>
                dispatch({
                  type: "select-plan",
                  planId,
                  source: planId === recommendedId ? "recommended" : "switched",
                })
              }
            />
          ))}
        </div>
      </div>

      {/* What it was built from, then that it grows: a starting point, not a
          programme with an end date. */}
      <div className="plan-built">
        <p className="plan-built__label">{PLAN_C1.builtFrom}</p>
        <ul className="plan-built__tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p className="plan-built__grows">{PLAN_C1.grows}</p>
      </div>

      {chosen.thisWeek ? (
        <ThisWeekCard
          label={PLAN_C1.thisWeek}
          whyLabel={PLAN_C1.why}
          {...chosen.thisWeek}
        />
      ) : null}

      {chosen.stages?.length ? (
        <div className="plan-ahead">
          <p className="plan-ahead__toward">
            {chosen.horizon}, toward <b>{toward}</b>
          </p>
          <PlanTimeline
            stages={chosen.stages}
            nowLabel={PLAN_C1.now}
            doneLabel={PLAN_C1.doneWhen}
            after={chosen.after}
          />
        </div>
      ) : null}
    </WizardStep>
  );
}

/**
 * The custom-plan wizard, nested inside plan selection.
 *
 * Leaving it is not cancelling it. Every answer is kept, the exit says so, and
 * plan selection shows the draft waiting. That is the difference between an
 * optional path and a trap: a user who opens this out of curiosity and changes
 * their mind should lose nothing by backing out.
 */
export function CustomPlanScreen({ flow, headingId }: ScreenProps) {
  const { state, dispatch, customPlanSteps, withDelay } = flow;
  const index = state.customPlanIndex ?? 0;
  const stepSpec = customPlanSteps[index];
  const answer = state.answers.customPlan[stepSpec.id];
  const isLast = index === customPlanSteps.length - 1;

  return (
    <WizardStep
      step={index + 1}
      total={customPlanSteps.length}
      progressLabel="Question"
      eyebrow={CUSTOM_PLAN_DRAFT_NAME}
      title={stepSpec.question}
      description={stepSpec.hint}
      headingId={headingId}
      primaryLabel={isLast ? "Use this plan" : "Next"}
      primaryDisabled={!answer}
      onPrimary={() => {
        if (isLast) {
          dispatch({ type: "select-plan", planId: "custom", source: "custom" });
          dispatch({ type: "go-to", step: "artifact" });
          withDelay("drafting", () => {});
          return;
        }
        dispatch({
          type: "answer-custom-plan",
          id: stepSpec.id,
          value: answer ?? "",
        });
      }}
      skipLabel="Leave"
      onSkip={() => dispatch({ type: "exit-custom-plan" })}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      <ToggleGroup
        label={stepSpec.question}
        labelHidden
        orientation="vertical"
        options={stepSpec.options}
        value={answer ?? ""}
        onChange={(value) =>
          dispatch({ type: "answer-custom-plan", id: stepSpec.id, value })
        }
      />
    </WizardStep>
  );
}
