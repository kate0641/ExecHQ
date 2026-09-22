"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { AssumptionNotice } from "@/components/onboarding/AssumptionNotice";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { RefinementQuestion } from "@/components/onboarding/RefinementQuestion";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { hasSkippedRefinement } from "@/flows/onboarding/shared";
import {
  CUSTOM_PLAN_DRAFT_NAME,
  GENERATING_COPY,
  PLAN_TEMPLATES,
  planById,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * The refinement questions.
 *
 * The skip path says "Skip and show my first step" and means it: it leaves the
 * whole refinement step, not just this question. Offering a per-question skip
 * as well would turn one clear exit into three small ones and make stopping
 * feel like a series of small failures rather than a decision.
 */
export function RefinementScreen({ flow, headingId }: ScreenProps) {
  const { state, dispatch, refinementQuestions, withDelay } = flow;
  const question = refinementQuestions[state.refinementIndex];
  const answer = state.answers.refinement[question.id];
  const isLast = state.refinementIndex === refinementQuestions.length - 1;

  return (
    <WizardStep
      step={state.refinementIndex + 1}
      total={refinementQuestions.length}
      progressLabel="Question"
      optionalFrom={1}
      eyebrow="Optional"
      title={question.question}
      headingId={headingId}
      primaryLabel="Continue"
      onPrimary={() => {
        dispatch({ type: "next" });
        if (isLast) withDelay("planning", () => {});
      }}
      primaryDisabled={!answer}
      skipLabel="Skip and show my first step"
      onSkip={() => {
        dispatch({ type: "skip-all-refinement" });
        withDelay("planning", () => {});
      }}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      <RefinementQuestion
        question={question}
        value={answer}
        onChange={(value) =>
          dispatch({ type: "answer-refinement", id: question.id, value })
        }
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
  const others = PLAN_TEMPLATES.filter((plan) => plan.id !== recommended.id);

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Your plan"
      title="This is where we would start"
      headingId={headingId}
      primaryLabel="Use this plan"
      onPrimary={() => {
        dispatch({
          type: "select-plan",
          planId: selectedId,
          source: selectedId === recommended.id ? "recommended" : "switched",
        });
        dispatch({ type: "next" });
      }}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      {hasSkippedRefinement(state) && derived ? (
        <AssumptionNotice
          statement={derived.assumption.statement}
          promise={derived.assumption.promise}
        />
      ) : null}

      {state.answers.customPlanDraftSaved ? (
        <Notice tone="info" title="Your own plan is saved as a draft">
          You can come back and finish it whenever you like. Nothing you answered
          was lost.
        </Notice>
      ) : null}

      <div className="plan-set" role="radiogroup" aria-label="Plan">
        <PlanTemplateCard
          plan={recommended}
          recommended
          selected={selectedId === recommended.id}
          name="plan"
          onSelect={(planId) =>
            dispatch({ type: "select-plan", planId, source: "recommended" })
          }
        />

        {showOthers
          ? others.map((plan) => (
              <PlanTemplateCard
                key={plan.id}
                plan={plan}
                selected={selectedId === plan.id}
                name="plan"
                onSelect={(planId) =>
                  dispatch({ type: "select-plan", planId, source: "switched" })
                }
              />
            ))
          : null}
      </div>

      <div className="plan-set__actions">
        {!showOthers ? (
          <Button variant="secondary" onClick={() => setShowOthers(true)}>
            See other plans
          </Button>
        ) : null}
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "open-custom-plan" })}
        >
          Build my own
        </Button>
      </div>
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
  const { state, dispatch, customPlanSteps } = flow;
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
      primaryLabel={isLast ? "Use this plan" : "Continue"}
      primaryDisabled={!answer}
      onPrimary={() => {
        if (isLast) {
          dispatch({ type: "select-plan", planId: "custom", source: "custom" });
          dispatch({ type: "next" });
          return;
        }
        dispatch({
          type: "answer-custom-plan",
          id: stepSpec.id,
          value: answer ?? "",
        });
      }}
      skipLabel="Leave this and keep the draft"
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

/** Plan confirmed. A beat, not a celebration — nothing has been achieved yet. */
export function PlanConfirmedScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, derived } = flow;
  const plan =
    state.answers.planSource === "custom"
      ? { name: CUSTOM_PLAN_DRAFT_NAME, emphasis: "Built from your answers." }
      : (planById(state.answers.planId ?? "") ?? derived?.recommended);

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Your plan"
      title={plan?.name ?? "Your plan"}
      description={plan?.emphasis}
      headingId={headingId}
      primaryLabel="Show me the first step"
      onPrimary={() => dispatch({ type: "next" })}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      <Notice tone="info">
        You can change the plan at any time, and changing it will not lose
        anything you have already made.
      </Notice>
    </WizardStep>
  );
}
