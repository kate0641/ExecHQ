"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 1 — Steps forward. The direction and the next steps lead, with the
 * roadmap as an Agenda under them (the stage she is in open, the rest one tap
 * away). What changed sits beside them on web. The Signal Picture and Momentum have their own page.
 *
 * For the person who opens the Plan to act. The roadmap is context, not the
 * way in. The Calendar is on Concept 2.
 */
export function PlanConcept1() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c1"
      lead={p.direction}
      main={
        <>
          {p.stepsCarousel}
          {p.agenda}
          {p.note}
        </>
      }
      side={
        <>
          {p.narrative}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept1;
