/**
 * The map of Homepage Concept 4: one ring per horizon, one segment per action
 * that is on her map, in one of three states.
 *
 * - `done`: the Loop confirms it, or she said so (the same test the rings of
 *   Concept 1 use, `isDone` in `lib/rings.ts`). Nothing else fills a segment.
 * - `in-progress`: she has taken it up.
 * - `not-started`: ExecHQ has suggested it and she has neither started it nor
 *   turned it down. It is shown, and it only leads to the Plan to read about,
 *   where she starts it or says it is not for her.
 *
 * A skipped action leaves the map. A finished one stays until she asks for a
 * new one, which clears the finished ring.
 */

import type { LoopRecord } from "@/lib/loop";
import { isDone } from "@/lib/rings";
import { ACTIONS, HORIZONS, NEW_ACTIONS, type Horizon, type LandscapeAction } from "@/mock/plan-stub";
import type { ActionChoice, TaskCheck } from "@/mock/snapshots";

export type MapState = "done" | "in-progress" | "not-started";

export interface MapSegment {
  action: LandscapeAction;
  state: MapState;
  record?: LoopRecord;
}

export interface MapRing {
  horizon: Horizon;
  label: string;
  span: string;
  segments: MapSegment[];
  /** How many are done. */
  done: number;
  /** Every action in it is done, and there is at least one. */
  complete: boolean;
}

export interface MapInput {
  records: LoopRecord[];
  tasks?: Record<string, TaskCheck>;
  choices?: Record<string, ActionChoice>;
  asked?: string[];
}

/** Every action the map could show: the plan's, then the ones she asked for. */
function allActions(asked: string[] | undefined): LandscapeAction[] {
  return [...ACTIONS, ...(asked ?? []).map((id) => NEW_ACTIONS.find((a) => a.id === id)).filter((a): a is LandscapeAction => Boolean(a))];
}

function stateOf(action: LandscapeAction, input: MapInput): MapState | undefined {
  const choice = input.choices?.[action.id];
  if (choice?.decision === "skipped" || choice?.decision === "retired") return undefined;
  if (input.tasks?.[action.id]?.dropped) return undefined;
  if (isDone(action, input.records, input.tasks)) return "done";
  if (choice?.decision === "started" || action.status === "accepted") return "in-progress";
  if (action.status === "deferred" || action.status === "suggested") return "not-started";
  return undefined;
}

export function mapFor(input: MapInput): MapRing[] {
  const actions = allActions(input.asked);
  return HORIZONS.map((h) => {
    const segments: MapSegment[] = [];
    for (const action of actions.filter((a) => a.horizon === h.id)) {
      const state = stateOf(action, input);
      if (state) {
        segments.push({
          action,
          state,
          record: action.artifactId ? input.records.find((r) => r.id === action.artifactId) : undefined,
        });
      }
    }
    // Done first, then in progress, then not started, so the ring reads
    // clockwise as where she is.
    const order: MapState[] = ["done", "in-progress", "not-started"];
    segments.sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state));
    const done = segments.filter((s) => s.state === "done").length;
    return { horizon: h.id, label: h.label, span: h.span, segments, done, complete: segments.length > 0 && done === segments.length };
  });
}

/** The next new action to put in this horizon, if any is left. */
export function nextNewAction(horizon: Horizon, asked: string[] | undefined): LandscapeAction | undefined {
  return NEW_ACTIONS.find((a) => a.horizon === horizon && !(asked ?? []).includes(a.id));
}

/** The ring's text equivalent, read in place of the drawing. */
export function mapRingText(ring: MapRing): string {
  const n = ring.segments.length;
  if (n === 0) return `${ring.label}: nothing on your map yet.`;
  const inProgress = ring.segments.filter((s) => s.state === "in-progress").length;
  const notStarted = ring.segments.filter((s) => s.state === "not-started").length;
  const parts = [`${ring.done} done`, `${inProgress} in progress`, `${notStarted} not started`].filter((p) => !p.startsWith("0 ") || p === `${ring.done} done`);
  return `${ring.label}: ${parts.join(", ")}.`;
}
