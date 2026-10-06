"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 1 — Steps forward. What her plan is, and the next steps, lead. The roadmap is
 * a timeline of the draft she started with, with little sparks on it that say what happened and
 * how her plan moved with her; on web it sits beside the steps. There is no separate "What
 * changed": the sparks are it. The Signal Picture and Momentum have their own page.
 *
 * For the person who opens the Plan to act. The roadmap is context, not the way in. The
 * Calendar is on Concept 2.
 */
export function PlanConcept1() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c1"
      showTitle={false}
      lead={p.planHeader}
      main={
        <>
          {p.stepsCarousel}
          {p.note}
        </>
      }
      side={p.timeline}
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept1;
