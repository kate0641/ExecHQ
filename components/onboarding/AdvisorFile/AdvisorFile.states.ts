import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { AdvisorFile } from "./AdvisorFile";

const noop = () => {};
const items = [
  { label: "Signals", value: "LinkedIn connected" },
  { label: "Where you’re going", value: "C-suite in 3 years" },
  { label: "Starting point", value: "Step up" },
];

export const advisorFileStates = defineComponentStates({
  name: "AdvisorFile",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "What ExecHQ knows so far: one line with a count and what was just added, opening to the whole list. Concept 3 carries it on every page.",
  component: AdvisorFile,
  notApplicable: {
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Empty", props: { label: GUIDE_C3.file.label, items: [], open: true, onToggle: noop } },
    { label: "Closed, just added", props: { label: GUIDE_C3.file.label, items, newest: "Starting point", open: false, onToggle: noop } },
    { label: "Open", props: { label: GUIDE_C3.file.label, items, newest: "Starting point", open: true, onToggle: noop } },
    { label: "Summary", description: "Always open, no toggle: the end of onboarding.", props: { label: GUIDE_C3.file.label, items, open: true, fixed: true } },
  ],
});
