import { createElement, type ComponentProps } from "react";
import { defineComponentStates } from "@/components/types";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { createRecord, markReady } from "@/lib/loop";
import { List, type ListItemData } from "./List";

const noop = () => {};
const draft = createRecord({ id: "a", kind: "situation-brief", title: "Brief", name: "your brief", on: "2026-10-05" });
const ready = markReady(draft, "2026-10-06");
const more = (name: string) =>
  createElement(
    Button,
    { variant: "ghost", size: "sm", "aria-label": `More for ${name}`, onClick: noop } as Omit<ComponentProps<typeof Button>, "children"> as ComponentProps<typeof Button>,
    createElement(Icon, { name: "menu", size: 16 })
  );

const artifacts: ListItemData[] = [
  {
    id: "brief",
    primary: "Brief for your manager check-in",
    secondary: "Situation Brief · Last changed today · 3 versions · For: Brief your manager before Thursday’s check-in",
    leading: { type: "icon", name: "document" },
    trailing: { badge: createElement(LoopStatus, { record: ready, detail: false }), actions: more("Brief for your manager check-in") },
    href: "/toolbox-flow/concept-1?artifact=check-in-brief",
  },
  {
    id: "post",
    primary: "Post: How planning season decides who gets new work",
    secondary: "Thought Leadership Builder · Last changed today · 1 version · Started from today’s Briefing",
    leading: { type: "icon", name: "pencil" },
    trailing: { badge: createElement(LoopStatus, { record: draft, detail: false }), actions: more("Post") },
    href: "/toolbox-flow/concept-1?artifact=post",
  },
  {
    id: "story",
    primary: "Your leadership story",
    secondary: "Positioning Builder · Last changed on Tuesday · 2 versions",
    leading: { type: "icon", name: "person" },
    trailing: { meta: "5 Oct", actions: more("Your leadership story") },
    href: "/toolbox-flow/concept-1?artifact=story",
  },
];

const people: ListItemData[] = [
  { id: "maya", primary: "Maya Chen", secondary: "Senior Director, Campaigns", leading: { type: "avatar", initials: "MC" }, trailing: { meta: "You" } },
  { id: "sam", primary: "Sam Ortiz", secondary: "VP Marketing · Your manager", leading: { type: "avatar", initials: "SO" } },
  { id: "lee", primary: "Lee Park", secondary: "Planning review sponsor", leading: { type: "avatar", initials: "LP" }, disabled: true },
];

const choices: ListItemData[] = [
  { id: "a", primary: "Marlow Management Review", leading: { type: "checkbox", checked: false, onChange: noop } },
  { id: "b", primary: "The Calder Quarterly", leading: { type: "checkbox", checked: false, onChange: noop } },
  { id: "c", primary: "Ridgeline Leadership Journal", leading: { type: "checkbox", checked: false, onChange: noop } },
  { id: "d", primary: "Halden Business Daily", leading: { type: "checkbox", checked: false, onChange: noop }, disabled: true },
];

const steps: ListItemData[] = [
  { id: "1", primary: "Use your leadership story in your next 1:1", secondary: "This week", leading: { type: "icon", name: "compass" } },
  { id: "2", primary: "Brief your manager before Thursday’s check-in", secondary: "This week", leading: { type: "icon", name: "compass" } },
  { id: "3", primary: "Put yourself forward for the Q1 planning review", secondary: "By the end of the month", leading: { type: "icon", name: "compass" } },
  { id: "4", primary: "Build a documented case for broader scope", secondary: "Before the January planning cycle", leading: { type: "icon", name: "compass" } },
];

export const listStates = defineComponentStates({
  name: "List",
  group: "layout",
  status: "draft",
  flows: ["toolbox"],
  description:
    "Rows of one or two lines, with a leading icon, avatar or checkbox and trailing badges, metadata or actions, and full or inset dividers. Plain rows open from their link, the whole row the target. Selectable rows (one or several) move with the arrow keys and choose with Space or Enter. Reorderable rows drag by the handle, move by keyboard (Space, arrows, Space; Escape to cancel), or by the up and down buttons. Spacing, dividers and type from the LISTS tokens.",
  component: List,
  notApplicable: {
    loading: "Its rows are given to it: there is nothing to wait for.",
    error: "A list only shows rows: nothing can fail.",
  },
  variants: [
    { label: "Two lines, icons, badges and actions — default", props: { items: artifacts, label: "Library" } },
    { label: "Single line, inset dividers", props: { items: artifacts, label: "Library", lines: "single", dividers: "inset" } },
    { label: "Avatars and metadata, one unavailable — disabled", props: { items: people, label: "People", selection: "single", defaultSelected: ["sam"] } },
    { label: "Several chosen, with checkboxes — selected", props: { items: choices, label: "Publishers", lines: "single", selection: "multiple", defaultSelected: ["a", "c"], dividers: "inset" } },
    { label: "Reorderable", description: "Drag a handle, or focus it and press Space, then Up or Down, then Space.", props: { items: steps, label: "Your steps", reorderable: true } },
    { label: "No dividers, unframed", props: { items: artifacts.slice(0, 2), label: "Library", dividers: "none", framed: false } },
    { label: "Row — hover", props: { items: artifacts.slice(0, 1), label: "Library", demo: "hover" } },
    { label: "Row — focus", props: { items: artifacts.slice(0, 1), label: "Library", demo: "focus" } },
    { label: "Row — pressed", props: { items: artifacts.slice(0, 1), label: "Library", demo: "active" } },
    { label: "Nothing in it — empty", props: { items: [], label: "Library" } },
    {
      label: "A long title wraps",
      props: { items: [{ ...artifacts[0], primary: "Brief for your manager check-in on the planning workstream, the Q1 review and what comes after it" }], label: "Library" },
    },
  ],
});
