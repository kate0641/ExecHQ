"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 2 — Road forward. The roadmap leads, under a compass card that holds
 * her direction, her plan and her stage: where she is on it, what finishing the
 * stage looks like, and that stage's next steps opened up inside it. Beside it
 * on web, the Calendar (her own items and her steps on their days), then what
 * changed. The Signal Picture and Momentum have their own page.
 *
 * For the person who wants to know where this is heading before deciding what
 * to do. The steps are the stage's work, not a separate list.
 */
export function PlanConcept2() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c2"
      lead={p.directionCompass}
      main={
        <>
          {p.roadmap({ children: p.steps })}
          {p.note}
        </>
      }
      side={
        <>
          {p.calendar}
          {p.narrative}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept2;
