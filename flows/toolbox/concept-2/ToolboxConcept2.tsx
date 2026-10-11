"use client";

import { LibraryGroup } from "@/components/toolbox/LibraryGroup";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import { SIGNALS } from "@/mock/plan-stub";
import { LIBRARY_COPY } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

/**
 * Toolbox, Concept 2 — Starter row and document workspace. One of the two
 * safe concepts.
 *
 * On a phone the tools are one row of chips that scrolls sideways, which
 * gives the library almost the whole first screen. The library is grouped by
 * plan area in sections that open and close. Opening a tool or an artifact
 * shows the draft full screen, with inputs and revisions in a sheet pulled up
 * from a peek bar (the side panel on desktop).
 */
export function ToolboxConcept2() {
  const p = useToolboxPage("concept-2");
  const groups = [
    ...SIGNALS.map((s) => ({ id: s.id, name: s.name, items: p.found.filter((i) => i.area === s.id) })),
    { id: "other", name: LIBRARY_COPY.otherArea, items: p.found.filter((i) => !i.area || !SIGNALS.some((s) => s.id === i.area)) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="toolbox-page toolbox-page--c2">
      {p.header}
      <ToolPicker layout="chips" hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            {p.noMatch}
            <div className="library__groups">
              {groups.map((g) => (
                <LibraryGroup key={g.id} heading={g.name} count={g.items.length} layout="section">
                  {p.list(g.items, { hideArea: true })}
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
