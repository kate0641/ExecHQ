"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { NavPlaceholder } from "@/components/layout/NavPlaceholder";
import { Button } from "@/components/primitives/Button";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { ThreadTurn } from "@/components/onboarding/ThreadTurn";
import {
  ONBOARDING_STEPS,
  stepIndex,
  useOnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { DIRECTION, GENERATING_COPY, PRIVACY } from "@/mock/onboarding";
import {
  AccountAsk,
  ActionAsk,
  ArtifactAsk,
  ConnectAsk,
  CompleteTurn,
  CustomPlanAsk,
  DirectionAsk,
  InterpretationTurn,
  PlanAsk,
  PlanConfirmedAsk,
  PrivacyAsk,
  RefinementAsk,
  accountRecord,
  planRecord,
  refinementRecord,
  type TurnContext,
} from "./turns";

/**
 * Concept 2 — the intake as a conversation with an advisor.
 *
 * Same flow, same fixed behaviour, same shared state machine as Concept 1. What
 * changes is that nothing is replaced when it is answered: every question and
 * every answer stays on screen, so the thread ends up being the record of how
 * the plan was arrived at.
 *
 * It is not a chatbot, and the difference is structural rather than cosmetic.
 * There is no open input: every turn asks one specific thing and supplies the
 * ways to answer it, so the user is never left deciding what to type. What the
 * conversational form buys is ordering — the plan turn can state its reasoning
 * before it names the plan, the way a person would.
 *
 * Accessibility, for this pattern specifically:
 *  - New turns are announced through a short, visually-hidden status line
 *    naming what has arrived, rather than by putting the whole thread in a live
 *    region — a plan card read out in full on arrival is not an announcement,
 *    it is an ambush.
 *  - Focus moves to the new input, never to the top of the new content, and
 *    only after the user's own action has produced it.
 *  - The input group is labelled by the heading that asked for it, so arriving
 *    there by keyboard tells you what is being asked without relying on having
 *    heard the announcement.
 *  - Scrolling the newest turn into view is a convenience. Everything is
 *    reachable and operable by keyboard with no scrolling at all.
 */
export function OnboardingConcept2() {
  const flow = useOnboardingFlow({
    conceptId: "concept-2",
    followInterpretation: true,
  });
  const { state, dispatch, derived, generating, pendingResume, refinementQuestions } = flow;

  const headingIdBase = useId();
  const activeHeadingId = `${headingIdBase}-active`;
  const askRef = useRef<HTMLFieldSetElement | null>(null);
  // `generating` belongs in this key. A step that shows the thinking state first
  // mounts its real input only when that clears, and the step itself has not
  // changed by then — so without it the input the user is sent to never gets
  // focus, and focus sits on the body instead.
  const turnKey = [
    state.step,
    state.refinementIndex,
    state.customPlanIndex,
    generating ?? "idle",
  ].join("-");
  const previousKey = useRef(turnKey);

  const setAskNode = useCallback((node: HTMLFieldSetElement | null) => {
    askRef.current = node;
  }, []);

  // Focus the input the new turn is asking for, and bring it into view. Both
  // run only on a real turn change, never on first paint: arriving at a page
  // with focus already moved and the view already scrolled is disorienting.
  useEffect(() => {
    if (previousKey.current === turnKey) return;
    previousKey.current = turnKey;

    const ask = askRef.current;
    // The outgoing turn's cleanup can leave a detached node here.
    if (!ask || !ask.isConnected) return;

    const target = ask.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])'
    );
    target?.focus();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ask.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [turnKey]);

  if (pendingResume) {
    return (
      <div className="thread">
        <Notice tone="info" title="You were part way through">
          We kept the conversation. You can pick it up where it stopped, or start
          again from the beginning.
          <div className="thread__resume-actions">
            <Button variant="primary" onClick={flow.acceptResume}>
              Pick up where I stopped
            </Button>
            <Button variant="secondary" onClick={flow.declineResume}>
              Start again
            </Button>
          </div>
        </Notice>
      </div>
    );
  }

  const context: TurnContext = {
    flow,
    registerAsk: setAskNode,
    activeHeadingId,
  };

  const current = state.step;
  const currentIndex = stepIndex(current);

  /** The furthest the conversation has got, which is not the same as where the
   *  user is standing. Going back to change an answer must not delete the record
   *  of everything said after it — the thread is the record, and a record that
   *  disappears when you correct a typo is not one. */
  const furthestIndex = state.visited.reduce(
    (furthest, step) => Math.max(furthest, stepIndex(step)),
    currentIndex
  );

  const isNow = (step: OnboardingStep) => step === current;
  /** Answered, ever — not "before where I am standing". These two are the same
   *  thing until the user goes back to change something, and the difference is
   *  the whole reason the record survives that. */
  const isDone = (step: OnboardingStep) => stepIndex(step) < furthestIndex;
  /** Styling: every turn except the live one is part of the record. */
  const isPast = (step: OnboardingStep) => !isNow(step);
  const inCustomPlan = state.customPlanIndex !== null;

  /** A turn is shown once the conversation has reached its step, ever. */
  const reached = (step: OnboardingStep) => stepIndex(step) <= furthestIndex;

  /** Set when the user has gone back to change something, so they can return to
   *  where they were instead of walking the whole thread again. */
  const revisiting = currentIndex < furthestIndex;
  const returnStep = ONBOARDING_STEPS[furthestIndex];

  const backToWhereIWas = revisiting ? (
    <div className="thread__revisit">
      <Notice tone="info" live>
        You are changing an earlier answer. Everything after it is still here.
        <div className="thread__revisit-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: "go-to", step: returnStep })}
          >
            Back to where I was
          </Button>
        </div>
      </Notice>
    </div>
  ) : null;

  const turns: { key: string; node: ReactNode }[] = [];

  function advisor(
    key: string,
    heading: string,
    options: {
      description?: string;
      children?: ReactNode;
      past?: boolean;
      active?: boolean;
    } = {}
  ) {
    turns.push({
      key,
      node: (
        <ThreadTurn
          speaker="advisor"
          heading={heading}
          headingLevel={2}
          headingId={options.active ? activeHeadingId : undefined}
          description={options.description}
          past={options.past}
        >
          {options.children}
        </ThreadTurn>
      ),
    });
  }

  /** A turn recording what the user said. `step` makes it correctable: with the
   *  back button gone, editing the record is how a mistake gets fixed. */
  function said(key: string, children: ReactNode, step?: OnboardingStep) {
    turns.push({
      key,
      node: (
        <ThreadTurn
          speaker="you"
          onEdit={step ? () => dispatch({ type: "go-to", step }) : undefined}
        >
          {children}
        </ThreadTurn>
      ),
    });
  }

  /* --- Account --- */
  advisor("account", "Let us start with an account", {
    description: "A personal email is all we need. Nothing else is required.",
    past: isPast("account"),
    active: isNow("account"),
    children: isNow("account") ? <AccountAsk context={context} /> : undefined,
  });
  if (isDone("account")) said("account-said", accountRecord(state), "account");

  /* --- Privacy --- */
  if (reached("privacy")) {
    advisor("privacy", PRIVACY.heading, {
      past: isPast("privacy"),
      active: isNow("privacy"),
      children: isNow("privacy") ? <PrivacyAsk context={context} /> : undefined,
    });
    if (isDone("privacy")) said("privacy-said", PRIVACY.action);
  }

  /* --- Direction --- */
  if (reached("direction")) {
    advisor("direction", DIRECTION.prompt, {
      past: isPast("direction"),
      active: isNow("direction"),
      children: isNow("direction") ? <DirectionAsk context={context} /> : undefined,
    });
    if (isDone("direction") && state.answers.direction) {
      said("direction-said", state.answers.direction, "direction");
    }
  }

  /* --- Refinement --- */
  if (reached("refinement")) {
    // Only the questions the user actually reached. refinementIndex is where
    // they got to in every case — mid-step, skipped out, or answered them all —
    // so a question they never saw never appears as a turn the advisor asked.
    refinementQuestions.forEach((question, index) => {
      if (index > state.refinementIndex) return;
      const activeHere = isNow("refinement") && index === state.refinementIndex;
      const answered = Boolean(state.answers.refinement[question.id]);

      advisor(`refinement-${question.id}`, question.question, {
        description: question.hint,
        past: !activeHere,
        active: activeHere,
        children: activeHere ? <RefinementAsk context={context} /> : undefined,
      });

      // An unanswered question gets no record of its own: the single "skipped"
      // line below covers it. Recording each one separately would make a
      // decision taken once read as a string of small refusals.
      if (answered) {
        said(
          `refinement-${question.id}-said`,
          refinementRecord(state, question.id, question.options),
          "refinement"
        );
      }
    });

    if (isDone("refinement") && state.skipped.includes("refinement")) {
      said(
        "refinement-skipped",
        Object.keys(state.answers.refinement).length > 0
          ? "Skipped the rest"
          : "Skipped these"
      );
    }
  }

  /* --- Interpretation --- */
  if (reached("interpretation")) {
    if (generating === "interpreting") {
      turns.push({
        key: "interpreting",
        node: (
          <ThreadTurn speaker="advisor">
            <GeneratingState label={GENERATING_COPY.interpreting} />
          </ThreadTurn>
        ),
      });
    } else {
      advisor("interpretation", "Here is what we understood", {
        description:
          "If this is not quite right, change it. Everything after it is built on it.",
        past: isPast("interpretation"),
        active: isNow("interpretation"),
        children: (
          <InterpretationTurn context={context} active={isNow("interpretation")} />
        ),
      });
    }
  }

  /* --- Plan --- */
  if (reached("plan")) {
    if (generating === "planning") {
      turns.push({
        key: "planning",
        node: (
          <ThreadTurn speaker="advisor">
            <GeneratingState label={GENERATING_COPY.planning} />
          </ThreadTurn>
        ),
      });
    } else if (inCustomPlan) {
      const spec = flow.customPlanSteps[state.customPlanIndex ?? 0];
      advisor(`custom-${spec.id}`, spec.question, {
        description: spec.hint,
        active: true,
        children: <CustomPlanAsk context={context} />,
      });
    } else {
      // Stage by stage: the reasoning, then the name, then one turn per stage.
      // A page has to show a plan all at once; a conversation can hand it over
      // in the order a person would say it, and scrolling back gives the
      // reasoning in the order it was given.
      advisor("plan-why", "Here is where I would start", {
        description: derived?.recommended.rationale,
        past: true,
      });

      advisor("plan-name", derived?.recommended.name ?? "A plan", {
        past: true,
      });

      (derived?.recommended.stages ?? []).forEach((stage, index) => {
        const last = index === (derived?.recommended.stages?.length ?? 0) - 1;
        turns.push({
          key: `plan-stage-${stage.title}`,
          node: (
            <ThreadTurn speaker="advisor" past={!last || isDone("plan")}>
              <div className="plan-stage-turn">
                <p className="plan-stage__window">{stage.window}</p>
                <p className="plan-stage-turn__title">{stage.title}</p>
                <ul className="plan-stage__outcomes">
                  {stage.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </ThreadTurn>
          ),
        });
      });

      if (isNow("plan")) {
        turns.push({
          key: "plan-choose",
          node: (
            <ThreadTurn
              speaker="advisor"
              heading="Does that sound like your plan?"
              headingLevel={2}
              headingId={activeHeadingId}
            >
              <PlanAsk context={context} />
            </ThreadTurn>
          ),
        });
      }

      if (isDone("plan")) {
        said("plan-said", planRecord(state, derived?.recommended.name ?? "A plan"), "plan");
      }
    }
  }

  /* --- Plan confirmed --- */
  if (reached("plan-confirmed") && !inCustomPlan) {
    advisor("plan-confirmed", planRecord(state, derived?.recommended.name ?? "Your plan"), {
      description: "That is your plan. Now the first thing worth doing.",
      past: isPast("plan-confirmed"),
      active: isNow("plan-confirmed"),
      children: isNow("plan-confirmed") ? (
        <PlanConfirmedAsk context={context} />
      ) : undefined,
    });
  }

  /* --- Action --- */
  if (reached("action") && !inCustomPlan) {
    advisor("action", "Start here", {
      past: isPast("action"),
      active: isNow("action"),
      children: isNow("action") ? <ActionAsk context={context} /> : undefined,
    });
  }

  /* --- Artifact --- */
  if (reached("artifact") && !inCustomPlan) {
    if (generating === "drafting") {
      turns.push({
        key: "drafting",
        node: (
          <ThreadTurn speaker="advisor">
            <GeneratingState label={GENERATING_COPY.drafting} />
          </ThreadTurn>
        ),
      });
    } else {
      advisor("artifact", derived?.artifact.title ?? "Your first draft", {
        description: derived?.artifact.note,
        past: isPast("artifact"),
        active: isNow("artifact"),
        children: isNow("artifact") ? <ArtifactAsk context={context} /> : undefined,
      });
    }
  }

  /* --- Connect --- */
  if (reached("connect") && !inCustomPlan) {
    advisor("connect", "Two things that would sharpen later drafts", {
      description:
        "Neither changes what you already have. You can add them any time, or never.",
      past: isPast("connect"),
      active: isNow("connect"),
      children: isNow("connect") ? <ConnectAsk context={context} /> : undefined,
    });
  }

  /* --- Complete --- */
  if (reached("complete")) {
    advisor("complete", "You have a plan and a first draft", {
      description: "Both are yours. Nothing here is visible to anyone else.",
      active: true,
      children: <CompleteTurn context={context} />,
    });
  }

  // Named for the announcement rather than read from the DOM, so what a screen
  // reader is told is a decision rather than a side effect of the markup.
  const announcement = announcementFor(state.step, generating);

  const showNav = stepIndex(current) >= stepIndex("artifact");

  return (
    <div className="thread">
      {showNav ? <NavPlaceholder /> : null}

      {/* The page's heading. Visually hidden because the design deliberately
          has no title above the conversation — but every turn is an h2, and a
          page whose outline starts at h2 has a hole in it. This names the thing
          the turns belong to without putting chrome on the screen. */}
      <h1 className="u-visually-hidden">Onboarding</h1>

      {backToWhereIWas}

      <ol className="thread__list">
        {turns.map((turn) => (
          <li className="thread__item" key={turn.key}>
            {turn.node}
          </li>
        ))}
      </ol>

      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

function announcementFor(
  step: OnboardingStep,
  generating: string | null
): string {
  if (generating) return "Working on it.";
  switch (step) {
    case "account":
      return "";
    case "privacy":
      return "New: how this account stays private.";
    case "direction":
      return "New question: what would you like to move toward?";
    case "interpretation":
      return "New: what we understood from your answer.";
    case "refinement":
      return "New question. It is optional.";
    case "plan":
      return "New: a recommended plan, with the reason for it.";
    case "plan-confirmed":
      return "Your plan is set.";
    case "action":
      return "New: your first step.";
    case "artifact":
      return "New: your first draft.";
    case "connect":
      return "New: two optional connections.";
    case "complete":
      return "Onboarding complete.";
    default:
      return "";
  }
}

export default OnboardingConcept2;
