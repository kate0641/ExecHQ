import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { ProgressStepper } from "./ProgressStepper";

const noop = () => {};
const steps = [
  { id: "moment", label: "Moment" },
  { id: "outcome", label: "Outcome" },
  { id: "audience", label: "Who’s there" },
  { id: "check", label: "Check" },
  { id: "draft", label: "Draft" },
];
const base = { steps, current: "audience", label: "Your progress", onSelect: noop };

export const progressStepperStates = defineComponentStates({
  name: "ProgressStepper",
  group: "navigation",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "Where she is in something with steps: numbered discs joined by lines. Done is filled with a check, the current step a ring, steps ahead muted and joined by a dashed line, and a step with a problem carries a warning mark, so each state has a shape as well as a colour. Done steps can be opened to go back; the current one and those ahead are locked. Horizontal, or vertical for a side column; on a phone, the discs and lines only.",
  component: ProgressStepper,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Steps ahead are locked: shown in every variant, as the upcoming steps.",
    empty: "A progress-stepper always has its steps.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Third of five — default", props: base },
    { label: "First step, nothing done yet", props: { ...base, current: "moment" } },
    { label: "Last step, all done before it", props: { ...base, current: "draft" } },
    { label: "A step needs attention — error", props: { ...base, steps: steps.map((s) => (s.id === "audience" ? { ...s, error: true } : s)) } },
    { label: "Locked: nothing can be opened", props: { ...base, onSelect: undefined } },
    { label: "Discs only, for a phone", props: { ...base, labels: "none" } },
    { label: "Vertical", props: { ...base, orientation: "vertical" } },
    { label: "Done step — hover", props: { ...base, demo: "hover" } },
    { label: "Done step — focus", props: { ...base, demo: "focus" } },
    { label: "Done step — pressed", props: { ...base, demo: "active" } },
    {
      label: "Long names wrap",
      props: { ...base, steps: steps.map((s) => (s.id === "outcome" ? { ...s, label: "What you want to come out of it" } : s)) },
    },
  ],
});
