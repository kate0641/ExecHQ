"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { AdvisorNote } from "@/components/onboarding/AdvisorNote";
import { DirectionField } from "@/components/onboarding/DirectionField";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Notice } from "@/components/onboarding/Notice";
import { PrivacySplash } from "@/components/onboarding/PrivacySplash";
import { WelcomeSplit } from "@/components/onboarding/WelcomeSplit";
import { WizardStep } from "@/components/onboarding/WizardStep";
import {
  DIRECTION_C1,
  DIRECTION_INTRO_C1,
  DIRECTION_PROMPTS_C1,
  GENERATING_COPY,
  INTERPRETATION_C1,
  PRIVACY_SPLASH,
  WELCOME,
  checkEmail,
  isValidInviteCode,
  readBack,
  type PromptedDirection,
} from "@/mock/onboarding";
import { hasSkippedRefinement, useDictation } from "@/flows/onboarding/shared";
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
 * The privacy promise, told as who does not see the account. Nothing to fill
 * in and nothing to agree to, so the one control acknowledges it. No back
 * button, by decision on 2026-09-24.
 */
export function PrivacyScreen({ flow, headingId }: ScreenProps) {
  return (
    <PrivacySplash
      titleLead={PRIVACY_SPLASH.titleLead}
      titleRest={PRIVACY_SPLASH.titleRest}
      lines={PRIVACY_SPLASH.lines}
      headingId={headingId}
      primaryLabel={PRIVACY_SPLASH.action}
      onPrimary={() => flow.dispatch({ type: "next" })}
    />
  );
}

/**
 * Where the user wants to go, said or typed. The prompts are short, concrete
 * goals: tapping one puts it in the field, still editable, and focus follows
 * so the next thing typed or said adds to it. The mic sits in the field's
 * corner, where people expect it from messaging apps.
 *
 * It opens on a bridge in the privacy splash's layout, saying why this comes
 * first and that a loose answer is as good a start as a precise one, by
 * decision on 2026-09-28. Without it the flow dropped from the privacy promise
 * straight into the hardest question. The bridge is part of this step rather
 * than a step of its own, so the shared step list and every concept's progress
 * count are untouched. Arriving with a direction already given goes straight
 * to the question; a step-bar jump clears the answer, so it opens on the
 * bridge like a first arrival.
 */
export function DirectionScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const [intro, setIntro] = useState(!state.answers.direction);
  // The shell moves focus on a step change; this is a change inside the step,
  // so it moves focus itself. Not on first paint, for the shell's reason.
  const introShown = useRef(intro);
  useEffect(() => {
    if (introShown.current === intro) return;
    introShown.current = intro;
    document.getElementById(headingId)?.focus();
  }, [intro, headingId]);
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(
    state.answers.directionSource === "prompted"
      ? (DIRECTION_PROMPTS_C1.find((p) => p.text === state.answers.direction)?.id ??
        null)
      : null
  );
  const [error, setError] = useState<string | undefined>();
  const dictation = useDictation(value, (next) => {
    setValue(next);
    setSelected(null);
    setError(undefined);
  });

  function choose(prompt: PromptedDirection) {
    dictation.stop();
    setValue(prompt.text);
    setSelected(prompt.id);
    setError(undefined);
  }

  function submit() {
    dictation.stop();
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

  if (intro) {
    return (
      <PrivacySplash
        titleLead={DIRECTION_INTRO_C1.titleLead}
        titleRest={DIRECTION_INTRO_C1.titleRest}
        lines={DIRECTION_INTRO_C1.lines}
        spaced
        icon="flag"
        headingId={headingId}
        primaryLabel={DIRECTION_INTRO_C1.action}
        onPrimary={() => setIntro(false)}
      />
    );
  }

  return (
    <WizardStep
      step={step}
      total={total}
      title={DIRECTION_C1.prompt}
      description={DIRECTION_C1.hint}
      headingId={headingId}
      backLabel={DIRECTION_INTRO_C1.back}
      onBack={() => {
        dictation.stop();
        setIntro(true);
      }}
      primaryLabel="Next"
      onPrimary={submit}
    >
      <DirectionField
        label={DIRECTION_C1.prompt}
        // The step's h1 already asks this. Showing the label too would put the
        // same sentence on screen twice.
        labelHidden
        value={value}
        onChange={(next) => {
          // Typing takes over from the mic, and makes a prompt the user's own.
          dictation.stop();
          setValue(next);
          setSelected(null);
          if (next.trim()) setError(undefined);
        }}
        prompted={DIRECTION_PROMPTS_C1}
        promptedLabel={DIRECTION_C1.promptedLabel}
        selectedPromptId={selected}
        onSelectPrompt={choose}
        focusOnSelect
        promptLayout="stacked"
        voice={{ listening: dictation.listening, onToggle: dictation.toggle }}
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
  const { state, dispatch, generating, withDelay } = flow;
  // The screen is tinted so the note can lift off it; the status bar matches.
  useStatusBarTone("sunken");
  // Said back from the user's own inputs — their direction and their
  // refinement answers — so it can never contradict what they just told us.
  const heard = readBack(state.answers.direction ?? "", state.answers.refinement);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.answers.interpretation ?? heard);

  if (generating === "interpreting") {
    return (
      <WizardStep
        step={step}
        total={total}
        title="One moment"
        headingId={headingId}
        className="wizard--tinted"
      >
        <GeneratingState label={GENERATING_COPY.interpreting} />
      </WizardStep>
    );
  }

  const sentence = state.answers.interpretation ?? heard;

  return (
    <WizardStep
      step={step}
      total={total}
      title={INTERPRETATION_C1.heading}
      description={INTERPRETATION_C1.hint}
      headingId={headingId}
      primaryLabel={INTERPRETATION_C1.confirm}
      onPrimary={() => {
        dispatch({ type: "next" });
        withDelay("planning", () => {});
      }}
      primaryDisabled={editing}
      className="wizard--centred wizard--tinted"
    >
      <AdvisorNote
        from={INTERPRETATION_C1.from}
        role={INTERPRETATION_C1.role}
        body={editing ? draft : sentence}
        // Refinement comes before this screen, so a skip lands here — which
        // makes this the place to say the reading rests on the goal alone.
        aside={hasSkippedRefinement(state) ? INTERPRETATION_C1.assumed : undefined}
        closing={INTERPRETATION_C1.bridge}
        editing={editing}
        editLabel={INTERPRETATION_C1.edit}
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
