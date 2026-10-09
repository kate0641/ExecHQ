import { defineComponentStates } from "@/components/types";
import { NumberTile } from "./NumberTile";

const noop = () => {};
const base = { label: "Podcast appearances", hint: "Shows you have been a guest on", value: "", onChange: noop };

export const numberTileStates = defineComponentStates({
  name: "NumberTile",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "A number she types into a lime tile, with what it counts beside it. The tile is the field; a dark green underline marks it as somewhere to type. Used for the Signal Picture's starting numbers on Home.",
  component: NumberTile,
  notApplicable: {
    loading: "Written from local data: there is nothing to wait for.",
    error: "Any whole number is a fine answer, and anything else is simply not kept.",
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
