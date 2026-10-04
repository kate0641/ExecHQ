import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { stageWindows } from "@/lib/roadmap-dates";
import { CALENDAR_SEED, roadmapFor } from "@/mock/plan";
import { PlanCalendar } from "./PlanCalendar";

const noop = () => {};
const windows = (current: number, today: string, finishedOn?: Record<number, string>) =>
  stageWindows({ stages: roadmapFor("leadership-scope"), startedOn: "2026-10-05", current, today, finishedOn });
const base = {
  windows: windows(0, "2026-10-20"),
  items: CALENDAR_SEED,
  today: "2026-10-20",
  selected: "2026-10-29",
  onSelect: noop,
  onAdd: noop,
  onEdit: noop,
  onDelete: noop,
};

export const planCalendarStates = defineComponentStates({
  name: "PlanCalendar",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "A month calendar with the roadmap's stages tinted across the days, her own items on the days they fall on, and a panel for the day she picked where she can add, edit or delete. It covers the months the plan and her items cover, and no more. The grid is one tab stop: arrow keys move between days, Home and End go to the ends of the week, Page Up and Page Down change month. A tint is never the only cue to a stage. She adds everything by hand.",
  component: PlanCalendar,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Read from her local calendar: there is nothing to wait for.",
    error: "Read from her local calendar: nothing can fail.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "October, an item on the picked day — default", props: { ...base, headingId: "pc-default" } },
    { label: "A day with nothing on it — empty", props: { ...base, selected: "2026-10-21", headingId: "pc-empty" } },
    {
      label: "A day outside every window",
      props: { ...base, selected: "2027-02-10", items: [...CALENDAR_SEED, { id: "x", title: "Annual offsite", date: "2027-02-10" }], headingId: "pc-outside" },
    },
    {
      label: "Several items on one day",
      props: {
        ...base,
        selected: "2026-10-29",
        items: [
          ...CALENDAR_SEED,
          { id: "a", title: "Dinner with the CMO", date: "2026-10-29" },
          { id: "b", title: "Prepare slides for the summit", date: "2026-10-29" },
        ],
        headingId: "pc-many",
      },
    },
    {
      label: "Plan steps on the calendar — one pinned, one suggested",
      description: "A step is only suggested a day until she accepts it or moves it. Marked in words and by a hollow dot, never colour alone.",
      props: {
        ...base,
        selected: "2026-10-22",
        steps: [
          { id: "brief-manager", title: "Brief your manager before Thursday’s check-in", date: "2026-10-22", suggested: false },
          { id: "ask-manager-scope", title: "Ask your manager what broader scope means to them", date: "2026-10-23", suggested: true },
        ],
        onOpenStep: noop,
        headingId: "pc-steps",
      },
    },
    {
      label: "Deleting — asks first",
      props: { ...base, demoDelete: true, headingId: "pc-delete" },
    },
    {
      label: "Finished early: later stages start earlier",
      props: { ...base, windows: windows(1, "2026-10-20", { 0: "2026-10-20" }), selected: "2026-10-21", headingId: "pc-early" },
    },
    {
      label: "A long item title wraps",
      props: {
        ...base,
        items: [{ id: "long", title: "Leadership forum talk proposal due to the programme chair and the review committee", date: "2026-10-29" }],
        headingId: "pc-long",
      },
    },
  ],
});
