export interface PartBarProps {
  part: number;
  whole: number;
  /** "19 used outside ExecHQ": the dark share, in words. */
  partLabel: string;
  /** "39 not marked as used": the rest, in words. */
  restLabel: string;
  className?: string;
}

/**
 * One whole, with the part of it that did something shaded dark
 * (2026-10-20): work made against work used. Both shares are said in words
 * under the bar, each beside a swatch, so neither depends on the shading
 * and a screen reader hears the words alone.
 */
export function PartBar({ part, whole, partLabel, restLabel, className }: PartBarProps) {
  const share = whole === 0 ? 0 : Math.min(100, Math.max(0, (part / whole) * 100));
  return (
    <figure className={["part-bar", className].filter(Boolean).join(" ")}>
      <span className="part-bar__track" aria-hidden="true">
        <span className="part-bar__part" style={{ inlineSize: `${share}%` }} />
      </span>
      <figcaption className="part-bar__legend">
        <span className="part-bar__key">
          <span className="part-bar__swatch part-bar__swatch--part" aria-hidden="true" />
          {partLabel}
        </span>
        <span className="part-bar__key">
          <span className="part-bar__swatch" aria-hidden="true" />
          {restLabel}
        </span>
      </figcaption>
    </figure>
  );
}

export default PartBar;
