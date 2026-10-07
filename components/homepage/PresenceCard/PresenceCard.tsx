import Link from "next/link";
import type { BaselineRow } from "@/components/homepage/BaselineList";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PRESENCE_CARD_COPY as C } from "@/mock/accounts-stub";

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
  /** What she has added since she started, as a sentence of counts. Empty when nothing. */
  summary?: string;
  /** One thing to try. */
  tryThis?: { title: string; why: string; label: string; href: string };
  tryLabel?: string;
  /** Opens the add sheet. Shown under the rows, and in place of the link in
   *  `invite`. */
  onAdd?: () => void;
  addLabel?: string;
  /** Nothing added and no baseline: what adding would show, and where to do it. */
  invite?: { intro: string; shows?: readonly string[]; label: string; href: string };
  headingId: string;
  className?: string;
}

const toNumber = (value: number | string) => Number(String(value).replace(/,/g, ""));

/**
 * Where she started beside where she is now, in a light card like the rest of
 * the page. Her LinkedIn followers lead, large, with what they were and how
 * far they have moved; beneath them the counts she adds herself sit in
 * aligned Start and Now columns. "Added since you started" is always there,
 * as a sentence of what she has added, or a line saying nothing yet. One
 * quiet Add button, and the suggestion is its own card.
 *
 * Nothing is found for her, so nothing here is ever a score or a target. A
 * count that has not moved shows the same number twice.
 */
export function PresenceCard({
  name,
  mark,
  asOf,
  thenLabel = "Start",
  nowLabel = "Now",
  rows = [],
  summary,
  onAdd,
  addLabel = "Add one",
  tryThis,
  tryLabel = "Try this",
  invite,
  headingId,
  className,
}: PresenceCardProps) {
  if (!invite) {
    const hero = rows.find((row) => row.id === "linkedin");
    const counts = rows.filter((row) => row.id !== "linkedin");
    const gain = hero ? toNumber(hero.now) - toNumber(hero.then) : 0;
    return (
      <div className={["presence-clean", className].filter(Boolean).join(" ")}>
        <section className="presence-clean__card" aria-labelledby={headingId}>
          <div className="presence-clean__top">
            <h3 className="presence-clean__name" id={headingId}>
              {name}
            </h3>
            {asOf ? <span className="presence-clean__asof">{asOf}</span> : null}
          </div>
          {hero ? (
            <div className="presence-clean__hero">
              <span className="presence-clean__hero-label">{hero.label}</span>
              <span className="presence-clean__hero-now">{hero.now}</span>
              <span className="presence-clean__hero-sub">
                {gain > 0 ? (
                  <>
                    {C.was(String(hero.then))} · <b>{C.up(gain.toLocaleString("en-US"))}</b>
                  </>
                ) : (
                  C.sameAsStart(String(hero.then))
                )}
              </span>
            </div>
          ) : null}
          {counts.length ? (
            <table className="presence-clean__table">
              <thead>
                <tr>
                  <th scope="col">{C.counts}</th>
                  <th scope="col">{thenLabel}</th>
                  <th scope="col">{nowLabel}</th>
                </tr>
              </thead>
              <tbody>
                {counts.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{row.label}</th>
                    <td>{row.then}</td>
                    <td>{row.now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <div className="presence-clean__added">
            <h4>{C.addedHeading}</h4>
            <p>{summary || C.addedNone}</p>
          </div>
          {onAdd ? (
            <Button variant="secondary" className="presence-clean__add" onClick={onAdd}>
              <Icon name="plus" size={14} />
              {addLabel}
            </Button>
          ) : null}
        </section>
        {tryThis ? (
          <section className="presence-clean__try" aria-label={tryLabel}>
            <span className="presence-clean__try-label">{tryLabel}</span>
            <b>{tryThis.title}</b>
            <p>{tryThis.why}</p>
            <Link href={tryThis.href} className="btn btn--primary btn--md">
              {tryThis.label}
              <Icon name="chevron" size={16} />
            </Link>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <section className={["account-card", "presence-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="account-card__top">
        <h3 className="account-card__name" id={headingId}>
          <span className="account-card__mark" aria-hidden="true">
            {mark}
          </span>
          {name}
        </h3>
      </div>
      <p className="account-card__text">{invite.intro}</p>
      {invite.shows?.length ? (
        <ul className="account-card__shows">
          {invite.shows.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {onAdd ? (
        <Button variant="secondary" className="account-card__cta" onClick={onAdd}>
          {invite.label}
        </Button>
      ) : (
        <Link href={invite.href} className="btn btn--secondary btn--md account-card__cta">
          {invite.label}
          <Icon name="chevron" size={16} />
        </Link>
      )}
    </section>
  );
}

export default PresenceCard;
