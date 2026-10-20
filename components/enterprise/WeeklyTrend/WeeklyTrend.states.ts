import { defineComponentStates } from "@/components/types";
import { COHORTS, trendFor, type TrendView } from "@/mock/enterprise";
import { WeeklyTrend } from "./WeeklyTrend";

const demo = trendFor(COHORTS.demo);

/** The demo with its third week below the minimum, to show the break. */
const withGap: TrendView = {
  ...demo,
  weeks: demo.weeks.map((week, i) => (i === 2 ? { weekOf: week.weekOf } : week)),
};

/** Half a year of weeks, to show the line staying legible when long. */
const longRun: TrendView = {
  state: "shown",
  weeks: Array.from({ length: 26 }, (_, i) => ({
    weekOf: new Date(Date.UTC(2026, 8, 14 + i * 7)).toISOString().slice(0, 10),
    active: Math.round(520 + 60 * Math.sin(i / 3) - i * 2),
  })),
};

export const weeklyTrendStates = defineComponentStates({
  name: "WeeklyTrend",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "People active each week since the program started, as one line. A week below 10 breaks the line; under four weekly updates it says when a trend will appear; below the minimum cohort size it is hidden. Hovering picks a week; the figures are also in a table for screen readers.",
  component: WeeklyTrend,
  notApplicable: {
    focus: "Nothing in it takes focus: the weekly figures are in a table for keyboard and screen reader users.",
    active: "Hovering picks a week; there is nothing to press.",
    disabled: "Not a control.",
    loading: "Figures are refreshed weekly, not fetched live: there is nothing to wait for.",
    error: "A week that cannot be shown is a gap with its reason, and a cohort below the minimum hides the trend.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "Shown — default, the December demo", props: { trend: demo } },
    { label: "A week picked — hover", props: { trend: demo, demoWeek: 7 } },
    { label: "A gap where a week was hidden", props: { trend: withGap } },
    { label: "Too early, the pilot at week 2", props: { trend: trendFor(COHORTS.pilot) } },
    { label: "Hidden — below the minimum, empty", props: { trend: trendFor(COHORTS.small) } },
    { label: "Half a year — a long run", props: { trend: longRun } },
  ],
});
