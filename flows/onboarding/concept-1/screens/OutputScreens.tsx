"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { ActionCard } from "@/components/onboarding/ActionCard";
import { ArtifactDraft } from "@/components/onboarding/ArtifactDraft";
import { ConnectOffer } from "@/components/onboarding/ConnectOffer";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { CONNECT_OFFERS, GENERATING_COPY } from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/** The first recommended action, with its reasoning shown. */
export function ActionScreen({ flow, step, total, headingId }: ScreenProps) {
  const { dispatch, derived, withDelay } = flow;
  if (!derived) return null;

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="First step"
      title="Start here"
      headingId={headingId}
      primaryLabel="Write it now"
      onPrimary={() => {
        dispatch({ type: "next" });
        withDelay("drafting", () => {});
      }}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      <ActionCard action={derived.action} />
    </WizardStep>
  );
}

/**
 * The first artifact.
 *
 * A stub of the Positioning Builder — Sprint 4 designs the real thing. What it
 * has to do here is arrive already written, so the transition reads as a
 * hand-off into work in progress rather than the start of a tutorial. The nav
 * placeholder appears from this point: the user is now inside the product
 * rather than being set up for it.
 */
export function ArtifactScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, derived, generating } = flow;

  if (generating === "drafting") {
    return (
      <WizardStep
        step={step}
        total={total}
        title="One moment"
        headingId={headingId}
        showNav
      >
        <GeneratingState label={GENERATING_COPY.drafting} />
      </WizardStep>
    );
  }

  if (!derived) return null;

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={derived.artifact.tool}
      title={derived.artifact.title}
      headingId={headingId}
      showNav
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
    >
      {/* The step header already carries the tool and the document's name, so
          the document does not repeat them. */}
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
    </WizardStep>
  );
}

/**
 * The optional connections, offered only now that the artifact exists.
 *
 * The website offer fails on its first attempt on purpose: a failed connection
 * is a required state, and the only honest way to reach it in a prototype with
 * no network is to script it. Retrying succeeds.
 */
export function ConnectScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});

  function connect(id: string) {
    const isFirstTry = !attempted[id];
    setAttempted((previous) => ({ ...previous, [id]: true }));
    const fails = id === "website" && isFirstTry;
    dispatch({
      type: "set-connection",
      id,
      state: fails ? "failed" : "connected",
    });
  }

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Optional"
      title="Two things that would sharpen later drafts"
      description="Neither changes what you already have. You can add them any time, or never."
      headingId={headingId}
      showNav
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
    >
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
    </WizardStep>
  );
}

/** The end of onboarding. Says what exists now, and gets out of the way. */
export function CompleteScreen({ flow, step, total, headingId }: ScreenProps) {
  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Set up"
      title="You have a plan and a first draft"
      description="Both are yours. Nothing here is visible to anyone else."
      headingId={headingId}
      showNav
    >
      <Notice tone="info">
        This is where onboarding hands over to the signed-in app. That surface is
        Sprint 2, which is why the navigation above is a placeholder.
      </Notice>
      <div className="wizard__restart">
        <Button variant="secondary" onClick={flow.restart}>
          Walk the flow again
        </Button>
      </div>
    </WizardStep>
  );
}
