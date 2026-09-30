import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface AccountStat {
  value: string;
  label: string;
  note?: string;
}

export interface AccountCardProps {
  /** "LinkedIn", "Your website". */
  name: string;
  /** A short mark in place of a logo: "in", "www". */
  mark: string;
  /** Where the numbers came from and when: "Uploaded 18 Oct". Required when
   *  connected, because outside numbers go stale. */
  asOf?: string;
  stats?: readonly AccountStat[];
  /** Where she started and where she is now, on the one number that best
   *  shows it. A number that has not moved says so in `note`. */
  baseline?: { label: string; then: string; now: string; note?: string };
  /** The column captions over the pair. */
  thenLabel?: string;
  nowLabel?: string;
  /** A chart, such as a TrendLine. */
  chart?: ReactNode;
  /** What the numbers suggest about the user, in a sentence. */
  says?: string;
  saysLabel?: string;
  /** One thing to try, using the user's own work. */
  tryThis?: { title: string; why: string; label: string; href: string };
  tryLabel?: string;
  /** Not connected: what connecting would show, and where to do it. */
  invite?: { intro: string; shows?: readonly string[]; label: string; href: string };
  headingId: string;
  className?: string;
}

/**
 * One connected account on the homepage (Concept 2, Account cards): its
 * source and date, three headline numbers, where she started beside where she
 * is now, a chart, what they suggest about the user, and one thing to try. Not connected, it says what connecting
 * would show and links to where connections live.
 *
 * It sits in its own section, never in the next-step card. It says what
 * changed, never that the user's work caused it.
 */
export function AccountCard({
  name,
  mark,
  asOf,
  stats = [],
  baseline,
  thenLabel = "Start",
  nowLabel = "Now",
  chart,
  says,
  saysLabel = "What it suggests",
  tryThis,
  tryLabel = "Try this",
  invite,
  headingId,
  className,
}: AccountCardProps) {
  return (
    <section className={["account-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
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
          {stats.length ? (
            <ul className="account-card__stats">
              {stats.map((s) => (
                <li key={s.label}>
                  <b>{s.value}</b>
                  <span className="account-card__stat-label">{s.label}</span>
                  {s.note ? <span className="account-card__stat-note">{s.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {baseline ? (
            <p className="account-card__baseline">
              <span className="account-card__baseline-label">{baseline.label}</span>
              <span className="account-card__baseline-pair">
                <span>
                  <span className="u-visually-hidden">{thenLabel}: </span>
                  {baseline.then}
                </span>
                <span aria-hidden="true">→</span>
                <b>
                  <span className="u-visually-hidden">{nowLabel}: </span>
                  {baseline.now}
                </b>
              </span>
              {baseline.note ? <span className="account-card__baseline-note">{baseline.note}</span> : null}
            </p>
          ) : null}
          {chart}
          {says ? (
            <p className="account-card__says">
              <span>{saysLabel}</span>
              {says}
            </p>
          ) : null}
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

export default AccountCard;
