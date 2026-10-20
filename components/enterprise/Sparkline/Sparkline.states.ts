import { defineComponentStates } from "@/components/types";
import { NOT_INTERACTIVE } from "@/components/not-applicable";
import { COHORTS } from "@/mock/enterprise";
import { Sparkline } from "./Sparkline";

const demo = COHORTS.demo.weeklyActive;

export const sparklineStates = defineComponentStates({
  name: "Sparkline",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "A small line of weekly values beside words that already say which way they moved: the shape at a glance, no axis and no numbers, the latest week marked. A week below the minimum breaks the line; fewer than two weeks draws nothing.",
  component: Sparkline,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Figures are refreshed weekly, not fetched live.",
    error: "A week that cannot be shown is a gap.",
    filled: "Not an input.",
    "long text": "It holds no text of its own.",
  },
  variants: [
    { label: "The December demo — default", props: { values: demo, label: "Active each week, from 212 to 496" } },
    { label: "Two weeks, the pilot", props: { values: [21, 26], label: "Active each week, from 21 to 26" } },
    { label: "A gap where a week was hidden", props: { values: [212, 389, undefined, 560, 588, 571], label: "Active each week, with one week hidden" } },
    { label: "One week — empty, nothing drawn", props: { values: [4], label: "Active each week" } },
  ],
});
