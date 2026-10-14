"use client";

import { useState, type ReactNode } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/primitives/Icon";
import { PLAN_AGENDA_COPY as A } from "@/mock/plan";

export interface RoadmapEntryProps {
  /** What the sheet holds: her direction and the roadmap. */
  children: ReactNode;
  /** Catalogue only: opens the sheet in place. */
  demoOpen?: boolean;
  /** Catalogue only: shows the card's focus. */
  demoState?: "focus";
  className?: string;
}

/**
 * The way into her roadmap from a move, on a phone and a tablet (designer, 2026-10-13): one card under
 * Why this matters, a lime chip with the plan's flag, "Your roadmap" and a chevron. It opens a sheet that
 * holds her direction and the stacked stages, so the move keeps the page to itself. On the web the roadmap
 * stays beside the page, where there is room for it.
 */
export function RoadmapEntry({ children, demoOpen, demoState, className }: RoadmapEntryProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  return (
    <>
      <button
        type="button"
        className={["roadmap-entry", demoState ? `is-${demoState}` : null, className].filter(Boolean).join(" ")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className="roadmap-entry__chip" aria-hidden="true">
          <Icon name="flag" size={20} />
        </span>
        <span className="roadmap-entry__title">{A.heading}</span>
        <Icon name="chevron" size={20} className="roadmap-entry__go" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} label={A.heading} inline={demoOpen} className="roadmap-sheet">
        {children}
      </Sheet>
    </>
  );
}

export default RoadmapEntry;
