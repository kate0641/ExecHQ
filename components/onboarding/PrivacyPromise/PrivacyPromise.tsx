import { Icon } from "@/components/primitives/Icon";

export interface PrivacyPromiseProps {
  /** Omit where the surrounding step already carries the heading, so the page
   *  does not end up with the same words twice in the heading outline. */
  heading?: string;
  /** One statement per line. Each is a complete sentence and stands alone. */
  statements: readonly string[];
  headingLevel?: 1 | 2;
  className?: string;
}

/**
 * The privacy promise, as its own moment.
 *
 * The PRD calls the ordering a trust-building requirement, and the brief is
 * explicit that this is not a footnote or a checkbox beside another field. So
 * it is a screen's worth of content with nothing to fill in and nothing to
 * agree to — there is no consent here to withhold, only a statement of fact.
 *
 * Deliberately short. Brand guidance is calm authority, not legal boilerplate,
 * and a wall of text would read as terms rather than as a promise.
 */
export function PrivacyPromise({
  heading,
  statements,
  headingLevel = 1,
  className,
}: PrivacyPromiseProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={["privacy", className].filter(Boolean).join(" ")}>
      <span className="privacy__mark">
        <Icon name="shield" size={28} />
      </span>
      {heading ? <Heading className="privacy__heading">{heading}</Heading> : null}
      <ul className="privacy__list">
        {statements.map((statement) => (
          <li className="privacy__statement" key={statement}>
            {statement}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrivacyPromise;
