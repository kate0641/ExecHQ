"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { AnswerList } from "@/components/onboarding/AnswerList";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  CUSTOM_PLAN_DRAFT_NAME,
  GENERATING_COPY,
  PLAN_TEMPLATES,
  REFINEMENT_C1,
  planById,
  refinementEcho,
  refinementFor,
  type PlanTemplate,
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
      else dispatch({ type: "next" });
    }, ANSWER_SETTLE_MS);
  }

  function skip() {
    if (settle.current) return;
    dispatch({ type: "skip-refinement", id: question.id });
    if (isLast) leave();
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
  const { state, dispatch, derived, generating, withDelay } = flow;
  const [showOthers, setShowOthers] = useState(false);

  if (generating === "planning") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={GENERATING_COPY.planning} />
      </WizardStep>
    );
  }

  const recommended = derived?.recommended;
  if (!recommended) return null;

  // One refinement answer, said back in the reasoning, so the questions
  // visibly shaped the plan.
  const echo = refinementEcho(state.answers.direction ?? "", state.answers.refinement);
  const withEcho = (reason: string) => (echo ? `${reason} ${echo}` : reason);

  const selectedId = state.answers.planId ?? recommended.id;
  const chosen = planById(selectedId) ?? recommended;
  const others = PLAN_TEMPLATES.filter((plan) => plan.id !== recommended.id);

  /** Confirming a plan goes straight to building the draft. There is no longer a
   *  screen in between: the user has just decided, and the fastest way to prove
   *  the decision was worth making is to hand them the first piece of work. */
  const recommendedId = recommended.id;

  function confirm() {
    dispatch({
      type: "select-plan",
      planId: selectedId,
      source: selectedId === recommendedId ? "recommended" : "switched",
    });
    dispatch({ type: "go-to", step: "artifact" });
    withDelay("drafting", () => {});
  }

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Recommended for you"
      title={chosen.name}
      headingId={headingId}
      primaryLabel="Use this plan"
      onPrimary={confirm}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
      footer={
        <>
          {!showOthers ? (
            <Button variant="secondary" fullWidth onClick={() => setShowOthers(true)}>
              See other plans
            </Button>
          ) : null}
          <Button
            variant="ghost"
            fullWidth
            onClick={() => dispatch({ type: "open-custom-plan" })}
          >
            Build my own plan
          </Button>
        </>
      }
    >
      {state.answers.customPlanDraftSaved ? (
        <Notice tone="info" title="Your own plan is saved as a draft">
          You can come back and finish it whenever you like. Nothing you answered
          was lost.
        </Notice>
      ) : null}

      {/* Why before what. The reason is tied to the user's own words, so it is
          the part that tells them whether this is their plan. */}
      {recommended.rationale && selectedId === recommended.id ? (
        <PlanReason reason={withEcho(recommended.rationale)} />
      ) : null}

      <PlanStages plan={chosen} />

      {showOthers ? (
        <div className="plan-set" role="radiogroup" aria-label="Plan">
          {others.map((plan) => (
            <PlanTemplateCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              name="plan"
              onSelect={(planId) =>
                dispatch({ type: "select-plan", planId, source: "switched" })
              }
            />
          ))}
        </div>
      ) : null}
    </WizardStep>
  );
}

/** The stated reason this plan was chosen. */
function PlanReason({ reason }: { reason: string }) {
  return (
    <div className="plan-reason">
      <p className="t-eyebrow">Why this one</p>
      <p className="plan-reason__text">{reason}</p>
    </div>
  );
}

/** The roadmap: what the plan is, in enough detail to judge it. */
function PlanStages({ plan }: { plan: PlanTemplate }) {
  if (!plan.stages?.length) return null;
  return (
    <ol className="plan-stages">
      {plan.stages.map((stage) => (
        <li className="plan-stage" key={stage.title}>
          <p className="plan-stage__window">{stage.window}</p>
          <h2 className="plan-stage__title">{stage.title}</h2>
          <ul className="plan-stage__outcomes">
            {stage.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
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
