import { defineComponentStates } from "@/components/types";
import { INTERPRETATION_C1 } from "@/mock/onboarding";
import { AdvisorNote } from "./AdvisorNote";

const noop = () => {};
const body =
  "You want to reach the C-suite within three years. The title matters most to you: being named for the role, not just doing the work. Right now there’s no clear path up, so part of the job is finding one, or making one.";

const base = {
  from: INTERPRETATION_C1.from,
  role: INTERPRETATION_C1.role,
  body,
  closing: INTERPRETATION_C1.bridge,
  onEdit: noop,
};

export const advisorNoteStates = defineComponentStates({
  name: "AdvisorNote",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The read-back of what the user said, as a note signed by ExecHQ. Concept 1's interpretation screen. “Change it” swaps the body for a field in place.",
  component: AdvisorNote,
  variants: [
    { label: "Default", props: base },
    {
      label: "Assumption made",
      description: "Every question was skipped, so the note says it is working from the goal alone.",
      props: {
        ...base,
        body: "You want to be CMO within three years.",
        aside: INTERPRETATION_C1.assumed,
      },
    },
    {
      label: "Editing",
      props: { ...base, editing: true, onChange: noop, onSave: noop, onCancel: noop },
    },
  ],
});
