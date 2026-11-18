export interface MeterProps {
  /** How full, from 0 to 1. */
  fraction: number;
  /** A ring for the one figure a card leads with; a bar everywhere else. */
  kind?: "ring" | "bar";
  /** Secondary ink while the window is still filling in, matching the number. */
  muted?: boolean;
  /** What sits in the ring's middle: the figure's number. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * A share drawn as a ring or a bar, beside the number it repeats. It is
 * decoration for a screen reader, which hears the number and what it is
 * out of from the figure itself. Never drawn for a hidden figure: an empty
 * ring would read as nought. One ink and one track, no colour carrying
 * meaning.
 */
export function Meter({ fraction, kind = "bar", muted, children, className }: MeterProps) {
  const full = Math.min(1, Math.max(0, fraction));
  const classes = ["meter", `meter--${kind}`, muted ? "meter--muted" : null, className].filter(Boolean).join(" ");

  if (kind === "ring") {
    // A 36-unit box: radius 15.9155 makes the circumference 100, so the
    // dash length is the percentage.
    return (
      <span className={classes}>
        <svg className="meter__ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle className="meter__track" cx="18" cy="18" r="15.9155" />
          <circle className="meter__fill" cx="18" cy="18" r="15.9155" strokeDasharray={`${full * 100} 100`} />
        </svg>
        {children ? <span className="meter__middle">{children}</span> : null}
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden="true">
      <span className="meter__fill" style={{ inlineSize: `${full * 100}%` }} />
    </span>
  );
}

export default Meter;
