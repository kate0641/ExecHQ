import { defineComponentStates } from "@/components/types";
import { COHORTS, DEFAULT_PRESET, newCohort, presetRange } from "@/mock/enterprise";
import { DateRangePicker } from "./DateRangePicker";

const pilot = COHORTS.pilot;
const demo = COHORTS.demo;
const thisWeek = presetRange(DEFAULT_PRESET, pilot);
const fresh = newCohort({ name: "Leadership Program 2027", expectedSize: 40, startsOn: "2027-01-11" }, "EXEC-2048");

export const dateRangePickerStates = defineComponentStates({
  name: "DateRangePicker",
  group: "form controls",
  status: "draft",
  flows: ["enterprise"],
  description:
    "The sponsor dashboard's dates (Kate, 2026-10-21; ranges 2026-10-22): a field with the dates, arrows to the dates before and after, and a panel with ranges on the left and two months of calendar, weeks from Monday. Any dates from the program's first day to today, as short as one day; the minimum of 10 active still hides figures, and the panel says so. A range applies at once; on the calendar the first press is the first day and the second the last. Keyboard: arrows a day or a week, Home and End the week's ends, Page Up and Page Down a month, Escape closes. Try it: these examples keep their own dates.",
  component: DateRangePicker,
  notApplicable: {
    loading: "The dates and their figures are in the page already: choosing waits for nothing.",
    error: "Only days that have figures can be chosen, so no choice is invalid.",
    "long text": "Dates have a fixed shape: the longest is a range name and two dates, “Last 90 days · 12 Sep – 10 Dec 2026”.",
  },
  variants: [
    { label: "This week — default", props: { cohort: pilot, value: thisWeek } },
    { label: "Open: ranges and two months", description: "The demo cohort, last month chosen.", props: { cohort: demo, value: presetRange("last-month", demo), defaultOpen: true, inline: true } },
    {
      label: "Choosing the last day",
      description: "The first day is set: move the pointer or the arrow keys to see the range, then press the last day.",
      props: { cohort: demo, value: presetRange("last-30", demo), defaultOpen: true, inline: true, pickingFrom: "2026-11-09" },
    },
    { label: "Dates chosen on the calendar", props: { cohort: demo, value: { from: "2026-11-09", to: "2026-11-20" } } },
    { label: "One day chosen on the calendar", props: { cohort: demo, value: { from: "2026-12-09", to: "2026-12-09" } } },
    { label: "Since launch: earlier unavailable", props: { cohort: demo, value: presetRange("since-launch", demo) } },
    { label: "Hover", props: { cohort: pilot, value: thisWeek, demo: "hover" } },
    { label: "Focus", props: { cohort: pilot, value: thisWeek, demo: "focus" } },
    { label: "Pressed", props: { cohort: pilot, value: thisWeek, demo: "active" } },
    {
      label: "Before the first figures — empty",
      description: "A cohort set up on this visit: nothing to choose until its first update.",
      props: { cohort: fresh, value: presetRange(DEFAULT_PRESET, fresh), defaultOpen: true, inline: true },
    },
  ],
});
