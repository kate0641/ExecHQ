"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 2 — Momentum first. This week leads: seven circles
 * and the next move, across the top on web. Under it comes what she says came
 * of the things she did, then where she started with its own suggestion: one
 * after the other on a phone, side by side on web, what came of it the wider.
 * One title, one Add button, one next move in Momentum. Only what she put out
 * in the world is on it: work inside ExecHQ, like a draft, is not a signal.
 *
 * For the person who wants to know whether she is keeping up before looking
 * at the record.
 */
export function SignalsConcept2() {
  const p = usePlanPage();
  return (
    <SignalsPage
      concept="c2"
      lead={p.momentumOf("week")}
      main={p.pictureOf("cameof")}
      side={p.started}
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept2;
