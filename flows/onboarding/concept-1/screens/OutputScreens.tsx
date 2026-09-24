"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
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

type Source = (typeof SIGNALS_C1.sources)[number];

/**
 * Build out your signals: optional, after onboarding has ended, so it carries
 * no progress marks. Each source is a row with its status; tapping one opens
 * a sheet to connect it or add it by link. What was brought in, and what it
 * is used for, is said in the sheet: that is the permission scope.
 *
 * Connecting is simulated. Nothing leaves the browser.
 */
export function SignalsScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch } = flow;
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState<string | undefined>();
  const copy = SIGNALS_C1;

  const isOn = (id: string) =>
    state.answers.connections[id] === "connected" || Boolean(state.answers.signalLinks[id]);
  const anyOn = copy.sources.some((source) => isOn(source.id));
  const source = copy.sources.find((item) => item.id === open);

  function openSheet(id: string) {
    lastOpened.current = id;
    setOpen(id);
    setPasting(false);
    setLink(state.answers.signalLinks[id] ?? "");
    setLinkError(undefined);
  }

  function close() {
    setOpen(null);
    setConnecting(false);
  }

  function importSource(item: Source) {
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      dispatch({ type: "set-connection", id: item.id, state: "connected" });
    }, 1100);
  }

  function addLink(item: Source) {
    if (!link.trim()) {
      setLinkError("Add a link, or close this to leave it for now.");
      return;
    }
    dispatch({ type: "set-signal-link", id: item.id, link: link.trim() });
    dispatch({ type: "set-connection", id: item.id, state: "connected" });
    setPasting(false);
  }

  function disconnect(item: Source) {
    dispatch({ type: "set-signal-link", id: item.id, link: null });
    dispatch({ type: "set-connection", id: item.id, state: "declined" });
  }

  function sheetBody(item: Source) {
    if (isOn(item.id)) {
      const pasted = state.answers.signalLinks[item.id];
      return (
        <div className="signal-imported">
          <p className="signal-imported__how">
            {pasted ? `From ${pasted}` : copy.connected}
          </p>
          <p>Brought in: {item.imported}.</p>
          <p>{item.use}</p>
          <button type="button" className="signal-link" onClick={() => disconnect(item)}>
            {copy.disconnect}
          </button>
        </div>
      );
    }
    if (connecting) {
      return <output className="signal-working">{item.connecting}</output>;
    }
    if (item.canImport && !pasting) {
      return (
        <div className="signal-actions">
          <Button variant="primary" fullWidth onClick={() => importSource(item)}>
            {item.connectLabel}
          </Button>
          <button type="button" className="signal-link" onClick={() => setPasting(true)}>
            {item.pasteLabel}
          </button>
        </div>
      );
    }
    return (
      <div className="signal-actions">
        <Input
          label={item.linkLabel}
          type="url"
          placeholder={item.placeholder}
          value={link}
          error={linkError}
          onChange={(event) => {
            setLink(event.target.value);
            setLinkError(undefined);
          }}
        />
        <Button variant="primary" fullWidth onClick={() => addLink(item)}>
          {copy.add}
        </Button>
      </div>
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
      <ul className="signal-list">
        {copy.sources.map((item) => {
          const on = isOn(item.id);
          return (
            <li key={item.id}>
              <span className="signal-list__mark" aria-hidden="true">
                {item.mark}
              </span>
              <div className="signal-list__text">
                <p className="signal-list__title">{item.title}</p>
                <p className="signal-list__detail">{on ? item.imported : item.why}</p>
              </div>
              {on ? (
                <button
                  type="button"
                  className="signal-list__status"
                  data-source={item.id}
                  onClick={() => openSheet(item.id)}
                  aria-label={`${item.title}: ${copy.connected}. Manage`}
                >
                  {copy.connected}
                </button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  data-source={item.id}
                  onClick={() => openSheet(item.id)}
                  aria-label={`${copy.connect} ${item.title}`}
                >
                  {copy.connect}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="signal-privacy">
        <Icon name="lock" size={16} />
        {copy.privacy}
      </p>

      <Sheet
        open={Boolean(source)}
        onClose={close}
        label={source?.title ?? ""}
        // Connecting swaps the row's button, so focus returns to its successor.
        returnFocusTo={() =>
          document.querySelector<HTMLElement>(`[data-source="${lastOpened.current}"]`)
        }
      >
        {source ? (
          <div className="signal-sheet">
            <div className="signal-sheet__head">
              <span className="signal-list__mark" aria-hidden="true">
                {source.mark}
              </span>
              <div>
                <p className="signal-list__title">{source.title}</p>
                <p className="signal-list__detail">{source.why}</p>
              </div>
            </div>
            {sheetBody(source)}
            <p className="signal-privacy">
              <Icon name="lock" size={16} />
              {copy.privacy}
            </p>
            <button type="button" className="signal-link" onClick={close}>
              {copy.close}
            </button>
          </div>
        ) : null}
      </Sheet>
    </WizardStep>
  );
}
