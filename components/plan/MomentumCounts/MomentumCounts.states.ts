import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BUILDING, TODAY, ev } from "@/components/plan/momentum-fixtures";
import { MomentumCounts } from "./MomentumCounts";

const base = { events: BUILDING, today: TODAY, history: 95 };

export const momentumCountsStates = defineComponentStates({
  name: "MomentumCounts",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Momentum, Concept B: counts only, called Plan progress. The same three figures in every window; thirty days sets this month’s counts beside last month’s in plain words; ninety days is counts and no label, ever. It tests whether counts alone give her enough sense of direction. Each figure keeps what is behind it one tap away, and a declined or deferred step is in none of them.",
  component: MomentumCounts,
  notApplicable: {
    hover: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    focus: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    active: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    disabled: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    loading: "Read from the local record: there is nothing to wait for.",
    error: "Read from the local record: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Seven days, counts — default", props: { ...base, headingId: "mb-7" } },
    { label: "Seven days, first figure open", props: { ...base, demoOpen: true, headingId: "mb-open" } },
    {
      label: "Thirty days, against the 30 before",
      props: { ...base, initialWindow: 30, headingId: "mb-30" },
    },
    {
      label: "Thirty days, nothing earlier to compare",
      props: { ...base, history: 40, initialWindow: 30, headingId: "mb-30n" },
    },
    {
      label: "Thirty days, thin history",
      props: { ...base, history: 16, initialWindow: 30, headingId: "mb-30t" },
    },
    {
      label: "Ninety days, counts so far — no label",
      description: "A pilot user never fills this window. It says so, and shows what there is.",
      props: { ...base, history: 30, initialWindow: 90, headingId: "mb-90t" },
    },
    { label: "Ninety days, counts only", props: { ...base, initialWindow: 90, headingId: "mb-90" } },
    { label: "Empty — nothing yet", props: { ...base, events: [], headingId: "mb-empty" } },
    {
      label: "A long event wraps",
      props: {
        ...base,
        events: [ev("completed", "2026-12-30", "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together", "long")],
        demoOpen: true,
        headingId: "mb-long",
      },
    },
  ],
});
