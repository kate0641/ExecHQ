"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { LinkedInUpload } from "@/components/onboarding/LinkedInUpload";
import { SignalSources } from "@/components/onboarding/SignalSources";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { linkedInIn } from "@/flows/onboarding/shared";
import {
  DONE_C1,
  LINKEDIN_UPLOAD,
  SIGNALS_C1,
  isSharpened,
  looksLikeLinkedInExport,
  planById,
  quickWinFor,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * Onboarding ends here, on the win: the plan and the story, both saved. Two
 * ways on: build out your signals, the main one by decision on 2026-09-24,
 * or go home. Signals stays optional — home is always one tap away.
 *
 * Then what comes next on the plan, by decision on 2026-09-28: sharpening the
 * story if it was left as a first draft, the bio once it has been sharpened.
 * The plan screen came before the draft, so this is the first place that can
 * say which.
 */
export function CompleteScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, derived, dispatch } = flow;
  const plan = planById(state.answers.planId ?? "") ?? derived?.recommended;
  const sharpened = isSharpened(state.answers.positioning);
  const story = sharpened ? DONE_C1.storySharpened : DONE_C1.storyDraft;

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={DONE_C1.eyebrow}
      title={DONE_C1.title}
      description={DONE_C1.hint}
      headingId={headingId}
      className="wizard--centred"
      footer={
        <div className="done-actions">
          <Button
            variant="primary"
            fullWidth
            onClick={() => dispatch({ type: "go-to", step: "connect" })}
          >
            {DONE_C1.signals}
          </Button>
          <Link className="btn btn--secondary btn--md btn--full" href={DONE_C1.homeHref}>
            {DONE_C1.home}
          </Link>
        </div>
      }
    >
      <ul className="done-saved">
        {plan ? (
          <li>
            <Icon name="check" size={18} />
            {DONE_C1.planPrefix} {plan.name}
          </li>
        ) : null}
        <li>
          <Icon name="check" size={18} />
          {story}
        </li>
      </ul>
      <ThisWeekCard
        label={DONE_C1.nextLabel}
        whyLabel={DONE_C1.nextWhy}
        {...quickWinFor(plan, sharpened)}
      />
      <div className="done-invite">
        <p className="done-invite__title">{DONE_C1.inviteTitle}</p>
        <p className="done-invite__body">{DONE_C1.inviteBody}</p>
      </div>
    </WizardStep>
  );
}

/**
 * Build out your signals: optional, after onboarding has ended, so it carries
 * no progress marks. The sources and their sheets are SignalSources, shared
 * with Concept 3, which asks for them earlier.
 */
export function SignalsScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const router = useRouter();
  const copy = SIGNALS_C1;
  const { linkedin } = state.answers;
  const anyOn = linkedInIn(linkedin);
  // LinkedIn's upload is a page of its own inside this screen, by decision on
  // 2026-09-28: four steps and a picker are too much for a sheet.
  const [uploading, setUploading] = useState(false);

  // Opening and closing the upload page is a change inside the step, so this
  // screen moves focus itself, to the new heading.
  const wasUploading = useRef(uploading);
  useEffect(() => {
    if (wasUploading.current === uploading) return;
    wasUploading.current = uploading;
    if (uploading) document.getElementById(headingId)?.focus();
    else document.querySelector<HTMLElement>('[data-source="linkedin"]')?.focus();
  }, [uploading, headingId]);

  if (uploading) {
    const fileIn = linkedInIn(linkedin);
    return (
      <WizardStep
        step={step}
        total={total}
        showProgress={false}
        eyebrow={LINKEDIN_UPLOAD.eyebrow}
        title={LINKEDIN_UPLOAD.title}
        description={fileIn ? undefined : LINKEDIN_UPLOAD.lede}
        headingId={headingId}
        backLabel={copy.title}
        onBack={() => setUploading(false)}
        primaryLabel={fileIn ? LINKEDIN_UPLOAD.done : LINKEDIN_UPLOAD.skip}
        primaryVariant={fileIn ? "primary" : "secondary"}
        onPrimary={() => setUploading(false)}
      >
        <LinkedInUpload
          status={linkedin.status}
          fileName={linkedin.fileName}
          email={state.answers.email}
          onChoose={(fileName) =>
            dispatch({
              type: "set-linkedin",
              patch: { fileName, status: looksLikeLinkedInExport(fileName) ? "reading" : "wrong-file" },
            })
          }
          onSendSteps={() => dispatch({ type: "set-linkedin", patch: { status: "sent" } })}
        />
      </WizardStep>
    );
  }

  return (
    <WizardStep
      step={step}
      total={total}
      showProgress={false}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.hint}
      headingId={headingId}
      primaryLabel={anyOn ? copy.done : copy.skip}
      primaryVariant={anyOn ? "primary" : "secondary"}
      onPrimary={() => router.push(DONE_C1.homeHref)}
    >
      <SignalSources linkedin={linkedin} onOpenLinkedIn={() => setUploading(true)} />
    </WizardStep>
  );
}
