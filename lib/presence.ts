import { addDays } from "@/lib/loop";
import {
  LINKEDIN_ROW_LABEL,
  LINKEDIN_STUB,
  PRESENCE_BASELINE,
  PRESENCE_KINDS,
  PRESENCE_ITEMS,
  PRESENCE_ORDER,
  type PresenceItem,
  type CountedKind,
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

/** Where she said she is starting from, in her own words: counts of what she
 *  has already done, and her LinkedIn followers if she typed them. */
export interface Baseline {
  counts: Record<CountedKind, number>;
  followers?: number;
}

/** Where she says she is now: the same counts as the baseline, as of the day
 *  she said it. Anything she adds after that day counts on top of it. */
export interface Current extends Baseline {
  on: string;
}

/**
 * The baseline and today's count for every kind, in card order. What she
 * saved as her starting point is where she started; without one, the
 * prototype's own starting counts stand in, except on the first return, when
 * `seeded` is false and nobody has entered anything yet.
 */
export function presenceCounts(
  today: string,
  items: readonly PresenceItem[] = PRESENCE_ITEMS,
  baseline: Baseline | null = null,
  seeded = true,
  current: Current | null = null
): PresenceCount[] {
  const added = addedBy(today, items);
  return PRESENCE_ORDER.map((kind) => {
    const ofKind = added.filter((item) => item.kind === kind);
    const then = baseline ? baseline.counts[kind] : seeded ? PRESENCE_BASELINE[kind] : 0;
    /* What she said she has now, plus what she added since saying it. */
    const now = current ? current.counts[kind] + ofKind.filter((item) => item.on > current.on).length : then + ofKind.length;
    return { kind, then, now, latest: ofKind[ofKind.length - 1] };
  });
}

/** Whether she has a starting point to show: one she saved, or the
 *  prototype's own. */
export function hasBaseline(baseline: Baseline | null, seeded: boolean): boolean {
  return seeded || baseline !== null;
}

/** One row of the Signal Picture: where she started beside where she is. */
export interface SignalRow {
  id: string;
  label: string;
  then: number | string;
  now: number | string;
  latest?: string;
  latestHref?: string;
}

/**
 * Every row of her Signal Picture: LinkedIn followers first, when she gave
 * a number, or in the prototype's own record; then what she has done. The
 * followers are typed by hand, never read from LinkedIn, so they stay as
 * she said until she says otherwise.
 */
export function signalRows(
  today: string,
  items: readonly PresenceItem[],
  baseline: Baseline | null,
  seeded: boolean,
  describe: (item: PresenceItem) => string,
  current: Current | null = null
): SignalRow[] {
  const rows: SignalRow[] = [];
  const typed = baseline?.followers;
  const typedNow = current?.followers;
  if (baseline ? typed !== undefined || typedNow !== undefined : seeded || typedNow !== undefined) {
    const fmt = (n: number) => n.toLocaleString("en-US");
    const then = typed !== undefined ? fmt(typed) : baseline ? "–" : LINKEDIN_STUB.baseline.then;
    rows.push({
      id: "linkedin",
      label: LINKEDIN_ROW_LABEL,
      then,
      now: typedNow !== undefined ? fmt(typedNow) : typed !== undefined ? fmt(typed) : LINKEDIN_STUB.baseline.now,
    });
  }
  for (const p of presenceCounts(today, items, baseline, seeded, current)) {
    rows.push({
      id: p.kind,
      label: PRESENCE_KINDS[p.kind].label,
      then: p.then,
      now: p.now,
      latest: p.latest ? describe(p.latest) : undefined,
      latestHref: p.latest?.link,
    });
  }
  return rows;
}

/** Anything added within the last week, newest first. */
export function recentlyAdded(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceItem[] {
  const since = addDays(today, -6);
  return addedBy(today, items)
    .filter((item) => item.on >= since)
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
  return (item.kind === "other" ? 0 : PRESENCE_BASELINE[item.kind]) + upTo.filter((other) => other.kind === item.kind).length;
}
