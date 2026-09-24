"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Input } from "@/components/form/Input";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Button } from "@/components/primitives/Button";
import { ActionCard } from "@/components/onboarding/ActionCard";
import { ArtifactDraft } from "@/components/onboarding/ArtifactDraft";
import { AssumptionNotice } from "@/components/onboarding/AssumptionNotice";
import { ConnectOffer } from "@/components/onboarding/ConnectOffer";
import { DirectionDeck } from "@/components/onboarding/DirectionDeck";
import { InterpretedDirection } from "@/components/onboarding/InterpretedDirection";
import { Notice } from "@/components/onboarding/Notice";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { PrivacyPromise } from "@/components/onboarding/PrivacyPromise";
import { RefinementQuestion } from "@/components/onboarding/RefinementQuestion";
import { StepActions } from "@/components/onboarding/StepActions";
import { ThreadTurn } from "@/components/onboarding/ThreadTurn";
import {
  hasSkippedRefinement,
  type OnboardingFlow,
  type OnboardingState,
} from "@/flows/onboarding/shared";
import {
  CONNECT_OFFERS,
  CUSTOM_PLAN_DRAFT_NAME,
  DIRECTION,
  PLAN_TEMPLATES,
  PRIVACY,
  PROMPTED_DIRECTIONS,
  checkEmail,
  isValidInviteCode,
  planById,
  type PromptedDirection,
} from "@/mock/onboarding";

/**
 * The turns of the conversational intake.
 *
 * Every turn is derived from the shared flow state rather than pushed onto a
 * list of its own. That is what makes the thread a record rather than a log:
 * going back does not leave orphaned turns behind, and there is no second
 * source of truth to drift from the state machine.
 *
 * Each step contributes an advisor turn, and — once it has been answered — a
 * turn recording what the user said. The step the flow is currently on also
 * renders its input, inline, as part of the advisor's turn.
 */

export interface TurnContext {
  flow: OnboardingFlow;
  /** Hands the shell the element it moves focus into once a turn is answered.
   *  Deliberately not named as a ref: it is a plain callback, and the shell —
   *  not this component — decides what to do with the node. */
  registerAsk: (node: HTMLFieldSetElement | null) => void;
  /** Id of the heading that asked for this input, so the input group is named
   *  by the question rather than repeating it. */
  activeHeadingId: string;
}

/** Wraps an active turn's controls and carries the focus target. */
function Ask({
  context,
  children,
}: {
  context: TurnContext;
  children: ReactNode;
}) {
  const { registerAsk, activeHeadingId } = context;

  // A fieldset rather than a div with role="group": these really are a set of
  // controls answering one question, and it is named by the heading that asked
  // it, so arriving here by keyboard tells you what is being asked without
  // having to have heard the announcement.
  return (
    <fieldset className="turn__ask" ref={registerAsk} aria-labelledby={activeHeadingId}>
      {children}
    </fieldset>
  );
}

/* -----------------------------------------------------------------------------
   ACCOUNT
   -------------------------------------------------------------------------- */

export function AccountAsk({ context }: { context: TurnContext }) {
  const { state, dispatch } = context.flow;
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [codeError, setCodeError] = useState(false);
  const [verdict, setVerdict] = useState<ReturnType<typeof checkEmail> | null>(null);

  function submit() {
    const codeOk = !code.trim() || isValidInviteCode(code);
    const emailVerdict = checkEmail(email);
    setCodeError(!codeOk);
    setVerdict(emailVerdict === "ok" ? null : emailVerdict);
    if (!codeOk || emailVerdict !== "ok") return;
    dispatch({ type: "set-invite-code", code: code.trim() || null });
    dispatch({ type: "set-email", email: email.trim() });
    dispatch({ type: "next" });
  }

  return (
    <Ask context={context}>
      <Input
        label="Email"
        type="email"
        required
        hint="Use whichever address suits you. You can change it whenever you like, and the account stays yours either way."
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

      <Input
        label="Invite code"
        hint="From an invitation, if you were sent one."
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />

      {codeError ? (
        <Notice tone="explain" title="We do not recognise that code" live>
          Check it against the invitation you were sent. You can also continue
          without one — a code only changes who pays, never what you get.
        </Notice>
      ) : null}

      <StepActions primaryLabel="Next" onPrimary={submit} />
    </Ask>
  );
}

/** What the account turn leaves in the record. The invite code is deliberately
 *  not echoed: it is never shown again after entry, and naming the code would
 *  also hint at who issued it. */
export function accountRecord(state: OnboardingState): string {
  const email = state.answers.email ?? "";
  return state.answers.inviteCode ? `${email} · joined with an invite code` : email;
}

/* -----------------------------------------------------------------------------
   PRIVACY
   -------------------------------------------------------------------------- */

export function PrivacyAsk({ context }: { context: TurnContext }) {
  return (
    <Ask context={context}>
      <PrivacyPromise statements={PRIVACY.statements} />
      <StepActions
        primaryLabel="Next"
        onPrimary={() => context.flow.dispatch({ type: "next" })}
      />
    </Ask>
  );
}

/* -----------------------------------------------------------------------------
   DIRECTION
   -------------------------------------------------------------------------- */

export function DirectionAsk({ context }: { context: TurnContext }) {
  const { state, dispatch } = context.flow;
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(() => {
    if (state.answers.directionSource === "free" && state.answers.direction) return "own";
    return (
      PROMPTED_DIRECTIONS.find((p) => p.text === state.answers.direction)?.id ?? null
    );
  });
  const [error, setError] = useState<string | undefined>();

  function choose(prompt: PromptedDirection) {
    setValue(prompt.text);
    setSelected(prompt.id);
    setError(undefined);
  }

  function submit() {
    if (!value.trim()) {
      setError(
        selected === "own" ? "A few words is enough." : "Choose one, or write your own."
      );
      return;
    }
    dispatch({
      type: "set-direction",
      direction: value.trim(),
      source: selected === "own" ? "free" : "prompted",
    });
    dispatch({ type: "next" });
  }

  return (
    <Ask context={context}>
      <DirectionDeck
        directions={PROMPTED_DIRECTIONS}
        selectedId={selected}
        onSelect={choose}
        onWriteOwn={() => {
          setSelected("own");
          setValue("");
          setError(undefined);
        }}
        value={value}
        onChange={(next) => {
          setValue(next);
          if (next.trim()) setError(undefined);
        }}
        label={DIRECTION.prompt}
        hint={DIRECTION.hint}
        error={error}
      />
      <StepActions primaryLabel="Next" onPrimary={submit} primaryDisabled={!selected} />
    </Ask>
  );
}

/* -----------------------------------------------------------------------------
   INTERPRETATION
   -------------------------------------------------------------------------- */

/**
 * The interpreted direction. Editable wherever it sits in the thread, not only
 * while it is the newest turn — the point of a record you can scroll back
 * through is that you can correct it. Editing feeds the artifact, so a draft
 * never quotes a sentence the user has replaced.
 */
export function InterpretationTurn({
  context,
  active,
}: {
  context: TurnContext;
  active: boolean;
}) {
  const { state, dispatch, derived, withDelay } = context.flow;
  const sentence = state.answers.interpretation ?? derived?.interpretation ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(sentence);

  const body = (
    <>
      <InterpretedDirection
        sentence={editing ? draft : sentence}
        editing={editing}
        onEdit={() => {
          setDraft(sentence);
          setEditing(true);
        }}
        onChange={setDraft}
        onSave={() => {
          dispatch({ type: "edit-interpretation", interpretation: draft });
          setEditing(false);
        }}
        onCancel={() => {
          setDraft(sentence);
          setEditing(false);
        }}
      />
      {active ? (
        <StepActions
          primaryLabel="Next"
          onPrimary={() => {
            dispatch({ type: "next" });
            withDelay("planning", () => {});
          }}
          primaryDisabled={editing}
        />
      ) : null}
    </>
  );

  return active ? <Ask context={context}>{body}</Ask> : <>{body}</>;
}

/* -----------------------------------------------------------------------------
   REFINEMENT
   -------------------------------------------------------------------------- */

export function RefinementAsk({ context }: { context: TurnContext }) {
  const { state, dispatch, refinementQuestions, withDelay } = context.flow;
  const question = refinementQuestions[state.refinementIndex];
  const answer = state.answers.refinement[question.id];
  const isLast = state.refinementIndex === refinementQuestions.length - 1;

  return (
    <Ask context={context}>
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
      />
    </Ask>
  );
}

export function refinementRecord(
  state: OnboardingState,
  questionId: string,
  options: { value: string; label: string }[]
): string {
  const value = state.answers.refinement[questionId];
  if (!value) return "Skipped";
  return options.find((option) => option.value === value)?.label ?? value;
}

/* -----------------------------------------------------------------------------
   PLAN
   -------------------------------------------------------------------------- */

/**
 * Plan selection, recommended-first.
 *
 * The turn states its reasoning before it names the plan, which is the one
 * thing the conversational form is genuinely better at than a page: the user
 * reads why, then what, in the order a person would say it.
 */
export function PlanAsk({ context }: { context: TurnContext }) {
  const { state, dispatch, derived } = context.flow;
  const [showOthers, setShowOthers] = useState(false);
  const recommended = derived?.recommended;
  if (!recommended) return null;

  const selectedId = state.answers.planId ?? recommended.id;
  const others = PLAN_TEMPLATES.filter((plan) => plan.id !== recommended.id);

  return (
    <Ask context={context}>
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

      {/* No card for the recommendation here: the turns above have just delivered
          it stage by stage, and repeating it as a card would be the same plan
          told twice in the space of one screen. The alternatives still appear as
          cards, because those have not been described. */}
      {showOthers ? (
        <div className="plan-set" role="radiogroup" aria-label="Other plans">
          {others.map((plan) => (
            <PlanTemplateCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              name="plan-c2"
              onSelect={(planId) =>
                dispatch({ type: "select-plan", planId, source: "switched" })
              }
            />
          ))}
        </div>
      ) : null}

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

      <StepActions
        primaryLabel="Use this plan"
        onPrimary={() => {
          dispatch({
            type: "select-plan",
            planId: selectedId,
            source: selectedId === recommended.id ? "recommended" : "switched",
          });
          dispatch({ type: "next" });
        }}
      />
    </Ask>
  );
}

/**
 * The custom-plan wizard, as turns rather than a separate surface.
 *
 * In a thread there is nowhere to route to, which turns out to suit it: the
 * questions simply continue the conversation, and leaving means the thread
 * carries on from where it was with the answers kept.
 */
export function CustomPlanAsk({ context }: { context: TurnContext }) {
  const { state, dispatch, customPlanSteps } = context.flow;
  const index = state.customPlanIndex ?? 0;
  const spec = customPlanSteps[index];
  const answer = state.answers.customPlan[spec.id];
  const isLast = index === customPlanSteps.length - 1;

  return (
    <Ask context={context}>
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
      />
    </Ask>
  );
}

export function planRecord(state: OnboardingState, fallbackName: string): string {
  if (state.answers.planSource === "custom") return CUSTOM_PLAN_DRAFT_NAME;
  return planById(state.answers.planId ?? "")?.name ?? fallbackName;
}

/* -----------------------------------------------------------------------------
   PLAN CONFIRMED, ACTION, ARTIFACT, CONNECT
   -------------------------------------------------------------------------- */

export function PlanConfirmedAsk({ context }: { context: TurnContext }) {
  const { dispatch } = context.flow;
  return (
    <Ask context={context}>
      <Notice tone="info">
        You can change the plan at any time, and changing it will not lose
        anything you have already made.
      </Notice>
      <StepActions
        primaryLabel="Show me the first step"
        onPrimary={() => dispatch({ type: "next" })}
      />
    </Ask>
  );
}

export function ActionAsk({ context }: { context: TurnContext }) {
  const { dispatch, derived, withDelay } = context.flow;
  if (!derived) return null;
  return (
    <Ask context={context}>
      <ActionCard action={derived.action} headingLevel={3} />
      <StepActions
        primaryLabel="Write it now"
        onPrimary={() => {
          dispatch({ type: "next" });
          withDelay("drafting", () => {});
        }}
      />
    </Ask>
  );
}

export function ArtifactAsk({ context }: { context: TurnContext }) {
  const { state, dispatch, derived } = context.flow;
  if (!derived) return null;
  return (
    <Ask context={context}>
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
      />
    </Ask>
  );
}

export function ConnectAsk({ context }: { context: TurnContext }) {
  const { state, dispatch } = context.flow;
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});

  function connect(id: string) {
    const isFirstTry = !attempted[id];
    setAttempted((previous) => ({ ...previous, [id]: true }));
    // The website connection fails once on purpose: a failed connection is a
    // required state and there is no network here to fail on its own.
    const fails = id === "website" && isFirstTry;
    dispatch({ type: "set-connection", id, state: fails ? "failed" : "connected" });
  }

  return (
    <Ask context={context}>
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
      {/* Adding and skipping both end onboarding and hand over to the app, so
          they go to the same place. Skipping is not a lesser exit. */}
      <div className="thread__handover">
        <Link className="btn btn--primary btn--md btn--full" href="/homepage/concept-1">
          Save and go to my homepage
        </Link>
        <Link
          className="btn btn--secondary btn--md btn--full"
          href="/homepage/concept-1"
          onClick={() =>
            CONNECT_OFFERS.forEach((offer) =>
              dispatch({ type: "set-connection", id: offer.id, state: "declined" })
            )
          }
        >
          Go to my homepage
        </Link>
      </div>
    </Ask>
  );
}

export function CompleteTurn({ context }: { context: TurnContext }) {
  return (
    <Ask context={context}>
      <Notice tone="info">
        This is where onboarding hands over to the signed-in app. That surface is
        Sprint 2, which is why the navigation above is a placeholder.
      </Notice>
      <div className="turn__inline-action">
        <Button variant="secondary" onClick={context.flow.restart}>
          Walk the flow again
        </Button>
      </div>
    </Ask>
  );
}

export { ThreadTurn };
