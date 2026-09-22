"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { ArtifactDraft } from "@/components/onboarding/ArtifactDraft";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  CONNECT_FIELDS,
  EXPORT_ACTIONS,
  GENERATING_COPY,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * The first artifact, built the moment the plan is confirmed.
 *
 * There is no longer a screen between choosing a plan and having something: the
 * user has just decided, and the fastest way to prove the decision was worth
 * making is to hand them the work rather than describe it. The one line under
 * the title carries what the deleted step used to say — why this piece first.
 *
 * Download and email sit in a toolbar above the primary action, available the
 * whole time. Both are designed states: nothing in this prototype leaves the
 * browser, so they confirm and stop.
 */
export function ArtifactScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, derived, generating } = flow;
  const [exported, setExported] = useState<"download" | "email" | null>(null);

  if (generating === "drafting") {
    return (
      <WizardStep
        step={step}
        total={total}
        title="Building your first draft"
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
      description="Everything in your plan reuses this, which is why it came first. Edit anything."
      headingId={headingId}
      showNav
      primaryLabel={state.answers.artifactSaved ? "Next" : "Save"}
      onPrimary={() => {
        if (!state.answers.artifactSaved) {
          dispatch({ type: "save-artifact" });
          return;
        }
        dispatch({ type: "next" });
      }}
      backLabel="Back"
      onBack={() => dispatch({ type: "go-to", step: "plan" })}
      footer={
        <div className="export">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setExported("download")}
          >
            {EXPORT_ACTIONS.downloadLabel}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setExported("email")}>
            {EXPORT_ACTIONS.emailLabel}
          </Button>
        </div>
      }
    >
      <ArtifactDraft
        artifact={derived.artifact}
        saved={state.answers.artifactSaved}
        showTitle={false}
      />

      {exported ? (
        <Notice tone="info" live>
          {exported === "download"
            ? EXPORT_ACTIONS.downloaded
            : EXPORT_ACTIONS.emailed}
        </Notice>
      ) : null}
    </WizardStep>
  );
}

/**
 * The last step. The metrics and the link are typed in here rather than offered
 * on a card that opens a form — the user asked for two things, and asking for
 * them is fewer moves than offering to ask.
 *
 * Both routes onward go to the same place. Saving nothing is not a lesser exit,
 * so the two buttons differ in what they do and not in how much they are worth.
 */
export function ConnectScreen({ flow, step, total, headingId }: ScreenProps) {
  const { dispatch } = flow;
  const [values, setValues] = useState<Record<string, string>>({});

  function set(id: string, value: string) {
    setValues((previous) => ({ ...previous, [id]: value }));
  }

  const linkedin = CONNECT_FIELDS.fields.filter((f) => f.group === "linkedin");
  const website = CONNECT_FIELDS.fields.filter((f) => f.group === "website");

  function finish(save: boolean) {
    const added = save && Object.values(values).some((v) => v.trim());
    dispatch({
      type: "set-connection",
      id: "linkedin",
      state: added ? "connected" : "declined",
    });
    dispatch({
      type: "set-connection",
      id: "website",
      state: save && values.website?.trim() ? "connected" : "declined",
    });
    dispatch({ type: "next" });
  }

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="Optional"
      title={CONNECT_FIELDS.heading}
      description={CONNECT_FIELDS.hint}
      headingId={headingId}
      showNav
      skipLabel="Skip"
      onSkip={() => finish(false)}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
      primaryLabel={CONNECT_FIELDS.saveLabel}
      onPrimary={() => finish(true)}
      footer={
        <Button variant="secondary" fullWidth onClick={() => finish(false)}>
          {CONNECT_FIELDS.skipLabel}
        </Button>
      }
    >
      <fieldset className="connect-fields">
        <legend className="t-eyebrow">{CONNECT_FIELDS.linkedinLabel}</legend>
        {linkedin.map((field) => (
          <Input
            key={field.id}
            label={field.label}
            inputMode="numeric"
            value={values[field.id] ?? ""}
            onChange={(event) => set(field.id, event.target.value)}
          />
        ))}
      </fieldset>

      <fieldset className="connect-fields">
        <legend className="t-eyebrow">{CONNECT_FIELDS.websiteLabel}</legend>
        {website.map((field) => (
          <Input
            key={field.id}
            label={field.label}
            type="url"
            placeholder="https://"
            value={values[field.id] ?? ""}
            onChange={(event) => set(field.id, event.target.value)}
          />
        ))}
      </fieldset>
    </WizardStep>
  );
}

/**
 * Where onboarding hands over. The homepage is a real route — a Sprint 2
 * placeholder — so the handover is a link rather than a description of one.
 */
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
      footer={
        <>
          <Link className="btn btn--primary btn--md btn--full" href="/homepage/concept-1">
            Go to my homepage
          </Link>
          <Button variant="ghost" fullWidth onClick={flow.restart}>
            Walk the flow again
          </Button>
        </>
      }
    >
      <Notice tone="info">
        The signed-in app is Sprint 2, which is why the navigation above is a
        placeholder and the homepage is still a holding page.
      </Notice>
    </WizardStep>
  );
}
