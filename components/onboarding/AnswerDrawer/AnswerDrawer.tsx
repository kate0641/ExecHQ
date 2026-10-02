"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { DeviceKeyboard } from "@/components/onboarding/DeviceKeyboard";
import { Button } from "@/components/primitives/Button";

export interface AnswerDrawerProps {
  /** What is being asked. It is said on the page, above the drawer, with the
   *  reason for asking; here it names the drawer for assistive technology and
   *  is what the folded bar says. */
  question: string;
  /** Id of the page's heading, which names the drawer. */
  questionId?: string;
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
  /** A title for the card on web, where the answers sit beside the question
   *  and the page's own heading is far from them. Not shown on phone or
   *  tablet, where the drawer sits under the heading. */
  webTitle?: string;
  /** No buttons: the page acts on each answer as it is given. */
  hideActions?: boolean;
  /** Return in a one-line field sends the answer. */
  className?: string;
}

const keepFocus = (event: MouseEvent) => event.preventDefault();

const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]), textarea';

/**
 * Concept 3's answers come up in a drawer, by decision on 2026-09-24. Since
 * 2026-09-30 it holds only the answer: the question, what it is for and why
 * ExecHQ is asking stay together on the page above it (option B of three
 * tried). Where the drawer's field asks something more particular than the
 * page's heading, the field's own label says so.
 *
 * The handle folds the drawer to a peek bar carrying the question, so the
 * whole page can be read; the bar brings it back. Both are real buttons, so
 * nothing needs dragging (WCAG 2.2 SC 2.5.7).
 *
 * While a text field inside has focus, a drawn keyboard sits under the drawer,
 * as a real one would on a phone. Its return key sends the answer, as Return
 * does, and pressing the drawer's own button does too without first closing
 * the keyboard.
 */
export function AnswerDrawer({
  question,
  questionId,
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
  webTitle,
  hideActions = false,
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
        {step ? <p className="answer-drawer__step">{step}</p> : null}
        {webTitle ? <p className="answer-drawer__title">{webTitle}</p> : null}
        {children ? <div className="answer-drawer__body">{children}</div> : null}
        {/* Pressing an action must not take focus from the field: that drops the
            keyboard, the drawer moves, and the press lands on nothing. */}
        {hideActions ? null : (
          <div className="answer-drawer__actions">
            {secondaryLabel ? (
              <Button variant="ghost" onClick={onSecondary} onMouseDown={keepFocus}>
                {secondaryLabel}
              </Button>
            ) : null}
            <Button variant="primary" onClick={onPrimary} onMouseDown={keepFocus} disabled={primaryDisabled}>
              {primaryLabel}
            </Button>
          </div>
        )}
      </section>
      {typing ? (
        <DeviceKeyboard returnLabel={primaryLabel} onReturn={primaryDisabled ? undefined : onPrimary} />
      ) : null}
    </div>
  );
}

export default AnswerDrawer;
