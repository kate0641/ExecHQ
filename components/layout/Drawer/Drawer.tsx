"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface DrawerProps {
  /** On the screen at all. Closed, nothing is drawn. */
  open: boolean;
  /** The handle and Escape close it for good; so do the buttons inside. */
  onClose: () => void;
  /** The drawer's accessible name. */
  label: string;
  closeLabel?: string;
  children: ReactNode;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A drawer that comes up from the foot of the phone screen, over the
 * navigation pill while it is open, and leaves the page behind it alone: no
 * scrim, nothing inert, so she can keep reading and scrolling. Its handle is a
 * real button that closes it, so nothing needs dragging (WCAG 2.2 SC 2.5.7),
 * and Escape closes it too. Closed, nothing of it stays on the screen, so the
 * navigation is back at once. Focus
 * moves in when it opens and goes back to what opened it when it closes.
 *
 * Where a Sheet blocks the screen for one job, this holds something she may
 * want beside the page.
 */
export function Drawer({ open, onClose, label, closeLabel = "Close", children, inline = false, className }: DrawerProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
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
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && panel.current?.contains(document.activeElement)) {
        event.preventDefault();
        latest.current();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.setTimeout(() => {
        if (opener?.isConnected) opener.focus();
      }, 0);
    };
  }, [open]);

  const classes = ["drawer", inline ? "drawer--inline" : null, className].filter(Boolean).join(" ");
  const drawer = open ? (
    <div className={classes}>
      <section className="drawer__panel" aria-label={label} ref={panel}>
        <button type="button" className="drawer__grab" aria-label={closeLabel} onClick={onClose} />
        {children}
      </section>
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
