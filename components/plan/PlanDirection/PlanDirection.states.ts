import { defineComponentStates } from "@/components/types";
import { PlanDirection } from "./PlanDirection";

const direction = "I want to move from running campaigns to leading a broader marketing organization.";

export const planDirectionStates = defineComponentStates({
  name: "PlanDirection",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Her direction above the roadmap in the guided check-in: “Your direction” with a chevron opens it like an accordion, to her words quoted in a card. It starts closed, and opening it is remembered on her device.",
  component: PlanDirection,
  notApplicable: {
    active: "Its one control opens or closes it at once.",
    disabled: "It can always be opened.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads her direction.",
    empty: "She always has a direction from onboarding.",
    filled: "Not an input: it only reads her direction.",
  },
  variants: [
    { label: "Default — closed, her first line cut off", props: { direction, demoOpen: false } },
    { label: "Open — her words in full", props: { direction, demoOpen: true } },
    { label: "Hover", props: { direction, demoOpen: false, demoState: "hover" } },
    { label: "Focus", props: { direction, demoOpen: false, demoState: "focus" } },
    {
      label: "Long text — a long direction wraps",
      props: {
        demoOpen: true,
        direction:
          "I want to move from running regional campaigns to leading a broader marketing organization across product lines, with a seat in the planning conversations that set next year’s priorities.",
      },
    },
  ],
});
