import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { WizardStep } from "./WizardStep";

export const wizardStepStates = defineComponentStates({
  name: "WizardStep",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One page of Concept 1's paged wizard: progress, one question, the actions. A component rather than markup inside the concept so every step is laid out by the same rules — a screen that wanted to differ would have to argue for it here instead of introducing it quietly in one place.",
  component: WizardStep,
  notApplicable: {
    ...CONTENT_INSIDE,
    empty: "Always has a title and its content.",
  },
  variants: [
    {
      label: "Default",
      props: {
        step: 3,
        total: 10,
        title: "What would you like to move toward?",
        description:
          "A role, a scope, an aspiration or a challenge. A precise title is optional.",
        primaryLabel: "Continue",
      },
    },
    {
      label: "With skip path",
      props: {
        step: 5,
        total: 10,
        eyebrow: "Optional",
        title: "Roughly when?",
        primaryLabel: "Continue",
        skipLabel: "Skip and show my first step",
        backLabel: "Back",
      },
    },
    {
      label: "Nested question progress",
      description: "Counting questions inside one step rather than steps.",
      props: {
        step: 2,
        total: 3,
        progressLabel: "Question",
        optionalFrom: 1,
        title: "Who most needs to see this differently?",
        primaryLabel: "Continue",
        skipLabel: "Skip and show my first step",
      },
    },
    {
      label: "Inside the app",
      description: "From the artifact onward, with the Sprint 2 nav placeholder.",
      props: {
        step: 9,
        total: 10,
        showNav: true,
        title: "Your leadership narrative",
        primaryLabel: "Save to my plan",
        backLabel: "Back",
      },
    },
    {
      label: "No actions",
      description: "A step whose content carries its own controls.",
      props: { step: 10, total: 10, title: "You are set up." },
    },
  ],
});
