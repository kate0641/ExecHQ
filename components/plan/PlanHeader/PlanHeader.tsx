"use client";

import { useState } from "react";
import { PlanDetailSheet } from "@/components/plan/PlanDetailSheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { PLAN_HEADER_COPY as C } from "@/mock/plan";

export interface PlanHeaderProps {
  planId: string;
  rationale: string;
  /** The stage she is in, from 0. */
  stage: number;
  direction: string;
  edited?: boolean;
  /** Where the edit flow starts. */
  editHref: string;
  /** Catalogue only: opens the detail. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Says what her plan is, before her next steps: its name, and one line on what it is built
 * around. Edit sits beside the name and opens the detail, where she can see her direction and
 * start the flow that changes it.
 */
export function PlanHeader({ planId, rationale, stage, direction, edited, editHref, demoOpen, headingId = "plan-header", className }: PlanHeaderProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  if (!template) return null;
  return (
    <section className={["plan-header", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <p className="plan-header__label">{C.label}</p>
      <div className="plan-header__top">
        <h2 className="plan-header__name" id={headingId}>
          {template.name}
        </h2>
        <Button className="plan-header__edit" variant="secondary" size="sm" aria-label={C.editName(template.name)} onClick={() => setOpen(true)}>
          <Icon name="pencil" size={14} />
          {C.edit}
        </Button>
      </div>
      <p className="plan-header__line">{C.line(template.emphasis)}</p>
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

export default PlanHeader;
