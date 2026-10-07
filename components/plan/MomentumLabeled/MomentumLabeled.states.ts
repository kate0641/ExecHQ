import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BUILDING, FOLLOW, NEXT_MOVE, QUIETER, STEADY, TODAY, WEEKLY, ev } from "@/components/plan/momentum-fixtures";
import { MomentumLabeled } from "./MomentumLabeled";

const base = { events: BUILDING, today: TODAY, history: 95, follow: FOLLOW, nextMove: NEXT_MOVE };
const noFollow = { done: 0, taken: 0, items: [] };

export const momentumLabeledStates = defineComponentStates({
  name: "MomentumLabeled",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Momentum: a transparent trend, built up as her history grows. She never picks a window. In her first week there are no counts, so no zeros: it lists what she has done so far, and gives her next move. From 7 days she sees the last 7 days (actions completed, artifacts created or used, outcomes updated). At 30 days the last 30 days leads, with how many of the last four weeks held a completed action and how far she got on the steps she took on, and the 7 days stay beneath. At 90 days a label (building, steady or needs attention) leads, with its basis and the next move, and the earlier views stay beneath. Every section has the activity behind it one tap away. Nothing is a score, rank or grade. Thresholds are a placeholder until D&T define them. Declined and deferred steps are never in it.",
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
    {
      label: "From the start — three days in",
      description: "No counts, so no zeros: what she has done so far as plain lines, and her next move.",
      props: { ...base, history: 3, events: WEEKLY.slice(-2), follow: noFollow, headingId: "ma-3" },
    },
    {
      label: "Under 30 days — the last 7 days only — default",
      props: { ...base, history: 16, events: WEEKLY, follow: noFollow, headingId: "ma-16" },
    },
    {
      label: "Under 30 days — first figure open",
      props: { ...base, history: 16, events: WEEKLY, follow: noFollow, demoOpen: true, headingId: "ma-open" },
    },
    {
      label: "At 30 days — consistency and follow-through, the 7 days beneath",
      description: "Completed something in three of the last four weeks, and three of the four steps she took on.",
      props: { ...base, history: 35, events: WEEKLY, headingId: "ma-30" },
    },
    {
      label: "At 30 days — a quiet month",
      description: "No completed action in four weeks. It says so plainly and does not frame it as a miss.",
      props: { ...base, history: 35, events: QUIETER, follow: noFollow, headingId: "ma-30q" },
    },
    { label: "At 90 days — building", props: { ...base, events: [...BUILDING, ...WEEKLY], headingId: "ma-90b" } },
    {
      label: "At 90 days — steady",
      props: { ...base, events: STEADY, headingId: "ma-90s" },
    },
    {
      label: "At 90 days — needs attention, paired with the next move",
      description: "The riskiest phrase in the sprint. It always comes with what to do.",
      props: { ...base, events: QUIETER, follow: noFollow, headingId: "ma-90n" },
    },
    {
      label: "At 90 days — quieter lately, the softer wording",
      props: { ...base, events: QUIETER, follow: noFollow, wording: "soft", headingId: "ma-90q" },
    },
    {
      label: "At 90 days — no next move",
      props: { ...base, events: BUILDING, nextMove: undefined, headingId: "ma-90x" },
    },
    {
      label: "Empty — nothing yet, her first day",
      description: "Says what will appear, not that there is too little data.",
      props: { ...base, history: 1, events: [], follow: noFollow, headingId: "ma-empty" },
    },
    {
      label: "A long event wraps",
      props: {
        ...base,
        history: 16,
        events: [ev("completed", "2026-12-30", "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together", "long")],
        demoOpen: true,
        headingId: "ma-long",
      },
    },
    {
      label: "Dial — three days in",
      description: "A ring with one tick a day. Days she has not reached are dots. The middle always says what day of her plan she is on.",
      props: { ...base, variant: "dial", history: 3, events: WEEKLY.slice(-2), follow: noFollow, headingId: "md-3" },
    },
    {
      label: "Dial — ten days in",
      props: { ...base, variant: "dial", history: 10, events: WEEKLY, follow: noFollow, headingId: "md-10" },
    },
    {
      label: "Dial — past 30 days, the middle still says her day",
      props: { ...base, variant: "dial", history: 35, events: WEEKLY, headingId: "md-30" },
    },
    {
      label: "Dial — past 90 days, still the past 30",
      description: "The ring never grows: it is always the past thirty days, however long she has been here. The longer reading is not drawn on the dial.",
      props: { ...base, variant: "dial", events: [...BUILDING, ...WEEKLY], headingId: "md-90b" },
    },
    {
      label: "Week — this week, with activity",
      description: "Only this week, so it is a weekly thing: seven circles, a dark one for each day she did something.",
      props: { ...base, variant: "week", events: WEEKLY, headingId: "mw-1" },
    },
    {
      label: "Week — her first days, the rest dashed",
      props: { ...base, variant: "week", history: 3, events: WEEKLY.slice(-2), headingId: "mw-3" },
    },
    {
      label: "Week — empty, nothing yet this week",
      description: "Quiet, never a miss: the circles stay neutral.",
      props: { ...base, variant: "week", events: [], headingId: "mw-empty" },
    },
    {
      label: "A long event wraps in the first week",
      props: {
        ...base,
        history: 3,
        events: [ev("completed", "2026-12-30", "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together", "long3")],
        follow: noFollow,
        headingId: "ma-long3",
      },
    },
  ],
});
