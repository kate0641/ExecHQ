import { fullDate } from "@/lib/loop";

/** "Fri, Oct 9, 2026": when she joined or something happened. */
export function dayMonthYear(date: string): string {
  return fullDate(date);
}
