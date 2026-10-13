"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface LibraryGroupProps {
  heading: string;
  /** How many artifacts it holds, beside a section's heading. A week shows
   *  none (Kate, 13 Oct). */
  count?: number;
  /**
   * - `section`: a plan area, opened and closed from its heading (Concept 2).
   * - `week`: a week on the timeline, always open (Concept 3).
   */
  layout: "section" | "week";
  /** Sections start open unless told otherwise. */
  startOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A group of artifacts in the library under one heading: a plan area that
 * opens and closes, with its count, or a week on the timeline.
 */
export function LibraryGroup({ heading, count, layout, startOpen = true, children, className }: LibraryGroupProps) {
  const [open, setOpen] = useState(startOpen);
  const bodyId = useId();
  const classes = ["library-group", `library-group--${layout}`, open ? "is-open" : null, className].filter(Boolean).join(" ");

  if (layout === "week") {
    return (
      <section className={classes} aria-label={heading}>
        <h3 className="library-group__heading">
          <span>{heading}</span>
        </h3>
        <div className="library-group__body">{children}</div>
      </section>
    );
  }

  return (
    <section className={classes}>
      <h3 className="library-group__heading">
        <button type="button" className="library-group__toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen(!open)}>
          <span>{heading}</span>
          {count !== undefined ? <span className="library-group__count">{count}</span> : null}
          <Icon name="chevron" size={16} className="library-group__chevron" />
        </button>
      </h3>
      <div className="library-group__body" id={bodyId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

export default LibraryGroup;
