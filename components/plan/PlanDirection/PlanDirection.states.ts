import { defineComponentStates } from "@/components/types";
import { PlanDirection } from "./PlanDirection";

const direction = "I want to move from running campaigns to leading a broader marketing organization.";

export const planDirectionStates = defineComponentStates({
  name: "PlanDirection",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Her direction above the roadmap in the guided check-in: “Your direction” as a grey eyebrow, then her words in full in the serif, in the system's white card. It only reads; changing her direction is in the plan sheet.",
  component: PlanDirection,
  notApplicable: {
    hover: "Not interactive: it only reads her direction.",
    focus: "Not interactive: it only reads her direction.",
    active: "Not interactive: it only reads her direction.",
    disabled: "Not interactive: it only reads her direction.",
    loading: "Her direction is already on the page: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her direction.",
    empty: "She always has a direction from onboarding.",
    filled: "Not an input: it only reads her direction.",
  },
  variants: [
    { label: "Default", props: { direction } },
    {
      label: "Long text — a long direction wraps",
      props: {
        direction:
          "I want to move from running regional campaigns to leading a broader marketing organization across product lines, with a seat in the planning conversations that set next year’s priorities.",
      },
    },
  ],
});
