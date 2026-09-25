import { defineComponentStates } from "@/components/types";
import { MicButton } from "./MicButton";

const noop = () => {};

export const micButtonStates = defineComponentStates({
  name: "MicButton",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Speak an answer instead of typing it. A pressed-state toggle; its accessible name says what pressing will do. Sits inside a text field's bottom edge through Input's `adornment`. In the prototype, listening is simulated: a sample answer is typed in word by word.",
  component: MicButton,
  notApplicable: {
    empty: "An icon button: it takes no content.",
    "long text": "Shows no text; its name is for assistive tech only.",
    filled: "A toggle, not an input: its on state is Listening.",
  },
  variants: [
    { label: "Default", props: { listening: false, onToggle: noop } },
    {
      label: "Listening",
      description: "Pressed, and pulsing unless reduced motion is on.",
      props: { listening: true, onToggle: noop },
    },
    { label: "Disabled", props: { listening: false, onToggle: noop, disabled: true } },
  ],
});
