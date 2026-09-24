"use client";

import { useId, useState } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { AssumptionNotice } from "@/components/onboarding/AssumptionNotice";
import { DirectionField } from "@/components/onboarding/DirectionField";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { InterpretedDirection } from "@/components/onboarding/InterpretedDirection";
import { Notice } from "@/components/onboarding/Notice";
import { PrivacyPromise } from "@/components/onboarding/PrivacyPromise";
import { WelcomeSplit } from "@/components/onboarding/WelcomeSplit";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  DIRECTION,
  GENERATING_COPY,
  PRIVACY,
  PROMPTED_DIRECTIONS,
  WELCOME,
  checkEmail,
  isValidInviteCode,
  type PromptedDirection,
} from "@/mock/onboarding";
import { hasSkippedRefinement } from "@/flows/onboarding/shared";
import { useStatusBarTone } from "@/lib/device-tone";
import type { ScreenProps } from "./types";

/**
 * The welcome and account creation, on one screen.
 *
 * The first thing anyone sees, so it says what ExecHQ is before it asks for
 * anything: the wordmark and one serif line on a dark panel, then the welcome,
 * then the email. The invite code sits behind a link, since most people do not
 * have one, and opening it is the only way the screen grows.
 *
 * No progress marks here. A welcome that opens on "1 of 9" reads as paperwork
 * before anything has started; the marks begin on the next screen.
 *
 * The personal-domain rule was removed by decision on 2026-09-22. Any address is
 * accepted: the account belongs to the user and they can change the address
 * whenever they like, so refusing a work one was a gate with nothing behind it.
 */
export function AccountScreen({ flow, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [showCode, setShowCode] = useState(Boolean(state.answers.inviteCode));
  const [codeError, setCodeError] = useState(false);
  const [emailVerdict, setEmailVerdict] = useState<
    ReturnType<typeof checkEmail> | null
  >(null);
  const codeFieldId = useId();

  // The dark panel runs to the top edge of the phone.
  useStatusBarTone("inverse");

  function submit() {
    const codeOk = !showCode || !code.trim() || isValidInviteCode(code);
    const verdict = checkEmail(email);
    setCodeError(!codeOk);
    setEmailVerdict(verdict === "ok" ? null : verdict);
    if (!codeOk || verdict !== "ok") return;

    dispatch({ type: "set-invite-code", code: showCode ? code.trim() || null : null });
    dispatch({ type: "set-email", email: email.trim() });
    dispatch({ type: "next" });
  }

  return (
    <WelcomeSplit
      quote={WELCOME.quote}
      title={WELCOME.heading}
      description={WELCOME.lede}
      headingId={headingId}
      primaryLabel={WELCOME.cta}
      onPrimary={submit}
    >
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={email}
        error={
          emailVerdict === "empty"
            ? "We need an email address to create the account."
            : emailVerdict === "malformed"
              ? "That does not look like an email address."
              : undefined
        }
        onChange={(event) => {
          setEmail(event.target.value);
          // Typing answers the error, so it goes rather than sitting over a
          // field that no longer says what it describes.
          setEmailVerdict(null);
        }}
      />

      <div className="welcome__invite">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={showCode}
          aria-controls={codeFieldId}
          onClick={() => {
            setShowCode((open) => !open);
            setCodeError(false);
          }}
        >
          {showCode ? WELCOME.inviteHide : WELCOME.inviteShow}
        </Button>
      </div>

      <div id={codeFieldId} hidden={!showCode}>
        <Input
          label="Invite code"
          autoComplete="off"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setCodeError(false);
          }}
        />
      </div>

      {codeError ? (
        <Notice tone="explain" title="We do not recognise that code" live>
          Check it against the invitation you were sent. You can also continue
          without one — a code only changes who pays, never what you get.
        </Notice>
      ) : null}
    </WelcomeSplit>
  );
}

/**
 * The privacy promise. Nothing to fill in and nothing to agree to — there is no
 * consent here to withhold, only a statement of fact, so the only control is
 * the one that moves on.
 */
export function PrivacyScreen({ flow, step, total, headingId }: ScreenProps) {
  return (
    <WizardStep
      step={step}
      total={total}
      title={PRIVACY.heading}
      headingId={headingId}
      primaryLabel="Next"
      onPrimary={() => flow.dispatch({ type: "next" })}
      backLabel="Back"
      onBack={() => flow.dispatch({ type: "back" })}
    >
      {/* No heading of its own: the step already carries these words as its
          h1, and repeating them would put the same line in the outline twice. */}
      <PrivacyPromise statements={PRIVACY.statements} />
    </WizardStep>
  );
}

/** The direction. The only piece of career information the flow requires. */
export function DirectionScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(
    state.answers.directionSource === "prompted"
      ? (PROMPTED_DIRECTIONS.find((p) => p.text === state.answers.direction)?.id ??
        null)
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
    // Refinement comes next now, so there is nothing to think about yet. The
    // interpreting pause happens on the way out of refinement instead.
    dispatch({ type: "next" });
  }

  return (
    <WizardStep
      step={step}
      total={total}
      title={DIRECTION.prompt}
      headingId={headingId}
      primaryLabel="Next"
      onPrimary={submit}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      <DirectionField
        label={DIRECTION.prompt}
        // The step's h1 already asks this. Showing the label too would put the
        // same sentence on screen twice and push the primary action off it.
        labelHidden
        hint={DIRECTION.hint}
        value={value}
        onChange={(next) => {
          setValue(next);
          // Typing over a prompt makes it the user's own answer again.
          setSelected(null);
          if (next.trim()) setError(undefined);
        }}
        prompted={PROMPTED_DIRECTIONS}
        promptedLabel={DIRECTION.promptedLabel}
        selectedPromptId={selected}
        onSelectPrompt={choose}
        // No separate examples block here: the hint carries both answer shapes
        // in a line, and the prompts below are examples you can act on. Concept
        // 1's whole claim is that nothing important sits below the fold.
        error={error}
      />
    </WizardStep>
  );
}

/**
 * The interpreted direction, read back and editable.
 *
 * The thinking state is simulated but it is real UI: it is the first time the
 * product appears to do work, and skipping straight to the answer would lose
 * the moment the whole flow is built around.
 */
export function InterpretationScreen({
  flow,
  step,
  total,
  headingId,
}: ScreenProps) {
  const { state, dispatch, derived, generating, withDelay } = flow;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    state.answers.interpretation ?? derived?.interpretation ?? ""
  );

  if (generating === "interpreting") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={GENERATING_COPY.interpreting} />
      </WizardStep>
    );
  }

  const sentence = state.answers.interpretation ?? derived?.interpretation ?? "";

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow="What we heard"
      title="Here is what we understood"
      description="If this is not quite right, change it. Everything after this is built on it."
      headingId={headingId}
      primaryLabel="Next"
      onPrimary={() => {
        dispatch({ type: "next" });
        withDelay("planning", () => {});
      }}
      primaryDisabled={editing}
      backLabel="Back"
      onBack={() => dispatch({ type: "back" })}
    >
      {/* Refinement comes before this screen now, so a skip lands here — which
          makes this the place the assumption was actually made, and the place to
          say so. On the plan screen it sat next to the plan's own reasoning and
          the two read as one thought said twice. */}
      {hasSkippedRefinement(state) && derived ? (
        <AssumptionNotice
          statement={derived.assumption.statement}
          promise={derived.assumption.promise}
        />
      ) : null}

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
    </WizardStep>
  );
}
