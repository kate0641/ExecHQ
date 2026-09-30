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

/** Everything she had added by `today`, oldest first. */
export function addedBy(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceItem[] {
  return items.filter((item) => item.on <= today);
}

/** The baseline and today's count for every kind, in card order. */
export function presenceCounts(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceCount[] {
  const added = addedBy(today, items);
  return PRESENCE_ORDER.map((kind) => {
    const ofKind = added.filter((item) => item.kind === kind);
    return {
      kind,
      then: PRESENCE_BASELINE[kind],
      now: PRESENCE_BASELINE[kind] + ofKind.length,
      latest: ofKind[ofKind.length - 1],
    };
  });
}

/** Anything added within the last week, newest first. */
export function recentlyAdded(today: string, items: readonly PresenceItem[] = PRESENCE_ITEMS): PresenceItem[] {
  const since = addDays(today, -6);
  return addedBy(today, items)
    .filter((item) => item.on >= since)
    .reverse();
}
