import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { RevisionControls } from "./RevisionControls";

const noop = () => {};

export const revisionControlsStates = defineComponentStates({
  name: "RevisionControls",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "How she changes a draft: one tap each on voice, specificity, length, audience and emphasis, and a line to say anything else. Every revision is saved as a new version.",
  component: RevisionControls,
  notApplicable: {
    ...CONTROLS_INSIDE,
    "long text": "She types one line; the field wraps like any other.",
  },
  variants: [
    { label: "Nothing chosen — default, empty", props: { onRevise: noop } },
    { label: "Shorter and more direct, chosen — filled", props: { onRevise: noop, initial: { length: "Shorter", voice: "More direct" } } },
    { label: "Said in her words", props: { onRevise: noop, initialFollowUp: "Lead with the planning workstream" } },
    { label: "Revise pressed with nothing chosen — error", props: { onRevise: noop, showNothing: true } },
    { label: "Revising — loading", props: { onRevise: noop, initial: { length: "Shorter" }, revising: true } },
  ],
});
