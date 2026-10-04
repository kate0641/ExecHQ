/**
 * "What changed / what next": a short reading of the windows that ends with
 * one next move. A stand-in for the model that writes it in the product: here
 * it is rules, so each sentence can be traced to the items it came from.
 *
 * - Two to four sentences. Every one carries the recorded items behind it.
 * - No causal claims: it says what happened and what she logged, never that
 *   one thing led to another.
 * - Thin history is said plainly, never inflated.
 * - The next move is a live action step and opens that step.
 */

import { inMomentumWindow, type MomentumEvent } from "@/lib/momentum";
import type { PictureItem } from "@/lib/signal-picture";
import { addDays, type LoopDate } from "@/lib/loop";
import { NARRATIVE_COPY as C, type ActionStep } from "@/mock/plan";

export interface Evidence {
  id: string;
  text: string;
  on: LoopDate;
}

export interface NarrativeLine {
  text: string;
  /** The recorded items this sentence rests on. */
  behind: Evidence[];
}

export interface Narrative {
  lines: NarrativeLine[];
  next?: { title: string; stepId: string };
}

/** Days under which the history is called thin, and so said to be. */
const THIN_UNDER = 14;

export function buildNarrative(input: {
  events: MomentumEvent[];
  items: PictureItem[];
  history: number;
  today: LoopDate;
  /** The live steps, best first. */
  steps: ActionStep[];
  /** Which of them she has accepted. */
  accepted: (step: ActionStep) => boolean;
}): Narrative {
  const { events, items, history, today, steps, accepted } = input;
  const days = history >= 30 ? 30 : Math.max(7, history);
  const lines: NarrativeLine[] = [];

  if (history < THIN_UNDER) lines.push({ text: C.thin(history), behind: [] });

  const recent = inMomentumWindow(events, today, days);
  const completed = recent.filter((e) => e.figure === "completed");
  const artifacts = recent.filter((e) => e.figure === "artifact");
  const outcomes = recent.filter((e) => e.figure === "outcome");
  const parts = [
    completed.length ? C.completed(completed.length) : "",
    artifacts.length ? C.artifacts(artifacts.length) : "",
    outcomes.length ? C.outcomes(outcomes.length) : "",
  ].filter(Boolean);
  if (parts.length) {
    lines.push({ text: C.did(C.window(history, days), parts), behind: [...completed, ...artifacts, ...outcomes] });
  }

  const since = addDays(today, -(days - 1));
  const added = items.filter((i) => i.source === "added" && i.on >= since && i.on <= today);
  if (added.length) {
    const kinds = [...new Set(added.map((i) => i.tag).filter(Boolean))].join(", ").toLowerCase();
    lines.push({ text: C.added(added.length, kinds || "outside ExecHQ"), behind: added });
  }

  const quote = items.filter((i) => i.quote && i.on >= since && i.on <= today).at(-1);
  if (quote) lines.push({ text: C.logged(quote.text), behind: [quote] });

  const step = steps.find(accepted) ?? steps[0];
  return { lines: lines.slice(0, 4), next: step ? { title: step.title, stepId: step.id } : undefined };
}
