import { createElement, type ComponentProps } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
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
    icon: "document",
    trailing: { badge: createElement(LoopStatus, { record: ready, detail: false }), actions: more("Brief for your manager check-in") },
    href: "/playbook-flow/concept-3?artifact=check-in-brief",
  },
  {
    id: "post",
    primary: "Post: How planning season decides who gets new work",
    secondary: "Thought Leadership Builder · Last changed today · 1 version · Started from today’s Briefing",
    icon: "pencil",
    trailing: { badge: createElement(LoopStatus, { record: draft, detail: false }), actions: more("Post") },
    href: "/playbook-flow/concept-3?artifact=post",
  },
  {
    id: "story",
    primary: "Your leadership story",
    secondary: "Positioning Builder · Last changed on Tuesday · 2 versions",
    icon: "person",
    trailing: { meta: "Mon, Oct 5, 2026", actions: more("Your leadership story") },
    href: "/playbook-flow/concept-3?artifact=story",
  },
];

export const listStates = defineComponentStates({
  name: "List",
  group: "layout",
  status: "draft",
  flows: ["playbook"],
  description:
    "Rows with the name and a second line under it where there is one, a leading icon, and trailing badges, metadata or actions, with full dividers or none. A row with a link opens from it, the whole row the target. Spacing, dividers and type from the LISTS tokens.",
  component: List,
  notApplicable: {
    loading: "Its rows are given to it: there is nothing to wait for.",
    error: "A list only shows rows: nothing can fail.",
    disabled: "No row is ever switched off: a row is there to open, or not there.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Two lines, icons, badges and actions — default", props: { items: artifacts, label: "Library" } },
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
