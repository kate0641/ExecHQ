"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { ArtifactActions } from "@/components/toolbox/ArtifactActions";
import { LibraryEmpty } from "@/components/toolbox/LibraryEmpty";
import { List, type ListItemData } from "@/components/layout/List";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import { editedWords, searchLibrary, libraryItems, type LibraryItem } from "@/lib/library";
import { aheadPhrase, shortDate, type LoopRecord } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { draftMeta, toolboxActions, useToolbox } from "@/lib/toolbox-store";
import type { ArtifactKind } from "@/mock/loop";
import { FLOW_COPY, LIBRARY_COPY as C, TOOLBOX_PAGE, USE_COPY } from "@/mock/toolbox";

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

  /** What comes next for an artifact, in a line (a folder's rows). */
  function nextStep(record: LoopRecord): string {
    const N = C.folders.next;
    switch (record.state) {
      case "drafted":
      case "in-progress":
        return N.draft;
      case "ready":
        return N.ready(record.kind);
      case "used":
      case "waiting":
        return record.checkBackOn && record.checkBackOn > loop.today ? N.checksBack(aheadPhrase(record.checkBackOn, loop.today)) : N.sayHow;
      case "outcome":
        return N.close;
      default:
        return N.closed;
    }
  }

  /** One artifact as a list row: the tool's icon, the title (which opens
   *  it), a second line with the tool, when it last changed, how many
   *  versions and where it came from, and its Loop status.
   *
   *  In a folder (`folder`), the tool goes without saying: the row is the
   *  title, its status and the date it last changed, and what comes next. */
  function itemOf(item: LibraryItem, options: { hideArea?: boolean; folder?: boolean }): ListItemData {
    const { record } = item;
    const source = item.reusedFrom
      ? FLOW_COPY.reusedFrom(item.reusedFrom)
      : item.readId
        ? C.fromRead
        : item.step
          ? C.forStep(item.step)
          : undefined;
    const second = [
      item.tool,
      C.edited(editedWords(item, loop.today)),
      C.versions(item.versions),
      options.hideArea ? undefined : item.areaName,
      source,
      // Her onboarding statement, not yet built out: opening it builds it out.
      item.fromOnboarding && record.state !== "closed" ? C.statementInvite : undefined,
      record.state === "outcome" ? C.closeSuggest : undefined,
    ].filter(Boolean);
    return {
      id: record.id,
      primary: record.title,
      // The status leads the second line, so on a phone the title keeps the
      // width and only the menu sits at the end.
      secondary: options.folder ? (
        <>
          <LoopStatus record={record} detail={false} className="library__status" />
          {" · "}
          {shortDate(item.lastOn)}
          <br />
          <span className="library__next">{nextStep(record)}</span>
        </>
      ) : (
        <>
          <LoopStatus record={record} detail={false} className="library__status" />
          {" "}
          {second.join(" · ")}
        </>
      ),
      href: artifactHref(record.id),
      leading: options.folder ? undefined : { type: "icon", name: TOOL_ICONS[record.kind] },
      trailing: {
        actions: (
          <>
            {record.state === "outcome" ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  loopActions.close(record.id);
                  setMessage(C.closed(record.title));
                }}
              >
                {C.actions.close}
                <span className="u-visually-hidden"> {record.title}</span>
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => setOpen(record.id)} aria-label={C.actions.more(record.title)}>
              <Icon name="menu" size={16} />
            </Button>
          </>
        ),
      },
    };
  }

  /** Library rows as a list, one or two lines each, divided. */
  const list = (items: readonly LibraryItem[], options: { hideArea?: boolean; folder?: boolean; label?: string } = {}): ReactNode =>
    items.length ? <List items={items.map((i) => itemOf(i, options))} label={options.label ?? C.heading} dividers="full" className={options.folder ? "library__rows library__rows--folder" : "library__rows"} /> : null;

  const header = (
    <header className="toolbox-page__header">
      <h1 className="toolbox-page__title" id={TITLE_ID} tabIndex={-1}>
        {TOOLBOX_PAGE.title}
      </h1>
      <p className="toolbox-page__lead">{TOOLBOX_PAGE.lead}</p>
    </header>
  );

  const librarySearch =
    all.length > 0 ? (
      <Input
        label={`${C.search}. ${C.searchHint}`}
        labelHidden
        type="search"
        placeholder={C.search}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    ) : null;

  const libraryHeader = (
    <div className="library__header">
      <h2 className="library__heading" id={LIBRARY_ID}>
        {C.heading}
      </h2>
      {librarySearch}
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
    artifactHref,
    list,
    header,
    libraryHeader,
    librarySearch,
    libraryId: LIBRARY_ID,
    noMatch,
    empty,
    sheet,
  };
}
