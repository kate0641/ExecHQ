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
  // Clicking the backdrop closes the panel. The listener is attached to the
  // element rather than passed as a JSX prop because the backdrop is part of the
  // dialog itself and has no element of its own to put a handler on. Escape is
  // the keyboard equivalent and is handled natively by <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClick(event: MouseEvent) {
      if (event.target === dialog) onClose();
    }

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
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
