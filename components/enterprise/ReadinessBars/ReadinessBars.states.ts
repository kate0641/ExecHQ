import { defineComponentStates } from "@/components/types";
import { COHORTS } from "@/mock/enterprise";
import { ReadinessBars } from "./ReadinessBars";

const pilot = COHORTS.pilot.readiness!;
const demo = COHORTS.demo.readiness!;

export const readinessBarsStates = defineComponentStates({
  name: "ReadinessBars",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "The readiness pulse's spread on the sponsor dashboard (Concept 1b, Kate, 2026-10-23): the same people's answers to “How ready do you feel for your next step?”, at the start and now, as two bars split into the five answers, lightest to darkest. Each bar says its counts to a screen reader. The card around it hides it until 10 or more have answered twice.",
  component: ReadinessBars,
  notApplicable: {
    hover: "Not interactive.",
    focus: "Not interactive: nothing takes focus.",
    active: "Not interactive.",
    disabled: "Not a control.",
    loading: "Figures are in the page already, updated daily.",
    error: "Too few answers hide the whole card, which says when it will show.",
    empty: "The card hides it until 10 or more have answered twice, so it never draws empty.",
    filled: "Not an input.",
    "long text": "Its words are fixed: two row labels and a five-step legend.",
  },
  variants: [
    { label: "The pilot — default, 24 answered", props: { start: pilot.start, now: pilot.now } },
    { label: "The December demo, 640 answered", props: { start: demo.start, now: demo.now } },
    { label: "No change", props: { start: [2, 5, 9, 6, 2], now: [2, 5, 9, 6, 2] } },
  ],
});
