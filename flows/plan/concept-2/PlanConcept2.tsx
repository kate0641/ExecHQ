"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 2 — Road forward. What her plan is leads, as on Concept 1: the plan's name as the
 * heading, a plain Edit link, one line on what it is built around, and where she is in it. The
 * roadmap is an agenda under it: a drawer for each stage, only the one she is on open, and in it
 * her steps as a title each, with the questions about a step opening the chat and a way to start.
 * What she adds herself sits in the stage it falls in. The Signal Picture and Momentum have their
 * own page.
 *
 * For the person who wants to know where this is heading before deciding what to do. The steps are
 * the stage's work, not a separate list.
 */
export function PlanConcept2() {
  const p = usePlanPage();
  return (
    <PlanPage concept="c2" showTitle={false} lead={p.planHeader} main={p.agenda}>
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept2;
