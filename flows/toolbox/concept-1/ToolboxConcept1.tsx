"use client";

import { useState } from "react";
import { LibraryFilters } from "@/components/toolbox/LibraryFilters";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import type { ArtifactKind } from "@/mock/loop";
import { STATUS_FILTERS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

/**
 * Toolbox, Concept 1 — Tool cards and guided steps. One of the two safe
 * concepts.
 *
 * On a phone the four tools are a 2×2 grid of compact tiles, each with its
 * name and a few words on what it makes: short enough that the first library
 * items show above the fold. Wider, the tiles become one row of four. The
 * library below filters by tool and by status from chips that scroll
 * sideways, newest first. A tool opens as guided steps, one question a screen.
 */
export function ToolboxConcept1() {
  const p = useToolboxPage("concept-1");
  const [tool, setTool] = useState<ArtifactKind>();
  const [status, setStatus] = useState<string>();
  const inStatus = (id: string) => STATUS_FILTERS.find((f) => f.id === id)?.states ?? [];
  const shown = p.found.filter(
    (i) => (!tool || i.record.kind === tool) && (!status || inStatus(status).includes(i.record.state))
  );

  return (
    <div className="toolbox-page toolbox-page--c1">
      {p.header}
      <ToolPicker layout="tiles" hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            <LibraryFilters
              tool={tool}
              status={status}
              onTool={setTool}
              onStatus={setStatus}
              countTool={(kind) => p.found.filter((i) => i.record.kind === kind).length}
              countStatus={(id) => p.found.filter((i) => inStatus(id).includes(i.record.state)).length}
            />
            {p.noMatch}
            <ul className="library__list">
              {shown.map((item) => (
                <li key={item.record.id}>{p.row(item)}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      {p.sheet}
    </div>
  );
}

export default ToolboxConcept1;
