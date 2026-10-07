"use client";

import { usePlanPage } from "@/flows/plan/usePlanPage";
import { SignalsPage } from "../SignalsPage";

/**
 * Signal Picture, Concept 3 — Where you show up. A place, not a line: every
 * thing she did is one dot, in one of four equal territories, hollow for what
 * she had when she started and filled for what she has added since. Her
 * followers sit above it and her next step is a dashed dot in its territory.
 * Momentum's bars sit beside it on web and under it on a phone.
 *
 * It asks "where do I show up?", where Concept 1 asks "how have I grown?" and
 * Concept 2 asks "am I keeping up?". Before she has said where she started,
 * the page asks that and nothing else.
 *
 * For the person who wants the shape of her presence at a glance.
 */
export function SignalsConcept3() {
  const p = usePlanPage();
  return (
    <SignalsPage
      concept="c3"
      lead={<>{p.sparkNode}{p.hasStarted ? null : p.started}</>}
      main={p.pictureOf("map")}
      side={p.momentumOf("bars")}
    >
      {p.sheet}
    </SignalsPage>
  );
}

export default SignalsConcept3;
