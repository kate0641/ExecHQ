export interface ThisWeekCardProps {
  /** Small label above, e.g. "This week". */
  label: string;
  title: string;
  detail: string;
  /** Lead-in for the reason, e.g. "Why now:". */
  whyLabel: string;
  why: string;
  className?: string;
}

/**
 * The one thing to do first, lifted out of the plan on a dark card so it is
 * the first thing read after the plan's name. It says what, a line of detail,
 * and why now. No effort estimate here: onboarding carries none.
 */
export function ThisWeekCard({ label, title, detail, whyLabel, why, className }: ThisWeekCardProps) {
  return (
    <section className={["feature-card", className].filter(Boolean).join(" ")} aria-label={label}>
      <div className="feature-card__head feature-card__head--inverse">
        <p className="feature-card__eyebrow">{label}</p>
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThisWeekCard;
