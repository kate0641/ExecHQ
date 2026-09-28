import { shortDate } from "@/lib/loop";

/** "9 Oct 2026": when a connection was made. */
export function dayMonthYear(date: string): string {
  return `${shortDate(date)} ${date.slice(0, 4)}`;
}
