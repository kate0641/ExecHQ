import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { BaselineForm } from "./BaselineForm";

const noop = () => {};
const base = { onSave: noop, onSkip: noop };

export const baselineFormStates = defineComponentStates({
  name: "BaselineForm",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "Where she says she is starting from, in one card: a stepper for each thing she can count and a number for her LinkedIn followers, all typed by hand. Zero is a fine answer, the followers are optional, and she can skip it for now.",
  component: BaselineForm,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Saving is local and instant: there is nothing to wait for.",
    error: "Every answer is optional and any number is valid, so there is nothing to get wrong.",
    "long text": "Its labels are fixed; the only text she types is a number.",
  },
  variants: [
    { label: "Empty — default", props: base },
    { label: "Filled in", props: { ...base, demo: { followers: "1,240", counts: { podcast: 1, press: 2, speaking: 1, writing: 3 } } } },
    { label: "Without a skip", props: { onSave: noop } },
  ],
});
