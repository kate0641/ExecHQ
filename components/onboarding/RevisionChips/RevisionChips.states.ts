import { defineComponentStates } from "@/components/types";
import { POSITIONING_C1, visibleRevisions } from "@/mock/onboarding";
import { RevisionChips } from "./RevisionChips";

const noop = () => {};
const label = POSITIONING_C1.revise.label;

export const revisionChipsStates = defineComponentStates({
  name: "RevisionChips",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Revision requests as chips that build on each other. Applying one fades it with a check and reveals any follow-ups; options that contradict it hide. Pressing a faded chip undoes it and what it revealed.",
  component: RevisionChips,
  variants: [
    {
      label: "Nothing applied",
      props: { label, options: visibleRevisions("narrative", []), applied: [], onToggle: noop },
    },
    {
      label: "Shorter and More confident applied",
      description: "Each fades with a check; Even shorter and Bolder still appear; Warmer hides.",
      props: {
        label,
        options: visibleRevisions("narrative", ["shorter", "confident"]),
        applied: ["shorter", "confident"],
        onToggle: noop,
      },
    },
    {
      label: "Bio, first person",
      props: { label, options: visibleRevisions("bio", ["first"]), applied: ["first"], onToggle: noop },
    },
  ],
});
