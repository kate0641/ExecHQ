"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** The dialog's accessible name. */
  label: string;
  /** Where focus goes on close, when the control that opened the sheet has
   *  been replaced while it was open. Defaults to the opener. */
  returnFocusTo?: () => HTMLElement | null;
  children: ReactNode;
  /** Render in place instead of over the device screen. For the catalogue,
   *  where there is no screen to cover. */
  inline?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A sheet that slides up over the phone screen, not the browser window.
 *
 * A native modal `<dialog>` would sit in the top layer and cover the whole
 * window, escaping the simulated device, so this one is drawn over the
 * device screen and does the modal work itself: it moves focus in, keeps Tab
 * inside, closes on Escape, makes the screen behind it inert, and gives focus
 * back to whatever opened it.
 */
export function Sheet({
  open,
  onClose,
  label,
  children,
  returnFocusTo,
  inline = false,
  className,
}: SheetProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  // The latest handlers, so the modal setup runs once per opening rather than
  // on every render.
  const handlers = useRef({ onClose, returnFocusTo });
  useEffect(() => {
    handlers.current = { onClose, returnFocusTo };
  });

  // Find the device screen this sheet belongs to, from where it is mounted.
  useEffect(() => {
    if (inline) return;
    setHost(anchor.current?.closest(".device__screen") ?? null);
  }, [inline]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const content = host?.querySelector<HTMLElement>(".device__content");
    if (content) content.inert = true;
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handlers.current.onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (content) content.inert = false;
      // After React has swapped in whatever replaced the opener. A timeout,
      // not an animation frame: frames pause in a background tab.
      window.setTimeout(() => {
        const target = opener?.isConnected ? opener : handlers.current.returnFocusTo?.();
        target?.focus();
      }, 0);
    };
  }, [open, host]);

  const sheet = open ? (
    <div className={["sheet", inline ? "sheet--inline" : null, className].filter(Boolean).join(" ")}>
      {/* The scrim closes on a pointer tap; Escape and the sheet's own close
          button are the keyboard routes, so it is hidden from the tab order. */}
      <div className="sheet__scrim" onClick={onClose} aria-hidden="true" />
      {/* Opened with the attribute, not showModal(): the top layer would put it
          over the whole window instead of the phone. The modal behaviour is
          done by hand above. */}
      <dialog className="sheet__panel" open aria-modal="true" aria-label={label} ref={panel}>
        <span className="sheet__grab" aria-hidden="true" />
        {children}
      </dialog>
    </div>
  ) : null;

  return (
    <>
      <span ref={anchor} hidden />
      {inline || !host ? sheet : sheet && createPortal(sheet, host)}
    </>
  );
}

export default Sheet;
