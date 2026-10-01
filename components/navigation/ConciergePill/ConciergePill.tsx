import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface ConciergePillProps {
  /** Where you are: shown in the dark chip at the start. */
  here: { label: string; icon: IconName };
  /** The prompt beside it. */
  ask?: string;
  /** A follow-up is due: the quiet dot. Never a count. */
  followUpDue?: boolean;
  expanded?: boolean;
  /** The id of the panel it opens. */
  controls?: string;
  onClick?: () => void;
  id?: string;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The Concierge's way in, on every signed-in page: where you are, and "Ask
 * or go". It opens the advisor, who can take you anywhere, log what happened,
 * or talk it through.
 */
export function ConciergePill({
  here,
  ask = "Ask or go",
  followUpDue = false,
  expanded = false,
  controls,
  onClick,
  id,
  demo,
  className,
}: ConciergePillProps) {
  return (
    <button
      type="button"
      id={id}
      className={["concierge-pill", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className="concierge-pill__here">
        <Icon name={here.icon} size={18} />
        <span>
          <span className="u-visually-hidden">You’re on </span>
          {here.label}
          <span className="u-visually-hidden">. </span>
        </span>
      </span>
      <span className="concierge-pill__ask">{ask}</span>
      {followUpDue ? (
        <>
          <span className="concierge-pill__dot" aria-hidden="true" />
          <span className="u-visually-hidden">. A follow-up is waiting</span>
        </>
      ) : null}
      <AdvisorMark size={20} className="concierge-pill__mark" />
    </button>
  );
}

export default ConciergePill;
