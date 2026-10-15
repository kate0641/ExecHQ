import { defineComponentStates } from "@/components/types";
import { COHORTS } from "@/mock/enterprise";
import { WindowSelector } from "./WindowSelector";

const onChange = () => {};
const asOf = COHORTS.pilot.asOf;
const toggle = "Its options are a ToggleGroup, which shows its own states.";

export const windowSelectorStates = defineComponentStates({
  name: "WindowSelector",
  group: "form controls",
  status: "draft",
  flows: ["enterprise"],
  description:
    "The sponsor dashboard's window, 30 days, 90 days or since launch, with when the figures were last refreshed. Nothing shorter than 30 days, and a weekly refresh, so no window can isolate one person.",
  component: WindowSelector,
  notApplicable: {
    hover: toggle,
    focus: toggle,
    active: toggle,
    disabled: "Every window is always open: a young program shows its figures as filling in instead.",
    loading: "The figures are already refreshed for the week: switching windows waits for nothing.",
    error: "A choice of three that are always valid: nothing can fail.",
    empty: "One window is always chosen.",
    "long text": "Fixed labels, three short words.",
  },
  variants: [
    { label: "30 days chosen — default", props: { value: "30d", onChange, asOf } },
    { label: "Since launch selected", props: { value: "launch", onChange, asOf } },
  ],
});
