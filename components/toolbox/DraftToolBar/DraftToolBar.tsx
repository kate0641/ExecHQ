import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface DraftTool {
  id: string;
  label: string;
  icon: IconName;
  /** Its sheet is open. */
  open?: boolean;
  onOpen: () => void;
}

export interface DraftToolBarProps {
  /** Names the tools for assistive technology: "Your draft: Inputs". */
  label: string;
  /** In order: Inputs, Revise, Versions (Kate, 13 October). */
  tools: readonly DraftTool[];
  /** Across the rest of the row: Mark ready, then "I've used this". */
  children?: ReactNode;
  /** Catalogue only: shows the first tool in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The foot of a draft on a phone or tablet (Toolbox flow Concept 2, option B,
 * 13 October): what it was built from, changing it and its versions as small
 * icons with a word under each, each opening its own sheet, then the one
 * thing to do with it across the rest of the row. One bar at the foot, the
 * pattern the Briefing's reader bar and Concept 1 use.
 */
export function DraftToolBar({ label, tools, children, demo, className }: DraftToolBarProps) {
  return (
    <div className={["draft-tool-bar", className].filter(Boolean).join(" ")}>
      {tools.map((tool, i) => (
        <button
          key={tool.id}
          type="button"
          className={["draft-tool-bar__tool", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
          aria-expanded={Boolean(tool.open)}
          aria-haspopup="dialog"
          onClick={tool.onOpen}
        >
          <Icon name={tool.icon} size={18} />
          {tool.label}
          <span className="u-visually-hidden"> ({label})</span>
        </button>
      ))}
      {children ? <div className="draft-tool-bar__main">{children}</div> : null}
    </div>
  );
}

export default DraftToolBar;
