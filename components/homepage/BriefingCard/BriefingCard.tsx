import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingCardProps {
  /** "Tuesday 20 October · 3 reads". */
  meta: string;
  /** The lead read's headline. */
  lead: string;
  /** Why it matters to the user, when it touches their plan. */
  why?: string;
  /** The other reads, headlines only. */
  others?: readonly string[];
  href: string;
  heading?: string;
  openLabel?: string;
  /** The close button's accessible name, which also says when it returns. */
  closeLabel?: string;
  onClose?: () => void;
  headingId?: string;
  /** Catalogue only: shows the close button in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Today's Briefing at the head of the homepage (Concept 2): the lead read and
 * why it matters, the other reads by headline, and the way in. It is its own
 * daily reading product, so it sits apart from the plan — a light card, never
 * the dark signal panel — and it can be closed for the day.
 */
export function BriefingCard({
  meta,
  lead,
  why,
  others = [],
  href,
  heading = "Today’s Briefing",
  openLabel = "Read today’s Briefing",
  closeLabel = "Close today’s Briefing",
  onClose,
  headingId = "briefing-card",
  demo,
  className,
}: BriefingCardProps) {
  return (
    <section className={["briefing-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="briefing-card__top">
        <p className="briefing-card__eyebrow">
          <Icon name="briefing" size={16} />
          <span className="briefing-card__label">
            <b id={headingId}>{heading}</b>
            <span>{meta}</span>
          </span>
        </p>
        {onClose ? (
          <button
            type="button"
            className={["briefing-card__close", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            aria-label={closeLabel}
            title={closeLabel}
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        ) : null}
      </div>
      <h2 className="briefing-card__lead">{lead}</h2>
      {why ? <p className="briefing-card__why">{why}</p> : null}
      {others.length ? (
        <ul className="briefing-card__others">
          {others.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : null}
      <Link href={href} className="link link--standalone briefing-card__open">
        {openLabel}
        <Icon name="chevron" size={14} />
      </Link>
    </section>
  );
}

export default BriefingCard;
