import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BUILDING, FOLLOW, NEXT_MOVE, QUIETER, STEADY, TODAY, ev } from "@/components/plan/momentum-fixtures";
import { MomentumLabeled } from "./MomentumLabeled";

const base = { events: BUILDING, today: TODAY, history: 95, follow: FOLLOW, nextMove: NEXT_MOVE };

export const momentumLabeledStates = defineComponentStates({
  name: "MomentumLabeled",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Momentum, Concept A: a labeled trend. Seven days is counts, thirty is how far she followed through on the steps she took on, ninety is a label (building, steady or needs attention) with the activity behind it one tap away and the next move beside it. The label is a word with its basis stated, never a grade; with less than ninety days of history it says so and gives none. Thresholds are a placeholder until D&T define them. Declined and deferred steps are never in it.",
  component: MomentumLabeled,
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
    { label: "Seven days, counts — default", props: { ...base, headingId: "ma-7" } },
    { label: "Seven days, first figure open", props: { ...base, demoOpen: true, headingId: "ma-open" } },
    { label: "Thirty days, follow-through against the plan", props: { ...base, initialWindow: 30, headingId: "ma-30" } },
    {
      label: "Thirty days, thin history",
      props: { ...base, history: 16, initialWindow: 30, headingId: "ma-30t" },
    },
    {
      label: "Ninety days, thin history — no label",
      description: "A pilot user never fills this window, so there is no label to give.",
      props: { ...base, history: 30, initialWindow: 90, headingId: "ma-90t" },
    },
    { label: "Ninety days — building", props: { ...base, initialWindow: 90, headingId: "ma-90b" } },
    {
      label: "Ninety days — steady",
      props: { ...base, events: STEADY, initialWindow: 90, headingId: "ma-90s" },
    },
    {
      label: "Ninety days — needs attention, paired with the next move",
      description: "The riskiest phrase in the sprint. It always comes with what to do.",
      props: { ...base, events: QUIETER, initialWindow: 90, headingId: "ma-90n" },
    },
    {
      label: "Ninety days — quieter lately, the softer wording",
      props: { ...base, events: QUIETER, wording: "soft", initialWindow: 90, headingId: "ma-90q" },
    },
    { label: "Empty — nothing yet", props: { ...base, events: [], follow: { done: 0, taken: 0, items: [] }, headingId: "ma-empty" } },
    {
      label: "A long event wraps",
      props: {
        ...base,
        events: [ev("completed", "2026-12-30", "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together", "long")],
        demoOpen: true,
        headingId: "ma-long",
      },
    },
  ],
});
