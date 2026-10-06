import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { CapacityControl } from "./CapacityControl";

const noop = () => {};
const base = { level: "steady", hold: false, live: 4, onLevel: noop, onHold: noop } as const;

export const capacityControlStates = defineComponentStates({
  name: "CapacityControl",
  group: "form controls",
  status: "draft",
  flows: ["plan"],
  description:
    "How much she can take on right now: light, steady or full, which is three, four or five live steps, never more than five. “Hold my workload” means the plan offers nothing new until she lifts it. It is her own setting, kept between visits, and neither choice is ever counted against her. Lowering it sets steps aside, not away.",
  component: CapacityControl,
  notApplicable: {
    hover: "Its controls are a ToggleGroup and a Switch, which show their own states.",
    focus: "Its controls are a ToggleGroup and a Switch, which show their own states.",
    active: "Its controls are a ToggleGroup and a Switch, which show their own states.",
    disabled: "Both of its choices are always available.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Every choice is valid, so there is nothing to get wrong.",
    filled: NOT_AN_INPUT,
    "long text": "Its words are fixed and short.",
  },
  variants: [
    { label: "Steady — default", props: { ...base } },
    { label: "Light — three live steps", props: { ...base, level: "light", live: 3 } },
    { label: "Full — five live steps", props: { ...base, level: "full", live: 5 } },
    { label: "Holding her workload", description: "Nothing new is offered until she lifts it.", props: { ...base, hold: true } },
    { label: "Empty — nothing live", props: { ...base, live: 0 } },
  ],
});
