"use client";

import { LibraryGroup } from "@/components/toolbox/LibraryGroup";
import { MomentStart } from "@/components/toolbox/MomentStart";
import { addDays, daysBetween, shortDate } from "@/lib/loop";
import type { LibraryItem } from "@/lib/library";
import { TOOLBOX_PAGE, WEEK_LABELS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

/** The Monday of a date's week. */
function weekStart(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return addDays(date, -((day + 6) % 7));
}

/** Not used yet: what she is still working on. */
const WORKING_STATES: readonly string[] = ["drafted", "in-progress", "ready"];
const WORKING_ID = "working-on-heading";

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
 * or asks when it can't tell. The four tools sit under it as shortcuts. Then
 * "What are you working on right now?": the drafts she touched last that she
 * hasn't used yet, up to three. Below, the library is a timeline, grouped by
 * the week each artifact last changed.
 */
export function ToolboxConcept3() {
  const p = useToolboxPage("concept-3");
  // The library is already newest first.
  const working = p.all.filter((item) => WORKING_STATES.includes(item.record.state)).slice(0, TOOLBOX_PAGE.workingOn.max);
  const weeks = new Map<string, LibraryItem[]>();
  for (const item of p.found) {
    const start = weekStart(item.lastOn);
    weeks.set(start, [...(weeks.get(start) ?? []), item]);
  }

  return (
    <div className="toolbox-page toolbox-page--c3">
      {p.header}
      <MomentStart hrefFor={p.toolHref} />
      {working.length > 0 ? (
        <section className="working-on" aria-labelledby={WORKING_ID}>
          <h2 className="library__heading" id={WORKING_ID}>
            {TOOLBOX_PAGE.workingOn.heading}
          </h2>
          {p.list(working, { label: TOOLBOX_PAGE.workingOn.heading })}
        </section>
      ) : null}
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            {p.noMatch}
            <div className="library__timeline">
              {[...weeks.entries()].map(([start, items]) => (
                <LibraryGroup key={start} heading={weekLabel(start, p.today)} layout="week">
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
