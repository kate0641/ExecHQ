"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 1 — Steps forward. The direction and the next steps lead, then what
 * changed. Momentum, the roadmap as an Agenda (the stage she is in open, the rest
 * one tap away) and the Signal Picture sit beside them on web.
 *
 * For the person who opens the Plan to act. The roadmap is context, not the
 * way in.
 */
export function PlanConcept1() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c1"
      main={
        <>
          {p.direction}
          {p.steps}
          {p.narrative}
        </>
      }
      side={
        <>
          {p.momentum}
          {p.agenda}
          {p.note}
          {p.picture}
          {p.started}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept1;
