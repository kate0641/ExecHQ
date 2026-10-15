import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY, type FigureView } from "@/mock/enterprise";

const C = ENTERPRISE_COPY;

export interface CohortFigureProps {
  figure: FigureView;
  /** `lg` for the one figure a section leads with. */
  size?: "md" | "lg";
  /** Opens the figure's definition, source and window. Every figure has one,
   *  so a page always passes it; the catalogue may leave it off. */
  onExplain?: () => void;
  /** Whether that definition is open now. */
  explaining?: boolean;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One cohort-level figure: what it is, the number, and what it is out of.
 *
 * It has three states, each designed with the same care. Shown. Filling in,
 * while the program is younger than the window, with the program's age
 * stated. Hidden, while too few participants are active, which names the
 * rule rather than apologising for it. Nothing here reads as a score: no
 * target, no comparison, no colour carrying meaning.
 */
export function CohortFigure({ figure, size = "md", onExplain, explaining, demo, className }: CohortFigureProps) {
  const classes = ["cohort-figure", `cohort-figure--${size}`, `cohort-figure--${figure.state}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <p className="cohort-figure__label">{figure.label}</p>

      {figure.state === "suppressed" ? (
        <p className="cohort-figure__hidden">
          <Icon name="lock" size={size === "lg" ? 20 : 16} />
          {C.hidden}
        </p>
      ) : (
        <p className="cohort-figure__value">
          {figure.value}
          {figure.detail ? <span className="cohort-figure__detail">{figure.detail}</span> : null}
        </p>
      )}

      {figure.state === "filling" ? (
        <Badge tone="neutral" className="cohort-figure__tag">
          {C.fillingTag}
        </Badge>
      ) : null}
      {figure.note ? <p className="cohort-figure__note">{figure.note}</p> : null}

      {onExplain || demo ? (
        <button
          type="button"
          className={["cohort-figure__explain", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
          aria-expanded={explaining ?? false}
          onClick={onExplain}
        >
          {C.definition.open}
          <span className="u-visually-hidden">: {figure.label}</span>
        </button>
      ) : null}
    </div>
  );
}

export default CohortFigure;
