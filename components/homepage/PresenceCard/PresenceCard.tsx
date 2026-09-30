import Link from "next/link";
import { BaselineList, type BaselineRow } from "@/components/homepage/BaselineList";
import { Icon } from "@/components/primitives/Icon";

/** One kind of presence: the same shape as any baseline row. */
export type PresenceRow = BaselineRow;

export interface PresenceCardProps {
  name: string;
  /** A short mark in place of a logo. */
  mark: string;
  /** "Since 5 Oct": where the baseline is taken from. */
  asOf?: string;
  /** Column captions over the counts. */
  thenLabel?: string;
  nowLabel?: string;
  rows?: readonly PresenceRow[];
  /** One line under the rows, as a count and no more. */
  summary?: string;
  /** One thing to try. */
  tryThis?: { title: string; why: string; label: string; href: string };
  tryLabel?: string;
  /** Nothing added and no baseline: what adding would show, and where to do it. */
  invite?: { intro: string; shows?: readonly string[]; label: string; href: string };
  headingId: string;
  className?: string;
}

/**
 * The four things she adds herself, in one card on the homepage: podcast
 * appearances, press mentions, speaking engagements and thought pieces. Each
 * row sets the count on the day her plan began beside the count today, so the
 * baseline is always on view, and names what she added last.
 *
 * Nothing is found for her, so nothing here is ever a score or a target. A
 * count that has not moved says so by showing the same number twice.
 */
export function PresenceCard({
  name,
  mark,
  asOf,
  thenLabel = "Start",
  nowLabel = "Now",
  rows = [],
  summary,
  tryThis,
  tryLabel = "Try this",
  invite,
  headingId,
  className,
}: PresenceCardProps) {
  return (
    <section className={["account-card", "presence-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="account-card__top">
        <h3 className="account-card__name" id={headingId}>
          <span className="account-card__mark" aria-hidden="true">
            {mark}
          </span>
          {name}
        </h3>
        {asOf && !invite ? <span className="account-card__asof">{asOf}</span> : null}
      </div>
      {invite ? (
        <>
          <p className="account-card__text">{invite.intro}</p>
          {invite.shows?.length ? (
            <ul className="account-card__shows">
              {invite.shows.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <Link href={invite.href} className="btn btn--secondary btn--md account-card__cta">
            {invite.label}
            <Icon name="chevron" size={16} />
          </Link>
        </>
      ) : (
        <>
          <BaselineList rows={rows} thenLabel={thenLabel} nowLabel={nowLabel} />
          {summary ? <p className="presence-card__summary">{summary}</p> : null}
          {tryThis ? (
            <div className="account-card__try">
              <span className="account-card__try-label">{tryLabel}</span>
              <b>{tryThis.title}</b>
              <p>{tryThis.why}</p>
              <Link href={tryThis.href} className="btn btn--secondary btn--md account-card__cta">
                {tryThis.label}
                <Icon name="chevron" size={16} />
              </Link>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default PresenceCard;
