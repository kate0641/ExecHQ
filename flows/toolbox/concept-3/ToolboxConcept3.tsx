"use client";

import { LibraryGroup } from "@/components/toolbox/LibraryGroup";
import { MomentStart } from "@/components/toolbox/MomentStart";
import { addDays, daysBetween, shortDate } from "@/lib/loop";
import type { LibraryItem } from "@/lib/library";
import { WEEK_LABELS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

/** The Monday of a date's week. */
function weekStart(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return addDays(date, -((day + 6) % 7));
}

function weekLabel(start: string, today: string): string {
  const weeks = Math.round(daysBetween(start, weekStart(today)) / 7);
  if (weeks === 0) return WEEK_LABELS.thisWeek;
  if (weeks === 1) return WEEK_LABELS.lastWeek;
  return WEEK_LABELS.weekOf(shortDate(start));
}

/**
 * Toolbox, Concept 3 — Start from the moment. The wild card.
 *
 * The top is one field, "What's coming up?", which works with the phone
 * keyboard's own dictation; ExecHQ picks the tool and says which in a line,
 * or asks when it can't tell. The four tools sit under it as shortcuts. Below,
 * the library is a timeline, grouped by the week each artifact last changed.
 */
export function ToolboxConcept3() {
  const p = useToolboxPage("concept-3");
  const weeks = new Map<string, LibraryItem[]>();
  for (const item of p.found) {
    const start = weekStart(item.lastOn);
    weeks.set(start, [...(weeks.get(start) ?? []), item]);
  }

  return (
    <div className="toolbox-page toolbox-page--c3">
      {p.header}
      <MomentStart hrefFor={p.toolHref} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            {p.noMatch}
            <div className="library__timeline">
              {[...weeks.entries()].map(([start, items]) => (
                <LibraryGroup key={start} heading={weekLabel(start, p.today)} count={items.length} layout="week">
                  {p.list(items)}
                </LibraryGroup>
              ))}
            </div>
          </>
        )}
      </section>
      {p.sheet}
    </div>
  );
}

export default ToolboxConcept3;
