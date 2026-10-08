import { defineComponentStates } from "@/components/types";
import { PlanDetailLink } from "./PlanDetailLink";

const base = {
  planId: "leadership-scope",
  rationale: "You said you want to lead a broader team, so this plan puts your leadership story first.",
  stage: 0,
  direction: "I want to move from running campaigns to leading a broader marketing organization.",
  editHref: "/onboarding/concept-3?edit=1",
};

export const planDetailLinkStates = defineComponentStates({
  name: "PlanDetailLink",
  group: "navigation",
  status: "draft",
  flows: ["plan"],
  description:
    "“See your plan”, beside the roadmap’s heading in the guided check-in. It opens the plan detail, the same sheet as the Plan header’s Edit.",
  component: PlanDetailLink,
  notApplicable: {
    active: "Pressing it opens the detail at once.",
    disabled: "It can always be opened.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her plan.",
    empty: "She always has a plan from onboarding.",
    filled: "Not an input: it only opens her plan.",
    "long text": "Its words are fixed and short.",
  },
  variants: [
    { label: "Default", props: base },
    { label: "Hover", props: { ...base, demoState: "hover" } },
    { label: "Focus", props: { ...base, demoState: "focus" } },
    { label: "Detail open", props: { ...base, edited: true, demoOpen: true } },
  ],
});
