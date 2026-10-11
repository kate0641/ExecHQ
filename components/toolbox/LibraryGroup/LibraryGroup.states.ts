import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { LibraryRow } from "@/components/toolbox/LibraryRow";
import { BRIEF_READY, EXAMPLE_TODAY } from "@/components/toolbox/library-examples";
import { LibraryGroup } from "./LibraryGroup";

const noop = () => {};
const row = createElement(LibraryRow, { item: BRIEF_READY, today: EXAMPLE_TODAY, href: "/toolbox-flow/concept-2?artifact=x", onMore: noop, hideArea: true, headingLevel: 4 });

export const libraryGroupStates = defineComponentStates({
  name: "LibraryGroup",
  group: "layout",
  status: "draft",
  flows: ["toolbox"],
  description:
    "A group in the library under one heading with its count: a plan area that opens and closes from its heading (Concept 2), or a week on the timeline, joined by a rule down the left (Concept 3).",
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
    { label: "A week on the timeline", props: { heading: "This week", count: 1, layout: "week", children: row } },
    { label: "A long plan area wraps", props: { heading: "Being seen as a leader, not only an operator", count: 1, layout: "section", children: row } },
  ],
});
