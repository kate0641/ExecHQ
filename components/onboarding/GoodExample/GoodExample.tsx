export interface GoodExampleProps {
  /** e.g. "What good looks like". */
  label: string;
  example: string;
  /** e.g. "Why it works". */
  whyLabel: string;
  why: string;
  className?: string;
}

/**
 * A strong example answer, and why it works: Concept 3's builder coaches as
 * it asks, by decision on 2026-09-24, so the user leaves with a better story
 * and knows how to tell it. An example, never a prefill: it is not the user's
 * answer and is never put in their field.
 */
export function GoodExample({ label, example, whyLabel, why, className }: GoodExampleProps) {
  return (
    <section className={["good-example", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className="good-example__label">{label}</p>
      <p className="good-example__example">{example}</p>
      <p className="good-example__why">
        <b>{whyLabel}:</b> {why}
      </p>
    </section>
  );
}

export default GoodExample;
