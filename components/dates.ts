/**
 * Dates set in small capitals (eyebrows and grey labels) use the short form, "Fri, Oct 9, 2026",
 * so they fit on one line beside or above a title. Dates in running text keep lib/loop's fullDate.
 */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-09" → "Fri, Oct 9, 2026". */
export function shortCapsDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
