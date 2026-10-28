"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { LibraryFolder } from "@/components/playbook/LibraryFolder";
import { rank } from "@/components/playbook/LibrarySearch/LibrarySearch";
import { LibraryTabs } from "@/components/playbook/LibraryTabs";
import { Icon } from "@/components/primitives/Icon";
import { ToolPicker } from "@/components/playbook/ToolPicker";
import type { LibraryItem } from "@/lib/library";
import type { LoopDate } from "@/lib/loop";
import { conceptHref } from "@/lib/manifest";
import { useViewport } from "@/lib/viewport-context";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/playbook";
import { useLead, usePlaybookPage } from "../usePlaybookPage";

const F = LIBRARY_COPY.folders;
const OPEN_HEADING = "library-folder-open";
const ALL = "all";
const TABS = "library-web";
const STATUS_TABS = "library-status";

/** "3 · 2 drafts · 1 waiting to hear": how many, and where they stand. */
/**
 * A folder's list under its status as tabs
 * (designer, 28 Oct; it was a Status menu, option A, 14 Oct): All, each
 * status the folder holds something in, and Closed always, each with its
 * count. Keyed by folder, so opening another starts on All.
 */
function FolderList({
  items,
  list,
  emptyBody,
  mixed = false,
  action,
}: {
  items: readonly LibraryItem[];
  list: (items: readonly LibraryItem[], options: { folder?: boolean; mixed?: boolean }) => ReactNode;
  emptyBody: string;
  /** Several folders in one list (web's All tab): each row names its folder. */
  mixed?: boolean;
  /** At the right of the bar, or under an empty folder's line: Start (web). */
  action?: ReactNode;
}) {
  const [status, setStatus] = useState(ALL);
  if (items.length === 0)
    return action ? (
      <div className="library-folder-open__empty-start">
        <p className="library-folder-open__empty">{emptyBody}</p>
        {action}
      </div>
    ) : (
      <p className="library-folder-open__empty">{emptyBody}</p>
    );
  // Each status the folder holds, and Closed always, so what she closed
  // can always be found (designer, 2026-10-28).
  const present = STATUS_FILTERS.filter((s) => s.id === "closed" || items.some((i) => s.states.includes(i.record.state)));
  const inStatus = (id: string) => items.filter((i) => present.find((s) => s.id === id)?.states.includes(i.record.state));
  const chosen = present.find((s) => s.id === status);
  const shown = chosen ? inStatus(chosen.id) : items;
  return (
    <>
      {/* No count over the tabs: All already says how many (designer,
          2026-10-28). Start stays at the bar's right on web. */}
      {action ? <div className="library-folder-open__bar">{action}</div> : null}
      {/* Status as tabs across the folder, the last flush right (designer,
          2026-10-28), in place of a button that dropped into a menu. */}
      <LibraryTabs
        tabs={[{ id: ALL, label: F.all, count: items.length }, ...present.map((s) => ({ id: s.id, label: s.label, count: inStatus(s.id).length }))]}
        value={chosen?.id ?? ALL}
        onChange={setStatus}
        label={F.filter}
        idBase={STATUS_TABS}
        className="library-tabs--spread"
      />
      <div role="tabpanel" id={`${STATUS_TABS}-panel`} aria-labelledby={`${STATUS_TABS}-tab-${chosen?.id ?? ALL}`}>
        {/* A tab with nothing in it, Closed at 0, says so in Kate's words. */}
        {shown.length ? (
          list(shown, mixed ? { mixed: true } : { folder: true })
        ) : (
          <p className="library-folder-open__empty">{F.noneInStatus(chosen?.label ?? F.all)}</p>
        )}
      </div>
    </>
  );
}

/**
 * Playbook, Concept 2 — Starter row. Approved 19 October.
 *
 * On a phone or tablet (tablet follows the phone, Kate 15 Oct) the tools are
 * one row of four that fits the width, each an icon over a short name, so
 * nothing scrolls. Under them, the tool her next plan step needs, as one row
 * (Concept 1's "Next on your plan", brought over 14 Oct). Finding the right
 * tool isn't on the page: it is the advisor's first prompt on the Playbook,
 * "Which tool do I need?" (14 Oct). The library is four folders, one per
 * tool (option A, chosen 11 October), filed by ExecHQ: each says how many it
 * holds, where they stand and when it last changed. The folders are 2×2 and
 * one opens as its own page (`?folder=`), newest first, with a Back to the
 * Playbook (option A with option B's next-step line, Kate, 13 Oct). The
 * magnifying glass beside Library opens search in a sheet, its matches
 * updating as she types, across every folder (14 Oct).
 *
 * On web (option A, Tools rail, Kate 15 Oct) a column down the left holds
 * the title, the four tools as rows with what each makes, then Next on your
 * plan under them, and stays in view as the page scrolls. The rest of the
 * width is the library: a search field beside its heading, the folders as
 * tabs (All first, or the folder `?folder=` names), and the chosen tab's
 * list with how many, the Status menu and, in a folder, its Start.
 *
 * Either way each row is the title, then its status and when she last
 * touched it as a tag; tapping it opens it (14 Oct). A tool or an artifact
 * opens in the Playbook flow (Concept 3, the Interview).
 */
function Concept2Page() {
  const p = usePlaybookPage("concept-2");
  const lead = useLead();
  const compact = useViewport().viewport !== "web";
  const router = useRouter();
  const params = useSearchParams();
  const asked = params.get("folder") as ArtifactKind | null;
  const known = asked && TOOL_ORDER.includes(asked) ? asked : null;
  const [tab, setTab] = useState<string>(known ?? ALL);
  const [query, setQuery] = useState("");

  const folders = TOOL_ORDER.map((kind) => {
    const items = p.all.filter((i) => i.record.kind === kind);
    return {
      kind,
      name: F.names[kind],
      items,
      // The card says when the folder last changed and how much is in it;
      // the open folder breaks it down by status (designer, 2026-10-27).
      summary: items[0] ? F.lastChange(usDate(items[0].lastOn)) : F.empty,
      date: items.length ? F.items(items.length) : undefined,
    };
  });

  /** The open folder's card: what the tool makes, and Start across it (designer, 2026-10-27). */
  const card = (kind: ArtifactKind, level: 1 | 2 | 3) => (
    <LibraryFolder
      as="header"
      tool={kind}
      name={F.names[kind]}
      summary={TOOLS[kind].short}
      headingId={OPEN_HEADING}
      headingLevel={level}
      action={
        <Link href={p.toolHref(kind)} className="btn btn--primary btn--md btn--full">
          {TOOLS[kind].start}
          <Icon name="chevron" size={16} />
        </Link>
      }
    />
  );

  if (!compact) {
    const q = query.trim().toLowerCase();
    const found = q
      ? p.all
          .map((item, i) => ({ item, i, r: rank({ id: item.record.id, title: item.record.title, detail: "", text: `${item.preview} ${item.tool}`, href: "" }, q) }))
          .filter((x) => x.r >= 0)
          .sort((a, b) => a.r - b.r || a.i - b.i)
          .map((x) => x.item)
      : [];
    const chosen = folders.find((f) => f.kind === tab);
    return (
      <div className="playbook-page playbook-page--c2 playbook-page--rail">
        <div className="playbook-rail">
          {p.header}
          <ToolPicker layout="rail" lead={lead} hrefFor={(kind) => p.toolHref(kind)} />
        </div>
        <section className="library library--web" aria-labelledby={p.libraryId}>
          <div className="library__header">
            <h2 className="library__heading" id={p.libraryId}>
              {LIBRARY_COPY.heading}
            </h2>
            {p.all.length ? (
              <div className="library-search__field library__search">
                <Icon name="search" size={18} className="library-search__icon" />
                <input
                  type="search"
                  aria-label={LIBRARY_COPY.search}
                  placeholder={LIBRARY_COPY.search}
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="field__control library-search__input"
                />
              </div>
            ) : null}
          </div>
          {/* Always present, so the count is announced as she types. */}
          <p className={q ? "library__matches" : "u-visually-hidden"} aria-live="polite">
            {q ? (found.length ? F.acrossFolders(found.length) : LIBRARY_COPY.searchSheet.noMatch(query.trim())) : ""}
          </p>
          {p.empty ??
            (q ? (
              p.list(found, { mixed: true })
            ) : (
              <>
                <LibraryTabs
                  tabs={[{ id: ALL, label: F.all, count: p.all.length }, ...folders.map((f) => ({ id: f.kind, label: f.name, count: f.items.length }))]}
                  value={tab}
                  onChange={setTab}
                  label={F.tabs}
                  idBase={TABS}
                  orientation="vertical"
                />
                <div role="tabpanel" id={`${TABS}-panel`} aria-labelledby={`${TABS}-tab-${tab}`} className="library-folder-open">
                  <FolderList
                    key={tab}
                    items={chosen ? chosen.items : p.all}
                    list={p.list}
                    mixed={!chosen}
                    emptyBody={chosen ? F.emptyBody(TOOLS[chosen.kind].name) : F.empty}
                    action={
                      chosen ? (
                        <Link href={p.toolHref(chosen.kind)} className="btn btn--secondary btn--sm library-folder-open__start">
                          {TOOLS[chosen.kind].start}
                        </Link>
                      ) : undefined
                    }
                  />
                </div>
              </>
            ))}
        </section>
      </div>
    );
  }

  const openFolder = known ? folders.find((f) => f.kind === known) : undefined;

  // A phone's folder page (option A, chosen 13 Oct): a bar with Back (the
  // name only once, as the title, Kate 13 Oct), a large title and when it
  // last changed, replaced 14 Oct by option A: the tool's card with Start,
  // then how many with the Status menu, then the list.
  if (openFolder) {
    return (
      <div className="playbook-page playbook-page--c2 folder-page">
        <div className="folder-page__bar">
          <Link href={conceptHref("playbook", "concept-2")} className="folder-page__back">
            <Icon name="chevron-left" size={18} />
            {F.backToPlaybook}
          </Link>
        </div>
        {card(openFolder.kind, 1)}
        <FolderList key={openFolder.kind} items={openFolder.items} list={p.list} emptyBody={F.emptyBody(TOOLS[openFolder.kind].name)} />
        {p.sheet}
      </div>
    );
  }

  return (
    <div className="playbook-page playbook-page--c2">
      {p.header}
      <ToolPicker layout="icons" lead={lead} hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <div className="library-folders">
            {folders.map((f) => (
              <LibraryFolder
                key={f.kind}
                tool={f.kind}
                name={f.name}
                summary={f.summary}
                date={f.date}
                dateLabel=""
                // On a phone or tablet a folder is its own page.
                onOpen={() => router.push(`${conceptHref("playbook", "concept-2")}?folder=${f.kind}`)}
              />
            ))}
          </div>
        )}
      </section>
      {p.sheet}
    </div>
  );
}

/** "Oct 5": month, then day, no year on a card this small (designer,
 *  2026-10-27). The shared short date in lib/ still reads "5 Oct" elsewhere. */
function usDate(date: LoopDate): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// The folder page reads `?folder=` from the address, which needs a Suspense
// boundary or a full page load stays blank.
export function PlaybookConcept2() {
  return (
    <Suspense fallback={null}>
      <Concept2Page />
    </Suspense>
  );
}

export default PlaybookConcept2;
