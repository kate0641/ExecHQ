"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 1 — Picture first. What she has put out there
 * leads: the Signal Picture, wide, with where she started above her record.
 * Momentum sits beside it on web, under it on a phone. Under it comes the
 * record of what she has added. V1 has no account connections, so there are
 * no LinkedIn or website cards: everything here is what she typed or ExecHQ
 * recorded.
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
