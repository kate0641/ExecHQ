import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { MindStart } from "./MindStart";

const onAsk = () => {};

export const mindStartStates = defineComponentStates({
  name: "MindStart",
  group: "form controls",
  status: "draft",
  flows: ["toolbox"],
  description:
    "Concept 1's \"What's on your mind?\", under the tools: the advisor's own box, one field with the send arrow inside, the hint as its placeholder. What she says opens the advisor as her first message; he names the tool with a Start button, or asks one question when he can't tell. Nothing is matched on the page.",
  component: MindStart,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Nothing to wait for on the page: the answer comes in the advisor.",
    error: "Sending with nothing typed does nothing, as in the advisor's box; there is no wrong answer to show.",
    disabled: "Sending rests until something is typed (the empty variant); the field is never switched off.",
  },
  variants: [
    { label: "Nothing said yet — default, empty", props: { onAsk } },
    { label: "Typed, ready to send — filled", props: { onAsk, initial: "Board meeting next week about the Q1 plan" } },
    { label: "A long thought wraps", props: { onAsk, initial: "My manager wants to talk on Thursday about whether I should take on the planning workstream as well as campaigns" } },
  ],
});
