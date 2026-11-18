/**
 * The rings of Homepage Concept 1: one per action-step horizon, one
 * segment per accepted action in it.
 *
 * The rules, from the concept brief, and not optional:
 *
 * - A segment fills only when the Loop confirms the work: the linked artifact
 *   is marked used, sent or published, or an outcome is recorded. Nothing
 *   else fills it — no checkbox, no "done" button.
 * - Declined and deferred actions are left out of the ring entirely. They
 *   never show as empty or missed segments.
 * - The rings read the current action steps, not a calendar period, so
 *   nothing resets on a clock.
 */

import type { LoopRecord } from "@/lib/loop";
import { ACTIONS, HORIZONS, type Horizon, type LandscapeAction } from "@/mock/plan-stub";
import type { TaskCheck } from "@/mock/snapshots";

type Tasks = Record<string, TaskCheck> | undefined;

/** An action is done when the Loop confirms its draft, or, for an action
 *  with no draft, when she says she's done it (her word). */
export function isDone(action: LandscapeAction, records: LoopRecord[], tasks: Tasks): boolean {
  const record = action.artifactId ? records.find((r) => r.id === action.artifactId) : undefined;
  return isConfirmed(record) || Boolean(!action.artifactId && tasks?.[action.id]?.doneOn && !tasks[action.id].dropped);
}

/** Accepted, and not set aside on her word. */
export function isLive(action: LandscapeAction, tasks: Tasks): boolean {
  return action.status === "accepted" && !tasks?.[action.id]?.dropped;
}

export interface RingSegment {
  action: LandscapeAction;
  /** The artifact that does it, if one exists yet. */
  record?: LoopRecord;
  filled: boolean;
}

export interface Ring {
  horizon: Horizon;
  label: string;
  span: string;
  segments: RingSegment[];
  /** How many segments are filled. */
  confirmed: number;
  /** Declined or deferred actions in this horizon: left out of the ring, and
   *  mentioned only quietly, when the ring is opened. */
  setAside: LandscapeAction[];
}

/** The Loop confirms the work: used, sent or published, or an outcome in. */
export function isConfirmed(record: LoopRecord | undefined): boolean {
  return Boolean(record && (record.usedOn !== undefined || record.outcome !== undefined));
}

export function ringsFor(records: LoopRecord[], actions: LandscapeAction[] = ACTIONS, tasks?: Tasks): Ring[] {
  return HORIZONS.map((h) => {
    const segments = actions
      .filter((a) => a.horizon === h.id && isLive(a, tasks))
      .map((action) => {
        const record = action.artifactId ? records.find((r) => r.id === action.artifactId) : undefined;
        return { action, record, filled: isDone(action, records, tasks) };
      });
    return {
      horizon: h.id,
      label: h.label,
      span: h.span,
      segments,
      confirmed: segments.filter((s) => s.filled).length,
      setAside: actions.filter(
        (a) => a.horizon === h.id && (a.status === "declined" || a.status === "deferred" || Boolean(tasks?.[a.id]?.dropped))
      ),
    };
  });
}

/** The one action that would fill the next segment: the first unfilled one,
 *  nearest horizon first. */
export function nextToFill(rings: Ring[]): { ring: Ring; segment: RingSegment } | undefined {
  for (const ring of rings) {
    const segment = ring.segments.find((s) => !s.filled);
    if (segment) return { ring, segment };
  }
  return undefined;
}

/** The ring's text equivalent, read out in place of the drawing:
 *  "Short-term: 1 of 2 actions confirmed." */
export function ringText(ring: Ring): string {
  const n = ring.segments.length;
  return `${ring.label}: ${ring.confirmed} of ${n} ${n === 1 ? "action" : "actions"} confirmed.`;
}

/** Where the ring stands, in words under it. Neutral either way: an empty
 *  ring is "ready to start", never behind. */
export function ringCount(ring: Ring): string {
  const n = ring.segments.length;
  if (ring.confirmed === 0) return `${n === 1 ? "1 action" : `${n} actions`}, ready to start`;
  return `${ring.confirmed} of ${n} confirmed`;
}

/** The action's horizon, for naming what a follow-up confirms. */
export function ringOf(rings: Ring[], recordId: string): { ring: Ring; segment: RingSegment } | undefined {
  for (const ring of rings) {
    const segment = ring.segments.find((s) => s.record?.id === recordId);
    if (segment) return { ring, segment };
  }
  return undefined;
}

/**
 * Where the user is on the roadmap, from progress rather than a calendar: the
 * first stage holding an accepted action the Loop hasn't confirmed. Once
 * everything accepted is confirmed, the stage after the last one worked in.
 */
export function currentStageIndex(
  records: LoopRecord[],
  stageCount: number,
  actions: LandscapeAction[] = ACTIONS,
  tasks?: Tasks
): number {
  const accepted = actions.filter((a) => isLive(a, tasks));
  const open = accepted.filter((a) => !isDone(a, records, tasks));
  if (open.length) return Math.min(...open.map((a) => a.stage));
  const last = accepted.length ? Math.max(...accepted.map((a) => a.stage)) : -1;
  return Math.min(last + 1, stageCount - 1);
}
