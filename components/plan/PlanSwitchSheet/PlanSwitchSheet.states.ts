import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { PlanSwitchSheet } from "./PlanSwitchSheet";

const noop = () => {};
const base = { open: true, inline: true, onClose: noop, onSwitch: noop, currentPlanId: "leadership-scope" };

export const planSwitchSheetStates = defineComponentStates({
  name: "PlanSwitchSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "Where she changes plan: the other plans, then what carries over before she confirms. Everything she made, every Loop record and everything on her Signal Picture stays; her next steps are chosen again; the plan she leaves stays in her history. Quiet by design, never the way in.",
  component: PlanSwitchSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    empty: "Always the five plans.",
    "long text": "Plan names and descriptions are short written copy that wraps inside each option.",
  },
  variants: [
    { label: "The other plans — default, current plan disabled", props: base },
    { label: "A new plan chosen — what carries over", props: { ...base, demoPicked: "executive-presence" } },
  ],
});
