"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 2 — Momentum first. This week leads: seven circles
 * and the next move. Under it, on a phone, or beside it on web, comes what
 * she says came of the things she did, then where she started with its own
 * suggestion. What ExecHQ has added for her sits between those two, at the
 * head of the signals she can add to, not above Momentum. One title, one Add button, one next move in Momentum.
 *
 * For the person who wants to know whether she is keeping up before looking
 * at the record.
 */
export function SignalsConcept2() {
  const p = usePlanPage();
  return (
    <SignalsPage
      concept="c2"
      main={p.momentumOf("week")}
      side={
        <>
          {p.pictureOf("cameof")}
          {p.sparkNode}
          {p.started}
        </>
      }
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept2;
