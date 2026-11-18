"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface HubPanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The slide-out version of the hub, available from every page.
 *
 * Built on a native `<dialog>` opened with `showModal()`, so focus trapping,
 * Escape-to-close, returning focus to the trigger, and making the rest of the
 * page inert all come from the platform rather than from hand-rolled key
 * handlers. The only behaviour added here is moving initial focus to the close
 * button and closing on a backdrop click.
 *
 * The slide-in transition uses `@starting-style` and `allow-discrete`; where
 * those are unsupported the panel simply appears, which is fine, and
 * prefers-reduced-motion removes the transition entirely.
 */
export function HubPanel({ open, onClose, children }: HubPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Backdrop click and Escape. Both listeners are attached to the element rather
  // than passed as JSX props: the backdrop is part of the dialog itself and has
  // no element of its own, and <dialog> already handles Escape natively — this
  // handler only guarantees the same result where the native close request does
  // not reach the element. Closing twice is a no-op.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClick(event: MouseEvent) {
      if (event.target === dialog) onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      className="hub-panel"
      ref={dialogRef}
      aria-labelledby="hub-panel-title"
      // Fires for Escape as well as dialog.close(), so state stays in step.
      onClose={onClose}
    >
      <div className="hub-panel__inner">
        <header className="hub-panel__header">
          <h2 className="hub-panel__title" id="hub-panel-title">
            Prototype hub
          </h2>
          <button
            type="button"
            className="hub-panel__close"
            onClick={onClose}
            ref={closeRef}
          >
            <span aria-hidden="true">×</span>
            <span className="u-visually-hidden">Close the prototype hub</span>
          </button>
        </header>
        <div className="hub-panel__body">{children}</div>
      </div>
    </dialog>
  );
}

export default HubPanel;
