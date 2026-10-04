import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { stageWindows } from "@/lib/roadmap-dates";
import { roadmapFor } from "@/mock/plan";
import { CalendarItemSheet } from "./CalendarItemSheet";

const noop = () => {};
const windows = stageWindows({ stages: roadmapFor("leadership-scope"), startedOn: "2026-10-05", current: 0, today: "2026-10-20" });
const base = { open: true, inline: true, onClose: noop, onSave: noop, windows };

export const calendarItemSheetStates = defineComponentStates({
  name: "CalendarItemSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "How she adds something to her own calendar, or changes it: what it is, when, and an optional note. It says which stage the day falls in, and a day outside every window is allowed. She adds everything by hand; nothing syncs from another calendar.",
  component: CalendarItemSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    filled: "Shown by the “editing” variant, which opens with her item filled in.",
  },
  variants: [
    { label: "Add — empty form, default", props: base },
    { label: "Add on a day — date chosen", props: { ...base, initial: { date: "2026-11-05" } } },
    {
      label: "Editing — her item filled in",
      props: { ...base, editing: true, initial: { title: "Growth Summit panel", date: "2026-10-29", note: "Panel: planning for growth" } },
    },
    { label: "Add on a day outside every window", props: { ...base, initial: { title: "Annual offsite", date: "2027-03-02" } } },
    { label: "Error — nothing written, no date", props: { ...base, demoErrors: true } },
    {
      label: "A long note wraps",
      props: {
        ...base,
        initial: {
          title: "Leadership forum talk proposal due",
          date: "2026-11-13",
          note: "Submit through the forum portal with a 200-word abstract, a one-line bio and the three learning outcomes, and copy the programme chair so she knows to expect it",
        },
      },
    },
  ],
});
