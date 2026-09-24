"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { SignalSources } from "@/components/onboarding/SignalSources";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { DONE_C1, SIGNALS_C1, planById } from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * Onboarding ends here, on the win: the plan and the story, both saved. Two
 * ways on: build out your signals, the main one by decision on 2026-09-24,
 * or go home. Signals stays optional — home is always one tap away.
 */
export function CompleteScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, derived, dispatch } = flow;
  const plan = planById(state.answers.planId ?? "") ?? derived?.recommended;
  const story = plan?.thisWeek?.output ?? "The story of what you lead";

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
  const { connections, signalLinks } = state.answers;
  const anyOn = copy.sources.some(
    (source) => connections[source.id] === "connected" || Boolean(signalLinks[source.id])
  );

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
      <SignalSources
        connections={connections}
        signalLinks={signalLinks}
        onConnect={(id) => dispatch({ type: "set-connection", id, state: "connected" })}
        onAddLink={(id, link) => {
          dispatch({ type: "set-signal-link", id, link });
          dispatch({ type: "set-connection", id, state: "connected" });
        }}
        onDisconnect={(id) => {
          dispatch({ type: "set-signal-link", id, link: null });
          dispatch({ type: "set-connection", id, state: "declined" });
        }}
      />
    </WizardStep>
  );
}
