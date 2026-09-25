import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { StepProgress } from "./StepProgress";

export const stepProgressStates = defineComponentStates({
  name: "StepProgress",
  group: "navigation",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Position and length, and nothing else. No percentage, no meter, no 'almost there' — the sequence has a legitimate exit at nearly every step, and a completion bar would frame taking it as failing to finish. The marks are decorative; a screen reader gets the sentence.",
  component: StepProgress,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always shows where you are.",
    "long text": "Shows numbers, not text.",
  },
  variants: [
    { label: "First of eight", props: { current: 1, total: 8 } },
    { label: "Mid sequence", props: { current: 4, total: 8 } },
    { label: "Last", props: { current: 8, total: 8 } },
    {
      label: "Optional tail",
      description:
        "Refinement: up to three questions. The hollow marks say 'up to', not 'three'.",
      props: { current: 1, total: 3, optionalFrom: 1, label: "Question" },
    },
    {
      label: "Optional tail — second answered",
      props: { current: 2, total: 3, optionalFrom: 1, label: "Question" },
    },
  ],
});
