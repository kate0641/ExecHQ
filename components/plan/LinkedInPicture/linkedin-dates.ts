import { fullDate } from "@/lib/loop";

/** "Monday, October 6, 2025": every date on her LinkedIn, written as every other date is. */
export function monthDayYear(date: string): string {
  return fullDate(date);
}
