import { defineComponentStates } from "@/components/types";
import { COHORTS, figureFor } from "@/mock/enterprise";
import { CohortFigure } from "./CohortFigure";

const noop = () => {};
const pilot = COHORTS.pilot;
const active = figureFor(pilot, "active", "launch");

export const cohortFigureStates = defineComponentStates({
  name: "CohortFigure",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "One cohort-level figure on the sponsor dashboard: the number and what it is out of, and which way it moved since last week when at least 10 people are behind the change. Filling in while the program is younger than the window, with its age stated; hidden while fewer than 10 participants are active, naming the rule. Every figure opens to its definition.",
  component: CohortFigure,
  notApplicable: {
    disabled: "Its one control always works: every figure has a definition, even a hidden one.",
    loading: "Figures are refreshed weekly, not fetched live: there is nothing to wait for.",
    error: "A figure that cannot be shown is hidden with its reason, which is the suppressed state.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "Shown — default", props: { figure: active, onExplain: noop } },
    { label: "Shown, large", props: { figure: figureFor(pilot, "invites", "launch"), size: "lg", onExplain: noop } },
    { label: "With a bar", props: { figure: figureFor(pilot, "follow-through", "launch"), size: "lg", meter: "bar", onExplain: noop } },
    { label: "With a ring", props: { figure: figureFor(pilot, "invites", "launch"), size: "lg", meter: "ring", onExplain: noop } },
    { label: "Bar while filling in", props: { figure: figureFor(pilot, "onboarding", "30d"), meter: "bar", onExplain: noop } },
    { label: "Moving up since last week", props: { figure: active, direction: "up", onExplain: noop } },
    { label: "Moving down since last week", props: { figure: figureFor(COHORTS.demo, "active", "30d"), direction: "down", onExplain: noop } },
    { label: "Large, moving up", props: { figure: figureFor(pilot, "plans", "launch"), size: "lg", direction: "up", onExplain: noop } },
    { label: "Filling in, 30 days at day 14", props: { figure: figureFor(pilot, "active", "30d"), onExplain: noop } },
    {
      label: "Hidden — suppressed, empty",
      description: "Below the minimum cohort size. Every figure but Joined is replaced by this.",
      props: { figure: figureFor(COHORTS.small, "active", "launch"), onExplain: noop },
    },
    { label: "Hidden, large", props: { figure: figureFor(COHORTS.small, "follow-through", "launch"), size: "lg", onExplain: noop } },
    { label: "Thousands, the demo cohort", props: { figure: figureFor(COHORTS.demo, "artifacts", "launch"), onExplain: noop } },
    { label: "A long detail wraps", props: { figure: figureFor(COHORTS.demo, "follow-through", "launch"), onExplain: noop } },
    { label: "Definition open — active", props: { figure: active, onExplain: noop, explaining: true } },
    { label: "What this counts — hover", props: { figure: active, demo: "hover" } },
    { label: "What this counts — focus", props: { figure: active, demo: "focus" } },
    { label: "What this counts — pressed", props: { figure: active, demo: "active" } },
  ],
});
