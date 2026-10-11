"use client";

import { useState } from "react";
import { LibraryFolder } from "@/components/toolbox/LibraryFolder";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import type { LibraryItem } from "@/lib/library";
import { shortDate } from "@/lib/loop";
import { useViewport } from "@/lib/viewport-context";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

const F = LIBRARY_COPY.folders;
const OPEN_HEADING = "library-folder-open";

/** "3 · 2 drafts · 1 waiting to hear": how many, and where they stand. */
function summaryOf(items: readonly LibraryItem[]): string {
  if (items.length === 0) return F.empty;
  const parts = STATUS_FILTERS.map((s) => [s.id, items.filter((i) => s.states.includes(i.record.state)).length] as const)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => F.count(id, n));
  return [String(items.length), ...parts].join(" · ");
}

/**
 * Toolbox, Concept 2 — Starter row and document workspace. One of the two
 * safe concepts.
 *
 * The tools are one row of four that fits the width, each an icon over a
 * short name, so nothing scrolls. The library is four folders, one per tool
 * (option A, chosen 11 October), filed by ExecHQ: each says how many it holds,
 * where they stand and when it last changed. On a phone the folders are 2×2
 * and one opens to its list, newest first, with a way back; on tablet and web
 * the folders sit in a column beside the open one's list, the most recently
 * changed open to begin with. Searching looks across every folder and lists
 * the matches, so a closed folder never hides work.
 *
 * Opening a tool or an artifact shows the draft full screen, with inputs and
 * revisions in a sheet pulled up from a peek bar (the side panel on desktop).
 */
export function ToolboxConcept2() {
  const p = useToolboxPage("concept-2");
  const phone = useViewport().viewport === "mobile";
  const [picked, setPicked] = useState<ArtifactKind | null>(null);

  const folders = TOOL_ORDER.map((kind) => {
    const items = p.all.filter((i) => i.record.kind === kind);
    return {
      kind,
      name: F.names[kind],
      items,
      summary: summaryOf(items),
      date: items[0] ? shortDate(items[0].lastOn) : undefined,
    };
  });
  // Beside the list (web), the most recently changed folder starts open.
  const latest = [...folders].filter((f) => f.items.length).sort((a, b) => (a.items[0].lastOn < b.items[0].lastOn ? 1 : -1))[0]?.kind;
  const open = picked ?? (phone ? null : (latest ?? TOOL_ORDER[0]));
  const openFolder = folders.find((f) => f.kind === open);

  // Opening a folder moves focus to its heading; going back returns it to
  // the folder she came from.
  const choose = (kind: ArtifactKind | null) => {
    const from = picked;
    setPicked(kind);
    setTimeout(() => {
      const target = kind
        ? document.getElementById(OPEN_HEADING)
        : document.querySelector<HTMLElement>(`.library-folder--button.library-folder--${from ?? TOOL_ORDER[0]}`);
      target?.focus();
    }, 0);
  };

  const searching = p.query.trim().length > 0;

  const grid = (
    <div className="library-folders">
      {folders.map((f) => (
        <LibraryFolder
          key={f.kind}
          tool={f.kind}
          name={f.name}
          summary={f.summary}
          date={f.date}
          dateLabel={F.lastChange("").trim()}
          current={!phone && f.kind === open}
          onOpen={() => choose(f.kind)}
        />
      ))}
    </div>
  );

  const opened = openFolder ? (
    <div className="library-folder-open">
      {phone ? (
        <button type="button" className="library-folder-open__back" onClick={() => choose(null)}>
          <span aria-hidden="true">←</span>
          {F.back}
        </button>
      ) : null}
      <LibraryFolder as="header" tool={openFolder.kind} name={openFolder.name} summary={openFolder.summary} headingId={OPEN_HEADING} />
      {openFolder.items.length ? (
        p.list(openFolder.items)
      ) : (
        <p className="library-folder-open__empty">{F.emptyBody(TOOLS[openFolder.kind].name)}</p>
      )}
    </div>
  ) : null;

  return (
    <div className="toolbox-page toolbox-page--c2">
      {p.header}
      <ToolPicker layout="icons" hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ??
          (searching ? (
            <>
              {p.noMatch ?? <p className="library__results">{F.results(p.found.length, p.query.trim())}</p>}
              {p.list(p.found)}
            </>
          ) : phone ? (
            (opened ?? grid)
          ) : (
            <div className="library-folders-split">
              {grid}
              {opened}
            </div>
          ))}
      </section>
      {p.sheet}
    </div>
  );
}

export default ToolboxConcept2;
