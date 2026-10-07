"use client";

import { PlanPage } from "../PlanPage";
import { usePlanPage } from "../usePlanPage";

/**
 * Plan, Concept 4 — Plan and signals. One page for what to do next and what it
 * has added. The Active Landscape leads: how much she can take on (light,
 * steady or full, remembered between visits, or hold), then up to five live
 * steps by horizon, each with its reason and its answers. A decline asks an
 * optional reason and offers a replacement at once; finishing a step offers
 * the next; deferring and declining are never counted against her.
 *
 * Under it, the evidence, in a fixed order: Momentum, how she has grown (its
 * next circle is one of the live steps above), what came of it, and where she
 * started. There is no separate suggestion: every next step on the page is one
 * of the live steps.
 *
 * For the person who opens the Plan to act, and then to see what it adds.
 */
export function PlanConcept4() {
  const p = usePlanPage();
  return (
    <PlanPage
      concept="c4"
      showTitle={false}
      lead={p.planHeader}
      main={
        <>
          {p.capacityControl}
          {p.stepsWithCapacity}
          {p.note}
        </>
      }
      side={
        <>
          {p.momentumOf("dial")}
          {p.pictureOf("path")}
          {p.pictureOf("cameof")}
          {p.toldUs}
          {p.startedPlain}
        </>
      }
    >
      {p.sheet}
    </PlanPage>
  );
}

export default PlanConcept4;
