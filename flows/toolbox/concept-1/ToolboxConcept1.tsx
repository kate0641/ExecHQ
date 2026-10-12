"use client";

import { useState } from "react";
import { DropdownMenu, type MenuEntry } from "@/components/form/DropdownMenu";
import { ToolPicker, type ToolLead } from "@/components/toolbox/ToolPicker";
import { useLoop } from "@/lib/loop-store";
import { useToolboxLinks } from "@/lib/toolbox-links";
import { useViewport } from "@/lib/viewport-context";
import { PLAN_AGENDA_COPY, stepById } from "@/mock/plan";
import type { LibraryItem } from "@/lib/library";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/toolbox";
import { useToolboxPage } from "../useToolboxPage";

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
 * screen. With no step that needs a tool, the four are equal tiles. The
 * library below filters from two menus side by side, tool and status (with
 * whether closed work shows), each a plain list with its counts, newest
 * first. A
 * tool opens as guided steps, one question a screen.
 */
/** The tool her next plan step needs: the first step on her plan that makes
 *  something with a tool. None, and the four tools are equal. */
function useLead(): ToolLead | undefined {
  const loop = useLoop();
  const links = useToolboxLinks();
  for (const rec of loop.recommendations) {
    const step = stepById(rec.id);
    const kind = TOOL_ORDER.find((k) => TOOLS[k].name === step?.toolboxTool);
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

export function ToolboxConcept1() {
  const p = useToolboxPage("concept-1");
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

  return (
    <div className="toolbox-page toolbox-page--c1">
      {p.header}
      <ToolPicker layout="lead" lead={lead} compact={compact} hrefFor={(kind) => p.toolHref(kind)} />
      <section className="library" aria-labelledby={p.libraryId}>
        {p.libraryHeader}
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
            {p.list(shown)}
          </>
        )}
      </section>
      {p.sheet}
    </div>
  );
}

export default ToolboxConcept1;
