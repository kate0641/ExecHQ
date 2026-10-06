"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 2 — Momentum first. Momentum leads, wide: how her
 * follow-through is going, with the next move. The Signal Picture sits beside
 * it on web, under it on a phone, with where she started beneath.
 *
 * For the person who wants to know whether she is keeping up before looking
 * at the record.
 */
export function SignalsConcept2() {
  const p = usePlanPage();
  return (
    <SignalsPage
      concept="c2"
      lead={p.sparkNode}
      main={p.momentumOf("week")}
      side={
        <>
          {p.pictureOf("summary")}
          {p.started}
        </>
      }
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept2;
