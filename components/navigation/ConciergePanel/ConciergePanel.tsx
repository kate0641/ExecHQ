"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { Icon } from "@/components/primitives/Icon";

export interface ConciergePanelProps {
  /** `sheet` rises over the phone screen; `card` is the centred card the pill
   *  grows into on tablet and web. */
  mode?: "sheet" | "card";
  /** The conversation, or what to start with. */
  children: ReactNode;
  /** The composer and anything above it. */
  footer?: ReactNode;
  /** The panel's accessible name. */
  label?: string;
  name?: string;
  role?: string;
  /** Whether the advisor's name sits in the top bar. Off before anything is
   *  asked, when the start screen introduces him itself, above the questions:
   *  the top bar then holds only New and Close. */
  whoInHead?: boolean;
  newLabel?: string;
  closeLabel?: string;
  onNew?: () => void;
  onClose?: () => void;
  id?: string;
  /** Catalogue only: shows the close button in a state a static page can't
   *  reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/** Open, the panel is modal on every viewport, so it is a dialog. (Not a
 *  `<dialog>`, whose own positioning would fight the card's morph.) */
const DIALOG = { role: "dialog", "aria-modal": true } as const;

/**
 * The Concierge's panel: the advisor's name at the top, the conversation, and
 * the composer at the foot. What goes in it is the concept's business; this
 * is the frame.
 */
export function ConciergePanel({
  mode = "card",
  children,
  footer,
  label = "ExecHQ, your advisor",
  name = "ExecHQ",
  role = "Your advisor",
  whoInHead = true,
  newLabel = "New",
  closeLabel = "Close the advisor",
  onNew,
  onClose,
  id,
  demo,
  className,
}: ConciergePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ from: number; dy: number } | null>(null);
  // Before anything is asked, the sheet has no top bar: it closes by tapping
  // above it or pulling it down. The close button stays for keyboards and
  // screen readers, out of sight until focused.
  const bare = mode === "sheet" && !whoInHead;

  function onDown(event: PointerEvent<HTMLElement>) {
    drag.current = { from: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    panelRef.current?.classList.add("is-dragging");
  }
  function onMove(event: PointerEvent<HTMLElement>) {
    if (!drag.current || !panelRef.current) return;
    drag.current.dy = Math.max(0, event.clientY - drag.current.from);
    panelRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  }
  function onUp() {
    const moved = drag.current?.dy ?? 0;
    drag.current = null;
    panelRef.current?.classList.remove("is-dragging");
    if (panelRef.current) panelRef.current.style.transform = "";
    if (moved > 80) onClose?.();
  }

  return (
    <div
      ref={panelRef}
      id={id}
      className={["concierge-panel", `concierge-panel--${mode}`, className].filter(Boolean).join(" ")}
      aria-label={label}
      {...DIALOG}
    >
      {mode === "sheet" ? (
        <span
          className="concierge-panel__grab"
          aria-hidden="true"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      ) : null}
      <div className={["concierge-panel__head", bare ? "concierge-panel__head--bare" : null].filter(Boolean).join(" ")}>
        {whoInHead ? <AdvisorWho name={name} role={role} /> : <span className="concierge-panel__who" />}
        {onNew ? (
          <button type="button" className="concierge-panel__new" onClick={onNew}>
            {newLabel}
          </button>
        ) : null}
        {onClose ? (
          <button
            type="button"
            className={["concierge-panel__close", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            onClick={onClose}
            title={closeLabel}
          >
            <Icon name="close" size={20} />
            <span className="u-visually-hidden">{closeLabel}</span>
          </button>
        ) : null}
      </div>
      <div className="concierge-panel__body">{children}</div>
      <div className="concierge-panel__foot">
        {footer}
      </div>
    </div>
  );
}

/** The advisor's mark, name and role. */
export function AdvisorWho({ name = "ExecHQ", role = "Your advisor", className }: { name?: string; role?: string; className?: string }) {
  return (
    <span className={["concierge-who", className].filter(Boolean).join(" ")}>
      <AdvisorMark size={22} />
      <span className="concierge-panel__who">
        <b>{name}</b>
        <span>{role}</span>
      </span>
    </span>
  );
}

export default ConciergePanel;
