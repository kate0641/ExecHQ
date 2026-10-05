"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 3 — Record forward. What changed leads, across the top, and
 * ends in one next move that opens the matching step. The next steps are the
 * wide column and the roadmap sits beside them. The Signal Picture and
 * Momentum have their own page.
 *
 * For the person who wants to see that acting adds up before they act again.
 */
export function PlanConcept3() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c3"
      lead={p.narrative}
      main={p.steps}
      side={
        <>
          {p.roadmap({ compact: true })}
          {p.note}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept3;
