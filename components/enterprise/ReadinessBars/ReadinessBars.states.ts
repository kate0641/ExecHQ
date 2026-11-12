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
    "The readiness pulse's spread on the sponsor dashboard (Concept 1b, Kate, 2026-10-23): the same people's answers to “How ready do you feel to …?” (Not yet to Ready), as a group per answer, Not yet to Ready, each named in a pill like Home’s “How did it go?” answers with its outcome dot, a stone bar for the start beside one for now in the answer’s colour, on one baseline and scale. Each group says its counts to a screen reader. The card around it hides it until 10 or more have answered twice.",
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
    "long text": "Its words are fixed: the three answers and At the start / Now.",
  },
  variants: [
    { label: "The pilot — default, 24 answered", props: { start: pilot.start, now: pilot.now } },
    { label: "The December demo, 640 answered", props: { start: demo.start, now: demo.now } },
    { label: "No change", props: { start: [9, 11, 4], now: [9, 11, 4] } },
  ],
});
