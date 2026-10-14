"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { LibraryFolder } from "@/components/toolbox/LibraryFolder";
import { Icon } from "@/components/primitives/Icon";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import type { LibraryItem } from "@/lib/library";
import { shortDate } from "@/lib/loop";
import { conceptHref } from "@/lib/manifest";
import { useViewport } from "@/lib/viewport-context";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/toolbox";
import { useLead, useToolboxPage } from "../useToolboxPage";

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
 * A folder's list with its status chips: All, then each status the folder
 * holds something in (a status with nothing in it has no chip). One chip at a time; pressing the chosen one goes back
 * to All. Keyed by folder, so opening another starts on All.
 */
function FolderList({ items, list, emptyBody }: { items: readonly LibraryItem[]; list: (items: readonly LibraryItem[], options: { folder: boolean }) => ReactNode; emptyBody: string }) {
  const [status, setStatus] = useState<string | null>(null);
  if (items.length === 0) return <p className="library-folder-open__empty">{emptyBody}</p>;
  const present = STATUS_FILTERS.filter((s) => items.some((i) => s.states.includes(i.record.state)));
  const inStatus = (id: string) => items.filter((i) => present.find((s) => s.id === id)?.states.includes(i.record.state));
  const chosen = present.find((s) => s.id === status);
  const shown = chosen ? inStatus(chosen.id) : items;
  // Chips are named with their counts; this maps a chip back to its status.
  const chips = [{ id: null, text: F.chip(F.all, items.length) }, ...present.map((s) => ({ id: s.id, text: F.chip(s.label, inStatus(s.id).length) }))];
  return (
    <>
      <ChipGroup
        label={F.filter}
        labelHidden
        options={chips.map((c) => c.text)}
        value={[chips.find((c) => c.id === (chosen?.id ?? null))!.text]}
        onChange={(next) => setStatus(chips.find((c) => c.text === next[0])?.id ?? null)}
        className="library-folder-open__filter"
      />
      {list(shown, { folder: true })}
    </>
  );
}

/**
 * Toolbox, Concept 2 — Starter row and document workspace. One of the two
 * safe concepts.
 *
 * The tool her next plan step needs leads, as one row (Concept 1's "Next on
 * your plan", brought over 14 Oct). Under it the tools are one row of four
 * that fits the width, each an icon over a short name, so nothing scrolls.
 * "What's on your mind?" isn't on the page: it is one of the advisor's
 * prompts on the Toolbox (14 Oct). The library is four folders, one per tool
 * (option A, chosen 11 October), filed by ExecHQ: each says how many it holds,
 * where they stand and when it last changed. On a phone the folders are 2×2
 * and one opens as its own page (`?folder=`), newest first, with a Back to
 * the Toolbox (option A with option B's next-step line, Kate, 13 Oct); on tablet and web the folders sit in a column
 * beside the open one's list, the most recently changed open to begin with.
 * Either way the list has status chips, and each row leads with its status. Searching looks across every folder and lists
 * the matches, so a closed folder never hides work.
 *
 * Opening a tool or an artifact shows the draft full screen, with inputs and
 * revisions in a sheet pulled up from a peek bar (the side panel on desktop).
 */
function Concept2Page() {
  const p = useToolboxPage("concept-2");
  const lead = useLead();
  const phone = useViewport().viewport === "mobile";
  const [picked, setPicked] = useState<ArtifactKind | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const asked = params.get("folder") as ArtifactKind | null;
  const pageFolder = phone && asked && TOOL_ORDER.includes(asked) ? asked : null;

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
  const open = phone ? pageFolder : (picked ?? asked ?? latest ?? TOOL_ORDER[0]);
  const openFolder = folders.find((f) => f.kind === open);

  // Opening a folder moves focus to its heading; going back returns it to
  // the folder she came from.
  const choose = (kind: ArtifactKind | null) => {
    // On a phone a folder is its own page.
    if (phone && kind) {
      router.push(`${conceptHref("toolbox", "concept-2")}?folder=${kind}`);
      return;
    }
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
      <LibraryFolder as="header" tool={openFolder.kind} name={openFolder.name} summary={openFolder.summary} headingId={OPEN_HEADING} />
      <FolderList key={openFolder.kind} items={openFolder.items} list={p.list} emptyBody={F.emptyBody(TOOLS[openFolder.kind].name)} />
    </div>
  ) : null;

  // A phone's folder page (option A, chosen 13 Oct): a bar with Back (the
  // name only once, as the title, Kate 13 Oct), a large title and when it last changed, the status chips
  // with their counts, then the list, each row saying what comes next.
  if (openFolder && phone) {
    return (
      <div className="toolbox-page toolbox-page--c2 folder-page">
        <div className="folder-page__bar">
          <Link href={conceptHref("toolbox", "concept-2")} className="folder-page__back">
            <Icon name="chevron-left" size={18} />
            {F.backToToolbox}
          </Link>
        </div>
        <header className="folder-page__head">
          <h1 className="folder-page__title" id={OPEN_HEADING} tabIndex={-1}>
            {openFolder.name}
          </h1>
          {openFolder.date ? <p className="folder-page__date">{F.lastChange(openFolder.date)}</p> : null}
        </header>
        <FolderList key={openFolder.kind} items={openFolder.items} list={p.list} emptyBody={F.emptyBody(TOOLS[openFolder.kind].name)} />
        {p.sheet}
      </div>
    );
  }

  return (
    <div className="toolbox-page toolbox-page--c2">
      {p.header}
      <ToolPicker layout="icons" lead={lead} hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ??
          (searching ? (
            <>
              {p.noMatch ?? <p className="library__results">{F.results(p.found.length, p.query.trim())}</p>}
              {p.list(p.found)}
            </>
          ) : phone ? (
            grid
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

// The folder page reads `?folder=` from the address, which needs a Suspense
// boundary or a full page load stays blank.
export function ToolboxConcept2() {
  return (
    <Suspense fallback={null}>
      <Concept2Page />
    </Suspense>
  );
}

export default ToolboxConcept2;
