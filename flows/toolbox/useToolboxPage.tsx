"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { ArtifactActions } from "@/components/toolbox/ArtifactActions";
import { LibraryEmpty } from "@/components/toolbox/LibraryEmpty";
import { LibraryRow } from "@/components/toolbox/LibraryRow";
import { searchLibrary, libraryItems, type LibraryItem } from "@/lib/library";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { draftMeta, toolboxActions, useToolbox } from "@/lib/toolbox-store";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY as C, TOOLBOX_PAGE, USE_COPY } from "@/mock/toolbox";

export const TITLE_ID = "toolbox-title";
const LIBRARY_ID = "library-heading";

/**
 * Everything the three Toolbox concepts share: the library read from her Loop
 * records, search, the actions sheet (open, reuse, update status, export,
 * close, delete) and where each tool and artifact opens. Each concept lays out
 * the tools and the library its own way.
 *
 * Opening an artifact goes straight to its draft, in this concept's flow, and
 * opening the page records the concept, so the Briefing's hand-off lands here.
 */
export function useToolboxPage(concept: "concept-1" | "concept-2" | "concept-3") {
  const loop = useLoop();
  const toolbox = useToolbox();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    toolboxActions.openConcept(concept);
  }, [concept]);

  const flow = conceptHref("toolbox-flow", concept);
  const toolHref = (kind: ArtifactKind, moment?: string) => {
    const params = new URLSearchParams({ tool: kind });
    if (moment) params.set("moment", moment);
    return `${flow}?${params.toString()}`;
  };
  const artifactHref = (id: string) => `${flow}?artifact=${encodeURIComponent(id)}`;
  const reuseHref = (id: string) => `${flow}?reuse=${encodeURIComponent(id)}`;

  const all = libraryItems(loop.records, draftMeta(toolbox));
  const found = searchLibrary(all, query);
  const openItem = all.find((i) => i.record.id === open);

  const close = () => setOpen(null);

  function row(item: LibraryItem, options: { hideArea?: boolean; headingLevel?: 3 | 4 } = {}): ReactNode {
    return (
      <LibraryRow
        key={item.record.id}
        item={item}
        today={loop.today}
        href={artifactHref(item.record.id)}
        buildOutHref={item.fromOnboarding ? `${toolHref("positioning")}&artifact=${item.record.id}` : undefined}
        onMore={() => setOpen(item.record.id)}
        onClose={() => {
          loopActions.close(item.record.id);
          setMessage(C.closed(item.record.title));
        }}
        hideArea={options.hideArea}
        headingLevel={options.headingLevel}
      />
    );
  }

  const header = (
    <header className="toolbox-page__header">
      <h1 className="toolbox-page__title" id={TITLE_ID} tabIndex={-1}>
        {TOOLBOX_PAGE.title}
      </h1>
      <p className="toolbox-page__lead">{TOOLBOX_PAGE.lead}</p>
    </header>
  );

  const libraryHeader = (
    <div className="library__header">
      <h2 className="library__heading" id={LIBRARY_ID}>
        {C.heading}
        <span className="library__count">{C.count(all.length)}</span>
      </h2>
      {all.length > 0 ? (
        <Input
          label={`${C.search}. ${C.searchHint}`}
          labelHidden
          type="search"
          placeholder={C.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      ) : null}
    </div>
  );

  const noMatch =
    query.trim() && found.length === 0 ? (
      <p className="library__no-match">
        {C.noMatch(query.trim())}{" "}
        <button type="button" className="library__clear" onClick={() => setQuery("")}>
          {C.clearSearch}
        </button>
      </p>
    ) : null;

  /** Only someone who left onboarding before saving: her first step. */
  const empty =
    all.length === 0 ? (
      <LibraryEmpty step={loop.nextStep?.title ?? ""} stepHref={conceptHref("plan", "concept-3")} />
    ) : null;

  const sheet = (
    <>
      <output className="u-visually-hidden">{message}</output>
      <Sheet open={Boolean(openItem)} onClose={close} label={openItem?.record.title ?? ""} className="toolbox-sheet">
        {openItem ? (
          <ArtifactActions
            key={openItem.record.id}
            item={openItem}
            openHref={artifactHref(openItem.record.id)}
            reuseHref={reuseHref(openItem.record.id)}
            onMarkReady={() => {
              loopActions.markReady(openItem.record.id);
              close();
            }}
            onMarkUsed={() => {
              loopActions.markUsed(openItem.record.id);
              close();
            }}
            onExport={(format) => {
              setMessage(USE_COPY.exported(format));
              close();
            }}
            onClose={() => {
              loopActions.close(openItem.record.id);
              setMessage(C.closed(openItem.record.title));
              close();
            }}
            onDelete={() => {
              loopActions.remove(openItem.record.id);
              toolboxActions.remove(openItem.record.id);
              setMessage(C.deleteConfirm.done(openItem.record.title));
              close();
            }}
            onDismiss={close}
          />
        ) : null}
      </Sheet>
    </>
  );

  return {
    today: loop.today,
    all,
    found,
    query,
    toolHref,
    row,
    header,
    libraryHeader,
    libraryId: LIBRARY_ID,
    noMatch,
    empty,
    sheet,
  };
}
