"use client";

import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import type { ArtifactKind } from "@/mock/loop";
import { LIBRARY_COPY, STATUS_FILTERS, TOOL_ORDER, TOOLS } from "@/mock/toolbox";

export interface LibraryFiltersProps {
  tool?: ArtifactKind;
  status?: string;
  onTool: (tool: ArtifactKind | undefined) => void;
  onStatus: (status: string | undefined) => void;
  /** How many artifacts each choice would show, so an empty one says so. */
  countTool: (tool: ArtifactKind) => number;
  countStatus: (status: string) => number;
  className?: string;
}

/**
 * Concept 1's filters: one row of chips that scrolls sideways, by tool, then
 * by status. One of each at most; pressing a chosen chip clears it. Each chip
 * says how many artifacts it holds, and a choice that would show nothing is
 * left out.
 */
export function LibraryFilters({ tool, status, onTool, onStatus, countTool, countStatus, className }: LibraryFiltersProps) {
  const F = LIBRARY_COPY.filters;
  return (
    <div className={["library-filters", className].filter(Boolean).join(" ")}>
      <fieldset className="library-filters__strip">
        <legend className="u-visually-hidden">{F.tool}</legend>
        {TOOL_ORDER.filter((kind) => tool === kind || countTool(kind) > 0).map((kind) => (
          <button
            key={kind}
            type="button"
            className="library-filters__chip"
            aria-pressed={tool === kind}
            onClick={() => onTool(tool === kind ? undefined : kind)}
          >
            <Icon name={TOOL_ICONS[kind]} size={14} />
            {TOOLS[kind].name}
            <span className="library-filters__count">{countTool(kind)}</span>
          </button>
        ))}
      </fieldset>
      <fieldset className="library-filters__strip">
        <legend className="u-visually-hidden">{F.status}</legend>
        {STATUS_FILTERS.filter((f) => status === f.id || countStatus(f.id) > 0).map((f) => (
          <button
            key={f.id}
            type="button"
            className="library-filters__chip"
            aria-pressed={status === f.id}
            onClick={() => onStatus(status === f.id ? undefined : f.id)}
          >
            {f.label}
            <span className="library-filters__count">{countStatus(f.id)}</span>
          </button>
        ))}
      </fieldset>
    </div>
  );
}

export default LibraryFilters;
