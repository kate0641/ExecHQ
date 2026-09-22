"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export type CanvasSectionState = "pending" | "active" | "complete";

export interface CanvasSectionProps {
  /** The section's name. Always the heading, in every state. */
  label: string;
  state: CanvasSectionState;
  headingLevel?: 2 | 3;
  /** Id on the heading, so the canvas can move focus to a section as it opens. */
  headingId?: string;
  /** What the user decided. Shown once the section is complete. */
  summary?: ReactNode;
  /** Shown in the pending state: what this section will ask for. One line. */
  hint?: string;
  /** The section's controls. Rendered only while it is active. */
  children?: ReactNode;
  /** Reopens a completed section. Omit where a section cannot be revisited. */
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
}

/**
 * One section of the living canvas.
 *
 * The canvas shows all of its sections from the first paint, which is the whole
 * idea: the user can see the shape of the page they are filling in rather than
 * discovering it one screen at a time. That only works if a section that has
 * not been reached costs almost nothing to look at — so `pending` is a single
 * muted line naming what it will ask, never a preview of the controls.
 *
 * Exactly one section is `active`, and only that one renders its controls. A
 * completed section collapses to its answer with a way back in, so revisiting a
 * decision never means losing your place on the page.
 *
 * The heading is present and at the same level in all three states, so the
 * page's outline stays stable as it fills in rather than growing new levels.
 */
export function CanvasSection({
  label,
  state,
  headingLevel = 2,
  headingId,
  summary,
  hint,
  children,
  onEdit,
  editLabel = "Change",
  className,
}: CanvasSectionProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <section
      className={["section", `section--${state}`, className]
        .filter(Boolean)
        .join(" ")}
      aria-current={state === "active" ? "step" : undefined}
    >
      <div className="section__head">
        <Heading className="section__label" id={headingId} tabIndex={-1}>
          {label}
        </Heading>

        {state === "complete" ? (
          <span className="section__done" aria-hidden="true">
            <Icon name="check" size={15} />
          </span>
        ) : null}
      </div>

      {state === "pending" && hint ? (
        <p className="section__hint">{hint}</p>
      ) : null}

      {state === "complete" ? (
        <div className="section__summary">
          <div className="section__summary-text">{summary}</div>
          {onEdit ? (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              {editLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

      {state === "active" && children ? (
        <div className="section__body">{children}</div>
      ) : null}
    </section>
  );
}

export default CanvasSection;
