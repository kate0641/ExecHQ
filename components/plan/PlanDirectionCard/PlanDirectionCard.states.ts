import { defineComponentStates } from "@/components/types";
import { PlanDirectionCard } from "./PlanDirectionCard";

const base = {
  planId: "leadership-scope",
  rationale: "You said you want to lead a broader team, so this plan puts your leadership story first.",
  stage: 0,
  direction: "I want to move from running campaigns to leading a broader marketing organization.",
  editHref: "/onboarding/concept-3?edit=1",
};

export const planDirectionCardStates = defineComponentStates({
  name: "PlanDirectionCard",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Her direction, quoted in her own words, at the head of the roadmap under the move in the guided check-in. The whole card opens the plan detail, the same sheet as the Plan header’s Edit, where she sees her plan and starts the flow that changes her direction.",
  component: PlanDirectionCard,
  notApplicable: {
    disabled: "It can always be opened.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her plan.",
    empty: "She always has a direction from onboarding.",
    filled: "Not an input: it only reads her direction.",
  },
  variants: [
    { label: "Default", props: base },
    { label: "Hover", props: { ...base, className: "is-hover" } },
    { label: "Focus", props: { ...base, className: "is-focus" } },
    { label: "Active", props: { ...base, className: "is-active" } },
    {
      label: "Long text — a long direction wraps",
      props: {
        ...base,
        direction:
          "I want to move from running regional campaigns to leading a broader marketing organization across product lines, with a seat in the planning conversations that set next year’s priorities.",
      },
    },
    { label: "Detail open", props: { ...base, edited: true, demoOpen: true } },
  ],
});
