import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { StepHeader } from "./StepHeader";

export const stepHeaderStates = defineComponentStates({
  name: "StepHeader",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The top of an onboarding step. The heading carries tabIndex -1 so a concept can move focus to it on a step change, which is how focus is never left on a control that has just been replaced.",
  component: StepHeader,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always has a title.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: { title: "What would you like to move toward?" },
    },
    {
      label: "With eyebrow",
      props: {
        eyebrow: "Your direction",
        title: "What would you like to move toward?",
      },
    },
    {
      label: "With supporting sentence",
      props: {
        eyebrow: "Your direction",
        title: "What would you like to move toward?",
        description:
          "A role, a scope, an aspiration or a challenge. A precise title is optional.",
      },
    },
    {
      label: "Secondary level",
      description: "Where steps accumulate on one page and h1 is already spent.",
      props: {
        title: "Roughly when?",
        headingLevel: 2 as const,
        description:
          "A rough answer is enough. It changes what we put first, not whether we start.",
      },
    },
  ],
});
