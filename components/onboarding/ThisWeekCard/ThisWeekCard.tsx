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
    <section className={["this-week", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className="this-week__label">{label}</p>
      <p className="this-week__title">{title}</p>
      <p className="this-week__detail">{detail}</p>
      <p className="this-week__why">
        <b>{whyLabel}</b> {why}
      </p>
    </section>
  );
}

export default ThisWeekCard;
