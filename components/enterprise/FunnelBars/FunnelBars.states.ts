import { defineComponentStates } from "@/components/types";
import { NOT_INTERACTIVE } from "@/components/not-applicable";
import { FunnelBars } from "./FunnelBars";

const base = { label: "Joining", hiddenLabel: "Hidden" };

export const funnelBarsStates = defineComponentStates({
  name: "FunnelBars",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "How many made it through each step, as bars on one baseline that get shorter, each with its number beside it. The first step, drawn as an outline, sets the scale. A hidden step keeps its place and says so.",
  component: FunnelBars,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Figures are refreshed weekly, not fetched live.",
    error: "A step that cannot be shown is hidden with its reason.",
    filled: "Not an input.",
  },
  variants: [
    {
      label: "The pilot — default",
      props: { ...base, steps: [{ label: "Expected", value: 50, outline: true }, { label: "Joined", value: 38 }, { label: "Set up", value: 33 }, { label: "Chose a plan", value: 26 }] },
    },
    {
      label: "Below the minimum — later steps hidden",
      props: { ...base, steps: [{ label: "Expected", value: 12, outline: true }, { label: "Joined", value: 6 }, { label: "Set up" }, { label: "Chose a plan" }] },
    },
    {
      label: "No one yet — empty",
      props: { ...base, steps: [{ label: "Expected", value: 40, outline: true }, { label: "Joined", value: 0 }, { label: "Set up", value: 0 }, { label: "Chose a plan", value: 0 }] },
    },
    {
      label: "A long label wraps",
      props: { ...base, steps: [{ label: "Expected", value: 1000, outline: true }, { label: "Joined with the cohort’s code", value: 912 }, { label: "Set up", value: 846 }, { label: "Chose a plan", value: 701 }] },
    },
  ],
});
