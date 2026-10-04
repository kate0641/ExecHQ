/**
 * The Signal Picture's data: one list of dated items, each labelled by where it
 * came from, and the windows that read it.
 *
 * Two sources, never blended without the label:
 *  - "recorded": ExecHQ saw it in the Loop (drafting, finishing, using, the
 *    outcome she logged, a step she marked done);
 *  - "added": she told us, through the add flow, about something outside
 *    ExecHQ it cannot see.
 *
 * Windows: 7 days is each item; 30 days groups them by plan area; 90 days is
 * the direction of travel for each area. A window with too little history says
 * so and shows what there is; it never draws a trend it cannot support.
 * Nothing here returns a number as a score, a percentage or a grade.
 */

import { addDays, daysBetween, type LoopDate, type LoopRecord } from "@/lib/loop";
import { entriesFor, signalOfRecord } from "@/lib/signals";
import type { PresenceItem } from "@/mock/accounts-stub";
import {
  DEFAULT_AREA,
  OTHER_AREA,
  OTHER_AREA_NAME,
  SIGNAL_PICTURE_COPY as C,
  entryTypeOfKind,
  stepById,
  type Direction,
  type WindowDays,
} from "@/mock/plan";
import { SIGNALS } from "@/mock/plan-stub";
import type { TaskCheck } from "@/mock/snapshots";

export type Source = "recorded" | "added";

export interface PictureItem {
  id: string;
  source: Source;
  text: string;
  /** The day it happened. */
  on: LoopDate;
  areaId: string;
  /** The channel, as a tag: "Podcast", "Published". */
  tag?: string;
  /** Her own words, shown as a quotation. */
  quote?: boolean;
  link?: string;
  /** Only what she added can be edited or deleted. */
  editable: boolean;
}

export const areaName = (areaId: string): string =>
  SIGNALS.find((s) => s.id === areaId)?.name ?? OTHER_AREA_NAME;

/** Everything ExecHQ recorded: the Loop's history, and steps she marked done. */
export function recordedItems(records: LoopRecord[], tasks?: Record<string, TaskCheck>): PictureItem[] {
  const out: PictureItem[] = [];
  for (const record of records) {
    const areaId = signalOfRecord(record.id) ?? OTHER_AREA;
    entriesFor(record).forEach((entry, i) => {
      out.push({
        id: `${record.id}:${i}`,
        source: "recorded",
        text: entry.text,
        on: entry.on,
        areaId,
        quote: entry.quote,
        tag: entry.source === "reported" && record.channel ? record.channel : undefined,
        editable: false,
      });
    });
  }
  for (const [id, task] of Object.entries(tasks ?? {})) {
    const step = stepById(id);
    if (!step || task.dropped || !task.doneOn) continue;
    out.push({ id: `task:${id}`, source: "recorded", text: C.did(step.title), on: task.doneOn, areaId: step.area, editable: false });
  }
  return out;
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
      tag: entryTypeOfKind(p.kind).label,
      link: p.link,
      editable: p.id.startsWith("added-"),
    }));
}

/** Newest first; on the same day, the later one in the list first. */
export function newestFirst(items: PictureItem[]): PictureItem[] {
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => (a.item.on === b.item.on ? b.i - a.i : a.item.on < b.item.on ? 1 : -1))
    .map(({ item }) => item);
}

/** Days of record she has: from the day her plan began, today included. */
export function historyDays(startedOn: LoopDate, today: LoopDate): number {
  return Math.max(1, daysBetween(startedOn, today) + 1);
}

/** Items inside the window, today included. */
export function inWindow(items: PictureItem[], today: LoopDate, days: number): PictureItem[] {
  const from = addDays(today, -(days - 1));
  return items.filter((i) => i.on >= from && i.on <= today);
}

/** Whether the history behind a window is long enough to read it fully. */
export function windowIsFull(history: number, days: WindowDays): boolean {
  return history >= days;
}

export interface AreaGroup {
  areaId: string;
  name: string;
  recorded: PictureItem[];
  added: PictureItem[];
}

/** Items grouped by plan area in the plan's own order, each group split by source. */
export function byArea(items: PictureItem[]): AreaGroup[] {
  const order = [...SIGNALS.map((s) => s.id), OTHER_AREA];
  return order
    .map((areaId) => {
      const own = newestFirst(items.filter((i) => i.areaId === areaId));
      return {
        areaId,
        name: areaName(areaId),
        recorded: own.filter((i) => i.source === "recorded"),
        added: own.filter((i) => i.source === "added"),
      };
    })
    .filter((g) => g.recorded.length + g.added.length > 0);
}

/** The last half of a window against the half before it, in words. Only read
 *  when the whole window has history; the caller checks. */
export function directionOf(items: PictureItem[], today: LoopDate, days: WindowDays): Direction {
  const half = days / 2;
  const mid = addDays(today, -(half - 1));
  const from = addDays(today, -(days - 1));
  const later = items.filter((i) => i.on >= mid && i.on <= today).length;
  const earlier = items.filter((i) => i.on >= from && i.on < mid).length;
  return later > earlier ? "building" : later < earlier ? "quieter" : "steady";
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
