"use client";

import { useState } from "react";
import { PlanDetailSheet } from "@/components/plan/PlanDetailSheet";
import { Icon } from "@/components/primitives/Icon";
import { PLAN_DIRECTION_COPY as C } from "@/mock/plan";

export interface PlanDetailLinkProps {
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
  /** Catalogue only: shows the link's hover or focus. */
  demoState?: "hover" | "focus";
  className?: string;
}

/**
 * "See your plan", beside the roadmap's heading in the guided check-in. It opens the plan detail,
 * the same sheet Concept 1's Edit opens, where she sees her plan, its stages and her direction, and
 * can start the flow that changes her direction.
 */
export function PlanDetailLink({ planId, rationale, stage, direction, edited, editHref, demoOpen, demoState, className }: PlanDetailLinkProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  return (
    <>
      <button
        type="button"
        className={["plan-detail-link", demoState ? `is-${demoState}` : null, className].filter(Boolean).join(" ")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {C.more}
        <Icon name="arrow-right" size={14} />
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

export default PlanDetailLink;
