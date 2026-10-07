/**
 * The prototype's live Loop: which snapshot is showing, and every change a
 * reviewer has made in it.
 *
 * Same shape as the viewport and toolbar stores: a tiny external store read
 * through useSyncExternalStore and mirrored to localStorage, so a follow-up
 * answered on one page is answered on every page, and still answered after a
 * reload. React renders the server snapshot first (Day one, untouched) and
 * swaps in the stored one after hydration, so the two never disagree on the
 * first paint.
 *
 * The snapshots are the five homepage states (`mock/homepage.ts`). Picking
 * one from the dock starts it fresh, so the state the dock shows — read from
 * the Loop, never remembered — always matches what was picked. Changes made
 * in it are kept until another is picked, across pages and reloads.
 *
 * Every move is made on the snapshot's own "today", never the reviewer's clock.
 */

import { useMemo, useSyncExternalStore } from "react";
import { reopenBriefing, useBriefingEverClosed } from "@/lib/briefing-dismissal";
import { resetPresence, useAddedPresence, useBaseline } from "@/lib/presence-store";
import { reopenSparks, useDismissedSparks } from "@/lib/spark-dismissal";
import { resetSignalNotices } from "@/lib/signal-notices";
import {
  abandonRecord,
  answerFollowUp,
  closeRecord,
  lastWorkedOn,
  markReady,
  markUsed,
  nextFollowUp,
  startEditing,
  type LoopRecord,
  type OutcomeType,
} from "@/lib/loop";
import type { Account } from "@/mock/account";
import {
  DEFAULT_SNAPSHOT,
  FALLBACK_NEXT_STEP,
  NEXT_STEP_AFTER,
  SNAPSHOT_IDS,
  SNAPSHOTS,
  type Recommendation,
  type Snapshot,
  type SnapshotId,
  type SnapshotState,
} from "@/mock/snapshots";
import { resetRoadmap, useRoadmapChanged } from "@/lib/plan-store";
import { homeStateOf, type HomeStateId } from "@/mock/homepage";

const STORAGE_KEY = "exechq.loop";
/** Bumped whenever the stored shape or the snapshots' starting data change,
 *  so an old save is dropped rather than half-read. */
const STORAGE_VERSION = 10;

export interface LoopStoreState {
  snapshot: SnapshotId;
  /** Only the snapshots a reviewer has changed. The rest read from
   *  `SNAPSHOTS` as they started. */
  changes: Partial<Record<SnapshotId, SnapshotState>>;
}

const INITIAL: LoopStoreState = { snapshot: DEFAULT_SNAPSHOT, changes: {} };

const listeners = new Set<() => void>();
let cached: LoopStoreState | undefined;

function isSnapshotId(value: unknown): value is SnapshotId {
  return typeof value === "string" && (SNAPSHOT_IDS as readonly string[]).includes(value);
}

function parse(raw: string | null): LoopStoreState {
  if (!raw) return INITIAL;
  try {
    const parsed = JSON.parse(raw) as { version?: number } & Partial<LoopStoreState>;
    if (parsed.version !== STORAGE_VERSION || !isSnapshotId(parsed.snapshot)) return INITIAL;
    return { snapshot: parsed.snapshot, changes: parsed.changes ?? {} };
  } catch {
    return INITIAL;
  }
}

function read(): LoopStoreState {
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage disabled: start fresh, and changes last until the tab closes.
    return INITIAL;
  }
}

export function getLoopState(): LoopStoreState {
  if (cached === undefined) cached = read();
  return cached;
}

export function getServerLoopState(): LoopStoreState {
  return INITIAL;
}

function write(next: LoopStoreState): void {
  cached = next;
  try {
    if (next.snapshot === DEFAULT_SNAPSHOT && Object.keys(next.changes).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, ...next })
      );
    }
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  cached = parse(event.newValue);
  for (const listener of listeners) listener();
}

export function subscribeToLoop(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

/* -----------------------------------------------------------------------------
   READING AND CHANGING
   -------------------------------------------------------------------------- */

/** A snapshot as it stands now: its starting point with the reviewer's
 *  changes laid over. */
export function currentSnapshot(state: LoopStoreState): Snapshot {
  const start = SNAPSHOTS[state.snapshot];
  const changed = state.changes[state.snapshot];
  return changed ? { ...start, ...changed } : start;
}

function update(change: (current: Snapshot) => Partial<SnapshotState>): void {
  const state = getLoopState();
  const current = currentSnapshot(state);
  const next = { ...current, ...change(current) };
  write({
    ...state,
    changes: {
      ...state.changes,
      [state.snapshot]: {
        account: next.account,
        records: next.records,
        recommendations: next.recommendations,
        justAnswered: next.justAnswered,
        tasks: next.tasks,
        choices: next.choices,
        asked: next.asked,
      },
    },
  });
}

/** Any move on a record ends the "just answered" moment, unless the move is
 *  itself an answer, which starts one. */
function updateRecord(
  id: string,
  change: (record: LoopRecord, today: string) => LoopRecord,
  justAnswered?: string
): void {
  update(({ records, today }) => ({
    records: records.map((record) => (record.id === id ? change(record, today) : record)),
    justAnswered,
  }));
}

/** Pick a scenario, fresh: any earlier changes to it are dropped. */
export function selectSnapshot(snapshot: SnapshotId): void {
  const changes = { ...getLoopState().changes };
  delete changes[snapshot];
  write({ snapshot, changes });
}

/** Every snapshot back as it started. Keeps the one being looked at. */
export function resetLoop(): void {
  write({ snapshot: getLoopState().snapshot, changes: {} });
  reopenBriefing();
  reopenSparks();
  resetSignalNotices();
  resetPresence();
  resetRoadmap();
}

/** The next step offered once this record's outcome is logged. Stubbed. */
export function nextStepAfter(record: LoopRecord): Recommendation {
  return NEXT_STEP_AFTER[record.id] ?? FALLBACK_NEXT_STEP;
}

export const loopActions = {
  edit: (id: string) => updateRecord(id, (r, today) => startEditing(r, today)),
  markReady: (id: string, answers?: Parameters<typeof markReady>[2]) =>
    updateRecord(id, (r, today) => markReady(r, today, answers)),
  markUsed: (id: string, answers?: Parameters<typeof markUsed>[2]) =>
    updateRecord(id, (r, today) => markUsed(r, today, answers)),
  answer: (id: string, answer: { type: OutcomeType; detail?: string; notes?: string }) =>
    updateRecord(id, (r, today) => answerFollowUp(r, today, answer), id),
  /** She says, from her Signal Picture, what came of something she used: the same answer as the
   *  check-in, without the "just answered" moment that belongs to the homepage. If an outcome is
   *  already logged it only takes her words. */
  report: (id: string, answer: { type: OutcomeType; detail?: string }) =>
    updateRecord(id, (r, today) => (r.outcome ? { ...r, outcome: { ...r.outcome, detail: answer.detail } } : answerFollowUp(r, today, answer))),
  /* Actions with no draft, on her word. Doing one ends "just answered". */
  completeTask: (id: string) =>
    update(({ tasks, today }) => ({ tasks: { ...tasks, [id]: { doneOn: today } }, justAnswered: undefined })),
  dropTask: (id: string) =>
    update(({ tasks, today }) => ({ tasks: { ...tasks, [id]: { doneOn: today, dropped: true } }, justAnswered: undefined })),
  answerTask: (id: string, type: OutcomeType) =>
    update(({ tasks, today }) => ({
      tasks: { ...tasks, [id]: { doneOn: tasks?.[id]?.doneOn ?? today, outcome: { type, on: today } } },
    })),
  noteTask: (id: string, detail: string) =>
    update(({ tasks }) => {
      const task = tasks?.[id];
      return task?.outcome ? { tasks: { ...tasks, [id]: { ...task, outcome: { ...task.outcome, detail } } } } : {};
    }),
  /** Adds her note to an outcome she has just logged (the check-in saves the
   *  answer on one tap, and offers the note after). Keeps "just answered". */
  noteOutcome: (id: string, detail: string) =>
    updateRecord(id, (r) => (r.outcome ? { ...r, outcome: { ...r.outcome, detail } } : r), id),
  /** Leave the "just answered" moment without changing anything else, e.g.
   *  to answer the other follow-up that is waiting. */
  moveOn: () => update(() => ({ justAnswered: undefined })),
  abandon: (id: string) => updateRecord(id, (r, today) => abandonRecord(r, today)),
  /** Take up the offered next step: the record closes, and the step becomes
   *  the one next thing. */
  takeNextStep: (id: string) =>
    update(({ records, recommendations, today }) => {
      const record = records.find((r) => r.id === id);
      if (!record) return {};
      const step = nextStepAfter(record);
      return {
        records: records.map((r) => (r.id === id ? closeRecord(r, today) : r)),
        recommendations: [step, ...recommendations.filter((rec) => rec.id !== step.id)],
        justAnswered: undefined,
      };
    }),
  /** Set the offered next step aside: the record closes, nothing else moves. */
  setNextStepAside: (id: string) => updateRecord(id, (r, today) => closeRecord(r, today)),
  /* The map (Homepage Concept 4). Starting, skipping and asking for a new
     action are her choices; none of them touches a record or a ring segment. */
  startAction: (id: string) =>
    update(({ choices, today }) => ({ choices: { ...choices, [id]: { decision: "started", on: today } } })),
  skipAction: (id: string, why?: { reason?: string; note?: string }) =>
    update(({ choices, today }) => ({
      choices: { ...choices, [id]: { decision: "skipped", on: today, ...(why?.reason ? { reason: why.reason } : {}), ...(why?.note ? { note: why.note } : {}) } },
    })),
  /** A ring is complete: its finished actions leave it, and the next new
   *  action for that horizon joins. Reports whether there was one to add. */
  askForNew: (retire: string[], add: string | undefined) => {
    update(({ choices, asked, today }) => {
      const retired = Object.fromEntries(retire.map((id) => [id, { decision: "retired" as const, on: today }]));
      return { choices: { ...choices, ...retired }, asked: add ? [...(asked ?? []), add] : asked };
    });
  },
  updateAccount: (change: Partial<Account>) =>
    update(({ account }) => ({ account: { ...account, ...change } })),
};

/* -----------------------------------------------------------------------------
   THE HOOK
   -------------------------------------------------------------------------- */

export interface LoopView extends Snapshot {
  /** The one follow-up to ask now, if any. */
  followUp: LoopRecord | undefined;
  /** The open artifact most recently touched: "pick up where you left off". */
  lastWorkedOn: LoopRecord | undefined;
  /** The one next step: the first recommendation. */
  nextStep: Recommendation | undefined;
  /** True when this snapshot has changes a reset would undo. */
  changed: boolean;
  /** True when any snapshot has, or the Briefing is closed: what the dock's
   *  reset undoes. */
  anyChanged: boolean;
  /** Which of the five homepage states the Loop is in now. */
  homeState: HomeStateId;
}

/** The live Loop for whichever snapshot is showing. */
export function useLoop(): LoopView {
  const state = useSyncExternalStore(subscribeToLoop, getLoopState, getServerLoopState);
  const briefingClosed = useBriefingEverClosed();
  const sparksDismissed = useDismissedSparks().length > 0;
  const presenceAdded = useAddedPresence().length > 0;
  const baselineSaved = useBaseline() !== null;
  const roadmapChanged = useRoadmapChanged();
  return useMemo(() => {
    const snapshot = currentSnapshot(state);
    const followUp = nextFollowUp(snapshot.records, snapshot.today);
    return {
      ...snapshot,
      homeState: homeStateOf(snapshot, Boolean(followUp)),
      followUp,
      lastWorkedOn: lastWorkedOn(snapshot.records),
      nextStep: snapshot.recommendations[0],
      changed: state.changes[state.snapshot] !== undefined,
      anyChanged: Object.keys(state.changes).length > 0 || briefingClosed || sparksDismissed || presenceAdded || baselineSaved || roadmapChanged,
    };
  }, [state, briefingClosed, sparksDismissed, presenceAdded, baselineSaved, roadmapChanged]);
}
