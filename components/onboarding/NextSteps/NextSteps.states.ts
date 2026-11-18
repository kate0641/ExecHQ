import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { NextSteps } from "./NextSteps";

const noop = () => {};
const c = GUIDE_C3.story.draft.next;

export const nextStepsStates = defineComponentStates({
  name: "NextSteps",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The ways on from a finished piece of work, as equal choices: refine it now, take it further, or save it and come back later. None is the default.",
  component: NextSteps,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...FIXED_CONTENT,
    filled: NOT_AN_INPUT,
    empty: "Always has its choices.",
  },
  variants: [
    {
      label: "Three ways on",
      props: {
        label: c.label,
        steps: [
          { label: c.detail.label, detail: c.detail.detail, onChoose: noop },
          { label: c.versions.label, detail: c.versions.detail, onChoose: noop },
          { label: c.later.label, detail: c.later.detail, onChoose: noop },
        ],
      },
    },
    {
      label: "Long text",
      description: "Longer labels and details wrap inside the button.",
      props: {
        label: c.label,
        steps: [
          {
            label: "Add more detail about the role, the team and the results you are proudest of",
            detail: "Your role, what you are responsible for and a result, so the story says what you lead and who it helps.",
            onChoose: noop,
          },
          { label: c.later.label, detail: c.later.detail, onChoose: noop },
        ],
      },
    },
  ],
});
