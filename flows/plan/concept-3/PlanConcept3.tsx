"use client";

import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 3 — Guided check-in. The Plan as a short run of pages, one move each, built from
 * onboarding's own parts: a page that says the move and why it matters, and a drawer that holds where
 * she is with it. Answering changes her plan for real and comes back as a short reply in the serif
 * voice, then the next move. The last page says where the plan stands. Under the move is the roadmap,
 * Concept 2's agenda in its Stack layout: the open drawer covers it, and folding the drawer to "Where
 * are you with this?" shows the whole road. Adding something of her own slides up as a sheet.
 *
 * For the person who wants to be asked, not shown: the plan as an advisor who checks in.
 */
export function PlanConcept3() {
  const p = usePlanPage();
  return (
    <>
      {p.guided}
      {p.sheet}
    </>
  );
}

export default PlanConcept3;
