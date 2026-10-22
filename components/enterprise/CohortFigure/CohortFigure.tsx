"use client";

import { useRef } from "react";
import { FigurePopover } from "@/components/enterprise/FigurePopover";
import { Meter } from "@/components/enterprise/Meter";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY, directionText, type Direction, type FigureView, type Period } from "@/mock/enterprise";

const C = ENTERPRISE_COPY;

export interface CohortFigureProps {
  figure: FigureView;
  /** `lg` for the one figure a section leads with. */
  size?: "md" | "lg";
  /** Which way it moved since last week's update, when enough people are
   *  behind the change to say so (`directionFor`). */
  direction?: Direction;
  /** Draws the share as a ring (the number in its middle) or a bar under the
   *  number. Only for figures that are a share, and never while hidden. */
  meter?: "ring" | "bar";
  /** Opens how the figure is measured, from the info icon beside its name.
   *  Every figure has one, so a page always passes it; the catalogue may
   *  leave it off. */
  onExplain?: () => void;
  /** Whether its popover is open now. Pressing the icon again, Escape, the
   *  popover's close button or a press outside all call `onExplain` to shut
   *  it. */
  explaining?: boolean;
  /** The dates the page shows, for the popover's "Covers" line. */
  window?: Period;
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
 * target and no colour carrying meaning. The one comparison is a direction
 * since last week, in words with an arrow, never a count (Kate, 2026-10-20).
 */
export function CohortFigure({ figure, size = "md", direction, meter, onExplain, explaining, window = "30d", demo, className }: CohortFigureProps) {
  const icon = useRef<HTMLButtonElement>(null);
  const drawn = meter && figure.state !== "suppressed" && figure.fraction !== undefined ? meter : undefined;
  const muted = figure.state === "filling";
  const classes = ["cohort-figure", `cohort-figure--${size}`, `cohort-figure--${figure.state}`, drawn ? `cohort-figure--${drawn}` : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="cohort-figure__label">
        {figure.label}
        {onExplain || demo ? (
          <button
            ref={icon}
            type="button"
            className={["cohort-figure__explain", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            aria-expanded={explaining ?? false}
            aria-label={C.definition.measured(figure.label)}
            title={C.definition.open}
            onClick={onExplain}
          >
            <Icon name="info" size={16} />
          </button>
        ) : null}
        {explaining && onExplain ? <FigurePopover id={figure.id} window={window} onClose={onExplain} anchor={icon} /> : null}
      </div>

      {figure.state === "suppressed" ? (
        <p className="cohort-figure__hidden">
          <Icon name="lock" size={size === "lg" ? 20 : 16} />
          {C.hidden}
        </p>
      ) : drawn === "ring" ? (
        <p className="cohort-figure__ringed">
          <Meter kind="ring" fraction={figure.fraction!} muted={muted}>
            <span className="cohort-figure__value">{figure.value}</span>
          </Meter>
          {figure.detail ? <span className="cohort-figure__detail">{figure.detail}</span> : null}
        </p>
      ) : (
        <p className="cohort-figure__value">
          {figure.value}
          {figure.detail ? <span className="cohort-figure__detail">{figure.detail}</span> : null}
        </p>
      )}
      {drawn === "bar" ? <Meter fraction={figure.fraction!} muted={muted} className="cohort-figure__bar" /> : null}

      {direction && figure.state !== "suppressed" ? (
        <p className="cohort-figure__direction">
          <Icon name={direction === "up" ? "arrow-up" : "arrow-down"} size={14} />
          {directionText(figure.id, direction)}
        </p>
      ) : null}

      {figure.state === "filling" ? (
        <Badge tone="neutral" className="cohort-figure__tag">
          {C.fillingTag}
        </Badge>
      ) : null}
      {figure.note ? <p className="cohort-figure__note">{figure.note}</p> : null}

    </div>
  );
}

export default CohortFigure;
