import Link from "next/link";
import { EntryLink } from "@/components/homepage/EntryLink";
import { Icon, type IconName } from "@/components/primitives/Icon";
import type { ArtifactKind } from "@/mock/loop";
import { TOOL_ORDER, PLAYBOOK_PAGE, TOOLS } from "@/mock/playbook";

export const TOOL_ICONS: Record<ArtifactKind, IconName> = {
  positioning: "person",
  pitch: "mic",
  "situation-brief": "document",
  // Not the pencil: that is the Playbook itself in the navigation.
  "thought-leadership": "lightbulb",
};

/** The tool her next plan step needs, as a row under the four. */
export interface ToolLead {
  kind: ArtifactKind;
  /** The step, as the plan says it. */
  step: string;
  /** Where the lead opens: the tool on that step, or its draft. */
  href: string;
  /** "Start a brief", or "Open your draft". */
  action: string;
}

export interface ToolPickerProps {
  /** Where each tool opens. */
  hrefFor: (kind: ArtifactKind) => string;
  /**
   * - `rail`: a column of four rows, each the icon, the name and what it
   *   makes, for the column down the left of the page on web (Concept 2,
   *   option A, 15 Oct). With a `lead`, the next step's tool is under them.
   * - `card`: the rail's rows in one card, a hairline between them and
   *   each icon in its dawn, for the phone, so what each tool makes is
   *   said there too. With a `lead`, under them.
   */
  layout: "rail" | "card";
  /** The tool her next plan step needs, as one row
   *  under the four. Without one, the four alone. */
  lead?: ToolLead;
  /** The group's accessible name. */
  label?: string;
  /** Catalogue only: shows the first tool in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The four tools, always at the top of the Playbook: each its icon, its name
 * and what it makes.
 */
export function ToolPicker({ hrefFor, layout, lead, label = "Tools", demo, className }: ToolPickerProps) {
  return (
    <nav className={["tool-picker", `tool-picker--${layout}`, className].filter(Boolean).join(" ")} aria-label={label}>
      <ul className="tool-picker__list">
        {TOOL_ORDER.map((kind, i) => (
          <li key={kind} className="tool-picker__item">
            <Link href={hrefFor(kind)} className={["tool-picker__tool", i === 0 && demo && !lead ? `is-${demo}` : null].filter(Boolean).join(" ")}>
              <span className="tool-picker__disc">
                <Icon name={TOOL_ICONS[kind]} size={20} className="tool-picker__icon" />
              </span>
              <span className="tool-picker__text">
                <span className="tool-picker__name">{TOOLS[kind].label}</span>
                <span className="tool-picker__short">{TOOLS[kind].short}</span>
              </span>
              <Icon name="chevron" size={16} className="tool-picker__go" />
            </Link>
          </li>
        ))}
      </ul>
      {lead ? <LeadRow lead={lead} demo={demo} /> : null}
    </nav>
  );
}

/** The next step's tool as the shared EntryLink card: the tool's icon on
 *  the eyebrow's line, the tool and the step. */
function LeadRow({ lead, demo }: { lead: ToolLead; demo?: ToolPickerProps["demo"] }) {
  return (
    <EntryLink
      href={lead.href}
      icon={TOOL_ICONS[lead.kind]}
      eyebrow={PLAYBOOK_PAGE.nextOnPlan}
      title={TOOLS[lead.kind].name}
      detail={lead.step}
      demo={demo}
    />
  );
}

export default ToolPicker;
