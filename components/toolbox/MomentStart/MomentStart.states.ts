import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { MomentStart } from "./MomentStart";

const hrefFor = (kind: string) => `/toolbox-flow/concept-3?tool=${kind}`;

export const momentStartStates = defineComponentStates({
  name: "MomentStart",
  group: "form controls",
  status: "draft",
  flows: ["toolbox"],
  description:
    "Concept 3's start: \"What's coming up?\", said the way she'd tell a colleague (the phone keyboard's dictation works). ExecHQ names the tool it picked in one line before anything starts; when its rules can't place the moment, it asks which of the four fits. The tools sit under it as shortcuts.",
  component: MomentStart,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "The pilot's matching is rules-based and instant: there is nothing to wait for.",
  },
  variants: [
    { label: "Nothing said yet — default, empty", props: { hrefFor } },
    { label: "A board meeting — answered, a Situation Brief", props: { hrefFor, initial: "Board meeting next week about the Q1 plan" } },
    { label: "A podcast — Pitch Builder", props: { hrefFor, initial: "A podcast the CMO listens to is looking for guests" } },
    { label: "Can't tell — asks which fits", props: { hrefFor, initial: "Something with my team" } },
    { label: "Pressed with nothing said — error", props: { hrefFor, startError: true } },
    { label: "A long moment wraps", props: { hrefFor, initial: "My manager wants to talk on Thursday about whether I should take on the planning workstream as well as campaigns" } },
  ],
});
