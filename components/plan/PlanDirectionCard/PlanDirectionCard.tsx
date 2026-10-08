"use client";

import { useState } from "react";
import { PlanDetailSheet } from "@/components/plan/PlanDetailSheet";
import { Icon } from "@/components/primitives/Icon";
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
  /** Catalogue only: opens the detail. */
  demoOpen?: boolean;
  className?: string;
}

/**
 * Her direction, quoted in her own words, at the head of the road it leads to. The whole card is one
 * button: it opens the plan detail, the same sheet Concept 1's Edit opens, where she sees her plan and
 * its stages and can start the flow that changes her direction.
 */
export function PlanDirectionCard({ planId, rationale, stage, direction, edited, editHref, demoOpen, className }: PlanDirectionCardProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  return (
    <>
      <button type="button" className={["plan-direction", className].filter(Boolean).join(" ")} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span className="plan-direction__label">{C.label}</span>
        <q className="plan-direction__quote">{direction}</q>
        <span className="plan-direction__more">
          {C.more}
          <Icon name="arrow-right" size={14} />
        </span>
      </button>
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
    </>
  );
}

export default PlanDirectionCard;
