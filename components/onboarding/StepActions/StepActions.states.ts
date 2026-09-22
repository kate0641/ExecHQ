import { defineComponentStates } from "@/components/types";
import { StepActions } from "./StepActions";

export const stepActionsStates = defineComponentStates({
  name: "StepActions",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Primary action and skip path as peers — same size, same row, equal width. Skip is secondary rather than ghost on purpose: a ghost button would visually demote the exact path the brief says must read as legitimate. Skip is second in the DOM so the primary is reached first by keyboard.",
  component: StepActions,
  variants: [
    {
      label: "Primary only",
      description: "Steps with no skip: email, privacy, the direction itself.",
      props: { primaryLabel: "Continue" },
    },
    {
      label: "With skip path",
      props: {
        primaryLabel: "Answer this",
        skipLabel: "Skip and show my first step",
      },
    },
    {
      label: "Primary disabled",
      description: "Nothing entered yet. Skip stays fully available.",
      props: {
        primaryLabel: "Continue",
        primaryDisabled: true,
        skipLabel: "Skip and show my first step",
      },
    },
    {
      label: "With back",
      description: "Back is tertiary. It is never where the skip path lives.",
      props: {
        primaryLabel: "Answer this",
        skipLabel: "Skip and show my first step",
        backLabel: "Back",
      },
    },
  ],
});
