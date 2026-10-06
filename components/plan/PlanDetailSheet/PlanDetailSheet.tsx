"use client";

import Link from "next/link";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { PLAN_DETAIL_COPY as C, roadmapFor } from "@/mock/plan";
import { PLAN_TEMPLATES } from "@/mock/onboarding";

export interface PlanDetailSheetProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  /** Why this plan, tied to what she said in onboarding. */
  rationale: string;
  /** The stage she is in, from 0. */
  stage: number;
  /** Her direction, in her own words. */
  direction: string;
  /** She changed it since onboarding. */
  edited?: boolean;
  /** Where "Change my direction" goes: the edit flow. */
  editHref: string;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
}

/**
 * More about her plan and her direction, with the way into changing it. It shows the plan
 * and why she has it, the stages with the one she is in marked, and her direction in her own
 * words. It never edits anything itself: "Change my direction" starts the onboarding questions
 * again, with her answers kept, and she chooses her plan at the end.
 */
export function PlanDetailSheet({ open, onClose, planId, rationale, stage, direction, edited, editHref, inline }: PlanDetailSheetProps) {
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  const stages = roadmapFor(planId);
  return (
    <Sheet open={open} onClose={onClose} label={C.title} inline={inline}>
      <div className="plan-detail">
        <header className="plan-detail__head">
          <h2 className="plan-detail__title">{template?.name}</h2>
          {template?.formalName ? <p className="plan-detail__formal">{template.formalName}</p> : null}
        </header>

        {rationale ? (
          <section className="plan-detail__section">
            <h3 className="plan-detail__label">{C.why}</h3>
            <p className="plan-detail__text">{rationale}</p>
          </section>
        ) : null}

        <section className="plan-detail__section">
          <h3 className="plan-detail__label">{C.stages}</h3>
          <ol className="plan-detail__stages">
            {stages.map((s, i) => (
              <li key={s.title} className={i === stage ? "is-current" : undefined} aria-current={i === stage ? "step" : undefined}>
                <span>{s.title}</span>
                {i === stage ? <b className="plan-detail__here">{C.youAreHere}</b> : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="plan-detail__section">
          <h3 className="plan-detail__label">{C.direction}</h3>
          <p className="plan-detail__direction">{direction}</p>
          {edited ? <p className="plan-detail__note">{C.edited}</p> : null}
        </section>

        <p className="plan-detail__note">{C.how}</p>
        <div className="plan-detail__actions">
          <Link href={editHref} className="btn btn--primary btn--md">
            {C.change}
          </Link>
          <Button variant="ghost" onClick={onClose}>
            {C.close}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

export default PlanDetailSheet;
