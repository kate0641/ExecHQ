import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { StepBar } from "./StepBar";

const ONBOARDING_ITEMS = [
  { id: "account", label: "Account" },
  { id: "privacy", label: "Privacy" },
  { id: "direction", label: "Direction" },
  { id: "refinement", label: "Refinement" },
  { id: "interpretation", label: "Interpretation" },
  { id: "plan", label: "Plan" },
  { id: "artifact", label: "Draft" },
  { id: "connect", label: "Connections" },
  { id: "complete", label: "Done" },
];

const noop = () => {};

export const stepBarStates = defineComponentStates({
  name: "StepBar",
  group: "navigation",
  status: "draft",
  flows: [],
  description:
    "Prototype scaffolding, not product UI. A thin bar across the top of the window listing every screen of the concept on the canvas, so a reviewer can jump straight to one. Jumping ahead fills any unanswered earlier step with sample answers. A concept declares its screens with `useStepNav`; anything that declares none gets no bar. The current screen is marked with `aria-current=\"step\"`, and the list scrolls sideways rather than wrapping.",
  component: StepBar,
  notApplicable: {
    disabled: "Review scaffolding: every step can always be jumped to.",
    loading: "Review scaffolding: the steps are fixed.",
    error: "Review scaffolding: jumping to a step cannot fail.",
    "long text": "Review scaffolding: the labels are short reviewer names, fixed in code.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default — first screen",
      props: { items: ONBOARDING_ITEMS, currentId: "account", onSelect: noop },
    },
    {
      label: "Part way through",
      props: { items: ONBOARDING_ITEMS, currentId: "plan", onSelect: noop },
    },
    {
      label: "Few steps",
      description: "A short flow keeps the bar the same height; the steps sit at the start.",
      props: {
        items: ONBOARDING_ITEMS.slice(0, 3),
        currentId: "privacy",
        onSelect: noop,
      },
    },
    {
      label: "Empty",
      description: "No steps declared: the bar renders nothing, and the canvas keeps the full height.",
      props: { items: [], currentId: "", onSelect: noop },
    },
  ],
});
