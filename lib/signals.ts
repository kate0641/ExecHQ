/**
 * Signal activity: the last seven days of each signal the Plan tracks, as a
 * list of facts. PROVISIONAL — a lightweight stand-in for the Signal Picture,
 * which Sprint 3 designs. Homepage Concept 2 reads it.
 *
 * Nothing here is stored. Every entry is read from the live Loop through the
 * Plan stub's actions (an action names its artifact and the signal it
 * touches), so answering a follow-up adds its entry at once.
 *
 * Each entry is either observed (it happened in ExecHQ: drafting, working on,
 * finishing an artifact) or reported (the user told us: that they used or
 * sent it, and what came of it). The line is drawn by who can vouch for the
 * event, not where the button was pressed: ExecHQ cannot see a 1:1 or an
 * inbox, so a use is always reported, even though it is logged with one tap
 * in ExecHQ. A reported entry carries how ExecHQ knows it.
 *
 * Wording is in `mock/plan-stub.ts`.
 */

import { addDays, shortDate, type LoopDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS, OUTCOME_OPTIONS } from "@/mock/loop";
import {
  ACTIONS,
  SIGNAL_COPY as C,
  SIGNALS,
  STEP_SIGNALS,
  type SignalEntry,
  type TrackedSignal,
} from "@/mock/plan-stub";

export interface SignalActivityEntry extends SignalEntry {
  /** The user's own words, shown as a quotation. */
  quote?: boolean;
}

export interface SignalActivity {
  signal: TrackedSignal;
  /** Newest first. Empty when nothing happened in the window. */
  entries: SignalActivityEntry[];
}

/** The signal the action behind this artifact touches. */
export function signalOfRecord(recordId: string): string | undefined {
  return ACTIONS.find((a) => a.artifactId === recordId)?.signalId;
}

/** The signal a next step touches: a Plan action, or a stubbed hand-off step. */
export function signalOfStep(stepId: string): string | undefined {
  return ACTIONS.find((a) => a.id === stepId)?.signalId ?? STEP_SIGNALS[stepId];
}

/** Every fact one artifact's history gives, oldest first. */
export function entriesFor(record: LoopRecord): SignalActivityEntry[] {
  const out: SignalActivityEntry[] = [];
  const lastEdit = record.history.filter((e) => e.type === "edited").at(-1);
  for (const event of record.history) {
    switch (event.type) {
      case "drafted":
        out.push({ source: "observed", text: C.drafted(record.name), on: event.on });
        break;
      case "edited":
        // Many edits are one fact: that it was worked on.
        if (event === lastEdit) out.push({ source: "observed", text: C.edited(record.name), on: event.on });
        break;
      case "ready":
        out.push({ source: "observed", text: C.ready(record.name), on: event.on });
        break;
      case "used":
        out.push({
          source: "reported",
          text: C.used(ARTIFACT_KINDS[record.kind].usedVerb, record.name),
          on: event.on,
          how: C.howUsed(shortDate(event.on)),
        });
        break;
      case "nothing-yet":
        out.push({ source: "reported", text: C.nothingYet(record.name), on: event.on, how: C.howNothingYet(shortDate(event.on)) });
        break;
      case "outcome": {
        if (event.outcome === "no-longer-relevant") break;
        const detail = record.outcome?.on === event.on ? record.outcome.detail : undefined;
        const label = OUTCOME_OPTIONS.find((o) => o.type === event.outcome)?.label ?? "";
        out.push(
          detail
            ? { source: "reported", text: detail, on: event.on, quote: true, how: C.howOutcome(shortDate(event.on)) }
            : { source: "reported", text: C.outcome(record.name, label), on: event.on, how: C.howOutcome(shortDate(event.on)) }
        );
        break;
      }
      case "closed":
        break;
    }
  }
  return out;
}

/** The first day inside the window: seven days back, today included. */
export function windowStart(today: LoopDate): LoopDate {
  return addDays(today, -C.windowDays);
}

/** "Last 7 days · 13 Oct – 20 Oct". */
export function windowLabel(today: LoopDate): string {
  return C.window(shortDate(windowStart(today)), shortDate(today));
}

/** Each tracked signal, in the Plan's order, with its facts from the window. */
export function signalActivity(records: LoopRecord[], today: LoopDate): SignalActivity[] {
  const from = windowStart(today);
  return SIGNALS.map((signal) => {
    const entries = records
      .filter((r) => signalOfRecord(r.id) === signal.id)
      .flatMap(entriesFor)
      .filter((e) => e.on >= from && e.on <= today)
      .map((e, i) => ({ e, i }))
      // Newest first; on the same day, the later event first.
      .sort((a, b) => (a.e.on === b.e.on ? b.i - a.i : a.e.on < b.e.on ? 1 : -1))
      .map(({ e }) => e);
    return { signal, entries };
  });
}
