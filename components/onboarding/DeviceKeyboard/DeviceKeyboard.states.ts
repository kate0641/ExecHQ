import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { DeviceKeyboard } from "./DeviceKeyboard";

export const deviceKeyboardStates = defineComponentStates({
  name: "DeviceKeyboard",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A phone keyboard, drawn in CSS: the room a real one takes, so screens are designed against it. A picture, hidden from assistive technology.",
  component: DeviceKeyboard,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "A drawing of the phone's keyboard, hidden from assistive tech; it takes no content.",
    "long text": "Its only text is the return key's short label.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Next", props: { returnLabel: "Next" } },
  ],
});
