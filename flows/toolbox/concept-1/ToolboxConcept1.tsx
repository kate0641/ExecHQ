"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { IconRow } from "@/components/navigation/IconRow";
import { Icon } from "@/components/primitives/Icon";
import { DropdownMenu, type MenuEntry } from "@/components/form/DropdownMenu";
import { MindStart } from "@/components/toolbox/MindStart";
import { PickUp, type PickUpItem } from "@/components/toolbox/PickUp";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import { daysBetween, shortDate, statusLabel } from "@/lib/loop";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import { askConcierge } from "@/flows/navigation/concept-1/ConciergeConcept";
import { conceptHref } from "@/lib/manifest";
import { useViewport } from "@/lib/viewport-context";
import type { LibraryItem } from "@/lib/library";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLBOX_PAGE, TOOLS } from "@/mock/toolbox";
import { TITLE_ID, useLead, useToolboxPage } from "../useToolboxPage";

const F = LIBRARY_COPY.filters;
const ALL = "all";

interface Filters {
  tool: string;
  status: string;
  showClosed: boolean;
}

const NONE: Filters = { tool: ALL, status: ALL, showClosed: true };

const inStatus = (id: string) => STATUS_FILTERS.find((f) => f.id === id)?.states ?? [];

function matches(item: LibraryItem, f: Filters): boolean {
  return (
    (f.tool === ALL || item.record.kind === f.tool) &&
    (f.status === ALL || inStatus(f.status).includes(item.record.state)) &&
    (f.showClosed || item.record.state !== "closed")
  );
}

/**
 * Toolbox, Concept 1 — Tool cards and guided steps. One of the two safe
 * concepts.
 *
 * The tool her next plan step needs leads (option C, chosen 11 October): on
 * tablet and web a bento, the lead tall with the detailed drawing and the
 * step it serves, the other three around it; on a phone the lead is one row
 * and the other three are icons under it, so the library starts on the first
 * screen. With no step that needs a tool, the four are equal tiles. Under
 * the tools, "What's on your mind?" hands her words to the advisor, and "Pick
 * up where you left off" lists her open drafts.
 *
 * The library is its own page (`?view=library`, Kate 13 Oct), reached from
 * "Library" at the top right, beside the title. It filters from two menus
 * side by side, tool and status (with whether closed work shows), each a
 * plain list with its counts, newest first. A tool opens as guided steps,
 * one question a screen.
 */
function Concept1Page() {
  const p = useToolboxPage("concept-1");
  const view = useSearchParams().get("view");
  const lead = useLead();
  // On a phone the lead is one row, so the library starts on the first screen.
  const compact = useViewport().viewport === "mobile";
  const [f, setF] = useState<Filters>(NONE);
  const shown = p.found.filter((i) => matches(i, f));

  // A choice's count is what it would show with the other filters kept.
  const count = (change: Partial<Filters>) => p.found.filter((i) => matches(i, { ...f, ...change })).length;
  const set = (change: Partial<Filters>) => setF((current) => ({ ...current, ...change }));

  const on = [f.tool !== ALL, f.status !== ALL, !f.showClosed].filter(Boolean).length;
  const radios = (key: "tool" | "status", label: string, options: { value: string; label: string }[]): MenuEntry => ({
    type: "radio-group",
    id: key,
    label,
    labelHidden: true,
    value: f[key],
    onValueChange: (value) => set({ [key]: value }),
    options: [{ value: ALL, label: F.all }, ...options].map((o) => {
      const n = count({ [key]: o.value });
      return { ...o, hint: String(n), disabled: o.value !== f[key] && n === 0 };
    }),
  });

  const toolName = f.tool === ALL ? undefined : TOOLS[f.tool as ArtifactKind].name;
  const statusName = f.status === ALL ? undefined : STATUS_FILTERS.find((s) => s.id === f.status)?.label;

  /** One menu per filter, each a plain list: no menu inside a menu. The
   *  button says what is chosen. */
  const menus: { id: string; label: string; chosen?: string; entries: MenuEntry[] }[] = [
    {
      id: "tool",
      label: F.tool,
      chosen: toolName,
      entries: [radios("tool", F.tool, TOOL_ORDER.map((k) => ({ value: k, label: TOOLS[k].name })))],
    },
    {
      id: "status",
      label: F.status,
      chosen: statusName ?? (f.showClosed ? undefined : F.closedHidden),
      entries: [
        radios("status", F.status, STATUS_FILTERS.map((s) => ({ value: s.id, label: s.label }))),
        { type: "separator", id: "sep" },
        { type: "checkbox", id: "closed", label: F.showClosed, checked: f.showClosed, onCheckedChange: (checked) => set({ showClosed: checked }) },
      ],
    },
  ];

  // Pick up where you left off: what is still a draft or ready to use, the
  // latest first (the library is newest first), the rest from 30 days.
  const PU = TOOLBOX_PAGE.pickUp;
  const working: PickUpItem[] = p.all
    .filter((i) => ["drafted", "in-progress", "ready"].includes(i.record.state))
    .filter((i, n) => n === 0 || daysBetween(i.lastOn, p.today) <= PU.days)
    .map((i) => ({
      id: i.record.id,
      href: p.artifactHref(i.record.id),
      title: i.record.title,
      icon: TOOL_ICONS[i.record.kind],
      detail: PU.detail(statusLabel(i.record), shortDate(i.lastOn)),
    }));

  const home = conceptHref("toolbox", "concept-1");

  // The library's own page: Back to the Toolbox, its title, search, the two
  // filter menus and the list.
  if (view === "library") {
    return (
      <div className="toolbox-page toolbox-page--c1 folder-page">
        <div className="folder-page__bar">
          <Link href={home} className="folder-page__back">
            <Icon name="chevron-left" size={18} />
            {TOOLBOX_PAGE.title}
          </Link>
        </div>
        <h1 className="folder-page__title" id={p.libraryId} tabIndex={-1}>
          {LIBRARY_COPY.heading}
        </h1>
        <section className="library" aria-labelledby={p.libraryId}>
          {p.librarySearch}
          {p.empty ?? (
            <>
              <div className="library__filter">
                <fieldset className="library__filter-menus">
                  <legend className="u-visually-hidden">{F.button}</legend>
                  {menus.map((m) => (
                    <DropdownMenu
                      key={m.id}
                      label={m.chosen ? F.chosen(m.label, m.chosen) : m.label}
                      entries={m.entries}
                      className={m.chosen ? "is-set" : undefined}
                    />
                  ))}
                </fieldset>
                {on ? (
                  <button type="button" className="library__clear" onClick={() => setF(NONE)}>
                    {F.clear}
                  </button>
                ) : null}
              </div>
              {p.noMatch}
              {shown.length === 0 && !p.noMatch ? <p className="library__no-match">{F.noneMatch}</p> : null}
              {/* A straightforward list, no cards (Kate, 13 Oct). */}
              {p.list(shown, { plain: true })}
            </>
          )}
        </section>
        {p.sheet}
      </div>
    );
  }

  return (
    <div className="toolbox-page toolbox-page--c1">
      <div className="toolbox-page__top">
        {/* The title alone, Library level with it (option A, 13 Oct). */}
        <h1 className="toolbox-page__title" id={TITLE_ID} tabIndex={-1}>
          {TOOLBOX_PAGE.title}
        </h1>
        {/* The library, top right, as the navigation draws a place (option A, 13 Oct). */}
        <IconRow className="toolbox-page__library" items={[{ id: "library", href: `${home}?view=library`, label: LIBRARY_COPY.heading, icon: "book" }]} />
      </div>
      <ToolPicker layout="lead" lead={lead} compact={compact} hrefFor={(kind) => p.toolHref(kind)} />
      <MindStart onAsk={(text) => askConcierge(text, { kind: "find-tool", text, concept: "concept-1" })} />
      {working[0] ? <PickUp latest={working[0]} more={working.slice(1)} /> : null}
      {p.sheet}
    </div>
  );
}

// The library page is read from the address, which needs a Suspense
// boundary or a full page load stays blank.
export function ToolboxConcept1() {
  return (
    <Suspense fallback={null}>
      <Concept1Page />
    </Suspense>
  );
}

export default ToolboxConcept1;
