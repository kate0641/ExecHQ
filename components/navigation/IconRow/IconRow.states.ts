import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { IconRow, type IconRowItem } from "./IconRow";

const places = (current: string, dot?: string): IconRowItem[] =>
  ([["Home", "home"], ["Plan", "flag"], ["Signals", "trend-up"], ["Playbook", "pencil"], ["Briefing", "calendar"], ["Profile", "person"]] as const).map(([label, icon]) => ({
    id: label,
    href: "#",
    label,
    icon,
    current: label === current,
    dot: label === dot,
    note: label === dot ? ", new in your Signal Picture" : undefined,
  }));

const longPlaces: IconRowItem[] = ["Your direction", "Signal Picture", "Daily Briefing", "Playbook"].map((label) => ({
  id: label,
  href: "#",
  label,
  icon: "flag",
}));

export const iconRowStates = defineComponentStates({
  name: "IconRow",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "One row of icons, each over its name, that fits the width however many there are. The advisor's navigation uses it for the product's places, the current one in a filled circle.",
  component: IconRow,
  notApplicable: {
    ...FIXED_CONTENT,
    hover: "Nothing changes on hover, by the designer's decision (11 Oct): it carries no meaning on a phone.",
    active: "No pressed style, by the same decision: the page changes as soon as she taps.",
    disabled: "Every place is always open.",
    empty: "There is always a row to show: the product's places.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Places, on Home — default", props: { items: places("Home"), label: "Go to" } },
    { label: "Places, something new on Signals", props: { items: places("Plan", "Signals"), label: "Go to" } },
    { label: "Long names — long text", props: { items: longPlaces, label: "Go to" }, states: ["long text"], description: "A long name wraps where it must and the row keeps its width." },
    { label: "Places — focus", props: { items: places("Home"), label: "Go to", demo: "focus" } },
  ],
});
