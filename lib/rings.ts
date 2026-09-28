/**
 * The rings of Homepage Concept 1: one per Active Landscape horizon, one
 * segment per accepted action in it.
 *
 * The rules, from the concept brief, and not optional:
 *
 * - A segment fills only when the Loop confirms the work: the linked artifact
 *   is marked used, sent or published, or an outcome is recorded. Nothing
 *   else fills it — no checkbox, no "done" button.
 * - Declined and deferred actions are left out of the ring entirely. They
 *   never show as empty or missed segments.
 * - The rings read the current Active Landscape, not a calendar period, so
 *   nothing resets on a clock.
 */

import type { LoopRecord } from "@/lib/loop";
import { ACTIONS, HORIZONS, type Horizon, type LandscapeAction } from "@/mock/plan-stub";

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

export function ringsFor(records: LoopRecord[], actions: LandscapeAction[] = ACTIONS): Ring[] {
  return HORIZONS.map((h) => {
    const segments = actions
      .filter((a) => a.horizon === h.id && a.status === "accepted")
      .map((action) => {
        const record = action.artifactId ? records.find((r) => r.id === action.artifactId) : undefined;
        return { action, record, filled: isConfirmed(record) };
      });
    return {
      horizon: h.id,
      label: h.label,
      span: h.span,
      segments,
      confirmed: segments.filter((s) => s.filled).length,
      setAside: actions.filter((a) => a.horizon === h.id && (a.status === "declined" || a.status === "deferred")),
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
