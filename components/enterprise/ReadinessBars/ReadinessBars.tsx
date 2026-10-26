import { READINESS_COPY as C } from "@/mock/enterprise";

export interface ReadinessBarsProps {
  /** How many gave each answer, lowest first, at the start and now: the
   *  same people. */
  start: number[];
  now: number[];
  className?: string;
}

/** The ramp's five shades, spread over however many answers there are:
 *  three answers take the lightest, the middle and the darkest. */
function shade(i: number, of: number): number {
  return of <= 1 ? 5 : Math.round((i / (of - 1)) * 4) + 1;
}

/**
 * The readiness pulse's spread (Concept 1b, Kate, 2026-10-23): two bars of
 * the same width, at the start and now, each split into the answers from
 * lightest (Not yet) to darkest (Ready), so a shift to the right
 * reads at a glance. A legend names the answers. Each bar's counts are said in
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
            n > 0 ? <i key={i} className={`readiness-bars__part readiness-bars__part--${shade(i, spread.length)}`} style={{ width: `${(n / total) * 100}%` }} /> : null,
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
            <i className={`readiness-bars__part readiness-bars__part--${shade(i, C.scale.length)}`} />
            {label}
          </span>
        ))}
      </p>
    </div>
  );
}

export default ReadinessBars;
