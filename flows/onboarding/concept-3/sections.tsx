"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Button } from "@/components/primitives/Button";
import { ActionCard } from "@/components/onboarding/ActionCard";
import { ArtifactDraft } from "@/components/onboarding/ArtifactDraft";
import { AssumptionNotice } from "@/components/onboarding/AssumptionNotice";
import { ConnectOffer } from "@/components/onboarding/ConnectOffer";
import { DirectionField } from "@/components/onboarding/DirectionField";
import { Notice } from "@/components/onboarding/Notice";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { PrivacyPromise } from "@/components/onboarding/PrivacyPromise";
import { RefinementQuestion } from "@/components/onboarding/RefinementQuestion";
import { StepActions } from "@/components/onboarding/StepActions";
import { hasSkippedRefinement, type OnboardingFlow } from "@/flows/onboarding/shared";
import {
  CONNECT_OFFERS,
  CUSTOM_PLAN_DRAFT_NAME,
  CUSTOM_PLAN_OPTION,
  DIRECTION,
  PLAN_TEMPLATES,
  PRIVACY,
  PROMPTED_DIRECTIONS,
  checkEmail,
  isValidInviteCode,
  planById,
  type PromptedDirection,
} from "@/mock/onboarding";

export interface SectionProps {
  flow: OnboardingFlow;
}

/* -----------------------------------------------------------------------------
   ACCOUNT
   -------------------------------------------------------------------------- */

export function AccountBody({ flow }: SectionProps) {
  const { state, dispatch } = flow;
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [showCode, setShowCode] = useState(Boolean(state.answers.inviteCode));
  const [codeError, setCodeError] = useState(false);
  const [verdict, setVerdict] = useState<ReturnType<typeof checkEmail> | null>(null);

  function submit() {
    const codeOk = !showCode || !code.trim() || isValidInviteCode(code);
    const emailVerdict = checkEmail(email);
    setCodeError(!codeOk);
    setVerdict(emailVerdict === "ok" ? null : emailVerdict);
    if (!codeOk || emailVerdict !== "ok") return;
    dispatch({ type: "set-invite-code", code: code.trim() || null });
    dispatch({ type: "set-email", email: email.trim() });
    dispatch({ type: "next" });
  }

  return (
    <>
      {showCode ? (
        <Input
          label="Invite code"
          hint="From the invitation you were sent. Optional."
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      ) : (
        <div className="canvas__inline-action">
          <Button variant="ghost" size="sm" onClick={() => setShowCode(true)}>
            I have an invite code
          </Button>
        </div>
      )}

      {codeError ? (
        <Notice tone="explain" title="We do not recognise that code" live>
          Check it against the invitation you were sent. You can also continue
          without one — a code only changes who pays, never what you get.
        </Notice>
      ) : null}

      <Input
        label="Email"
        type="email"
        required
        hint="Use whichever address suits you. You can change it whenever you like."
        value={email}
        error={
          verdict === "empty"
            ? "We need an email address to create the account."
            : verdict === "malformed"
              ? "That does not look like an email address."
              : undefined
        }
        onChange={(event) => setEmail(event.target.value)}
      />

      <StepActions primaryLabel="Continue" onPrimary={submit} />
    </>
  );
}

/* -----------------------------------------------------------------------------
   PRIVACY
   -------------------------------------------------------------------------- */

export function PrivacyBody({ flow }: SectionProps) {
  return (
    <>
      <PrivacyPromise statements={PRIVACY.statements} />
      <StepActions
        primaryLabel={PRIVACY.action}
        onPrimary={() => flow.dispatch({ type: "next" })}
        backLabel="Back"
        onBack={() => flow.dispatch({ type: "back" })}
      />
    </>
  );
}

/* -----------------------------------------------------------------------------
   DIRECTION — edited in the header rather than in a section of its own
   -------------------------------------------------------------------------- */

export function DirectionBody({ flow }: SectionProps) {
  const { state, dispatch } = flow;
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(
    state.answers.directionSource === "prompted"
      ? (PROMPTED_DIRECTIONS.find((p) => p.text === state.answers.direction)?.id ?? null)
      : null
  );
  const [error, setError] = useState<string | undefined>();

  function choose(prompt: PromptedDirection) {
    setValue(prompt.text);
    setSelected(prompt.id);
    setError(undefined);
  }

  function submit() {
    if (!value.trim()) {
      setError("Tell us roughly where you want to go. A few words is enough.");
      return;
    }
    dispatch({
      type: "set-direction",
      direction: value.trim(),
      source: selected ? "prompted" : "free",
    });
    dispatch({ type: "next" });
  }

  return (
    <>
      <DirectionField
        label={DIRECTION.prompt}
        hint={DIRECTION.hint}
        value={value}
        onChange={(next) => {
          setValue(next);
          setSelected(null);
          if (next.trim()) setError(undefined);
        }}
        prompted={PROMPTED_DIRECTIONS}
        promptedLabel={DIRECTION.promptedLabel}
        selectedPromptId={selected}
        onSelectPrompt={choose}
        error={error}
      />
      <StepActions
        primaryLabel="Continue"
        onPrimary={submit}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}

/* -----------------------------------------------------------------------------
   REFINEMENT
   -------------------------------------------------------------------------- */

export function RefinementBody({ flow }: SectionProps) {
  const { state, dispatch, refinementQuestions, withDelay } = flow;
  const question = refinementQuestions[state.refinementIndex];
  const answer = state.answers.refinement[question.id];
  const isLast = state.refinementIndex === refinementQuestions.length - 1;

  return (
    <>
      <p className="canvas__count">
        Question {state.refinementIndex + 1} of {refinementQuestions.length}. All
        optional.
      </p>
      <h3 className="canvas__question">{question.question}</h3>
      <RefinementQuestion
        question={question}
        value={answer}
        onChange={(value) =>
          dispatch({ type: "answer-refinement", id: question.id, value })
        }
      />
      <StepActions
        primaryLabel="Continue"
        primaryDisabled={!answer}
        onPrimary={() => {
          dispatch({ type: "next" });
          if (isLast) withDelay("interpreting", () => {});
        }}
        skipLabel="Skip and show my first step"
        onSkip={() => {
          dispatch({ type: "skip-all-refinement" });
          withDelay("interpreting", () => {});
        }}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}

/* -----------------------------------------------------------------------------
   PLAN — the choice set
   -------------------------------------------------------------------------- */

/**
 * Plan selection as a choice set rather than a recommendation.
 *
 * All five templates are on the page together, every one carrying the same
 * fields so the set can be read across, with the recommendation flagged and
 * carrying its rationale on top of its "best for" line rather than instead of
 * it. Building your own sits in the same list as a sixth option, not as an
 * escape from the five.
 *
 * This is the deliberate difference between this concept and the other two:
 * they recommend and let you overrule, this one asks you to choose and tells
 * you what it would have picked.
 */
export function PlanBody({ flow }: SectionProps) {
  const { state, dispatch, derived } = flow;
  const recommended = derived?.recommended;
  if (!recommended) return null;

  const selectedId = state.answers.planId ?? recommended.id;
  const cards = PLAN_TEMPLATES.map((plan) =>
    plan.id === recommended.id ? recommended : plan
  );

  return (
    <>
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
        {cards.map((plan) => (
          <PlanTemplateCard
            key={plan.id}
            plan={plan}
            recommended={plan.id === recommended.id}
            comparison
            selected={selectedId === plan.id}
            name="plan-c3"
            onSelect={(planId) =>
              dispatch({
                type: "select-plan",
                planId,
                source: planId === recommended.id ? "recommended" : "switched",
              })
            }
          />
        ))}

        <PlanTemplateCard
          plan={CUSTOM_PLAN_OPTION}
          comparison
          selected={selectedId === CUSTOM_PLAN_OPTION.id}
          name="plan-c3"
          onSelect={() => dispatch({ type: "open-custom-plan" })}
        />
      </div>

      <StepActions
        primaryLabel="Use this plan"
        primaryDisabled={selectedId === CUSTOM_PLAN_OPTION.id}
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
      />
    </>
  );
}

export function CustomPlanBody({ flow }: SectionProps) {
  const { state, dispatch, customPlanSteps } = flow;
  const index = state.customPlanIndex ?? 0;
  const spec = customPlanSteps[index];
  const answer = state.answers.customPlan[spec.id];
  const isLast = index === customPlanSteps.length - 1;

  return (
    <>
      <p className="canvas__count">
        {CUSTOM_PLAN_DRAFT_NAME} · question {index + 1} of {customPlanSteps.length}
      </p>
      <h3 className="canvas__question">{spec.question}</h3>
      <p className="canvas__hint">{spec.hint}</p>
      <ToggleGroup
        label={spec.question}
        labelHidden
        orientation="vertical"
        options={spec.options}
        value={answer ?? ""}
        onChange={(value) =>
          dispatch({ type: "answer-custom-plan", id: spec.id, value })
        }
      />
      <StepActions
        primaryLabel={isLast ? "Use this plan" : "Continue"}
        primaryDisabled={!answer}
        onPrimary={() => {
          if (isLast) {
            dispatch({ type: "select-plan", planId: "custom", source: "custom" });
            dispatch({ type: "next" });
            return;
          }
          dispatch({ type: "answer-custom-plan", id: spec.id, value: answer ?? "" });
        }}
        skipLabel="Leave this and keep the draft"
        onSkip={() => dispatch({ type: "exit-custom-plan" })}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}

export function planSummary(flow: OnboardingFlow): string {
  const { state, derived } = flow;
  if (state.answers.planSource === "custom") return CUSTOM_PLAN_DRAFT_NAME;
  return (
    planById(state.answers.planId ?? "")?.name ??
    derived?.recommended.name ??
    "Not chosen yet"
  );
}

/* -----------------------------------------------------------------------------
   PLAN CONFIRMED, ACTION, ARTIFACT, CONNECT
   -------------------------------------------------------------------------- */

export function PlanConfirmedBody({ flow }: SectionProps) {
  return (
    <>
      <Notice tone="info">
        You can change the plan at any time, and changing it will not lose
        anything you have already made.
      </Notice>
      <StepActions
        primaryLabel="Show me the first step"
        onPrimary={() => flow.dispatch({ type: "next" })}
        backLabel="Back"
        onBack={() => flow.dispatch({ type: "back" })}
      />
    </>
  );
}

export function ActionBody({ flow }: SectionProps) {
  const { dispatch, derived, withDelay } = flow;
  if (!derived) return null;
  return (
    <>
      <ActionCard action={derived.action} headingLevel={3} />
      <StepActions
        primaryLabel="Write it now"
        onPrimary={() => {
          dispatch({ type: "next" });
          withDelay("drafting", () => {});
        }}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}

export function ArtifactBody({ flow }: SectionProps) {
  const { state, dispatch, derived } = flow;
  if (!derived) return null;
  return (
    <>
      <ArtifactDraft
        artifact={derived.artifact}
        saved={state.answers.artifactSaved}
        showTitle={false}
      />
      {state.answers.artifactSaved ? (
        <Notice tone="info" live>
          Saved. It is yours — edit it, export it, or leave it as it is.
        </Notice>
      ) : null}
      <StepActions
        primaryLabel={state.answers.artifactSaved ? "Continue" : "Save to my plan"}
        onPrimary={() => {
          if (!state.answers.artifactSaved) {
            dispatch({ type: "save-artifact" });
            return;
          }
          dispatch({ type: "next" });
        }}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}

export function ConnectBody({ flow }: SectionProps) {
  const { state, dispatch } = flow;
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});

  function connect(id: string) {
    const isFirstTry = !attempted[id];
    setAttempted((previous) => ({ ...previous, [id]: true }));
    // Scripted to fail once: a failed connection is a required state and there
    // is no network here to fail on its own.
    const fails = id === "website" && isFirstTry;
    dispatch({ type: "set-connection", id, state: fails ? "failed" : "connected" });
  }

  return (
    <>
      <p className="canvas__hint">
        Neither changes what you already have. You can add them any time, or
        never.
      </p>
      <div className="connect-set">
        {CONNECT_OFFERS.map((offer) => (
          <ConnectOffer
            key={offer.id}
            offer={offer}
            state={state.answers.connections[offer.id] ?? "offered"}
            onConnect={() => connect(offer.id)}
            onRetry={() => connect(offer.id)}
            onDecline={() =>
              dispatch({ type: "set-connection", id: offer.id, state: "declined" })
            }
          />
        ))}
      </div>
      <StepActions
        primaryLabel="Done"
        onPrimary={() => dispatch({ type: "next" })}
        skipLabel="Skip both"
        onSkip={() => {
          CONNECT_OFFERS.forEach((offer) =>
            dispatch({ type: "set-connection", id: offer.id, state: "declined" })
          );
          dispatch({ type: "next" });
        }}
        backLabel="Back"
        onBack={() => dispatch({ type: "back" })}
      />
    </>
  );
}
