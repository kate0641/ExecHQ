"use client";

import { useLoop } from "@/lib/loop-store";
import { newlyRecorded, recordedItems } from "@/lib/signal-picture";
import { useSignalNotices } from "@/lib/signal-notices";

/**
 * Whether ExecHQ has recorded something for her that she has not yet seen on
 * the Signal Picture: the quiet dot on the navigation. Never a count.
 */
export function useNewSignals(): boolean {
  const loop = useLoop();
  const notices = useSignalNotices();
  const fresh = newlyRecorded(recordedItems(loop.records, loop.tasks), loop.today, notices.hidden);
  return fresh.some((i) => !notices.noticed.includes(i.id));
}
