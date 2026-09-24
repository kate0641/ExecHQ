"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DeviceKeyboard } from "@/components/onboarding/DeviceKeyboard";
import { Button } from "@/components/primitives/Button";

export interface AnswerDrawerProps {
  /** What is being asked. It lives here while the drawer is open, so the
   *  question and the answer are one thing. */
  question: string;
  /** Id for the question, so a page change can move focus to it. */
  questionId?: string;
  kicker?: string;
  lede?: string;
  /** Where in a stepped question, e.g. "1 of 3". */
  step?: string;
  /** Open, or folded down to a peek so the page behind can be read. */
  open: boolean;
  onToggle: () => void;
  foldLabel?: string;
  /** Said on the peek bar, e.g. "Tap to answer". */
  peekStatus?: string;
  children?: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Focus the first text field on arrival, for a question that is only typed. */
  autoFocusField?: boolean;
  /** Return in a one-line field sends the answer. */
  className?: string;
}

const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]), textarea';

/**
 * Concept 3's answers come up in a drawer, by decision on 2026-09-24, and the
 * question comes with it: option 1 of three tried, so the question and the
 * answer are never apart. The page behind keeps where you are, what ExecHQ
 * knows and why it is asking.
 *
 * The handle folds the drawer to a peek bar carrying the question, so the
 * whole page can be read; the bar brings it back. Both are real buttons, so
 * nothing needs dragging (WCAG 2.2 SC 2.5.7).
 *
 * While a text field inside has focus, a drawn keyboard sits under the drawer,
 * as a real one would on a phone.
 */
export function AnswerDrawer({
  question,
  questionId,
  kicker,
  lede,
  step,
  open,
  onToggle,
  foldLabel = "Fold the drawer down to read the page",
  peekStatus = "Tap to answer",
  children,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  secondaryLabel,
  onSecondary,
  autoFocusField = false,
  className,
}: AnswerDrawerProps) {
  const panel = useRef<HTMLElement>(null);
  const [typing, setTyping] = useState(false);

  // After the page has moved focus to the question, a typed-only question
  // hands it straight on to its field, which is what brings the keyboard up.
  useEffect(() => {
    if (!open || !autoFocusField) return;
    const timer = window.setTimeout(() => {
      const field = panel.current?.querySelector<HTMLElement>(TEXT_FIELD);
      field?.focus({ preventScroll: true });
      // Focus events wait while the window itself is unfocused, so say so
      // directly rather than waiting to hear it.
      if (field && document.activeElement === field) setTyping(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, autoFocusField, question]);

  // Listening, not interacting: the drawer notices when a field inside it
  // has focus (to show the keyboard) and when Return is pressed in a one-line
  // field (to send the answer). The fields themselves are the controls.
  const latest = useRef({ onPrimary, primaryDisabled });
  useEffect(() => {
    latest.current = { onPrimary, primaryDisabled };
  });
  useEffect(() => {
    const node = panel.current;
    if (!open || !node) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "Enter" && target.tagName === "INPUT" && !latest.current.primaryDisabled) {
        event.preventDefault();
        latest.current.onPrimary();
      }
    };
    const onIn = (event: FocusEvent) => setTyping((event.target as HTMLElement).matches(TEXT_FIELD));
    const onOut = (event: FocusEvent) => {
      const next = event.relatedTarget as HTMLElement | null;
      if (!next || !node.contains(next) || !next.matches(TEXT_FIELD)) setTyping(false);
    };
    node.addEventListener("keydown", onKey);
    node.addEventListener("focusin", onIn);
    node.addEventListener("focusout", onOut);
    return () => {
      node.removeEventListener("keydown", onKey);
      node.removeEventListener("focusin", onIn);
      node.removeEventListener("focusout", onOut);
    };
  }, [open]);

  if (!open) {
    return (
      <section className={["answer-drawer", "is-peek", className].filter(Boolean).join(" ")} aria-label={question}>
        <button type="button" className="answer-drawer__peek" aria-expanded={false} onClick={onToggle}>
          <span className="answer-drawer__peek-q">{question}</span>
          <span className="answer-drawer__peek-status">{peekStatus}</span>
        </button>
      </section>
    );
  }

  return (
    <div className="answer-drawer__wrap">
      <section
        ref={panel}
        className={["answer-drawer", className].filter(Boolean).join(" ")}
        aria-labelledby={questionId}
      >
        <button
          type="button"
          className="answer-drawer__grab"
          aria-expanded
          aria-label={foldLabel}
          onClick={onToggle}
        />
        {kicker || step ? (
          <div className="answer-drawer__head">
            {kicker ? <p className="answer-drawer__kicker">{kicker}</p> : <span />}
            {step ? <p className="answer-drawer__step">{step}</p> : null}
          </div>
        ) : null}
        <p className="answer-drawer__q" id={questionId} tabIndex={-1}>
          {question}
        </p>
        {lede ? <p className="answer-drawer__lede">{lede}</p> : null}
        {children ? <div className="answer-drawer__body">{children}</div> : null}
        <div className="answer-drawer__actions">
          {secondaryLabel ? (
            <Button variant="ghost" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
          <Button variant="primary" onClick={onPrimary} disabled={primaryDisabled}>
            {primaryLabel}
          </Button>
        </div>
      </section>
      {typing ? <DeviceKeyboard returnLabel={primaryLabel} /> : null}
    </div>
  );
}

export default AnswerDrawer;
