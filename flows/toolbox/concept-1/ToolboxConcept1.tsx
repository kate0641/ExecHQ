"use client";

import { useState } from "react";
import { DropdownMenu, type MenuEntry } from "@/components/form/DropdownMenu";
import { ToolPicker } from "@/components/toolbox/ToolPicker";
import type { LibraryItem } from "@/lib/library";
import type { ArtifactKind } from "@/mock/loop";
import { SIGNALS } from "@/mock/plan-stub";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

const F = LIBRARY_COPY.filters;
const ALL = "all";

interface Filters {
  tool: string;
  status: string;
  area: string;
  showClosed: boolean;
}

const NONE: Filters = { tool: ALL, status: ALL, area: ALL, showClosed: true };

const inStatus = (id: string) => STATUS_FILTERS.find((f) => f.id === id)?.states ?? [];

function matches(item: LibraryItem, f: Filters): boolean {
  return (
    (f.tool === ALL || item.record.kind === f.tool) &&
    (f.status === ALL || inStatus(f.status).includes(item.record.state)) &&
    (f.area === ALL || item.area === f.area) &&
    (f.showClosed || item.record.state !== "closed")
  );
}

/**
 * Toolbox, Concept 1 — Tool cards and guided steps. One of the two safe
 * concepts.
 *
 * On a phone the four tools are a 2×2 grid of compact tiles, each with its
 * name and a few words on what it makes: short enough that the first library
 * items show above the fold. Wider, the tiles become one row of four. The
 * library below filters from one Filter menu (tool, status and plan area, each
 * a submenu with its counts, and whether closed work shows), newest first. A
 * tool opens as guided steps, one question a screen.
 */
export function ToolboxConcept1() {
  const p = useToolboxPage("concept-1");
  const [f, setF] = useState<Filters>(NONE);
  const shown = p.found.filter((i) => matches(i, f));

  // A choice's count is what it would show with the other filters kept.
  const count = (change: Partial<Filters>) => p.found.filter((i) => matches(i, { ...f, ...change })).length;
  const set = (change: Partial<Filters>) => setF((current) => ({ ...current, ...change }));

  const on = [f.tool !== ALL, f.status !== ALL, f.area !== ALL, !f.showClosed].filter(Boolean).length;
  const summary = [
    f.tool !== ALL ? TOOLS[f.tool as ArtifactKind].name : null,
    f.status !== ALL ? STATUS_FILTERS.find((s) => s.id === f.status)?.label : null,
    f.area !== ALL ? SIGNALS.find((s) => s.id === f.area)?.name : null,
    f.showClosed ? null : F.closedHidden,
  ].filter((part): part is string => Boolean(part));

  const radios = (key: "tool" | "status" | "area", label: string, options: { value: string; label: string }[]): MenuEntry => ({
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

  const label = (key: "tool" | "status" | "area", fallback: string, names: Record<string, string>) =>
    f[key] === ALL ? undefined : names[f[key]] ?? fallback;

  const entries: MenuEntry[] = [
    {
      type: "submenu",
      id: "tool",
      label: F.tool,
      hint: label("tool", "", Object.fromEntries(TOOL_ORDER.map((k) => [k, TOOLS[k].name]))),
      items: [radios("tool", F.tool, TOOL_ORDER.map((k) => ({ value: k, label: TOOLS[k].name })))],
    },
    {
      type: "submenu",
      id: "status",
      label: F.status,
      hint: label("status", "", Object.fromEntries(STATUS_FILTERS.map((s) => [s.id, s.label]))),
      items: [radios("status", F.status, STATUS_FILTERS.map((s) => ({ value: s.id, label: s.label })))],
    },
    {
      type: "submenu",
      id: "area",
      label: F.area,
      hint: label("area", "", Object.fromEntries(SIGNALS.map((s) => [s.id, s.name]))),
      items: [radios("area", F.area, SIGNALS.map((s) => ({ value: s.id, label: s.name })))],
    },
    { type: "separator", id: "sep-1" },
    { type: "checkbox", id: "closed", label: F.showClosed, checked: f.showClosed, onCheckedChange: (checked) => set({ showClosed: checked }) },
    { type: "separator", id: "sep-2" },
    { type: "item", id: "clear", label: F.clear, icon: "close", disabled: on === 0, onSelect: () => setF(NONE) },
  ];

  return (
    <div className="toolbox-page toolbox-page--c1">
      {p.header}
      <ToolPicker layout="tiles" hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
        {p.empty ?? (
          <>
            <div className="library__filter">
              <DropdownMenu label={F.button} icon="filter" badge={on ? String(on) : undefined} srSuffix={on ? F.on(on) : undefined} entries={entries} />
              {on ? (
                <p className="library__filter-summary">
                  {F.showing(summary)}{" "}
                  <button type="button" className="library__clear" onClick={() => setF(NONE)}>
                    {F.clear}
                  </button>
                </p>
              ) : null}
            </div>
            {p.noMatch}
            {shown.length === 0 && !p.noMatch ? <p className="library__no-match">{F.noneMatch}</p> : null}
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
