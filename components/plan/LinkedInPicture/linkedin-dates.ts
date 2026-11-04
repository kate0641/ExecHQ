import { fullDate } from "@/lib/loop";

/** "Monday, October 6, 2025": every date on her LinkedIn, written as every other date is (Kate, 2 Nov). */
export function monthDayYear(date: string): string {
  return fullDate(date);
}
