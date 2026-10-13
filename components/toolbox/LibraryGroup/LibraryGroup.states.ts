import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { List } from "@/components/layout/List";
import { LibraryGroup } from "./LibraryGroup";

const row = createElement(List, {
  label: "Library",
  items: [{ id: "brief", primary: "Brief for your manager check-in", secondary: "Situation Brief · Last changed today · 3 versions", leading: { type: "icon", name: "document" }, href: "/toolbox-flow/concept-2?artifact=check-in-brief" }],
});

export const libraryGroupStates = defineComponentStates({
  name: "LibraryGroup",
  group: "layout",
  status: "draft",
  flows: ["toolbox"],
  description:
    "A group in the library under one heading: a plan area with its count, opening and closing from its heading, or a week on the timeline with no count, joined by a rule down the left (Concept 3).",
  component: LibraryGroup,
  notApplicable: {
    ...CONTENT_INSIDE,
    hover: "The heading button shares the plain button hover.",
    active: "A press opens or closes it at once.",
    disabled: "A group is only shown when it holds something.",
    empty: "A group is only shown when it holds something.",
  },
  variants: [
    { label: "Plan area, open — default", props: { heading: "Time with the people who decide", count: 1, layout: "section", children: row }, states: ["focus"] },
    { label: "Plan area, closed", props: { heading: "A broader remit", count: 2, layout: "section", startOpen: false, children: row } },
    { label: "A week on the timeline", props: { heading: "This week", layout: "week", children: row } },
    { label: "A long plan area wraps", props: { heading: "Being seen as a leader, not only an operator", count: 1, layout: "section", children: row } },
  ],
});
