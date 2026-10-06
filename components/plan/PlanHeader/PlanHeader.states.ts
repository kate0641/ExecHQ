import { defineComponentStates } from "@/components/types";
import { PlanHeader } from "./PlanHeader";

const base = {
  planId: "leadership-scope",
  rationale: "You said you want to lead a broader team, so this plan puts your leadership story first.",
  stage: 1,
  direction: "I want to move from running campaigns to leading a broader marketing organization.",
  editHref: "/onboarding/concept-3?edit=1",
  // Several headers on one page: only the page itself has an h1.
  asPageTitle: false,
};

export const planHeaderStates = defineComponentStates({
  name: "PlanHeader",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Says what her plan is before her next steps, and is the page\u2019s heading: \u201cYour plan\u201d as a small label, the plan\u2019s name large with a plain Edit link beside it, one line on what it is built around, and where she is in it. Edit opens the detail, where she sees her direction and starts the flow that changes it.",
  component: PlanHeader,
  notApplicable: {
    hover: "Its one control is a Button, which shows its own states.",
    focus: "Its one control is a Button, which shows its own states.",
    active: "Its one control is a Button, which shows its own states.",
    disabled: "Every control can always be used.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her plan.",
    empty: "She always has a plan from onboarding.",
    filled: "Not an input: it only reads her plan.",
  },
  variants: [
    { label: "Default — Step up", props: { ...base, headingId: "ph-default" } },
    { label: "Another plan", props: { ...base, planId: "current-org", headingId: "ph-other" } },
    {
      label: "Long text — the longest plan name and line wrap",
      props: { ...base, planId: "explore", headingId: "ph-long" },
    },
    { label: "Later stage — more of the strip filled", props: { ...base, stage: 2, headingId: "ph-later" } },
    { label: "Detail open", props: { ...base, demoOpen: true, headingId: "ph-open" } },
  ],
});
