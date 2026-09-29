import type { ReactNode } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { Icon } from "@/components/primitives/Icon";

export interface ConciergePanelProps {
  /** `sheet` rises over the phone screen; `docked` stands beside the page on
   *  tablet and web, which stays usable next to it. */
  mode?: "sheet" | "docked";
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

/**
 * The Concierge's panel: the advisor's name at the top, the conversation, and
 * the composer at the foot. What goes in it is the concept's business; this
 * is the frame.
 */
export function ConciergePanel({
  mode = "docked",
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
  const Tag = mode === "sheet" ? "div" : "aside";
  return (
    <Tag
      id={id}
      className={["concierge-panel", `concierge-panel--${mode}`, className].filter(Boolean).join(" ")}
      aria-label={label}
      {...(mode === "sheet" ? { role: "dialog", "aria-modal": true } : {})}
    >
      {mode === "sheet" ? <span className="concierge-panel__grab" aria-hidden="true" /> : null}
      <div className="concierge-panel__head">
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
    </Tag>
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
