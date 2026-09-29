import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface NextStepCardProps {
  /** The one action. */
  title: string;
  /** Why this, why now, why you. Any can be left out. */
  why?: { this?: string; now?: string; you?: string };
  /** `rows`: all three as label and value rows. `folded`: why now as one
   *  line, with why this and why you behind "Why this, for you". */
  whyStyle?: "rows" | "folded";
  foldLabel?: string;
  /** Where it starts: its Toolbox flow. Stubbed until Sprint 4. */
  href: string;
  actionLabel?: string;
  /** A line above the title, e.g. "Your next step". */
  eyebrow?: string;
  /** What just happened, shown before the step: the just-answered readback. */
  lead?: ReactNode;
  /** Marks the step as a stand-in until Sprint 3 connects the Plan. Always
   *  visible when set, so no reviewer mistakes it for a live recommendation. */
  stubbed?: boolean;
  stubbedLabel?: string;
  /** Keep the title for assistive technology only, when a concept already
   *  shows it large elsewhere (e.g. inside a ring). */
  titleHidden?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * One action, with the reasons for it — why this, why now, why you — and
 * the way into its Toolbox flow. The reasons show as label and value rows,
 * or folded: why now in one line, the other two a tap away in a native
 * disclosure, so it needs no script and works from the keyboard.
 */
export function NextStepCard({
  title,
  why = {},
  whyStyle = "rows",
  foldLabel = "Why this, for you",
  href,
  actionLabel = "Start in the Toolbox",
  eyebrow = "Your next step",
  lead,
  stubbed = false,
  stubbedLabel = "Stubbed · Sprint 3 connects this",
  titleHidden = false,
  headingId = "next-step-title",
  className,
}: NextStepCardProps) {
  const rows = [
    ["Why this", why.this],
    ["Why now", why.now],
    ["Why you", why.you],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  return (
    <section className={["home-card", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {lead ? <div className="home-card__lead">{lead}</div> : null}
      <div className={stubbed ? "home-card__inset" : "home-card__stack"}>
        {stubbed ? <span className="home-card__stub">{stubbedLabel}</span> : null}
        <p className="home-card__eyebrow">{eyebrow}</p>
        <h2 className={titleHidden ? "u-visually-hidden" : "home-card__title"} id={headingId} tabIndex={-1}>
          {title}
        </h2>
        {whyStyle === "folded" ? (
          <>
            {why.now ? (
              <p className="home-card__whynow">
                <b>Why now:</b> {why.now}
              </p>
            ) : null}
            {why.this || why.you ? (
              <details className="home-card__fold">
                <summary>
                  {foldLabel}
                  <Icon name="chevron" size={12} />
                </summary>
                <dl>
                  {why.this ? (
                    <div>
                      <dt>Why this</dt>
                      <dd>{why.this}</dd>
                    </div>
                  ) : null}
                  {why.you ? (
                    <div>
                      <dt>Why you</dt>
                      <dd>{why.you}</dd>
                    </div>
                  ) : null}
                </dl>
              </details>
            ) : null}
          </>
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
      <Link href={href} className="btn btn--primary btn--md btn--full">
        {actionLabel}
        <Icon name="chevron" size={16} />
      </Link>
    </section>
  );
}

export default NextStepCard;
