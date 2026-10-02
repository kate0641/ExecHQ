import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { Stepper } from "./Stepper";

const noop = () => {};
const base = { label: "Podcast appearances", hint: "Shows you have been a guest on", value: 1, onChange: noop };

export const stepperStates = defineComponentStates({
  name: "Stepper",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "A small count she nudges up and down, for numbers that are usually zero to three. The minus is switched off at zero, so zero is a clear floor. The number is read out as it changes.",
  component: Stepper,
  notApplicable: {
    loading: "Written from local data: there is nothing to wait for.",
    error: "Every number in range is valid, so there is nothing to get wrong.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — one", props: base },
    { label: "Empty — at zero, minus switched off", props: { ...base, value: 0 } },
    { label: "Disabled — at the largest, plus switched off", props: { ...base, value: 99, max: 99 } },
    { label: "Long text — a long label and hint wrap", props: { ...base, label: "Somewhere you publish, such as a newsletter, a blog or articles", hint: "A newsletter, blog or articles, and how many pieces you have put out so far" } },
    { label: "Hover", props: { ...base, demo: { button: "more", state: "hover" } } },
    { label: "Focus", props: { ...base, demo: { button: "more", state: "focus" } } },
    { label: "Pressed", props: { ...base, demo: { button: "more", state: "active" } } },
  ],
});
