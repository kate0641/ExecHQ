import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { StepChangePanel } from "./StepChangePanel";

const noop = () => {};
const base = { title: "Brief your manager before Thursday’s check-in", today: "2026-10-20", date: "2026-10-22", onDecline: noop, onDefer: noop, onEdit: noop, onClose: noop };

export const stepChangePanelStates = defineComponentStates({
  name: "StepChangePanel",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "What takes over a step's card when she taps the quiet “Change this step” link: first what she wants to do (not for me, do it later, or change the timing or how much), then a few plain questions for that choice and a free-type box for her reasons. Every question is optional apart from the day for “later”. It never asks “are you sure?” and nothing counts against her. What she writes is kept for the advisor and never shown back unasked.",
  component: StepChangePanel,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Every question is optional, so there is nothing to get wrong.",
      },
  variants: [
    { label: "What would you like to do? — default", props: base },
    { label: "Not for me — empty, nothing chosen or written yet", props: { ...base, demoScreen: "decline" } },
    { label: "Not for me — a reason chosen and her words written", props: { ...base, demoScreen: "decline", demoFilled: true } },
    { label: "Do it later — a day and a note", props: { ...base, demoScreen: "later" } },
    { label: "Change the timing or how much", props: { ...base, demoScreen: "change" } },
    {
      label: "A long step title wraps",
      props: { ...base, title: "Brief your manager on the cross-functional planning workstream before Thursday’s check-in with finance and sales operations" },
    },
  ],
});
