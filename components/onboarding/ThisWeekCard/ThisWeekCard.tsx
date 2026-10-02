export interface ThisWeekCardProps {
  /** Small label above, e.g. "This week". */
  label: string;
  title: string;
  detail: string;
  /** Lead-in for the reason, e.g. "Why now:". */
  whyLabel: string;
  why: string;
  /** Data behind the reason, with where it comes from. */
  fact?: { text: string; source?: string; placeholder?: boolean };
  /** Where the page's own heading already says it, the label stays for
   *  assistive technology only. */
  labelHidden?: boolean;
  className?: string;
}

/**
 * The one thing to do first, lifted out of the plan on a dark card so it is
 * the first thing read after the plan's name. It says what, a line of detail,
 * and why now. No effort estimate here: onboarding carries none.
 */
export function ThisWeekCard({ label, title, detail, whyLabel, why, fact, labelHidden, className }: ThisWeekCardProps) {
  return (
    <section className={["this-week", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className={labelHidden ? "u-visually-hidden" : "this-week__label"}>{label}</p>
      <p className="this-week__title">{title}</p>
      <p className="this-week__detail">{detail}</p>
      <p className="this-week__why">
        <b>{whyLabel}</b> {why}
      </p>
      {fact ? (
        <p className={["this-week__fact", fact.placeholder ? "is-placeholder" : null].filter(Boolean).join(" ")}>
          {fact.text}
          {fact.source ? <span className="this-week__source">{fact.source}</span> : null}
        </p>
      ) : null}
    </section>
  );
}

export default ThisWeekCard;
