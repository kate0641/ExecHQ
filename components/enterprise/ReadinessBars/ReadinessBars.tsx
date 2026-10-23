import { READINESS_COPY as C } from "@/mock/enterprise";

export interface ReadinessBarsProps {
  /** How many answered 1 to 5, at the start and now: the same people. */
  start: number[];
  now: number[];
  className?: string;
}

/**
 * The readiness pulse's spread (Concept 1b, Kate, 2026-10-23): two bars of
 * the same width, at the start and now, each split into the five answers
 * from lightest (1, not at all) to darkest (5, very), so a shift to the right
 * reads at a glance. A legend names the five. Each bar's counts are said in
 * words to a screen reader, in place of the drawing.
 */
export function ReadinessBars({ start, now, className }: ReadinessBarsProps) {
  const row = (label: string, spread: number[]) => {
    const total = spread.reduce((sum, n) => sum + n, 0);
    return (
      <div className="readiness-bars__row">
        <span className="readiness-bars__label" aria-hidden="true">
          {label}
        </span>
        <span className="u-visually-hidden">{C.spreadLabel(label, spread)}</span>
        <span className="readiness-bars__bar" aria-hidden="true">
          {spread.map((n, i) =>
            n > 0 ? <i key={i} className={`readiness-bars__part readiness-bars__part--${i + 1}`} style={{ width: `${(n / total) * 100}%` }} /> : null,
          )}
        </span>
      </div>
    );
  };
  return (
    <div className={["readiness-bars", className].filter(Boolean).join(" ")}>
      {row(C.start, start)}
      {row(C.now, now)}
      <p className="readiness-bars__legend" aria-hidden="true">
        {C.scale.map((label, i) => (
          <span key={label}>
            <i className={`readiness-bars__part readiness-bars__part--${i + 1}`} />
            {label}
          </span>
        ))}
      </p>
    </div>
  );
}

export default ReadinessBars;
