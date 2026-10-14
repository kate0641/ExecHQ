import Link from "next/link";
import { IconRow } from "@/components/navigation/IconRow";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { ToolIllustration } from "@/components/toolbox/ToolIllustration";
import type { ArtifactKind } from "@/mock/loop";
import { TOOL_ORDER, TOOLBOX_PAGE, TOOLS } from "@/mock/toolbox";

export const TOOL_ICONS: Record<ArtifactKind, IconName> = {
  positioning: "person",
  pitch: "mic",
  "situation-brief": "document",
  // Not the pencil: that is the Toolbox itself in the navigation.
  "thought-leadership": "lightbulb",
};

/** The tool her next plan step needs, which leads in the `lead` layout. */
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
   * - `tiles`: a 2×2 grid on a phone, one row of four wider (Concept 1).
   * - `chips`: one row of chips that scrolls sideways.
   * - `icons`: one row of four that fits the width, each an icon over a short
   *   name, so nothing scrolls and the library keeps the first screen
   *   (Concept 2). With a `lead`, the next step's tool is one row under them.
   * - `lead`: the tool for her next plan step leads, with the detailed
   *   drawing; the other three follow (Concept 1). See `compact`.
   */
  layout: "tiles" | "chips" | "icons" | "lead";
  /** `lead`: the tool that leads; without one, the four are tiles. `icons`:
   *  the next step's row under the four; without one, the four alone. */
  lead?: ToolLead;
  /** `lead` only: on a phone, the lead is one row and the other three are
   *  icons under it, so the library starts on the first screen. Otherwise a
   *  bento: the lead tall on the left, the others around it. */
  compact?: boolean;
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
export function ToolPicker({ hrefFor, layout, lead, compact = false, label = "Tools", demo, className }: ToolPickerProps) {
  if (layout === "lead" && lead) return <LeadPicker hrefFor={hrefFor} lead={lead} compact={compact} label={label} demo={demo} className={className} />;
  // Without a lead, the lead layout falls back to four equal tiles.
  const shape = layout === "lead" ? "tiles" : layout;
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

/** The next step's tool as one row: its drawing, "Next on your plan", the
 *  tool and the step. */
function LeadRow({ lead, demo }: { lead: ToolLead; demo?: ToolPickerProps["demo"] }) {
  return (
    <Link href={lead.href} className={["tool-picker__lead", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}>
      <ToolIllustration tool={lead.kind} level="simple" size={52} />
      <span className="tool-picker__lead-text">
        <span className="tool-picker__eyebrow">{TOOLBOX_PAGE.nextOnPlan}</span>
        <span className="tool-picker__name">{TOOLS[lead.kind].name}</span>
        <span className="tool-picker__step">{lead.step}</span>
      </span>
    </Link>
  );
}

/** The next step's tool leads; the other three follow. */
function LeadPicker({
  hrefFor,
  lead,
  compact,
  label,
  demo,
  className,
}: Required<Pick<ToolPickerProps, "hrefFor" | "lead" | "compact" | "label">> & Pick<ToolPickerProps, "demo" | "className">) {
  const tool = TOOLS[lead.kind];
  const others = TOOL_ORDER.filter((k) => k !== lead.kind);
  const demoClass = demo ? `is-${demo}` : null;

  if (compact) {
    return (
      <nav className={["tool-picker", "tool-picker--lead", "tool-picker--compact", className].filter(Boolean).join(" ")} aria-label={label}>
        <LeadRow lead={lead} demo={demo} />
        <ul className="tool-picker__others">
          {others.map((kind) => (
            <li key={kind}>
              <Link href={hrefFor(kind)} className="tool-picker__other">
                <ToolIllustration tool={kind} level="icon" size={26} />
                {/* The short name shows; the full one is what is read. */}
                <span className="tool-picker__other-name" aria-hidden="true">
                  {TOOLS[kind].label}
                </span>
                <span className="u-visually-hidden">{TOOLS[kind].name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className={["tool-picker", "tool-picker--lead", "tool-picker--bento", className].filter(Boolean).join(" ")} aria-label={label}>
      <Link href={lead.href} className={["tool-picker__hero", demoClass].filter(Boolean).join(" ")}>
        <span className="tool-picker__eyebrow">{TOOLBOX_PAGE.nextOnPlan}</span>
        <ToolIllustration tool={lead.kind} level="detailed" size={150} />
        <span className="tool-picker__name tool-picker__name--hero">{tool.name}</span>
        <span className="tool-picker__step">{lead.step}</span>
        <span className="tool-picker__go">{lead.action}</span>
      </Link>
      {others.map((kind) => (
        <Link key={kind} href={hrefFor(kind)} className="tool-picker__card">
          <ToolIllustration tool={kind} level="simple" size={64} />
          <span className="tool-picker__name">{TOOLS[kind].name}</span>
          <span className="tool-picker__short">{TOOLS[kind].short}</span>
        </Link>
      ))}
    </nav>
  );
}

export default ToolPicker;
