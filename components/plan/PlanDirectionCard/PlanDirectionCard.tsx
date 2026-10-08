"use client";

import { useId, useState } from "react";
import { PlanDetailSheet } from "@/components/plan/PlanDetailSheet";
import { Icon } from "@/components/primitives/Icon";
import { setDirectionFolded, useDirectionFolded } from "@/lib/direction-fold";
import { PLAN_DIRECTION_CARD_COPY as C } from "@/mock/plan";

export interface PlanDirectionCardProps {
  planId: string;
  rationale: string;
  /** The stage she is in, from 0. */
  stage: number;
  /** Her direction, in her own words. */
  direction: string;
  edited?: boolean;
  /** Where "Change my direction" goes: the edit flow. */
  editHref: string;
  /** Catalogue only: folded or open, ignoring what her device remembers. */
  demoFolded?: boolean;
  /** Catalogue only: opens the detail. */
  demoOpen?: boolean;
  /** Catalogue only: shows a control's hover or focus. */
  demoState?: "hover" | "focus";
  className?: string;
}

/**
 * Her direction, quoted in her own words, at the head of the road it leads to. The head row folds the
 * quote away, and remembers that, and keeps "See your plan", which opens the plan detail: the same sheet
 * Concept 1's Edit opens, where she sees her plan and its stages and can start the flow that changes
 * her direction.
 */
export function PlanDirectionCard({ planId, rationale, stage, direction, edited, editHref, demoFolded, demoOpen, demoState, className }: PlanDirectionCardProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  // Folding it away is remembered on her device, so it stays out of the way once she has read it.
  // The catalogue's variants set it themselves and leave what her device remembers alone.
  const stored = useDirectionFolded();
  const [demoFoldedNow, setDemoFoldedNow] = useState(demoFolded);
  const folded = demoFoldedNow ?? stored;
  const quoteId = useId();

  function toggle() {
    if (demoFoldedNow !== undefined) setDemoFoldedNow(!folded);
    else setDirectionFolded(!folded);
  }

  const demo = demoState ? `is-${demoState}` : undefined;
  return (
    <section className={["plan-direction", folded ? null : "is-open", className].filter(Boolean).join(" ")} aria-label={C.label}>
      <div className="plan-direction__head">
        <button type="button" className={["plan-direction__toggle", demo].filter(Boolean).join(" ")} aria-expanded={!folded} aria-controls={quoteId} onClick={toggle}>
          {C.label}
          <Icon name="chevron-down" size={14} />
        </button>
        <button type="button" className={["plan-direction__more", demo].filter(Boolean).join(" ")} aria-haspopup="dialog" onClick={() => setOpen(true)}>
          {C.more}
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
      <p className="plan-direction__quote" id={quoteId} hidden={folded}>
        <q>{direction}</q>
      </p>
      <PlanDetailSheet
        open={open}
        onClose={() => setOpen(false)}
        planId={planId}
        rationale={rationale}
        stage={stage}
        direction={direction}
        edited={edited}
        editHref={editHref}
        inline={demoOpen}
      />
    </section>
  );
}

export default PlanDirectionCard;
