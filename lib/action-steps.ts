/**
 * What the action steps do. Pure functions over a plain state: every move
 * returns the next state and what, if anything, replaces what left. The Plan
 * pages hold the state and call these; nothing here knows about React.
 *
 * The rules, from the Sprint 3 brief and the review notes:
 *
 * - Never more than five live (three short, one medium, one long).
 * - A decline frees its slot. The slot is refilled at once from the ranked
 *   queue, from the same horizon, if something suitable exists.
 * - The reason she gives changes what comes next, and the replacement says
 *   how ("A lighter one this time"). A reason that did nothing would make a
 *   second decline feel like nobody was listening.
 * - A replacement arrives with its own reason, never the same suggestion
 *   reworded: it never shares kind, area and channel with what left.
 * - Declining a channel avoids it for good, not only for the next pick.
 * - Replacement is capped: one per horizon per visit. After that the slot
 *   stays empty and says so, so repeated declines cannot become a conveyor belt.
 * - She can always keep her current workload; then nothing is replaced.
 * - Declining and deferring are never counted against her anywhere.
 */

import { addDays, datePhrase, type LoopDate } from "@/lib/loop";
import {
  ACTION_QUEUE,
  LIVE_LIMITS,
  PLAN_COPY,
  CHANNELS,
  HANDOFF_RULES,
  HANDOFF_STEP,
  stepById,
  type ActionStep,
  type DeclineReason,
} from "@/mock/plan";
import type { Horizon } from "@/mock/plan-stub";
import { suggestedDate } from "@/lib/step-dates";
import { NEXT_STEP_AFTER } from "@/mock/snapshots";

/** A decline for wrong timing comes back once after this many days. */
export const WRONG_TIMING_RETURNS_AFTER_DAYS = 14;
/** A deferral with no date chosen comes back after this many days. */
export const DEFAULT_DEFER_DAYS = 7;
/** Replacements allowed per horizon in one visit. */
export const MAX_REPLACEMENTS_PER_HORIZON = 1;

export type StepDecision = "accepted" | "declined" | "deferred" | "completed";

export interface Decision {
  decision: StepDecision;
  on: LoopDate;
  reason?: DeclineReason;
  /** A deferred step is offered again once, on or after this date. */
  returnsOn?: LoopDate;
  /** It has been offered again once; never a second time, and no reminder. */
  resurfaced?: boolean;
}

export interface PlanState {
  today: LoopDate;
  /** What is on the Plan now, in order. Never more than five. */
  shown: string[];
  decisions: Record<string, Decision>;
  /** Channels she has said she is uncomfortable with. Never offered. */
  avoidChannels: ActionStep["channel"][];
  /** Replacements made in each horizon this visit. */
  replaced: Partial<Record<Horizon, number>>;
  /** She chose to keep her current workload: nothing is replaced. */
  holdWorkload: boolean;
  /** Her edits to a step: its scope, and the day she chose for it. The card says a day only once she
   *  has chosen one; until then it says when in words. */
  edits: Record<string, { scope?: "lighter" | "as-is"; day?: LoopDate }>;
  /** The day each step she has accepted, or moved, sits on her calendar. A step with no
   *  day here is only suggested one (`lib/step-dates.ts`). Absent in older saved state. */
  dates?: Record<string, LoopDate>;
}

export type EmptyReason = keyof typeof PLAN_COPY.empty;

export type Replacement =
  | {
      step: ActionStep;
      /** The line that says her answer was heard. Absent when nothing changed. */
      heard?: string;
      /** For "already done": the step to add to her record as hers. */
      offerRecord?: boolean;
    }
  | { empty: EmptyReason; message: string };

export interface Move {
  state: PlanState;
  /** What took the freed slot, or why nothing did. Absent when no slot freed. */
  replacement?: Replacement;
}

/** Her Plan as it opens: the live steps from the queue, the rest set aside. */
export function initialPlanState(today: LoopDate): PlanState {
  const decisions: Record<string, Decision> = {};
  const shown: string[] = [];
  const dates: Record<string, LoopDate> = {};
  for (const step of ACTION_QUEUE) {
    if (step.status === "accepted") {
      shown.push(step.id);
      decisions[step.id] = { decision: "accepted", on: today };
      dates[step.id] = suggestedDate(step, today);
    } else if (step.status === "deferred") {
      decisions[step.id] = { decision: "deferred", on: today, returnsOn: addDays(today, DEFAULT_DEFER_DAYS) };
    } else if (step.status === "declined") {
      decisions[step.id] = { decision: "declined", on: today, reason: "not-relevant" };
    }
  }
  return { today, shown, decisions, avoidChannels: [], replaced: {}, holdWorkload: false, edits: {}, dates };
}

export const liveSteps = (state: PlanState): ActionStep[] =>
  state.shown.map((id) => stepById(id)).filter((s): s is ActionStep => Boolean(s));

export const liveIn = (state: PlanState, horizon: Horizon): ActionStep[] =>
  liveSteps(state).filter((s) => s.horizon === horizon);

/** Whether a horizon has room for another live step. */
export const hasRoom = (state: PlanState, horizon: Horizon): boolean =>
  liveIn(state, horizon).length < LIVE_LIMITS[horizon];

/* -----------------------------------------------------------------------------
   MOVES
   -------------------------------------------------------------------------- */

const without = (shown: string[], id: string) => shown.filter((s) => s !== id);
const withoutDate = (dates: PlanState["dates"], id: string) => {
  if (!dates) return dates;
  return Object.fromEntries(Object.entries(dates).filter(([key]) => key !== id));
};

/** Accepting a step pins the day it was suggested for onto her calendar. */
export function accept(state: PlanState, id: string): PlanState {
  const step = stepById(id);
  const dates = { ...state.dates };
  if (step && !dates[id]) dates[id] = suggestedDate(step, state.today);
  return { ...state, decisions: { ...state.decisions, [id]: { decision: "accepted", on: state.today } }, dates };
}

/** Scope changed, or she moved the step to another day; the step stays on her Plan. */
export function edit(state: PlanState, id: string, change: { scope?: "lighter" | "as-is"; date?: LoopDate }): PlanState {
  const { date, ...rest } = change;
  return {
    ...state,
    edits: { ...state.edits, [id]: { ...state.edits[id], ...rest, ...(date ? { day: date } : {}) } },
    dates: date ? { ...state.dates, [id]: date } : state.dates,
  };
}

/** The day a step is on her calendar, and whether it is only suggested. */
export function stepDay(state: PlanState, step: Pick<ActionStep, "id" | "horizon">): { date: LoopDate; suggested: boolean } {
  const pinned = state.dates?.[step.id];
  return { date: pinned ?? suggestedDate(step, state.today), suggested: !pinned };
}

export function keepWorkload(state: PlanState, hold = true): PlanState {
  return { ...state, holdWorkload: hold };
}

/** Starts a new visit: the per-visit replacement count goes back to nothing. */
export function newVisit(state: PlanState, today: LoopDate): PlanState {
  return { ...state, today, replaced: {} };
}

export function decline(state: PlanState, id: string, reason?: DeclineReason): Move {
  const step = stepById(id);
  if (!step || !state.shown.includes(id)) return { state };
  let next: PlanState = { ...state, shown: without(state.shown, id), dates: withoutDate(state.dates, id) };
  // Wrong timing is the one reason that is about when, not whether: it comes
  // back once, later.
  const returnsOn = reason === "wrong-timing" ? addDays(state.today, WRONG_TIMING_RETURNS_AFTER_DAYS) : undefined;
  next.decisions = { ...next.decisions, [id]: { decision: "declined", on: state.today, reason, returnsOn } };
  // A channel she is uncomfortable with is avoided from here on.
  if (reason === "uncomfortable-channel" && step.channel && !next.avoidChannels.includes(step.channel)) {
    next = { ...next, avoidChannels: [...next.avoidChannels, step.channel] };
  }
  return refill(next, step, reason);
}

export function defer(state: PlanState, id: string, returnsOn?: LoopDate): Move {
  const step = stepById(id);
  if (!step || !state.shown.includes(id)) return { state };
  const on = returnsOn ?? addDays(state.today, DEFAULT_DEFER_DAYS);
  const next: PlanState = {
    ...state,
    shown: without(state.shown, id),
    dates: withoutDate(state.dates, id),
    decisions: { ...state.decisions, [id]: { decision: "deferred", on: state.today, returnsOn: on } },
  };
  return refill(next, step, undefined);
}

/**
 * Finishing a step offers the next one right away, with no waiting for a
 * weekly boundary. That is progress, not a decline, so the replacement cap
 * does not apply. `prefer` names the step the Loop hand-off wants offered.
 */
export function complete(state: PlanState, id: string, prefer?: string): Move {
  const step = stepById(id);
  if (!step || !state.shown.includes(id)) return { state };
  const next: PlanState = {
    ...state,
    shown: without(state.shown, id),
    dates: withoutDate(state.dates, id),
    decisions: { ...state.decisions, [id]: { decision: "completed", on: state.today } },
  };
  if (next.holdWorkload) return { state: next, replacement: emptyOf("kept-workload") };
  const preferred = prefer ? stepById(prefer) : undefined;
  const pick =
    preferred && eligible(next, preferred) ? preferred : candidates(next, step.horizon)[0];
  if (!pick) return { state: next, replacement: emptyOf("nothing-suitable") };
  return { state: offer(next, pick), replacement: { step: pick } };
}

/**
 * The Loop hands an outcome to the Plan: the step that did the work is done,
 * and the next one is offered, tied to what she reported. The reason is her
 * own words, quoted, so it carries what happened and claims nothing more:
 * "Your manager asked you to lead the workstream", never "your brief got you
 * the workstream".
 */
export function handOff(
  state: PlanState,
  fromStepId: string,
  nextStepId: string,
  reported?: string,
): Move {
  const move = complete(state, fromStepId, nextStepId);
  if (move.replacement && "step" in move.replacement && move.replacement.step.id === nextStepId && reported) {
    move.replacement = { ...move.replacement, heard: `You told us: “${reported}”` };
  }
  return move;
}

/* -----------------------------------------------------------------------------
   REPLACEMENT
   -------------------------------------------------------------------------- */

const emptyOf = (reason: EmptyReason): Replacement => ({ empty: reason, message: PLAN_COPY.empty[reason] });

/** Not on the Plan, not decided, not a channel she avoids; or a deferred step
 *  whose date has come, offered again once. */
function eligible(state: PlanState, step: ActionStep): boolean {
  if (state.shown.includes(step.id)) return false;
  if (step.channel && state.avoidChannels.includes(step.channel)) return false;
  const d = state.decisions[step.id];
  if (!d) return true;
  const returns = d.decision === "deferred" || (d.decision === "declined" && d.returnsOn !== undefined);
  return returns && d.returnsOn !== undefined && d.returnsOn <= state.today && !d.resurfaced;
}

const candidates = (state: PlanState, horizon: Horizon): ActionStep[] =>
  ACTION_QUEUE.filter((s) => s.horizon === horizon && eligible(state, s));

const sameShape = (a: ActionStep, b: ActionStep) => a.kind === b.kind && a.area === b.area && a.channel === b.channel;

function offer(state: PlanState, step: ActionStep, replaced = false): PlanState {
  const d = state.decisions[step.id];
  return {
    ...state,
    shown: [...state.shown, step.id],
    decisions: d ? { ...state.decisions, [step.id]: { ...d, resurfaced: true } } : state.decisions,
    replaced: replaced
      ? { ...state.replaced, [step.horizon]: (state.replaced[step.horizon] ?? 0) + 1 }
      : state.replaced,
  };
}

/** Fills the slot a decline or deferral freed, by the reason given. */
function refill(state: PlanState, gone: ActionStep, reason: DeclineReason | undefined): Move {
  if (state.holdWorkload) return { state, replacement: emptyOf("kept-workload") };
  if ((state.replaced[gone.horizon] ?? 0) >= MAX_REPLACEMENTS_PER_HORIZON) {
    return { state, replacement: emptyOf("limit-reached") };
  }

  // Never the same suggestion reworded.
  const pool = candidates(state, gone.horizon).filter((c) => !sameShape(c, gone));

  let pick: ActionStep | undefined;
  let heard: string | undefined;

  switch (reason) {
    case "uncomfortable-channel":
      // The channel is already in `avoidChannels`, so the pool is clean of it.
      pick = pool[0];
      heard = gone.channel ? PLAN_COPY.heard["uncomfortable-channel"](CHANNELS[gone.channel].phrase) : undefined;
      break;
    case "too-much-effort": {
      const lighter = pool.find((c) => c.effort < gone.effort);
      pick = lighter ?? pool[0];
      // Only say "lighter" when it is.
      heard = lighter ? PLAN_COPY.heard["too-much-effort"] : undefined;
      break;
    }
    case "not-relevant": {
      const different = pool.find((c) => c.area !== gone.area && c.kind !== gone.kind) ?? pool.find((c) => c.area !== gone.area);
      pick = different ?? pool[0];
      heard = different ? PLAN_COPY.heard["not-relevant"] : undefined;
      break;
    }
    case "wrong-timing": {
      pick = pool[0];
      heard = state.decisions[gone.id]?.returnsOn
        ? PLAN_COPY.heard["wrong-timing"](datePhrase(state.decisions[gone.id].returnsOn!))
        : undefined;
      break;
    }
    case "already-done":
      pick = pool[0];
      heard = PLAN_COPY.heard["already-done"];
      break;
    default:
      pick = pool[0];
  }

  if (!pick) return { state, replacement: emptyOf("nothing-suitable") };
  return {
    state: offer(state, pick, true),
    replacement: { step: pick, heard, offerRecord: reason === "already-done" ? true : undefined },
  };
}

/* -----------------------------------------------------------------------------
   THE LOOP
   -------------------------------------------------------------------------- */

export interface Arrival {
  /** The step that was done. */
  from: ActionStep;
  replacement: Replacement;
}

/**
 * Brings the Plan in line with the Loop. A step that is done (its artifact
 * reached used, sent or published, or she said she did it) leaves the Plan and
 * the next one is offered at once. When the outcome has just been recorded,
 * the next one is the one the hand-off names, tied to what she reported.
 */
export function reconcile(
  state: PlanState,
  isDone: (step: ActionStep) => boolean,
  answered?: { recordId: string; reported?: string },
): { state: PlanState; arrivals: Arrival[] } {
  let current = state;
  const arrivals: Arrival[] = [];
  for (const step of liveSteps(state)) {
    if (!isDone(step) || !current.shown.includes(step.id)) continue;
    const mine = answered && step.artifactId === answered.recordId;
    const byWords = mine ? HANDOFF_RULES.find((r) => answered.reported && r.says.test(answered.reported))?.stepId : undefined;
    const named = mine ? NEXT_STEP_AFTER[answered.recordId]?.id : undefined;
    const handsOffTo = byWords ?? (named ? (HANDOFF_STEP[named] ?? named) : undefined);
    const move =
      handsOffTo && stepById(handsOffTo)
        ? handOff(current, step.id, handsOffTo, answered?.reported)
        : complete(current, step.id);
    current = move.state;
    if (move.replacement) arrivals.push({ from: step, replacement: move.replacement });
  }
  return { state: current, arrivals };
}
