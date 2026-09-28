import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { LoopTrack } from "./LoopTrack";

const rec = (state: keyof typeof HOME_STATES, id: string) => HOME_STATES[state].records.find((r) => r.id === id)!;

export const loopTrackStates = defineComponentStates({
  name: "LoopTrack",
  group: "feedback",
  status: "draft",
  flows: ["homepage"],
  description:
    "An artifact’s way through the Loop, like a parcel tracker: Drafted, then used in the kind’s own word (Used, Sent, Published), then what came of it. A tick for each done step; the step it is waiting on is ringed.",
  component: LoopTrack,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Drawn from the local Loop: there is nothing to wait for.",
    error: "Drawn from the local Loop: nothing can fail.",
    empty: "Every artifact has all three steps from the moment it exists.",
    filled: NOT_AN_INPUT,
    "long text": "Step labels are fixed words and dates are short.",
  },
  variants: [
    { label: "Drafted, not used yet — default", props: { record: rec("first-return", "story") } },
    { label: "Ready, not used yet", props: { record: rec("drafted-not-used", "check-in-brief") } },
    { label: "Sent, waiting to hear", description: "A pitch uses its own word for used.", props: { record: rec("follow-up-due", "pitch") } },
    {
      label: "“Nothing yet”, still open",
      description: "Nothing yet leaves the last step open rather than marking it.",
      props: { record: rec("drafted-not-used", "pitch") },
    },
    { label: "What came of it, logged", props: { record: rec("just-answered", "story") } },
  ],
});
