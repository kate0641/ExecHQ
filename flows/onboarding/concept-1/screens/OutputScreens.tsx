"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Notice } from "@/components/onboarding/Notice";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  CONNECT_FIELDS,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

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
