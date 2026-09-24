import { defineComponentStates } from "@/components/types";
import { DeviceKeyboard } from "./DeviceKeyboard";

export const deviceKeyboardStates = defineComponentStates({
  name: "DeviceKeyboard",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A phone keyboard, drawn in CSS: the room a real one takes, so screens are designed against it. A picture, hidden from assistive technology.",
  component: DeviceKeyboard,
  variants: [
    { label: "Default", props: {} },
    { label: "Next", props: { returnLabel: "Next" } },
  ],
});
