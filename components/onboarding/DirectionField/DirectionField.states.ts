import { defineComponentStates } from "@/components/types";
import { DIRECTION, PROMPTED_DIRECTIONS } from "@/mock/onboarding";
import { DirectionField } from "./DirectionField";

const base = {
  label: DIRECTION.prompt,
  hint: DIRECTION.hint,
  examples: DIRECTION.examples,
  examplesLabel: DIRECTION.examplesLabel,
  prompted: PROMPTED_DIRECTIONS,
  promptedLabel: DIRECTION.promptedLabel,
  onChange: () => {},
};

export const directionFieldStates = defineComponentStates({
  name: "DirectionField",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The career direction field. Must not read as 'fill in your job title': the examples mix title-style and direction-style answers, the open field comes before the prompts so they read as a head start rather than a menu, and 'I do not know yet' is a real selectable answer rather than a way of declining to answer.",
  component: DirectionField,
  variants: [
    { label: "Empty", props: { ...base, value: "" } },
    {
      label: "Free text entered",
      props: {
        ...base,
        value:
          "I want to lead a larger marketing organisation, somewhere the brand actually matters to the business.",
      },
    },
    {
      label: "Prompt selected",
      description: "The field is filled and stays editable.",
      props: {
        ...base,
        value: PROMPTED_DIRECTIONS[0].text,
        selectedPromptId: PROMPTED_DIRECTIONS[0].id,
      },
    },
    {
      label: "The unsure path",
      description:
        "Not being able to name a role is an answer, and it reaches a real plan.",
      props: {
        ...base,
        value: PROMPTED_DIRECTIONS[5].text,
        selectedPromptId: PROMPTED_DIRECTIONS[5].id,
      },
    },
    {
      label: "Error",
      props: {
        ...base,
        value: "",
        error: "Tell us roughly where you want to go. A few words is enough.",
      },
    },
    {
      label: "Without prompts",
      description: "The open field on its own.",
      props: { ...base, prompted: undefined, value: "" },
    },
  ],
});
