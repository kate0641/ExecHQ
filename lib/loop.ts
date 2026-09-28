/**
 * The Loop: the status and outcome record on every artifact ExecHQ produces.
 *
 * Pure rules, no screens and no storage. Every function takes a record (or the
 * list of them) and returns a new one; nothing is changed in place, so the
 * store in front of this can keep a history and a reset. "Today" is always
 * passed in, because the prototype runs on each snapshot's fixed date, not the
 * reviewer's clock.
 *
 * The seven states are the PRD's, from the Sprint 2 brief:
 *
 *   drafted → in-progress → ready → used → waiting → outcome → closed
 *
 * with three deliberate short cuts, because the brief's second risk is that the
 * Loop only closes if marking an artifact used takes one tap:
 *
 * - An artifact can be marked used from draft or in progress. Nobody has to
 *   say it is ready first.
 * - Marking it used schedules the check-back at once, so it moves straight to
 *   waiting. It stays at plain "used" only if the user asked not to be
 *   checked on.
 * - An outcome can be reported whenever it is used or waiting, without waiting
 *   for the follow-up to arrive.
 *
 * Wording and defaults are in `mock/loop.ts`, so designers can change them.
 */

import {
  ARTIFACT_KINDS,
  FOLLOW_UP_POLICY,
  OUTCOME_READBACK,
  PROGRESS_COPY,
  STATE_DETAILS,
  STATE_LABELS,
  type ArtifactKind,
} from "@/mock/loop";

export type { ArtifactKind } from "@/mock/loop";

/** A calendar date, `YYYY-MM-DD`. Days, not moments: the Loop never needs a
 *  time of day, and plain dates compare correctly as strings. */
export type LoopDate = string;

export type LoopState =
  | "drafted"
  | "in-progress"
  | "ready"
  | "used"
  | "waiting"
  | "outcome"
  | "closed";

export type OutcomeType =
  | "positive"
  | "neutral"
  | "negative"
  | "no-response-yet"
  | "no-longer-relevant";

export interface Outcome {
  type: OutcomeType;
  on: LoopDate;
  /** What happened, in the user's words. Optional. */
  detail?: string;
  /** Private notes or evidence. Optional, and never shown back unasked. */
  notes?: string;
}

/** One entry in a record's history: what happened, and when. Kept for the
 *  Plan's activity record and for export. */
export type LoopEvent =
  | { type: "drafted"; on: LoopDate }
  | { type: "edited"; on: LoopDate }
  | { type: "ready"; on: LoopDate; intendedUse?: string }
  | { type: "used"; on: LoopDate; channel?: string }
  | { type: "nothing-yet"; on: LoopDate; checkBackOn: LoopDate }
  | { type: "outcome"; on: LoopDate; outcome: OutcomeType }
  | { type: "closed"; on: LoopDate; reason: "done" | "abandoned" | "no-longer-relevant" };

export interface LoopRecord {
  id: string;
  kind: ArtifactKind;
  /** The artifact's name as a heading: "Your story". */
  title: string;
  /** The same, as it reads mid-sentence: "your leadership story". Used by
   *  the follow-up question, so it must sound right after "You used…". */
  name: string;
  createdOn: LoopDate;
  /** The Active Landscape recommendation it came from, if any. */
  recommendation?: string;
  state: LoopState;
  /** How the user said they'd use it, when they marked it ready. */
  intendedUse?: string;
  /** Days from use to check-back, chosen when marked ready. `null` means
   *  "don't check back". Unset means the kind's default. */
  checkBackDays?: number | null;
  usedOn?: LoopDate;
  /** Where or to whom it went. Optional. */
  channel?: string;
  /** When the next follow-up is due, while waiting. */
  checkBackOn?: LoopDate;
  /** How many times the user has answered "Nothing yet". */
  nothingYet: number;
  outcome?: Outcome;
  history: LoopEvent[];
}

/* -----------------------------------------------------------------------------
   DATES
   -------------------------------------------------------------------------- */

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toUtc(date: LoopDate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function addDays(date: LoopDate, days: number): LoopDate {
  return new Date(toUtc(date).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`. Negative if `to` is earlier. */
export function daysBetween(from: LoopDate, to: LoopDate): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / DAY_MS);
}

/** "on 13 October": a fixed date, for records read long after the event. */
export function datePhrase(date: LoopDate): string {
  const d = toUtc(date);
  return `on ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** "today", "yesterday", "on Tuesday" (this week), "last Tuesday" (the week
 *  before), or "on 13 October": how an advisor would say when something
 *  happened. Weeks start on Monday. */
export function whenPhrase(date: LoopDate, today: LoopDate): string {
  const ago = daysBetween(date, today);
  const weekday = WEEKDAYS[toUtc(date).getUTCDay()];
  /** Days since this week's Monday: 0 on a Monday, 6 on a Sunday. */
  const intoWeek = (toUtc(today).getUTCDay() + 6) % 7;
  if (ago === 0) return "today";
  if (ago === 1) return "yesterday";
  if (ago > 1 && ago <= intoWeek) return `on ${weekday}`;
  if (ago > intoWeek && ago <= intoWeek + 7) return `last ${weekday}`;
  return datePhrase(date);
}

/** A date ahead, said plainly: "today", "tomorrow", "on Friday" (within a
 *  week), or "on 3 November". */
export function aheadPhrase(date: LoopDate, today: LoopDate): string {
  const ahead = daysBetween(today, date);
  if (ahead <= 0) return "today";
  if (ahead === 1) return "tomorrow";
  if (ahead < 7) return `on ${WEEKDAYS[toUtc(date).getUTCDay()]}`;
  return datePhrase(date);
}

function sameMonth(a: LoopDate, b: LoopDate): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

/* -----------------------------------------------------------------------------
   MAKING AND MOVING RECORDS
   -------------------------------------------------------------------------- */

/** A Loop record is created the moment the artifact exists. */
export function createRecord(fields: {
  id: string;
  kind: ArtifactKind;
  title: string;
  name: string;
  on: LoopDate;
  recommendation?: string;
}): LoopRecord {
  const { on, ...rest } = fields;
  return {
    ...rest,
    createdOn: on,
    state: "drafted",
    nothingYet: 0,
    history: [{ type: "drafted", on }],
  };
}

/** Everything the user can do to a record in its current state. The UI
 *  offers these and nothing else; the functions below refuse anything else. */
export type LoopAction = "edit" | "ready" | "use" | "answer" | "close" | "abandon";

const ACTIONS: Record<LoopState, LoopAction[]> = {
  drafted: ["edit", "ready", "use", "abandon"],
  "in-progress": ["edit", "ready", "use", "abandon"],
  ready: ["edit", "use", "abandon"],
  used: ["answer"],
  waiting: ["answer"],
  outcome: ["close"],
  closed: [],
};

export function availableActions(record: LoopRecord): LoopAction[] {
  return ACTIONS[record.state];
}

function assertCan(record: LoopRecord, action: LoopAction): void {
  if (!ACTIONS[record.state].includes(action)) {
    throw new Error(`Loop: can't "${action}" ${record.id} while it is ${record.state}.`);
  }
}

/** Revising or gathering inputs. Pausing is simply not coming back yet. */
export function startEditing(record: LoopRecord, on: LoopDate): LoopRecord {
  assertCan(record, "edit");
  return {
    ...record,
    state: record.state === "ready" ? "ready" : "in-progress",
    history: [...record.history, { type: "edited", on }],
  };
}

/** The user says it's usable. The Loop asks how they'll use it and when to
 *  check back; both answers are optional. */
export function markReady(
  record: LoopRecord,
  on: LoopDate,
  answers: { intendedUse?: string; checkBackDays?: number | null } = {}
): LoopRecord {
  assertCan(record, "ready");
  return {
    ...record,
    state: "ready",
    intendedUse: answers.intendedUse ?? record.intendedUse,
    checkBackDays:
      answers.checkBackDays !== undefined ? answers.checkBackDays : record.checkBackDays,
    history: [...record.history, { type: "ready", on, intendedUse: answers.intendedUse }],
  };
}

/** One tap: it was used, sent or published. The check-back is scheduled from
 *  today, by the user's choice, else the one made at ready, else the kind's
 *  default. */
export function markUsed(
  record: LoopRecord,
  on: LoopDate,
  answers: { channel?: string; checkBackDays?: number | null } = {}
): LoopRecord {
  assertCan(record, "use");
  const days =
    answers.checkBackDays !== undefined
      ? answers.checkBackDays
      : record.checkBackDays !== undefined
        ? record.checkBackDays
        : ARTIFACT_KINDS[record.kind].checkBackDays;
  return {
    ...record,
    state: days === null ? "used" : "waiting",
    usedOn: on,
    channel: answers.channel ?? record.channel,
    checkBackOn: days === null ? undefined : addDays(on, days),
    history: [...record.history, { type: "used", on, channel: answers.channel }],
  };
}

/**
 * The answer to "What came of it?", whether the follow-up asked or the user
 * came to say so.
 *
 * - "Nothing yet" keeps it waiting and moves the check-back out.
 * - "No longer relevant" records that and closes it. No next step is offered.
 * - Anything else records the outcome, and a next step is offered.
 */
export function answerFollowUp(
  record: LoopRecord,
  on: LoopDate,
  answer: { type: OutcomeType; detail?: string; notes?: string }
): LoopRecord {
  assertCan(record, "answer");

  if (answer.type === "no-response-yet") {
    const nothingYet = record.nothingYet + 1;
    const gaps = FOLLOW_UP_POLICY.rescheduleDays;
    const checkBackOn = addDays(on, gaps[Math.min(nothingYet, gaps.length) - 1]);
    return {
      ...record,
      state: "waiting",
      nothingYet,
      checkBackOn,
      history: [...record.history, { type: "nothing-yet", on, checkBackOn }],
    };
  }

  const outcome: Outcome = { type: answer.type, on, detail: answer.detail, notes: answer.notes };
  const recorded: LoopRecord = {
    ...record,
    outcome,
    checkBackOn: undefined,
    history: [...record.history, { type: "outcome", on, outcome: answer.type }],
  };

  if (answer.type === "no-longer-relevant") {
    return {
      ...recorded,
      state: "closed",
      history: [...recorded.history, { type: "closed", on, reason: "no-longer-relevant" }],
    };
  }
  return { ...recorded, state: "outcome" };
}

/** Nothing more to do: the next step was taken up or set aside. */
export function closeRecord(record: LoopRecord, on: LoopDate): LoopRecord {
  assertCan(record, "close");
  return {
    ...record,
    state: "closed",
    history: [...record.history, { type: "closed", on, reason: "done" }],
  };
}

/** The user set the draft aside. Not a failure, and never asked about again. */
export function abandonRecord(record: LoopRecord, on: LoopDate): LoopRecord {
  assertCan(record, "abandon");
  return {
    ...record,
    state: "closed",
    checkBackOn: undefined,
    history: [...record.history, { type: "closed", on, reason: "abandoned" }],
  };
}

/* -----------------------------------------------------------------------------
   FOLLOW-UPS
   -------------------------------------------------------------------------- */

/** Due when it's waiting, the check-back date has come, and the Loop hasn't
 *  already stopped asking. */
export function isFollowUpDue(record: LoopRecord, today: LoopDate): boolean {
  return (
    record.state === "waiting" &&
    record.checkBackOn !== undefined &&
    record.checkBackOn <= today &&
    record.nothingYet < FOLLOW_UP_POLICY.maxNothingYet
  );
}

/** Every due follow-up, longest-waiting first. */
export function dueFollowUps(records: LoopRecord[], today: LoopDate): LoopRecord[] {
  return records
    .filter((record) => isFollowUpDue(record, today))
    .sort((a, b) => (a.checkBackOn! < b.checkBackOn! ? -1 : a.checkBackOn! > b.checkBackOn! ? 1 : 0));
}

/** The one follow-up to put in front of the user now, if any. The policy is
 *  one at a time, so the others wait their turn rather than stacking up. */
export function nextFollowUp(records: LoopRecord[], today: LoopDate): LoopRecord | undefined {
  return dueFollowUps(records, today)[0];
}

/** One question, specific to the artifact and the moment:
 *  "You used your leadership story last Tuesday. What came of it?" */
export function followUpQuestion(record: LoopRecord, today: LoopDate): string {
  const verb = ARTIFACT_KINDS[record.kind].usedVerb;
  const when = record.usedOn ? ` ${whenPhrase(record.usedOn, today)}` : "";
  return `You ${verb} ${record.name}${when}. What came of it?`;
}

/* -----------------------------------------------------------------------------
   WHAT THE USER SEES
   -------------------------------------------------------------------------- */

/** The status label, the same wherever the artifact appears. */
export function statusLabel(record: LoopRecord): string {
  if (record.state === "used") return ARTIFACT_KINDS[record.kind].usedLabel;
  return STATE_LABELS[record.state];
}

/** The status's second line, for the states that have one. */
export function statusDetail(record: LoopRecord): string | undefined {
  if (record.state === "in-progress") return STATE_DETAILS["in-progress"];
  if (record.state === "closed") {
    const closed = record.history.findLast((e) => e.type === "closed");
    if (closed?.type === "closed" && closed.reason === "abandoned") return STATE_DETAILS.abandoned;
  }
  return undefined;
}

/** What happened, as the user reported it. States the facts in order and
 *  never says the artifact caused the result. */
export function outcomeSummary(record: LoopRecord): string | undefined {
  if (!record.outcome || !record.usedOn) return undefined;
  const verb = ARTIFACT_KINDS[record.kind].usedVerb;
  const used = `You ${verb} ${record.name} ${datePhrase(record.usedOn)}.`;
  const detail = record.outcome.detail?.trim();
  // The detail is the user's own words, so it is quoted rather than rephrased,
  // and "Afterwards" says what followed without saying what caused it.
  return detail
    ? `${used} Afterwards: \u201c${detail}\u201d`
    : `${used} ${OUTCOME_READBACK[record.outcome.type]}`;
}

/* -----------------------------------------------------------------------------
   PROGRESS
   -------------------------------------------------------------------------- */

export interface LoopProgress {
  /** Artifacts used this calendar month: the PRD's "completed actions". */
  completedThisMonth: number;
  /** Used or waiting, with no outcome yet. */
  awaitingOutcome: number;
  outcomesRecorded: number;
  total: number;
}

export function loopProgress(records: LoopRecord[], today: LoopDate): LoopProgress {
  return {
    completedThisMonth: records.filter(
      (r) => r.usedOn !== undefined && sameMonth(r.usedOn, today) && r.usedOn <= today
    ).length,
    awaitingOutcome: records.filter((r) => r.state === "used" || r.state === "waiting").length,
    outcomesRecorded: records.filter(
      (r) => r.outcome !== undefined && r.outcome.type !== "no-longer-relevant"
    ).length,
    total: records.length,
  };
}

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function inWords(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

/** The progress sentence, in the PRD's model: facts, never a score. */
export function progressSentence(records: LoopRecord[], today: LoopDate): string {
  const { completedThisMonth: done, awaitingOutcome: awaiting, total } = loopProgress(records, today);
  if (done > 0 && awaiting > 0) {
    return `${PROGRESS_COPY.completed(inWords(done), done !== 1)} and have ${PROGRESS_COPY.awaiting(inWords(awaiting), awaiting !== 1)}.`;
  }
  if (done > 0) return `${PROGRESS_COPY.completed(inWords(done), done !== 1)}.`;
  if (awaiting > 0) return `You have ${PROGRESS_COPY.awaiting(inWords(awaiting), awaiting !== 1)}.`;
  if (total === 1 && records[0].createdOn === today) return PROGRESS_COPY.firstToday;
  return PROGRESS_COPY.soFar(inWords(total), total !== 1);
}

/* -----------------------------------------------------------------------------
   PICKING UP
   -------------------------------------------------------------------------- */

/** The date of the last thing that happened to a record. */
export function lastTouched(record: LoopRecord): LoopDate {
  return record.history.reduce((latest, e) => (e.on > latest ? e.on : latest), record.createdOn);
}

/** "Pick up where you left off": the open artifact most recently touched.
 *  Closed ones are finished, so they are never offered to pick up. */
export function lastWorkedOn(records: LoopRecord[]): LoopRecord | undefined {
  return records
    .filter((r) => r.state !== "closed")
    .reduce<LoopRecord | undefined>(
      (latest, r) => (!latest || lastTouched(r) > lastTouched(latest) ? r : latest),
      undefined
    );
}
