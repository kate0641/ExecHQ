"use client";

import { LibraryGroup } from "@/components/toolbox/LibraryGroup";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import { daysBetween } from "@/lib/loop";
import { TOUCHED_GROUPS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

/**
 * Toolbox, Concept 2 — Starter row and document workspace. One of the two
 * safe concepts.
 *
 * The tools are one row of four that fits the width, each an icon over a
 * short name, so nothing scrolls and the library keeps almost the whole
 * first screen. The library is grouped by when she last touched each
 * artifact (today, yesterday, earlier this week, last week, earlier) in
 * sections that open and close. Opening a tool or an artifact shows the
 * draft full screen, with inputs and revisions in a sheet pulled up from a
 * peek bar (the side panel on desktop).
 */
export function ToolboxConcept2() {
  const p = useToolboxPage("concept-2");
  // When she last touched each one: today, yesterday, earlier this week (weeks
  // start on Monday), last week, earlier. The list is newest first already.
  const bucketOf = (lastOn: string): keyof typeof TOUCHED_GROUPS => {
    const ago = daysBetween(lastOn, p.today);
    const intoWeek = (new Date(`${p.today}T00:00:00Z`).getUTCDay() + 6) % 7;
    if (ago <= 0) return "today";
    if (ago === 1) return "yesterday";
    if (ago <= intoWeek) return "thisWeek";
    if (ago <= intoWeek + 7) return "lastWeek";
    return "earlier";
  };
  const groups = (Object.keys(TOUCHED_GROUPS) as (keyof typeof TOUCHED_GROUPS)[])
    .map((id) => ({ id, name: TOUCHED_GROUPS[id], items: p.found.filter((i) => bucketOf(i.lastOn) === id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="toolbox-page toolbox-page--c2">
      {p.header}
      <ToolPicker layout="icons" hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            {p.noMatch}
            <div className="library__groups">
              {groups.map((g) => (
                <LibraryGroup key={g.id} heading={g.name} count={g.items.length} layout="section">
                  {p.list(g.items)}
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

export default ToolboxConcept2;
