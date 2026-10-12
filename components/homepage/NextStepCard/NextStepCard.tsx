import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface NextStepCardProps {
  /** The one action. */
  title: string;
  /** Why this, why now, why you. Any can be left out. */
  why?: { this?: string; now?: string; you?: string };
  /** The reasons as one sentence. When set, it shows in place of the rows. */
  whyLine?: string;
  /** Where it starts: its Toolbox flow. Stubbed until Sprint 4. */
  href: string;
  actionLabel?: string;
  /** Runs when she follows the main link, e.g. to mark the step started. */
  onAction?: () => void;
  /** A line above the title, e.g. "Your next step". */
  eyebrow?: string;
  /** What just happened, shown before the step: the just-answered readback. */
  lead?: ReactNode;
  /** A line under the eyebrow, before the title: what the step adds to. */
  context?: ReactNode;
  /** Marks the step as a stand-in until Sprint 3 connects the Plan. Always
   *  visible when set, so no reviewer mistakes it for a live recommendation. */
  stubbed?: boolean;
  stubbedLabel?: string;
  /** A second way on, under the main one: "I've done this", for a step with
   *  no draft that she can say she's done. */
  secondary?: { label: string; onClick: () => void };
  /** Keep the title for assistive technology only, when a concept already
   *  shows it large elsewhere (e.g. inside a ring). */
  titleHidden?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * One action, with the reasons for it — why this, why now, why you — and
 * the way into its Toolbox flow. The reasons show as label and value rows,
 * or as one sentence that says all three.
 */
export function NextStepCard({
  title,
  why = {},
  whyLine,
  href,
  actionLabel = "Start in the Toolbox",
  onAction,
  eyebrow = "Your next step",
  lead,
  context,
  stubbed = false,
  stubbedLabel = "Stubbed · Sprint 3 connects this",
  titleHidden = false,
  secondary,
  headingId = "next-step-title",
  className,
}: NextStepCardProps) {
  const rows = [
    ["Why this", why.this],
    ["Why now", why.now],
    ["Why you", why.you],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  // The plain card — eyebrow and title on top, the reasons as rows below — is
  // a feature card. Anything more above or around the title (a lead, a
  // context line, a stub, a title shown elsewhere, the one-sentence reasons)
  // keeps the earlier design until it is given one of its own.
  const feature = !lead && !context && !stubbed && !titleHidden && !whyLine;
  if (feature) {
    return (
      <section className={["feature-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
        {/* Navy, not pale blue: the next step is the page's main callout. */}
        <div className="feature-card__head feature-card__head--inverse">
          <p className="feature-card__eyebrow">{eyebrow}</p>
          <h2 className="feature-card__title" id={headingId} tabIndex={-1}>
            {title}
          </h2>
        </div>
        <div className="feature-card__body">
          {rows.length ? (
            <dl className="feature-card__rows">
              {rows.map(([term, text]) => (
                <div className="feature-card__row" key={term}>
                  <dt className="feature-card__label">{term}</dt>
                  <dd className="feature-card__text">{text}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <Link href={href} className="btn btn--primary btn--md btn--full" onClick={onAction}>
            {actionLabel}
            <Icon name="chevron" size={16} />
          </Link>
          {secondary ? (
            <Button variant="secondary" fullWidth onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </section>
    );
  }
  return (
    <section className={["home-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {lead ? <div className="home-card__lead">{lead}</div> : null}
      <div className={stubbed ? "home-card__inset" : "home-card__stack"}>
        {stubbed ? <span className="home-card__stub">{stubbedLabel}</span> : null}
        <p className="home-card__eyebrow">{eyebrow}</p>
        {context ? <div className="home-card__context">{context}</div> : null}
        <h2 className={titleHidden ? "u-visually-hidden" : "home-card__title"} id={headingId} tabIndex={-1}>
          {title}
        </h2>
        {whyLine ? (
          <p className="home-card__whyline">{whyLine}</p>
        ) : rows.length ? (
          <dl className="home-card__why">
            {rows.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      <Link href={href} className="btn btn--primary btn--md btn--full" onClick={onAction}>
        {actionLabel}
        <Icon name="chevron" size={16} />
      </Link>
      {secondary ? (
        <Button variant="secondary" fullWidth onClick={secondary.onClick}>
          {secondary.label}
        </Button>
      ) : null}
    </section>
  );
}

export default NextStepCard;
