"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 3 — Side by side. Where she started, and the note
 * on what has moved, run across the top as one card. The Signal Picture and
 * Momentum sit beneath it as equals, in two columns on web.
 *
 * For the person who wants the start and now first, then the detail behind
 * them.
 */
export function SignalsConcept3() {
  const p = usePlanPage();
  return (
    <SignalsPage concept="c3" lead={<>{p.sparkNode}{p.started}</>} main={p.pictureOf("areas")} side={p.momentumOf("bars")}>
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept3;
