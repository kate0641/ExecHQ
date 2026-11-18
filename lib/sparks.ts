import { nthOfKind, recentlyAdded } from "@/lib/presence";
import { SPARK_COPY, type PresenceItem } from "@/mock/accounts-stub";

export interface SparkNote {
  /** Stable, so a dismissed note stays dismissed. */
  id: string;
  /** Where it came from: "Podcast", "LinkedIn". */
  source: string;
  text: string;
  /** The word before the source: "Great job!", "Nice one!" or "Well done!". */
  kicker: string;
  /** The day it happened, to put the newest first. */
  on: string;
}

function noteFor(item: PresenceItem, items: readonly PresenceItem[]): SparkNote {
  const n = nthOfKind(item, items);
  const text =
    item.kind !== "writing" && item.kind !== "other" && !item.where
      ? SPARK_COPY.other(item.note ?? item.title)
      : item.kind === "podcast"
      ? SPARK_COPY.podcast(item.where, n)
      : item.kind === "press"
        ? SPARK_COPY.press(item.where, n)
        : item.kind === "speaking"
          ? SPARK_COPY.speaking(item.where, n)
          : item.kind === "writing"
            ? SPARK_COPY.writing(item.title, n)
            : SPARK_COPY.other(item.note ?? item.title);
  /* The kickers take turns in the order things were added, so two notes in a
     row never open with the same word. */
  const kicker = SPARK_COPY.kickers[Math.max(0, items.indexOf(item)) % SPARK_COPY.kickers.length];
  return { id: `presence:${item.id}`, source: SPARK_COPY.source[item.kind], text, kicker, on: item.on };
}

/**
 * What has moved in the last week that she can see for herself: something she
 * added, or her LinkedIn numbers arriving. It says what changed and never
 * that her work caused it. Only ever the newest, by Kate's decision on
 * 2026-10-28: once she dismisses it, nothing shows until she adds something
 * new, and older notes never come back.
 */
export function sparksFor(
  today: string,
  dismissed: readonly string[],
  items: readonly PresenceItem[]
): SparkNote[] {
  const newest = recentlyAdded(today, items)
    .map((item) => noteFor(item, items))
    .sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0))[0];

  return newest && !dismissed.includes(newest.id) ? [newest] : [];
}
