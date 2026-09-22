"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { NavPlaceholder } from "@/components/layout/NavPlaceholder";
import { Button } from "@/components/primitives/Button";
import { CanvasHeader } from "@/components/onboarding/CanvasHeader";
import { CanvasSection } from "@/components/onboarding/CanvasSection";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { InterpretedDirection } from "@/components/onboarding/InterpretedDirection";
import { Notice } from "@/components/onboarding/Notice";
import {
  stepIndex,
  useOnboardingFlow,
  type OnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { GENERATING_COPY, REFINEMENT_QUESTIONS } from "@/mock/onboarding";
import {
  AccountBody,
  ActionBody,
  ArtifactBody,
  ConnectBody,
  CustomPlanBody,
  DirectionBody,
  PlanBody,
  PlanConfirmedBody,
  PrivacyBody,
  RefinementBody,
  planSummary,
} from "./sections";

/**
 * Concept 3 — the living canvas.
 *
 * One surface that fills itself in. Every section is on the page from the first
 * paint as a single muted line, so the user can see the shape of what they are
 * building rather than discovering it a screen at a time; exactly one section is
 * open; answered sections collapse into their answer and can be reopened
 * without losing your place.
 *
 * Built at 390px first, which is the width this pattern is hardest at and the
 * one the product actually lives at. Everything here works in a single column
 * with no horizontal scrolling and no section hidden behind a gesture.
 *
 * The plan step is deliberately different from the other two concepts. Concepts
 * 1 and 2 recommend and let you overrule; this one puts all five templates plus
 * building your own on the page together and asks you to choose, with the
 * recommendation flagged and its reasoning attached. That difference is the
 * thing the three concepts exist to test, so it is not softened here.
 */
type SectionKey =
  | "account"
  | "privacy"
  | "direction"
  | "refinement"
  | "plan"
  | "action"
  | "artifact"
  | "connect";

/** Which step each section owns. A section can own more than one — the plan
 *  section covers choosing and confirming, which are one decision to the user
 *  even though the flow tracks them separately. */
const SECTION_STEPS: Record<SectionKey, OnboardingStep[]> = {
  account: ["account"],
  privacy: ["privacy"],
  direction: ["direction", "interpretation"],
  refinement: ["refinement"],
  plan: ["plan", "plan-confirmed"],
  action: ["action"],
  artifact: ["artifact"],
  connect: ["connect"],
};

const SECTION_ORDER: SectionKey[] = [
  "account",
  "privacy",
  "direction",
  "refinement",
  "plan",
  "action",
  "artifact",
  "connect",
];

const SECTION_LABELS: Record<SectionKey, string> = {
  account: "Your account",
  privacy: "Privacy",
  direction: "What you are working toward",
  refinement: "A few optional questions",
  plan: "Your plan",
  action: "Your first step",
  artifact: "Your first draft",
  connect: "Optional connections",
};

const SECTION_HINTS: Record<SectionKey, string> = {
  account: "A personal email. Nothing else is required.",
  privacy: "What we will and will not do with this.",
  direction: "Where you want to get to.",
  refinement: "Up to three. Every one of them skippable.",
  plan: "Five starting points, and the option to build your own.",
  action: "The one thing worth doing first.",
  artifact: "Something you can actually use.",
  connect: "Two things that would sharpen later drafts.",
};

export function OnboardingConcept3() {
  const flow = useOnboardingFlow({
    conceptId: "concept-3",
    followInterpretation: true,
  });
  const { state, dispatch, derived, generating, pendingResume } = flow;

  // Where the user was before they went back to change something. The canvas
  // promises you can revisit an earlier answer without losing your place, and
  // the flow on its own cannot keep that promise: sending the step back to
  // "account" means walking forward through everything after it again. So the
  // canvas remembers, and offers the way back.
  const [returnTo, setReturnTo] = useState<OnboardingStep | null>(null);

  const idBase = useId();
  const activeHeadingId = `${idBase}-active`;
  const focusKey = [
    state.step,
    state.refinementIndex,
    state.customPlanIndex,
    generating ?? "idle",
  ].join("-");
  const previousKey = useRef(focusKey);

  // Focus moves to the section that has just opened — its heading, not its
  // first control, so what is announced is which part of the page is now live
  // rather than a stray field name. The heading is focusable but not tabbable,
  // so it never appears in the tab order afterwards.
  useEffect(() => {
    if (previousKey.current === focusKey) return;
    previousKey.current = focusKey;
    const heading = document.getElementById(activeHeadingId);
    if (!heading) return;
    heading.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heading.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  }, [focusKey, activeHeadingId]);

  if (pendingResume) {
    return (
      <div className="canvas">
        <Notice tone="info" title="You were part way through">
          We kept the page as you left it. You can pick it up, or start again
          from the beginning.
          <div className="canvas__resume-actions">
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

  const current = state.step;
  const currentIndex = stepIndex(current);
  const inCustomPlan = state.customPlanIndex !== null;

  function sectionState(key: SectionKey) {
    const steps = SECTION_STEPS[key];
    if (steps.includes(current)) return "active" as const;
    const last = steps[steps.length - 1];
    return stepIndex(last) < currentIndex ? ("complete" as const) : ("pending" as const);
  }

  /* --- The header: the direction, and what we have gathered since --- */

  const interpretationReady =
    stepIndex("interpretation") <= currentIndex && generating !== "interpreting";
  const sentence = interpretationReady
    ? (state.answers.interpretation ?? derived?.interpretation ?? null)
    : null;

  // Refinement answers surface in the header as they are given, so the page's
  // subject keeps up with the page rather than freezing at the first answer.
  const meta = REFINEMENT_QUESTIONS.map((question) => {
    const value = state.answers.refinement[question.id];
    if (!value) return null;
    return question.options.find((option) => option.value === value)?.label ?? null;
  }).filter((label): label is string => Boolean(label));

  const headerEditing = current === "direction" || current === "interpretation";

  const header = (
    <CanvasHeader
      label="What you are working toward"
      sentence={sentence}
      placeholder="We will fill this in as soon as you tell us."
      meta={meta}
      onEdit={() => dispatch({ type: "go-to", step: "direction" })}
    >
      {headerEditing ? (
        <div className="canvas-header__active">
          <h1
            className="canvas-header__sentence is-placeholder"
            id={activeHeadingId}
            tabIndex={-1}
          >
            {current === "direction"
              ? "Where do you want to get to?"
              : "Here is what we understood"}
          </h1>

          {generating === "interpreting" ? (
            <GeneratingState label={GENERATING_COPY.interpreting} />
          ) : current === "direction" ? (
            <DirectionBody flow={flow} />
          ) : (
            <InterpretationBody flow={flow} />
          )}
        </div>
      ) : undefined}
    </CanvasHeader>
  );

  /* --- The sections --- */

  function bodyFor(key: SectionKey): ReactNode {
    if (key === "refinement") return <RefinementBody flow={flow} />;
    if (key === "plan") {
      if (generating === "planning") {
        return <GeneratingState label={GENERATING_COPY.planning} />;
      }
      if (inCustomPlan) return <CustomPlanBody flow={flow} />;
      return current === "plan-confirmed" ? (
        <PlanConfirmedBody flow={flow} />
      ) : (
        <PlanBody flow={flow} />
      );
    }
    if (key === "action") return <ActionBody flow={flow} />;
    if (key === "artifact") {
      return generating === "drafting" ? (
        <GeneratingState label={GENERATING_COPY.drafting} />
      ) : (
        <ArtifactBody flow={flow} />
      );
    }
    if (key === "connect") return <ConnectBody flow={flow} />;
    if (key === "account") return <AccountBody flow={flow} />;
    if (key === "privacy") return <PrivacyBody flow={flow} />;
    return null;
  }

  function summaryFor(key: SectionKey): ReactNode {
    switch (key) {
      case "account":
        return state.answers.inviteCode
          ? `${state.answers.email} · joined with an invite code`
          : state.answers.email;
      case "privacy":
        return "Understood";
      case "refinement": {
        const answered = meta.length ? meta.join(" · ") : null;
        if (state.skipped.includes("refinement")) {
          return answered ? `${answered} · skipped the rest` : "Skipped";
        }
        return answered ?? "Skipped";
      }
      case "plan":
        return planSummary(flow);
      case "action":
        return derived?.action.title ?? "Chosen";
      case "artifact":
        return state.answers.artifactSaved ? "Saved to your plan" : "Started";
      case "connect": {
        const added = Object.entries(state.answers.connections)
          .filter(([, value]) => value === "connected")
          .map(([id]) => (id === "linkedin" ? "LinkedIn metrics" : "Personal website"));
        return added.length ? added.join(" · ") : "None added";
      }
      default:
        return null;
    }
  }

  /** Sections you can meaningfully reopen. Privacy is not one: there is nothing
   *  in it to change. */
  function editFor(key: SectionKey): (() => void) | undefined {
    const step = SECTION_STEPS[key][0];
    if (key === "privacy") return undefined;
    return () => {
      setReturnTo(current);
      dispatch({ type: "go-to", step });
    };
  }

  const revisiting =
    returnTo !== null && currentIndex < stepIndex(returnTo) ? returnTo : null;

  const showNav = currentIndex >= stepIndex("artifact");
  const announcement =
    current === "complete"
      ? "Onboarding complete."
      : `Now: ${SECTION_LABELS[activeKey(current)]}.`;

  return (
    <div className="canvas">
      {showNav ? <NavPlaceholder /> : null}

      {header}

      <div className="canvas__sections">
        {SECTION_ORDER.map((key) => {
          if (key === "direction") return null;
          const sectionStatus = sectionState(key);
          const isActive = sectionStatus === "active";
          return (
            <CanvasSection
              key={key}
              label={SECTION_LABELS[key]}
              state={sectionStatus}
              headingId={isActive ? activeHeadingId : undefined}
              hint={SECTION_HINTS[key]}
              summary={summaryFor(key)}
              onEdit={sectionStatus === "complete" ? editFor(key) : undefined}
            >
              {isActive ? (
                <>
                  {revisiting ? (
                    <Notice tone="info">
                      You are changing an earlier answer. Everything after it is
                      still here.
                      <div className="canvas__inline-action">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            dispatch({ type: "go-to", step: revisiting });
                            setReturnTo(null);
                          }}
                        >
                          Back to {SECTION_LABELS[activeKey(revisiting)].toLowerCase()}
                        </Button>
                      </div>
                    </Notice>
                  ) : null}
                  {bodyFor(key)}
                </>
              ) : null}
            </CanvasSection>
          );
        })}
      </div>

      {current === "complete" ? (
        <div className="canvas__done">
          <Notice tone="info" title="You have a plan and a first draft">
            Both are yours. Nothing here is visible to anyone else. This is where
            onboarding hands over to the signed-in app — that surface is Sprint 2,
            which is why the navigation above is a placeholder.
          </Notice>
          <div className="canvas__inline-action">
            <Button variant="secondary" onClick={flow.restart}>
              Walk the flow again
            </Button>
          </div>
        </div>
      ) : null}

      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

/** The section a step belongs to, for the announcement. */
function activeKey(step: OnboardingStep): SectionKey {
  const found = SECTION_ORDER.find((key) => SECTION_STEPS[key].includes(step));
  return found ?? "account";
}

/**
 * The interpreted direction, edited in the header rather than in a section of
 * its own — it is the page's subject, so it lives where the subject lives.
 */
function InterpretationBody({ flow }: { flow: OnboardingFlow }) {
  const { state, dispatch, derived } = flow;
  const sentence = state.answers.interpretation ?? derived?.interpretation ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(sentence);

  return (
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
      <div className="canvas__actions">
        <Button
          variant="primary"
          onClick={() => dispatch({ type: "next" })}
          disabled={editing}
        >
          That is right
        </Button>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "back" })}>
          Back
        </Button>
      </div>
    </>
  );
}

export default OnboardingConcept3;
