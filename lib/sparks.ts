import type { Account } from "@/mock/account";
import { addDays } from "@/lib/loop";
import { nthOfKind, ordinal, recentlyAdded } from "@/lib/presence";
import { SPARK_COPY, type PresenceItem } from "@/mock/accounts-stub";

/** The most that show at once: a note, not a feed. */
const MAX_SPARKS = 2;

export interface SparkNote {
  /** Stable, so a dismissed note stays dismissed. */
  id: string;
  /** Where it came from: "Podcast", "LinkedIn". */
  source: string;
  text: string;
  /** The day it happened, to put the newest first. */
  on: string;
}

function noteFor(item: PresenceItem): SparkNote {
  const nth = ordinal(nthOfKind(item));
  const text =
    item.kind === "podcast"
      ? SPARK_COPY.podcast(item.where, nth)
      : item.kind === "press"
        ? SPARK_COPY.press(item.where, nth)
        : item.kind === "speaking"
          ? SPARK_COPY.speaking(item.where, nth)
          : SPARK_COPY.writing(item.title, nth);
  return { id: `presence:${item.id}`, source: SPARK_COPY.source[item.kind], text, on: item.on };
}

/**
 * What has moved in the last week that she can see for herself: something she
 * added, or her LinkedIn numbers arriving. It says what changed and never
 * that her work caused it. Newest first, at most two, none already dismissed.
 */
export function sparksFor(today: string, account: Account, dismissed: readonly string[]): SparkNote[] {
  const notes = recentlyAdded(today).map(noteFor);

  const linkedIn = account.connections.find((c) => c.id === "linkedin");
  if (linkedIn?.connected && linkedIn.connectedOn && linkedIn.connectedOn >= addDays(today, -6)) {
    notes.push({
      id: `linkedin:${linkedIn.connectedOn}`,
      source: SPARK_COPY.source.linkedin,
      text: SPARK_COPY.linkedin,
      on: linkedIn.connectedOn,
    });
  }

  return notes
    .filter((note) => !dismissed.includes(note.id))
    .sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0))
    .slice(0, MAX_SPARKS);
}
