import { defineComponentStates } from "@/components/types";
import { Switch } from "./Switch";

const label = "Loop follow-ups by email";

export const switchStates = defineComponentStates({
  name: "Switch",
  group: "form controls",
  status: "draft",
  flows: ["profile"],
  description:
    "An on/off setting that takes effect at once. Announced as a switch that is on or off; the thumb moves and the track fills, so state is not colour alone.",
  component: Switch,
  notApplicable: {
    loading: "Takes effect at once on the local account: there is nothing to wait for.",
    error: "Turning a setting on or off cannot fail in the prototype.",
    empty: "Always either on or off.",
    "long text": "It has no text of its own; the row beside it carries the label.",
  },
  variants: [
    { label: "Off — default", props: { checked: false, label } },
    { label: "On — selected", props: { checked: true, label } },
    { label: "Off — hover", props: { checked: false, label, className: "is-hover" } },
    { label: "On — focus", props: { checked: true, label, className: "is-focus" } },
    { label: "On — active", props: { checked: true, label, className: "is-active" } },
    { label: "Off — disabled", props: { checked: false, label, disabled: true } },
    { label: "On — disabled", props: { checked: true, label, disabled: true } },
  ],
});
