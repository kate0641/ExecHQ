import { defineComponentStates } from "@/components/types";
import { Checkbox } from "./Checkbox";

const label = "Keep me signed in on this device";

export const checkboxStates = defineComponentStates({
  name: "Checkbox",
  group: "form controls",
  status: "draft",
  flows: ["login"],
  description: "A single yes/no choice with its label beside it. A native checkbox, drawn larger.",
  component: Checkbox,
  notApplicable: {
    loading: "Takes effect at once: there is nothing to wait for.",
    error: "A single optional choice cannot be wrong.",
    empty: "Unticked is its empty state, shown as the default.",
  },
  variants: [
    { label: "Unticked — default", props: { label } },
    { label: "Ticked — selected", props: { label, defaultChecked: true } },
    { label: "Hover", props: { label, boxClassName: "is-hover" } },
    { label: "Focus", props: { label, defaultChecked: true, boxClassName: "is-focus" } },
    { label: "Active", props: { label, boxClassName: "is-active" } },
    { label: "Disabled", props: { label, disabled: true } },
    { label: "A long label wraps", props: { label: "Keep me signed in on this device, unless it is shared with anyone else" } },
  ],
});
