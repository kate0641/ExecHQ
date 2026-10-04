/**
 * Calendar arithmetic on plain YYYY-MM-DD days, so nothing depends on the time
 * zone of whoever is looking. Weeks start on Monday.
 */

import { addDays, type LoopDate } from "@/lib/loop";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface Month {
  y: number;
  /** 1 to 12. */
  m: number;
}

export const monthOf = (date: LoopDate): Month => ({ y: Number(date.slice(0, 4)), m: Number(date.slice(5, 7)) });

export const monthKey = (month: Month): string => `${month.y}-${String(month.m).padStart(2, "0")}`;

export const shiftMonth = (month: Month, by: number): Month => {
  const index = month.y * 12 + (month.m - 1) + by;
  return { y: Math.floor(index / 12), m: (index % 12) + 1 };
};

export const monthLabel = (month: Month): string => `${MONTH_NAMES[month.m - 1]} ${month.y}`;

/** The weekday of a day, with Monday as 0. */
export function weekdayIndex(date: LoopDate): number {
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** Every day in the month's weeks, Monday first, as whole rows of seven. */
export function monthGrid(month: Month): LoopDate[] {
  const first = `${monthKey(month)}-01`;
  const start = addDays(first, -weekdayIndex(first));
  const last = addDays(`${monthKey(shiftMonth(month, 1))}-01`, -1);
  const length = Math.ceil((weekdayIndex(first) + Number(last.slice(8, 10))) / 7) * 7;
  return Array.from({ length }, (_, i) => addDays(start, i));
}

/** "Thursday 29 October". */
export function longDay(date: LoopDate): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

/** "Tue 27 Oct". */
export function dayLabel(date: LoopDate): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()].slice(0, 3)}`;
}
