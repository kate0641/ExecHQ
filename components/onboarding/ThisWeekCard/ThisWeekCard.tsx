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
 * The one thing to do first, lifted out of the plan as a feature card: a dark
 * head with the label and title, then the detail and why now, backed by a
 * sourced figure where there is one. No effort estimate: onboarding carries none.
 */
export function ThisWeekCard({ label, title, detail, whyLabel, why, fact, labelHidden, className }: ThisWeekCardProps) {
  return (
    <section className={["feature-card", className].filter(Boolean).join(" ")} aria-label={label}>
      <div className="feature-card__head feature-card__head--inverse">
        <p className={labelHidden ? "u-visually-hidden" : "feature-card__eyebrow"}>{label}</p>
        <p className="feature-card__title">{title}</p>
      </div>
      <div className="feature-card__body">
        <div className="feature-card__rows">
          <div className="feature-card__row">
            <p className="feature-card__text">{detail}</p>
          </div>
          <div className="feature-card__row">
            <p className="feature-card__label">{whyLabel.replace(/:\s*$/, "")}</p>
            <p className="feature-card__text">{why}</p>
            {fact ? (
              <p className={["feature-card__fact", fact.placeholder ? "is-placeholder" : null].filter(Boolean).join(" ")}>
                {fact.text}
                {fact.source ? <span className="feature-card__source">{fact.source}</span> : null}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThisWeekCard;
