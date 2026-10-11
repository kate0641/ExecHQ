/**
 * The library's rows: her Loop records, with what the Toolbox knows about
 * each. Read from the Loop, so the library, the Plan and the homepage show
 * the same status for the same artifact.
 */

import { recordedItems } from "@/lib/signal-picture";
import { signalOfRecord } from "@/lib/signals";
import { lastTouched, whenPhrase, type LoopRecord } from "@/lib/loop";
import { SIGNALS } from "@/mock/plan-stub";
import { stepById } from "@/mock/plan";
import { LIBRARY_SEED, TOOLS, type ArtifactMeta } from "@/mock/toolbox";

export interface LibraryItem {
  record: LoopRecord;
  tool: string;
  /** Plan area id, or undefined when it serves none. */
  area?: string;
  areaName?: string;
  /** The action step it serves, by title. */
  step?: string;
  readId?: string;
  versions: number;
  preview: string;
  /** The last day anything happened to it. */
  lastOn: string;
  fromOnboarding: boolean;
  /** What deleting it would also take off her Signal Picture. */
  signalItems: number;
}

export function libraryItems(records: readonly LoopRecord[], extra: Readonly<Record<string, ArtifactMeta>> = {}): LibraryItem[] {
  return records
    .map((record) => {
      const meta = extra[record.id] ?? LIBRARY_SEED[record.id];
      const area = meta?.area ?? signalOfRecord(record.id);
      return {
        record,
        tool: TOOLS[record.kind].name,
        area,
        areaName: SIGNALS.find((s) => s.id === area)?.name,
        step: meta?.planStepId ? stepById(meta.planStepId)?.title : record.recommendation,
        readId: meta?.readId,
        versions: meta?.versions ?? 1,
        preview: meta?.preview ?? "",
        lastOn: lastTouched(record),
        fromOnboarding: Boolean(meta?.fromOnboarding),
        signalItems: recordedItems([record]).length,
      };
    })
    .sort((a, b) => (a.lastOn < b.lastOn ? 1 : a.lastOn > b.lastOn ? -1 : 0));
}

/** Search by title and content, case-insensitive. */
export function searchLibrary(items: readonly LibraryItem[], query: string): LibraryItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((i) => `${i.record.title} ${i.preview} ${i.tool}`.toLowerCase().includes(q));
}

/** "today", "on Tuesday", "on 13 October". */
export function editedWords(item: LibraryItem, today: string): string {
  return whenPhrase(item.lastOn, today);
}
