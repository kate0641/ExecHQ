import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/Icon";
import type { ArtifactKind } from "@/mock/loop";
import { TOOL_ORDER, TOOLS } from "@/mock/toolbox";

export const TOOL_ICONS: Record<ArtifactKind, IconName> = {
  positioning: "person",
  pitch: "mic",
  "situation-brief": "document",
  "thought-leadership": "pencil",
};

export interface ToolPickerProps {
  /** Where each tool opens. */
  hrefFor: (kind: ArtifactKind) => string;
  /**
   * - `tiles`: a 2×2 grid on a phone, one row of four wider (Concept 1).
   * - `chips`: one row of chips that scrolls sideways.
   * - `icons`: one row of four that fits the width, each an icon over a short
   *   name, so nothing scrolls and the library keeps the first screen
   *   (Concept 2).
   */
  layout: "tiles" | "chips" | "icons";
  /** The group's accessible name. */
  label?: string;
  /** Catalogue only: shows the first tool in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The four tools, always at the top of the Toolbox. A tile carries the tool's
 * name and a few words on what it makes; a chip, the name alone; an icon
 * option, the icon over a short name.
 */
export function ToolPicker({ hrefFor, layout, label = "Tools", demo, className }: ToolPickerProps) {
  return (
    <nav className={["tool-picker", `tool-picker--${layout}`, className].filter(Boolean).join(" ")} aria-label={label}>
      <ul className="tool-picker__list">
        {TOOL_ORDER.map((kind, i) => {
          const tool = TOOLS[kind];
          return (
            <li key={kind} className="tool-picker__item">
              <Link
                href={hrefFor(kind)}
                className={["tool-picker__tool", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
              >
                {layout === "icons" ? (
                  <>
                    <span className="tool-picker__badge" aria-hidden="true">
                      <Icon name={TOOL_ICONS[kind]} size={20} />
                    </span>
                    {/* The short name shows; the full one is what is read. */}
                    <span className="tool-picker__name" aria-hidden="true">
                      {tool.label}
                    </span>
                    <span className="u-visually-hidden">{tool.name}</span>
                  </>
                ) : (
                  <>
                    <Icon name={TOOL_ICONS[kind]} size={layout === "tiles" ? 20 : 16} className="tool-picker__icon" />
                    <span className="tool-picker__name">{tool.name}</span>
                    {layout === "tiles" ? <span className="tool-picker__short">{tool.short}</span> : null}
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default ToolPicker;
