export type StepHeadingLevel = 1 | 2 | 3;

export interface StepHeaderProps {
  /** The question or statement this step is asking. Becomes the heading. */
  title: string;
  /** Small context line above the title, e.g. "Your direction". */
  eyebrow?: string;
  /** One supporting sentence. Anything longer belongs in the step body. */
  description?: string;
  /** h1 by default: each step is the page in a single-focus concept. Drop it to
   *  h2 or h3 where steps accumulate on one page and h1 is already spent. */
  headingLevel?: StepHeadingLevel;
  /** Marks the heading as the focus target for a step change. The concept moves
   *  focus here so it is never left on a control that has been replaced. */
  id?: string;
  className?: string;
}

/**
 * The top of an onboarding step: context, the question, and at most one
 * supporting sentence.
 *
 * The heading is focusable via `tabIndex={-1}` but not in the tab order, which
 * is what lets a concept move focus to it when the step changes.
 */
export function StepHeader({
  title,
  eyebrow,
  description,
  headingLevel = 1,
  id,
  className,
}: StepHeaderProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <header className={["step-header", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
      <Heading className="step-header__title" id={id} tabIndex={-1}>
        {title}
      </Heading>
      {description ? (
        <p className="step-header__description">{description}</p>
      ) : null}
    </header>
  );
}

export default StepHeader;
