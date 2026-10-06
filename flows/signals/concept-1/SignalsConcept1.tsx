"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 1 — Picture first. What she has put out there
 * leads: the Signal Picture, wide, with where she started above her record.
 * Momentum sits beside it on web, under it on a phone. Under the picture
 * come her LinkedIn and her website (moved from Homepage Concept 2 on
 * 2026-10-06), then the record of what she has added.
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
          {p.accounts}
          {p.picture}
        </>
      }
      side={p.momentum}
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept1;
