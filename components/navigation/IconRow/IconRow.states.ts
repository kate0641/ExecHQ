import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { IconRow, type IconRowItem } from "./IconRow";

const places = (current: string, dot?: string): IconRowItem[] =>
  ([["Home", "home"], ["Plan", "flag"], ["Signals", "trend-up"], ["Toolbox", "pencil"], ["Briefing", "calendar"], ["Profile", "person"]] as const).map(([label, icon]) => ({
    id: label,
    href: "#",
    label,
    icon,
    current: label === current,
    dot: label === dot,
    note: label === dot ? ", new in your Signal Picture" : undefined,
  }));

const tools: IconRowItem[] = [
  { id: "positioning", href: "#", label: "Positioning statement", fullName: "Positioning Builder", icon: "person" },
  { id: "pitch", href: "#", label: "Pitch builder", fullName: "Pitch Builder", icon: "mic" },
  { id: "situation-brief", href: "#", label: "Situation brief", fullName: "Situation Brief", icon: "document" },
  { id: "thought-leadership", href: "#", label: "Thought leadership", fullName: "Thought Leadership Builder", icon: "lightbulb" },
];

export const iconRowStates = defineComponentStates({
  name: "IconRow",
  group: "navigation",
  status: "draft",
  flows: ["navigation", "toolbox"],
  description:
    "One row of icons, each over its name, that fits the width however many there are. The advisor's navigation uses it for the product's places, the current one in a filled circle; Toolbox Concept 2 uses it for the four tools, with no current item, so tools and places read as one family.",
  component: IconRow,
  notApplicable: {
    ...FIXED_CONTENT,
    hover: "Nothing changes on hover, by the designer's decision (11 Oct): it carries no meaning on a phone.",
    active: "No pressed style, by the same decision: the page changes as soon as she taps.",
    disabled: "Every place and every tool is always open.",
    empty: "There is always a row to show: the product's places, or the four tools.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Places, on Home — default", props: { items: places("Home"), label: "Go to" } },
    { label: "Places, something new on Signals", props: { items: places("Plan", "Signals"), label: "Go to" } },
    { label: "Tools, large, two lines (Toolbox Concept 2)", props: { items: tools, label: "Tools", size: "lg", twoLines: true }, description: "No current item. Every name breaks after its first word, so the row lines up." },
    { label: "Tools, one line each — long text", props: { items: tools, label: "Tools" }, states: ["long text"], description: "Without two lines, a long name wraps where it must and the row keeps its width." },
    { label: "Places — focus", props: { items: places("Home"), label: "Go to", demo: "focus" } },
  ],
});
