import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { PlanDirection } from "@/components/plan/PlanDirection";
import { RoadmapEntry } from "./RoadmapEntry";

const inside = createElement(PlanDirection, {
  direction: "I want to move from running campaigns to leading a broader marketing organization.",
});

export const roadmapEntryStates = defineComponentStates({
  name: "RoadmapEntry",
  group: "navigation",
  status: "draft",
  flows: ["plan"],
  description:
    "“Your roadmap” under Why this matters on the Plan, on a phone and a tablet: a lime chip with the plan’s flag and a chevron. It opens a sheet with her direction and the stacked stages.",
  component: RoadmapEntry,
  notApplicable: {
    hover: "Hover carries no meaning on a phone: nothing changes.",
    active: "Pressing it opens the sheet at once.",
    disabled: "It can always be opened.",
    loading: "Her plan is on her device: there is nothing to wait for.",
    error: "Nothing here can fail: it only opens her roadmap.",
    empty: "She always has a plan from onboarding.",
    filled: "Not an input: it only opens her roadmap.",
    "long text": "Its words are fixed and short.",
  },
  variants: [
    { label: "Default", props: { children: inside } },
    { label: "Focus", props: { children: inside, demoState: "focus" } },
    { label: "Sheet open", props: { children: inside, demoOpen: true } },
  ],
});
