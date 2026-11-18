/**
 * When, in words. A step or a stage is "this week", "next month" or "this quarter", never a
 * day, because a day on a card reads as a deadline. The days still exist underneath, so her
 * calendar and the windows keep working; this only says which stretch of time a day falls in.
 *
 * Weeks run Monday to Sunday, as the calendar's do. Quarters are the calendar's: January to
 * March and so on.
 */

import { addDays, type LoopDate } from "@/lib/loop";
import { weekdayIndex } from "@/lib/calendar";

export type TimeBucket = "this-week" | "next-week" | "this-month" | "next-month" | "this-quarter" | "next-quarter" | "later";

export const TIME_WORDS: Record<TimeBucket, string> = {
  "this-week": "This week",
  "next-week": "Next week",
  "this-month": "This month",
  "next-month": "Next month",
  "this-quarter": "This quarter",
  "next-quarter": "Next quarter",
  later: "Later",
};

type Stretch = Exclude<TimeBucket, "later">;
const ORDER: Stretch[] = ["this-week", "next-week", "this-month", "next-month", "this-quarter", "next-quarter"];

const lastOfMonth = (y: number, m: number): LoopDate => addDays(`${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-01`, -1);

/** The last day of each stretch, counted from `today`. */
function ends(today: LoopDate): Record<Stretch, LoopDate> {
  const y = Number(today.slice(0, 4));
  const m = Number(today.slice(5, 7));
  const quarterEndMonth = Math.ceil(m / 3) * 3;
  const nextQuarterEndMonth = quarterEndMonth + 3;
  const week = addDays(today, 6 - weekdayIndex(today));
  return {
    "this-week": week,
    "next-week": addDays(week, 7),
    "this-month": lastOfMonth(y, m),
    "next-month": lastOfMonth(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1),
    "this-quarter": lastOfMonth(y, quarterEndMonth),
    "next-quarter": lastOfMonth(nextQuarterEndMonth > 12 ? y + 1 : y, nextQuarterEndMonth > 12 ? nextQuarterEndMonth - 12 : nextQuarterEndMonth),
  };
}

/** The first stretch a day falls in, nearest first. A day already past is this week. */
export function bucketOf(date: LoopDate, today: LoopDate): TimeBucket {
  const end = ends(today);
  return ORDER.find((bucket) => date <= end[bucket]) ?? "later";
}

/** "This week", "Next month": the words for a day. */
export function whenWords(date: LoopDate, today: LoopDate): string {
  return TIME_WORDS[bucketOf(date, today)];
}

export interface TimeChoice {
  bucket: Stretch;
  label: string;
  /** The day it stands for: the last weekday in the stretch, never before today. */
  date: LoopDate;
}

const isWeekday = (date: LoopDate) => weekdayIndex(date) < 5;

/**
 * The stretches she can choose between, nearest first. A stretch that would be empty (this
 * month, when the month ends inside next week) is left out, so every choice names a day that
 * `bucketOf` puts back in the same stretch.
 */
export function timeChoices(today: LoopDate, from: LoopDate = today): TimeChoice[] {
  const end = ends(today);
  const out: TimeChoice[] = [];
  let covered = addDays(from, -1);
  for (const bucket of ORDER) {
    if (end[bucket] <= covered) continue;
    let date = end[bucket];
    while (!isWeekday(date) && date > addDays(covered, 1)) date = addDays(date, -1);
    out.push({ bucket, label: TIME_WORDS[bucket], date: date < today ? today : date });
    covered = end[bucket];
  }
  return out;
}
