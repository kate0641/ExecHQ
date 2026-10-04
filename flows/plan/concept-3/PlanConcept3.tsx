"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 3 — Record forward. What changed leads, across the top, and
 * ends in one next move that opens the matching step. The Signal Picture and
 * Momentum are the wide column; the next steps and the roadmap sit beside them.
 *
 * For the person who wants to see that acting adds up before they act again.
 */
export function PlanConcept3() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c3"
      lead={p.narrative}
      main={
        <>
          {p.picture}
          {p.momentum}
        </>
      }
      side={
        <>
          {p.steps}
          {p.roadmap({ compact: true })}
          {p.note}
          {p.started}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept3;
