"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 1 — How you've grown. Where she started leads, then
 * a path through time: a circle for each month sized by how much she added, and
 * her next step ahead as a dashed circle. Momentum, drawn as a dial, sits
 * beside it on web and under it on a phone. V1 has no account connections, so
 * everything here is what she typed or ExecHQ recorded.
 *
 * It asks "how have I grown over time?", where Concept 2 asks "am I keeping
 * up?" and Concept 3 asks "where do I show up?".
 *
 * For the person who opens this page to see what she has done and add to it.
 */
export function SignalsConcept1() {
  const p = usePlanPage();
  return (
    <SignalsPage
      concept="c1"
      lead={p.sparkNode}
      main={
        <>
          {p.started}
          {p.pictureOf("path")}
        </>
      }
      side={p.momentumOf("dial")}
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept1;
