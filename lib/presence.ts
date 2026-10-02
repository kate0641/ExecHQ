import { addDays } from "@/lib/loop";
import {
  PRESENCE_BASELINE,
  PRESENCE_ITEMS,
  PRESENCE_ORDER,
  type PresenceItem,
  type PresenceKind,
} from "@/mock/accounts-stub";

/** One kind of presence, at the start and today. */
export interface PresenceCount {
  kind: PresenceKind;
  then: number;
  now: number;
  /** What she added most recently, if she has added any. */
  latest?: PresenceItem;
}

/** The stubbed record and what she has added herself, oldest first. */
export function withAdded(added: readonly PresenceItem[]): PresenceItem[] {
  return [...PRESENCE_ITEMS, ...added].sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0));
}

/** Everything she had added by `today`, oldest first. */
export function addedBy(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceItem[] {
  return items.filter((item) => item.on <= today);
}

/**
 * The baseline and today's count for every kind, in card order. What she
 * marked as already having when she began counts toward where she started.
 * `seeded` is false on the first return, when nobody has entered a baseline
 * yet and the prototype's own starting counts would be made up.
 */
export function presenceCounts(
  today: string,
  items: readonly PresenceItem[] = PRESENCE_ITEMS,
  seeded = true
): PresenceCount[] {
  const added = addedBy(today, items);
  return PRESENCE_ORDER.map((kind) => {
    const ofKind = added.filter((item) => item.kind === kind);
    const then = (seeded ? PRESENCE_BASELINE[kind] : 0) + ofKind.filter((item) => item.baseline).length;
    return {
      kind,
      then,
      now: then + ofKind.filter((item) => !item.baseline).length,
      latest: ofKind.filter((item) => !item.baseline).at(-1),
    };
  });
}

/** Whether she has a baseline to show: the starting counts, or something she
 *  entered herself. */
export function hasBaseline(items: readonly PresenceItem[], seeded: boolean): boolean {
  return seeded || items.some((item) => item.baseline);
}

/** Anything added within the last week, newest first. */
export function recentlyAdded(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceItem[] {
  const since = addDays(today, -6);
  return addedBy(today, items)
    .filter((item) => item.on >= since && !item.baseline)
    .reverse();
}

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

/** "first", "second" … and "11th" once the words run out. */
export function ordinal(n: number): string {
  if (n >= 1 && n <= ORDINALS.length) return ORDINALS[n - 1];
  const teens = n % 100 >= 11 && n % 100 <= 13;
  return `${n}${teens ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")}`;
}

/** Which one of its kind an item is, counting what she had at the start: the
 *  first thing she adds after having one already is her "second". `items` is
 *  oldest first, as PRESENCE_ITEMS is. */
export function nthOfKind(item: PresenceItem, items: readonly PresenceItem[] = PRESENCE_ITEMS): number {
  const upTo = items.slice(0, items.findIndex((other) => other.id === item.id) + 1);
  return PRESENCE_BASELINE[item.kind] + upTo.filter((other) => other.kind === item.kind).length;
}
