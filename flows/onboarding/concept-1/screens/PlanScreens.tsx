"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { RefinementQuestion } from "@/components/onboarding/RefinementQuestion";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  CUSTOM_PLAN_DRAFT_NAME,
  GENERATING_COPY,
  PLAN_TEMPLATES,
  planById,
  type PlanTemplate,
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
      primaryLabel="Next"
      onPrimary={() => {
        dispatch({ type: "next" });
        // Leaving refinement is what triggers the reading, now that the
        // interpretation comes after these questions rather than before them.
        if (isLast) withDelay("interpreting", () => {});
      }}
      primaryDisabled={!answer}
      skipLabel="Skip"
      onSkip={() => {
        dispatch({ type: "skip-all-refinement" });
        withDelay("interpreting", () => {});
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
        <PlanReason reason={recommended.rationale} />
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
