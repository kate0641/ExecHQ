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
    "Her direction, quoted in her own words, at the head of the roadmap under the move in the guided check-in. The head row folds the quote away, remembered on her device, and keeps See your plan, which opens the plan detail, the same sheet as the Plan header’s Edit, where she sees her plan and starts the flow that changes her direction.",
  component: PlanDirectionCard,
  notApplicable: {
    active: "Its two controls are text buttons: pressing one folds the quote or opens the detail at once.",
    disabled: "It can always be opened.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her plan.",
    empty: "She always has a direction from onboarding.",
    filled: "Not an input: it only reads her direction.",
  },
  variants: [
    { label: "Default — open", props: { ...base, demoFolded: false } },
    { label: "Folded — the quote put away, See your plan kept", props: { ...base, demoFolded: true } },
    { label: "Hover", props: { ...base, demoFolded: false, demoState: "hover" } },
    { label: "Focus", props: { ...base, demoFolded: false, demoState: "focus" } },
    {
      label: "Long text — a long direction wraps",
      props: {
        ...base,
        demoFolded: false,
        direction:
          "I want to move from running regional campaigns to leading a broader marketing organization across product lines, with a seat in the planning conversations that set next year’s priorities.",
      },
    },
    { label: "Detail open", props: { ...base, demoFolded: false, edited: true, demoOpen: true } },
  ],
});
