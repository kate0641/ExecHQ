/**
 * Where a plan step falls on her calendar.
 *
 * A step has a window, not a date. It gets a suggested day from the event it is
 * tied to (her 1:1, nominations closing) or from its horizon, and shows on the
 * calendar marked "Suggested". Accepting it pins that day. She can move it to
 * any day. A suggestion is never a deadline, and a step never moves on its own
 * once she has pinned it.
 */

import { addDays, type LoopDate } from "@/lib/loop";
import { HORIZON_OFFSET_DAYS, STEP_TIMING, type ActionStep } from "@/mock/plan";

const dow = (date: LoopDate) => new Date(`${date}T00:00:00Z`).getUTCDay();

/** The last weekday of the month `date` is in. */
function lastWeekdayOfMonth(date: LoopDate): LoopDate {
  const [y, m] = [Number(date.slice(0, 4)), Number(date.slice(5, 7))];
  let last = addDays(`${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-01`, -1);
  while (dow(last) === 0 || dow(last) === 6) last = addDays(last, -1);
  return last;
}

/** The day a step is suggested for, never before today. */
export function suggestedDate(step: Pick<ActionStep, "id" | "horizon">, today: LoopDate): LoopDate {
  const timing = STEP_TIMING[step.id];
  if (timing?.kind === "weekday") return addDays(today, (timing.dow - dow(today) + 7) % 7);
  if (timing?.kind === "monthEnd") {
    const end = lastWeekdayOfMonth(today);
    return end >= today ? end : lastWeekdayOfMonth(addDays(today, 31));
  }
  if (timing?.kind === "fixed") return timing.date >= today ? timing.date : today;
  return addDays(today, HORIZON_OFFSET_DAYS[step.horizon]);
}
