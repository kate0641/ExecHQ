import { defineComponentStates } from "@/components/types";
import {
  DIRECTION,
  DIRECTION_C1,
  DIRECTION_PROMPTS_C1,
  PROMPTED_DIRECTIONS,
} from "@/mock/onboarding";
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
      label: "With voice — Concept 1",
      description:
        "A mic in the field's corner, and short goal prompts. Choosing a prompt moves focus into the field.",
      props: {
        label: DIRECTION_C1.prompt,
        labelHidden: true,
        prompted: DIRECTION_PROMPTS_C1,
        promptedLabel: DIRECTION_C1.promptedLabel,
        onChange: () => {},
        value: "",
        voice: { listening: false, onToggle: () => {} },
        promptLayout: "stacked",
      },
    },
    {
      label: "With voice — listening",
      props: {
        label: DIRECTION_C1.prompt,
        labelHidden: true,
        prompted: DIRECTION_PROMPTS_C1,
        promptedLabel: DIRECTION_C1.promptedLabel,
        onChange: () => {},
        value: "I want to move from running campaigns",
        voice: { listening: true, onToggle: () => {} },
      },
    },
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
