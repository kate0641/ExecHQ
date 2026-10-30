import Link from "next/link";
import { EntryLink } from "@/components/homepage/EntryLink";
import { IconRow } from "@/components/navigation/IconRow";
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

/** The tool her next plan step needs, as a row under the `icons` layout. */
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
   * - `tiles`: a 2×2 grid on a phone, one row of four wider.
   * - `chips`: one row of chips that scrolls sideways.
   * - `icons`: one row of four that fits the width, each an icon over a short
   *   name, so nothing scrolls and the library keeps the first screen
   *   (Concept 2). With a `lead`, the next step's tool is one row under them.
   * - `rail`: a column of four rows, each the icon, the name and what it
   *   makes, for the column down the left of the page on web (Concept 2,
   *   option A, 15 Oct). With a `lead`, the next step's tool is under them.
   * - `card`: the rail's rows in one card, a hairline between them and
   *   each icon in its dawn, for the phone, so what each tool makes is
   *   said there too (designer, 2026-10-28). With a `lead`, under them.
   */
  layout: "tiles" | "chips" | "icons" | "rail" | "card";
  /** `icons`, `rail` and `card`: the tool her next plan step needs, as one row
   *  under the four. Without one, the four alone. */
  lead?: ToolLead;
  /** The group's accessible name. */
  label?: string;
  /** Catalogue only: shows the first tool in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The four tools, always at the top of the Playbook. A tile carries the tool's
 * name and a few words on what it makes; a chip, the name alone; an icon
 * option, the icon over a short name.
 */
export function ToolPicker({ hrefFor, layout, lead, label = "Tools", demo, className }: ToolPickerProps) {
  const shape = layout;
  // Icons are the navigation's own row, so tools and places read as one family.
  if (shape === "icons") {
    return (
      <nav className={["tool-picker", "tool-picker--icons", lead ? "tool-picker--with-lead" : null, className].filter(Boolean).join(" ")} aria-label={label}>
        <IconRow
          size="lg"
          twoLines
          demo={demo === "focus" && !lead ? "focus" : undefined}
          items={TOOL_ORDER.map((kind) => ({
            id: kind,
            href: hrefFor(kind),
            label: TOOLS[kind].label,
            fullName: TOOLS[kind].name,
            icon: TOOL_ICONS[kind],
          }))}
        />
        {lead ? <LeadRow lead={lead} demo={demo} /> : null}
      </nav>
    );
  }
  // The rail: the tools first, then the step that needs one (Kate, 15 Oct).
  if (shape === "rail" || shape === "card") {
    return (
      <nav className={["tool-picker", `tool-picker--${shape}`, className].filter(Boolean).join(" ")} aria-label={label}>
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
  return (
    <nav className={["tool-picker", `tool-picker--${shape}`, className].filter(Boolean).join(" ")} aria-label={label}>
      <ul className="tool-picker__list">
        {TOOL_ORDER.map((kind, i) => {
          const tool = TOOLS[kind];
          return (
            <li key={kind} className="tool-picker__item">
              <Link
                href={hrefFor(kind)}
                className={["tool-picker__tool", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
              >
                <Icon name={TOOL_ICONS[kind]} size={shape === "tiles" ? 20 : 16} className="tool-picker__icon" />
                <span className="tool-picker__name">{tool.name}</span>
                {shape === "tiles" ? <span className="tool-picker__short">{tool.short}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** The next step's tool as the shared EntryLink card: the tool's icon on
 *  the eyebrow's line, the tool and the step (designer, 2026-10-27: every
 *  icon, eyebrow, title and line card is an EntryLink). */
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
