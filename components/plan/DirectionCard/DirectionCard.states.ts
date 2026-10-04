import { defineComponentStates } from "@/components/types";
import { DirectionCard } from "./DirectionCard";

const noop = () => {};
const direction = "I want to move from running campaigns to leading a broader marketing organization.";

export const directionCardStates = defineComponentStates({
  name: "DirectionCard",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Where she says she is headed, in her own words, at the top of the Plan, and editable at any time. Changing it never changes her plan on its own: saving says so, and points to Change plan if what she wrote now points somewhere new.",
  component: DirectionCard,
  notApplicable: {
    hover: "Its one control is a Button, which shows its own states.",
    focus: "Its controls are a Button and a text field, which show their own states.",
    active: "Its one control is a Button, which shows its own states.",
    disabled: "Every control can always be used.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    empty: "She always has a direction from onboarding.",
  },
  variants: [
    { label: "Her direction, from onboarding — default", props: { direction, onSave: noop, headingId: "dc-default" } },
    {
      label: "Edited by her",
      props: { direction: "I want to lead a CMO-level marketing team.", edited: true, onSave: noop, headingId: "dc-edited" },
    },
    { label: "Editing — text chosen", props: { direction, onSave: noop, demoEditing: true, headingId: "dc-editing" } },
    { label: "Saved, and the plan stays as it is", props: { direction, onSave: noop, demoSaved: true, headingId: "dc-saved" } },
    { label: "Error — nothing written", props: { direction: "", onSave: noop, demoEditing: true, demoError: true, headingId: "dc-error" } },
    {
      label: "A long direction wraps",
      props: {
        direction:
          "I want to move from running campaigns to leading a broader marketing organization, with a seat in the planning conversations about budget and headcount, within the next two planning cycles.",
        onSave: noop,
        headingId: "dc-long",
      },
    },
  ],
});
