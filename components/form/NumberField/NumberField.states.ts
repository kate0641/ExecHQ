import { defineComponentStates } from "@/components/types";
import { NumberField } from "./NumberField";

const noop = () => {};
const base = { label: "Podcast appearances", hint: "Shows you have been a guest on", value: "", onChange: noop };

export const numberFieldStates = defineComponentStates({
  name: "NumberField",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "A number she types, with what it counts beside it: label and hint on the left, a short standard text field on the right. Used for the Signal Picture's starting numbers on Home.",
  component: NumberField,
  notApplicable: {
    loading: "Written from local data: there is nothing to wait for.",
    error: "Any whole number is a fine answer, and anything else is simply not kept.",
    active: "A text field has no pressed state: tapping it simply puts the cursor in.",
  },
  variants: [
    { label: "Empty — default", props: base },
    { label: "Filled in", props: { ...base, value: "3" } },
    { label: "Wide — followers in the thousands", props: { ...base, label: "LinkedIn followers", hint: "Look at your profile and type the number", value: "1,240", size: "wide" as const } },
    { label: "Long text — a long label and hint wrap", props: { ...base, label: "Somewhere you publish", hint: "A newsletter, blog or articles, and how many pieces" } },
    { label: "Disabled", props: { ...base, value: "2", disabled: true } },
    { label: "Hover", props: { ...base, demo: "hover" as const } },
    { label: "Focus", props: { ...base, demo: "focus" as const } },
  ],
});
