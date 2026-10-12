import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ReadCounter } from "./ReadCounter";

const noop = () => {};

export const readCounterStates = defineComponentStates({
  name: "ReadCounter",
  group: "navigation",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Concept 2's place in the day's set: 1 of 3 at the top, with a quiet Back and See all three beside it, so Next is never the only way through.",
  component: ReadCounter,
  notApplicable: {
    hover: "Its two controls are plain text buttons with the shared link hover.",
    active: "Its two controls are plain text buttons; pressing one moves the page at once.",
    disabled: "A control that can't be used is left out, not shown unavailable: no Back on the first read.",
    loading: "Moving between reads is instant: there is nothing to wait for.",
    error: "Nothing here can fail.",
    empty: "There are always three reads.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed, short labels.",
  },
  variants: [
    { label: "First read, no Back — default", props: { at: 1, of: 3, onToEnd: noop } },
    { label: "Second read", props: { at: 2, of: 3, onBack: noop, onToEnd: noop } },
    { label: "End of the set", props: { at: 3, of: 3, onBack: noop } },
    { label: "Back — focus", props: { at: 2, of: 3, onBack: noop, onToEnd: noop, demo: "focus" } },
  ],
});
