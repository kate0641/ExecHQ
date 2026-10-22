import { defineComponentStates } from "@/components/types";
import { COHORTS, presetRange, trendFor, type TrendView } from "@/mock/enterprise";
import { WeeklyTrend } from "./WeeklyTrend";

const demo = trendFor(COHORTS.demo);

const thisWeek = presetRange("this-week", COHORTS.demo);
const lastMonth = presetRange("last-month", COHORTS.demo);

/** The demo with its third week below the minimum, to show the gap. */
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
    "People active each week since the program started, Monday to Sunday, as bars (Kate, 2026-10-22). There are no weekly updates, so it shows from the first week; this week, still going, is hatched. It always shows every week and shades the ones the dates chosen touch. A week below 10 is a gap; below the minimum cohort size it is hidden. Hovering picks a week; the figures are also in a table for screen readers.",
  component: WeeklyTrend,
  notApplicable: {
    focus: "Nothing in it takes focus: the weekly figures are in a table for keyboard and screen reader users.",
    active: "Hovering picks a week; there is nothing to press.",
    disabled: "Not a control.",
    loading: "Figures are in the page already, updated daily: there is nothing to wait for.",
    error: "A week that cannot be shown is a gap with its reason, and a cohort below the minimum hides the trend.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "This week shaded — default, the December demo", props: { trend: demo, highlight: thisWeek } },
    { label: "Last month shaded", props: { trend: demo, highlight: lastMonth } },
    { label: "Every week, with no dates", props: { trend: demo } },
    { label: "A week picked — hover", props: { trend: demo, highlight: thisWeek, demoWeek: 7 } },
    { label: "A gap where a week was hidden", props: { trend: withGap, highlight: thisWeek } },
    { label: "Three weeks in, the pilot", props: { trend: trendFor(COHORTS.pilot), highlight: presetRange("this-week", COHORTS.pilot) } },
    { label: "Hidden — below the minimum, empty", props: { trend: trendFor(COHORTS.small) } },
    { label: "Half a year — a long run", props: { trend: longRun } },
  ],
});
