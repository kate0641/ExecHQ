export interface StepProgressProps {
  /** 1-based index of the step being shown. */
  current: number;
  total: number;
  /** How many of the trailing steps are optional. Those marks are drawn hollow,
   *  so "up to three questions" reads as up to, not three. */
  optionalFrom?: number;
  /** Names what is being counted, for the visually-hidden announcement. */
  label?: string;
  className?: string;
}

/**
 * Progress signalling without pressure.
 *
 * Deliberately not a percentage, a meter or a "nearly there" — the sequence has
 * a legitimate exit at almost every step, and a completion bar would frame
 * taking it as failing to finish. Marks show position and length, nothing else.
 *
 * The marks are decorative; the real statement is the visually-hidden sentence,
 * so a screen reader gets "Step 2 of 3" rather than a row of unexplained dots.
 */
export function StepProgress({
  current,
  total,
  optionalFrom,
  label = "Step",
  className,
}: StepProgressProps) {
  const marks = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className={["step-progress", className].filter(Boolean).join(" ")}>
      <p className="u-visually-hidden">
        {label} {current} of {total}
        {optionalFrom && optionalFrom <= total
          ? `. Steps ${optionalFrom} onward are optional.`
          : ""}
      </p>
      <span className="step-progress__marks" aria-hidden="true">
        {marks.map((mark) => {
          const isOptional = optionalFrom !== undefined && mark >= optionalFrom;
          const classes = [
            "step-progress__mark",
            mark === current ? "is-current" : null,
            mark < current ? "is-done" : null,
            isOptional ? "is-optional" : null,
          ]
            .filter(Boolean)
            .join(" ");
          return <span className={classes} key={mark} />;
        })}
      </span>
    </div>
  );
}

export default StepProgress;
