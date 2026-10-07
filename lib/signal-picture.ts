/**
 * The Signal Picture's data: one list of dated items, each labelled by where it
 * came from, and the things that read it.
 *
 * Two sources, never blended without the label:
 *  - "recorded": ExecHQ saw it in the Loop (drafting, finishing, using, the
 *    outcome she logged, a step she marked done);
 *  - "added": she told us, through the add flow, about something outside
 *    ExecHQ it cannot see.
 *
 * Each Signals concept draws it differently: months along a path, dots in four
 * territories, or rows of a thing and what came of it. Nothing here returns a
 * number as a score, a percentage or a grade.
 */

import { addDays, daysBetween, type LoopDate, type LoopRecord } from "@/lib/loop";
import { entriesFor, signalOfRecord } from "@/lib/signals";
import type { PresenceItem } from "@/mock/accounts-stub";
import {
  ACTION_QUEUE,
  ACTIVITY_OF_ARTIFACT,
  ACTIVITY_OF_CHANNEL,
  DEFAULT_AREA,
  OTHER_AREA,
  SIGNAL_PICTURE_COPY as C,
  entryTypeOfKind,
  stepById,
  type ActivityType,
} from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { isDone } from "@/lib/rings";
import type { TaskCheck } from "@/mock/snapshots";

export type Source = "recorded" | "added";

export interface PictureItem {
  id: string;
  source: Source;
  text: string;
  /** The day it happened. */
  on: LoopDate;
  areaId: string;
  /** The kind of activity, as she would say it. */
  activity: ActivityType;
  /** The channel, as a tag: "Podcast", "Published". */
  tag?: string;
  /** Her own words, shown as a quotation. */
  quote?: boolean;
  link?: string;
  /** What came of it, in her words. Only what she typed; never worked out. */
  impact?: string;
  /** Only what she added can be edited or deleted. */
  editable: boolean;
}

/** The activity type of an artifact she made: its step's channel if the plan
 *  names one (a pitch to a podcast is a podcast), else what the kind of
 *  artifact is. A pitch with no channel stays inside the organisation. */
export function activityOfRecord(record: LoopRecord): ActivityType {
  const step = ACTIONS.find((a) => a.artifactId === record.id);
  const channel = step ? stepById(step.id)?.channel : undefined;
  return channel ? ACTIVITY_OF_CHANNEL[channel] : (ACTIVITY_OF_ARTIFACT[record.kind] ?? "inside");
}

/** The activity type of something she added, from its kind. */
export function activityOfKind(kind: string): ActivityType {
  return kind === "writing" ? "publishing" : kind === "speaking" || kind === "podcast" || kind === "press" ? kind : "other";
}

/** Everything ExecHQ recorded: the Loop's history, and steps she marked done. */
export function recordedItems(records: LoopRecord[], tasks?: Record<string, TaskCheck>): PictureItem[] {
  const out: PictureItem[] = [];
  for (const record of records) {
    const areaId = signalOfRecord(record.id) ?? OTHER_AREA;
    const activity = activityOfRecord(record);
    entriesFor(record).forEach((entry, i) => {
      out.push({
        id: `${record.id}:${i}`,
        source: "recorded",
        text: entry.text,
        on: entry.on,
        areaId,
        activity,
        quote: entry.quote,
        tag: entry.source === "reported" && record.channel ? record.channel : undefined,
        editable: false,
      });
    });
  }
  for (const [id, task] of Object.entries(tasks ?? {})) {
    const step = stepById(id);
    if (!step || task.dropped || !task.doneOn) continue;
    out.push({ id: `task:${id}`, source: "recorded", text: C.did(step.title), on: task.doneOn, areaId: step.area, activity: step.channel ? ACTIVITY_OF_CHANNEL[step.channel] : "inside", editable: false });
  }
  return out;
}

/**
 * What ExecHQ recorded for her in the last week that she has not hidden,
 * newest first: the things the page tells her it added, so she is not left to
 * wonder whether she added them herself.
 */
export function newlyRecorded(recorded: readonly PictureItem[], today: LoopDate, hidden: readonly string[]): PictureItem[] {
  const since = addDays(today, -7);
  return recorded
    .filter((i) => i.source === "recorded" && i.on > since && i.on <= today && !hidden.includes(i.id))
    .sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0));
}

/**
 * Things already in her picture that may be what she is about to add: the same
 * kind of thing, within three days of the date she gave, closest first. Not
 * "something else", which is too loose to say. Used to ask "is it this one?"
 * before she adds a second copy of what ExecHQ recorded or she added earlier.
 */
export function likelyDuplicates(items: readonly PictureItem[], kind: string, on: LoopDate, ignoreId?: string): PictureItem[] {
  const activity = activityOfKind(kind);
  if (activity === "other") return [];
  return items
    .filter((i) => i.id !== ignoreId && i.activity === activity && Math.abs(daysBetween(i.on, on)) <= 3)
    .sort((a, b) => Math.abs(daysBetween(a.on, on)) - Math.abs(daysBetween(b.on, on)))
    .slice(0, 2);
}

/** What she added: the earlier record and anything she has entered since. */
export function addedItems(presence: readonly PresenceItem[], today: LoopDate): PictureItem[] {
  return presence
    .filter((p) => (p.happenedOn ?? p.on) <= today)
    .map((p) => ({
      id: p.id,
      source: "added" as const,
      text: p.note || (p.where ? `${p.title} · ${p.where}` : p.title),
      on: p.happenedOn ?? p.on,
      areaId: p.area ?? DEFAULT_AREA,
      activity: activityOfKind(p.kind),
      tag: entryTypeOfKind(p.kind).label,
      link: p.link,
      impact: p.impact,
      editable: p.id.startsWith("added-"),
    }));
}

/** Days of record she has: from the day her plan began, today included. */
export function historyDays(startedOn: LoopDate, today: LoopDate): number {
  return Math.max(1, daysBetween(startedOn, today) + 1);
}

export interface Offer {
  recordId: string;
  title: string;
  usedOn: LoopDate;
}

/**
 * The moment to offer her the entry flow: a piece she has just marked
 * published, which she may want to add with its link. At most one, none
 * already added from it, and only while it is fresh. It is an offer, never a
 * standing form.
 */
export function offerFor(records: LoopRecord[], presence: readonly PresenceItem[], today: LoopDate): Offer | undefined {
  const fresh = addDays(today, -2);
  const record = records.find(
    (r) =>
      r.kind === "thought-leadership" &&
      r.usedOn !== undefined &&
      r.usedOn >= fresh &&
      r.usedOn <= today &&
      !presence.some((p) => p.fromRecord === r.id)
  );
  return record && record.usedOn ? { recordId: record.id, title: record.title, usedOn: record.usedOn } : undefined;
}

/**
 * The next step that would add a circle to the growth path: the first one she
 * has accepted and not finished that runs through a channel she can be seen
 * on, such as a pitch, a talk or a post. Work inside the organisation never
 * qualifies, so it is not shown on the path.
 */
export function nextOutsideStep(records: LoopRecord[], tasks: Record<string, TaskCheck> | undefined) {
  return ACTION_QUEUE.find((s) => s.status === "accepted" && s.channel !== undefined && !isDone(s, records, tasks));
}

export interface GrowthMonth {
  /** "Jul". */
  label: string;
  /** Her things from outside the organisation that month, oldest first. */
  items: PictureItem[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * One entry for each calendar month from the month her plan began to the
 * month of today, each holding what she added or ExecHQ recorded outside the
 * organisation in it. A month with nothing is still there, empty, never
 * skipped. Work inside the organisation is Momentum's to count, so it is not
 * a circle here.
 */
export function growthMonths(items: PictureItem[], startedOn: LoopDate, today: LoopDate): GrowthMonth[] {
  const first = new Date(`${startedOn}T00:00:00`);
  const last = new Date(`${today}T00:00:00`);
  const out: GrowthMonth[] = [];
  const index = new Map<string, GrowthMonth>();
  for (let m = new Date(first.getFullYear(), first.getMonth(), 1); m <= last; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
    const month = { label: MONTH_NAMES[m.getMonth()], items: [] as PictureItem[] };
    index.set(`${m.getFullYear()}-${m.getMonth()}`, month);
    out.push(month);
  }
  for (const item of [...items].sort((a, b) => (a.on < b.on ? -1 : 1))) {
    if (item.activity === "inside" || item.on < startedOn || item.on > today) continue;
    const d = new Date(`${item.on}T00:00:00`);
    index.get(`${d.getFullYear()}-${d.getMonth()}`)?.items.push(item);
  }
  return out;
}

export interface CameOfRow {
  id: string;
  /** What she did, as the picture names it. */
  did: string;
  /** The day it happened. */
  on: LoopDate;
  /** What she says came of it, in her words. Absent when she has not said. */
  came?: string;
  /** The entry behind it when she added it herself, so she can edit it. */
  item?: PictureItem;
}

/**
 * A row for each thing she did and what she says came of it, newest first.
 *  - Things she added from outside ExecHQ (published, spoke, a podcast, press)
 *    always get a row, with her note of what came of it or none yet.
 *  - A Loop record she has used gets a row when she has logged an outcome in
 *    her own words, or when she has said it went out and nothing has come yet.
 * Drafting, editing and anything not yet used never appears: nothing came of
 * it yet, and Momentum counts it. Her words are never changed or scored.
 */
export function cameOfRows(items: PictureItem[], startedOn: LoopDate, today: LoopDate): CameOfRow[] {
  const since = items.filter((i) => i.on >= startedOn && i.on <= today);
  const rows: CameOfRow[] = [];
  for (const item of since.filter((i) => i.source === "added")) {
    rows.push({ id: item.id, did: item.text, on: item.on, came: item.impact, item });
  }
  const byRecord = new Map<string, PictureItem[]>();
  for (const item of since.filter((i) => i.source === "recorded" && !i.id.startsWith("task:"))) {
    const key = item.id.split(":")[0];
    byRecord.set(key, [...(byRecord.get(key) ?? []), item]);
  }
  for (const [key, group] of byRecord) {
    const said = group.filter((i) => i.quote);
    const used = group.filter((i) => !i.quote && i.tag);
    /* The first thing she said about it is that she used it; later lines are follow-ups. */
    const did = used.sort((a, b) => (a.on < b.on ? -1 : 1))[0];
    if (!did) continue;
    rows.push({ id: `record:${key}`, did: did.text, on: did.on, came: said.sort((a, b) => (a.on < b.on ? 1 : -1))[0]?.text });
  }
  return rows.sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0));
}
