import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { StepChangePanel } from "./StepChangePanel";

const noop = () => {};
const base = {
  title: "Brief your manager before Thursday’s check-in",
  today: "2026-10-20",
  date: "2026-10-22",
  effortText: "About an hour",
  done: "Your brief is marked used or sent.",
  onEdit: noop,
  onReplace: noop,
  onClose: noop,
};

export const stepChangePanelStates = defineComponentStates({
  name: "StepChangePanel",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "What takes over a step's card when she taps the quiet “Edit” link: first what she wants to do (edit this step, or ask for a different one), then a few plain questions for that choice and a free-type box for her own words. She can edit when it happens, how long it will take her, and what counts as done. The outcome, the plan area and the reasons are ExecHQ's reading of her situation, so they are not editable: if they are wrong, asking for a different step is how she says so. Every question is optional. It never asks “are you sure?” and nothing counts against her. What she writes is kept for the advisor and never shown back unasked.",
  component: StepChangePanel,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Every question is optional, so there is nothing to get wrong.",
      },
  variants: [
    { label: "What would you like to do? — default", props: base },
    { label: "Edit this step — when, how long, what counts as done", props: { ...base, demoScreen: "edit" } },
    { label: "Ask for a different step — empty, nothing chosen or written yet", props: { ...base, demoScreen: "replace" } },
    { label: "Ask for a different step — a reason chosen and her words written", props: { ...base, demoScreen: "replace", demoFilled: true } },
    {
      label: "A long step title wraps",
      props: { ...base, title: "Brief your manager on the cross-functional planning workstream before Thursday’s check-in with finance and sales operations" },
    },
  ],
});
