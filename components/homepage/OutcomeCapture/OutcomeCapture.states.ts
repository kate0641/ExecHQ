import { defineComponentStates } from "@/components/types";
import { OutcomeCapture } from "./OutcomeCapture";

const noop = () => {};

export const outcomeCaptureStates = defineComponentStates({
  name: "OutcomeCapture",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "What happened: the five outcome types from the spec as one choice, an optional private note, and Save. Works inline inside FollowUpCard; “Nothing yet” is offered as a normal answer.",
  component: OutcomeCapture,
  notApplicable: {
    disabled: "The question can always be answered; Save is never switched off.",
    loading: "Saving is local and immediate: there is nothing to wait for.",
  },
  variants: [
    { label: "None chosen yet — default", props: { onSubmit: noop } },
    {
      label: "Answer chosen, note filled",
      props: { onSubmit: noop, defaultType: "positive", defaultDetail: "She asked me to lead the planning workstream." },
    },
    {
      label: "Error — saving with nothing chosen",
      description: "Save stays pressable; the message says what’s missing.",
      props: { onSubmit: noop, showError: true },
    },
    { label: "Answer — hover", props: { onSubmit: noop, demo: { type: "neutral", state: "hover" } } },
    { label: "Answer — focus", props: { onSubmit: noop, demo: { type: "no-response-yet", state: "focus" } } },
    { label: "Answer — pressed", props: { onSubmit: noop, demo: { type: "negative", state: "active" } } },
    {
      label: "A long note wraps",
      props: {
        onSubmit: noop,
        defaultType: "neutral",
        defaultDetail:
          "Good conversation. She wants to see it in writing before the planning cycle, and suggested I talk to the head of operations first, since they will weigh in on who runs the review.",
      },
    },
  ],
});
