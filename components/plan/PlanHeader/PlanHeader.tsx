"use client";

import { useState } from "react";
import { PlanDetailSheet } from "@/components/plan/PlanDetailSheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { AGENDA_COPY as A, PLAN_HEADER_COPY as C, roadmapFor } from "@/mock/plan";

export interface PlanHeaderProps {
  planId: string;
  rationale: string;
  /** The stage she is in, from 0. */
  stage: number;
  direction: string;
  edited?: boolean;
  /** Where the edit flow starts. */
  editHref: string;
  /** The plan's name is the page's heading, so it is an h1. False sets it as a section heading. */
  asPageTitle?: boolean;
  /** Catalogue only: opens the detail. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Says what her plan is, before her next steps, and is the page's heading: "Your plan" as a
 * small label, then the plan's name large with a plain Edit link beside it, one line on what it
 * is built around, and where she is in it. Edit opens the detail, where she can see her direction
 * and start the flow that changes it.
 */
export function PlanHeader({ planId, rationale, stage, direction, edited, editHref, asPageTitle = true, demoOpen, headingId = "plan-header", className }: PlanHeaderProps) {
  const [open, setOpen] = useState(Boolean(demoOpen));
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  if (!template) return null;
  const stages = roadmapFor(planId);
  const at = Math.min(Math.max(stage, 0), stages.length - 1);
  const Heading = asPageTitle ? "h1" : "h2";
  return (
    <section className={["plan-header", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <p className="plan-header__label">{C.label}</p>
      <div className="plan-header__top">
        <Heading className="plan-header__name" id={headingId}>
          {template.name}
        </Heading>
        <Button className="plan-header__edit" variant="ghost" size="sm" aria-label={C.editName(template.name)} onClick={() => setOpen(true)}>
          <Icon name="pencil" size={14} />
          {C.edit}
        </Button>
      </div>
      <p className="plan-header__line">{C.line(template.emphasis)}</p>
      {stages.length ? (
        <div className="plan-header__where">
          <div className="plan-header__segments" aria-hidden="true">
            {stages.map((s, i) => (
              <i key={s.title} className={i <= at ? "is-on" : undefined} />
            ))}
          </div>
          <p>
            <b>{A.stageOf(at + 1, stages.length)}</b> · {stages[at].title}
          </p>
        </div>
      ) : null}
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
