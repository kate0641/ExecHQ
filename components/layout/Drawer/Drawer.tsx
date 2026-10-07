"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface DrawerProps {
  /** On the screen at all. Closed, nothing is drawn. */
  open: boolean;
  /** Down to a peek bar, so the page behind can be read. */
  folded: boolean;
  /** The grab handle and the peek bar: fold it, or bring it back. */
  onToggle: () => void;
  /** The drawer's accessible name, and what the peek bar says. */
  label: string;
  /** Said on the peek bar, e.g. "Tap to open". */
  peekStatus?: string;
  foldLabel?: string;
  children: ReactNode;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A drawer that comes up from the foot of the phone screen and leaves the
 * page behind it alone: no scrim, nothing inert, so she can keep reading and
 * scrolling. Its handle folds it to a peek bar carrying its name, and the bar
 * brings it back; both are real buttons, so nothing needs dragging (WCAG 2.2
 * SC 2.5.7). Escape folds it, and whatever holds the drawer closes it by no longer opening it. Focus moves in when it opens and goes back to
 * what opened it when it closes.
 *
 * Where a Sheet blocks the screen for one job, this holds something she may
 * want beside the page. It is the onboarding's answer drawer, without the
 * question.
 */
export function Drawer({ open, folded, onToggle, label, peekStatus = "Tap to open", foldLabel = "Fold the drawer down to read the page", children, inline = false, className }: DrawerProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const latest = useRef({ onToggle, folded });
  useEffect(() => {
    latest.current = { onToggle, folded };
  });

  useEffect(() => {
    if (inline) return;
    setHost(anchor.current?.closest(".device__screen") ?? null);
  }, [inline]);

  // Focus goes in when it opens, and back to the opener when it closes.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    return () => {
      window.setTimeout(() => {
        if (opener?.isConnected) opener.focus();
      }, 0);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !latest.current.folded && panel.current?.contains(document.activeElement)) {
        event.preventDefault();
        latest.current.onToggle();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const classes = ["drawer", inline ? "drawer--inline" : null, folded ? "is-peek" : null, className].filter(Boolean).join(" ");
  const drawer = open ? (
    <div className={classes}>
      {folded ? (
        <section className="drawer__panel" aria-label={label}>
          <button type="button" className="drawer__peek" aria-expanded={false} onClick={onToggle}>
            <span className="drawer__peek-name">{label}</span>
            <span className="drawer__peek-status">{peekStatus}</span>
          </button>
        </section>
      ) : (
        <section className="drawer__panel" aria-label={label} ref={panel}>
          <button type="button" className="drawer__grab" aria-expanded aria-label={foldLabel} onClick={onToggle} />
          {children}
        </section>
      )}
    </div>
  ) : null;

  return (
    <>
      <span ref={anchor} hidden />
      {inline || !host ? drawer : drawer && createPortal(drawer, host)}
    </>
  );
}

export default Drawer;
