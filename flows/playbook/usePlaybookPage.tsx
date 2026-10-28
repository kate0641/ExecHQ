"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { LibraryEmpty } from "@/components/playbook/LibraryEmpty";
import { LibrarySearch } from "@/components/playbook/LibrarySearch";
import { List, type ListItemData } from "@/components/layout/List";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { type ToolLead } from "@/components/playbook/ToolPicker/ToolPicker";
import { libraryItems, touchedTag, type LibraryItem } from "@/lib/library";
import { statusLabel } from "@/lib/loop";
import { useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { usePlaybookLinks } from "@/lib/playbook-links";
import { PLAN_AGENDA_COPY, stepById } from "@/mock/plan";
import { draftMeta, flowFor, playbookActions, usePlaybook, type PlaybookPage } from "@/lib/playbook-store";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY as C, TOOL_ORDER, PLAYBOOK_PAGE, TOOLS } from "@/mock/playbook";

/** The tool her next plan step needs: the first step on her plan that makes
 *  something with a tool. None, and the four tools are equal. */
export function useLead(): ToolLead | undefined {
  const loop = useLoop();
  const links = usePlaybookLinks();
  for (const rec of loop.recommendations) {
    const step = stepById(rec.id);
    const kind = TOOL_ORDER.find((k) => TOOLS[k].name === step?.playbookTool);
    if (step && kind) {
      return {
        kind,
        step: step.title,
        href: links.forStep(step.id),
        action: links.hasDraft(step.id) ? PLAN_AGENDA_COPY.openDraft : TOOLS[kind].start,
      };
    }
  }
  return undefined;
}

export const TITLE_ID = "playbook-title";
const LIBRARY_ID = "library-heading";
const SEARCH_BUTTON_ID = "library-search-button";

/**
 * What the Playbook page needs: the library read from her Loop records, the
 * search sheet, and where each tool and artifact opens.
 *
 * Opening an artifact goes straight to its draft, in the tool flow concept
 * last opened, and opening the page records the concept.
 */
export function usePlaybookPage(concept: PlaybookPage) {
  const loop = useLoop();
  const playbook = usePlaybook();
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    playbookActions.openConcept(concept);
  }, [concept]);

  /* The showroom opens the page on one of its screens with `?screen=` (designer,
     2026-10-21), so every piece can be reviewed at once: search with nothing
     typed, with matches and with none, an empty folder and the empty library. Only what shows
     changes; nothing she has saved is. */
  const [screen, setScreen] = useState<string | null>(null);
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("screen");
    /* eslint-disable react-hooks/set-state-in-effect -- the URL is only readable after mount */
    setScreen(asked);
    if (asked?.startsWith("search")) setSearching(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  // "leadership" finds her statement in every dock state; "budget" finds nothing.
  const searchFor = { "search-match": "leadership", "search-none": "budget" }[screen ?? ""];

  // Tools open in the tool flow concept the reviewer last opened.
  const flow = conceptHref("playbook-flow", flowFor(playbook));
  const toolHref = (kind: ArtifactKind, moment?: string) => {
    const params = new URLSearchParams({ tool: kind });
    if (moment) params.set("moment", moment);
    return `${flow}?${params.toString()}`;
  };
  const artifactHref = (id: string) => `${flow}?artifact=${encodeURIComponent(id)}`;

  // The showroom's empty library, and an empty folder whatever the dock's state holds.
  const all = screen === "empty" || screen === "folder-empty" ? [] : libraryItems(loop.records, draftMeta(playbook));
  /** "Today", "3 days ago", "2 weeks ago", then the date. */
  const when = (item: LibraryItem) => touchedTag(item.lastOn, loop.today);

  /** One artifact as a row, no card (Concept 1's list, brought over 14
   *  Oct): the title, then where it stands (in a folder) or its tool, and
   *  when she last touched it as a tag. Tapping the row opens it; there is
   *  no menu (Kate, 14 Oct). */
  function itemOf(item: LibraryItem, options: { folder?: boolean; mixed?: boolean }): ListItemData {
    const { record } = item;
    return {
      id: record.id,
      primary: record.title,
      secondary: (
        <>
          {/* In a folder, a line of what it says tells same-named ones apart
              (option A, 14 Oct). */}
          {(options.folder || options.mixed) && item.preview ? <span className="library__preview">{item.preview}</span> : null}
          {/* Several folders in one list (web's All tab and search): the
              folder, then where it stands. */}
          {/* In a folder, where it stands and when sit over the title as
              plain words, no tag (designer, 2026-10-28). */}
          {options.folder ? (
            <span className="library__stamp">
              {statusLabel(record)} · {when(item)}
            </span>
          ) : (
            <>
              {options.mixed ? `${C.folders.names[record.kind]} · ${statusLabel(record)}` : item.tool}{" "}
              <Badge className="library__when">{when(item)}</Badge>
            </>
          )}
        </>
      ),
      href: artifactHref(record.id),
    };
  }

  /** Library rows as a list, no card, a line between each. In an open
   *  folder each row is its own card with the horizon line (designer,
   *  2026-10-28). */
  const list = (items: readonly LibraryItem[], options: { folder?: boolean; mixed?: boolean; label?: string } = {}): ReactNode =>
    items.length ? (
      <List
        items={items.map((i) => itemOf(i, options))}
        label={options.label ?? C.heading}
        dividers={options.folder ? "none" : "full"}
        framed={false}
        className={options.folder ? "library__rows list--horizon-cards" : "library__rows"}
      />
    ) : null;

  const header = (
    <header className="playbook-page__header">
      <h1 className="playbook-page__title" id={TITLE_ID} tabIndex={-1}>
        {PLAYBOOK_PAGE.title}
      </h1>
      <p className="playbook-page__lead">{PLAYBOOK_PAGE.lead}</p>
    </header>
  );

  /** The heading, with the magnifying glass at the right: it opens search
   *  in a sheet (Kate, 14 Oct). */
  const libraryHeader = (
    <div className="library__header">
      <h2 className="library__heading" id={LIBRARY_ID}>
        {C.heading}
      </h2>
      {all.length ? (
        <Button
          variant="ghost"
          size="sm"
          id={SEARCH_BUTTON_ID}
          className="library__search-button"
          aria-haspopup="dialog"
          aria-label={C.search}
          onClick={() => setSearching(true)}
        >
          <Icon name="search" size={20} />
        </Button>
      ) : null}
    </div>
  );

  /** Only someone who left onboarding before saving: her first step. */
  const empty =
    all.length === 0 ? (
      <LibraryEmpty step={loop.nextStep?.title ?? ""} stepHref={conceptHref("plan", "concept-3")} />
    ) : null;

  const sheet = (
    <Sheet
      open={searching}
      onClose={() => setSearching(false)}
      label={C.search}
      returnFocusTo={() => document.getElementById(SEARCH_BUTTON_ID)}
      className="playbook-sheet library-search-sheet"
    >
      {searching ? (
        <LibrarySearch
          items={all.map((i) => ({
            id: i.record.id,
            title: i.record.title,
            detail: `${i.tool} · ${when(i)}`,
            text: `${i.preview} ${i.tool}`,
            href: artifactHref(i.record.id),
          }))}
          copy={C.searchSheet}
          initial={searchFor}
          onPick={(item) => {
            setSearching(false);
            router.push(item.href);
          }}
        />
      ) : null}
    </Sheet>
  );

  return {
    today: loop.today,
    all,
    toolHref,
    artifactHref,
    list,
    header,
    libraryHeader,
    libraryId: LIBRARY_ID,
    empty,
    sheet,
  };
}
