import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { NEXT_MOVE, THIS_WEEK, TODAY, ev } from "@/components/plan/momentum-fixtures";
import { MomentumLabeled } from "./MomentumLabeled";

const base = { events: THIS_WEEK, today: TODAY, history: 60, nextMove: NEXT_MOVE };

export const momentumLabeledStates = defineComponentStates({
  name: "MomentumLabeled",
  group: "cards",
  status: "draft",
  flows: ["signals"],
  description:
    "Momentum on the Signal Picture: her week in motion. This week only, Sunday to Saturday, as seven circles: filled for a day she did something (a plan step, a draft or an outcome, or a signal she added), a thin outline for a past day with nothing in it, dashed for a day still to come, and a ring on today. Under them, when anything happened, one line counts it by kind; an empty week has no line. Then her next move. Nothing is a score, and declined or deferred steps are never in it.",
  component: MomentumLabeled,
  notApplicable: {
    hover: "Its one control is the next move's link, which shows its own states.",
    focus: "Its one control is the next move's link, which shows its own states.",
    active: "Its one control is the next move's link, which shows its own states.",
    disabled: "Its one control can always be used.",
    loading: "Read from the local record: there is nothing to wait for.",
    error: "Read from the local record: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "This week, with something of each kind — default", props: { ...base, headingId: "mw-default" } },
    {
      label: "Her first days: before her plan began is not drawn as missed",
      props: { ...base, history: 2, events: THIS_WEEK.filter((e) => e.on >= "2026-12-31"), headingId: "mw-first" },
    },
    { label: "Empty — nothing yet this week, so no count line", props: { ...base, events: [], headingId: "mw-empty" } },
    { label: "No next move", props: { ...base, nextMove: undefined, headingId: "mw-none" } },
    {
      label: "Long text — a long next move wraps",
      props: {
        ...base,
        events: [ev("completed", "2026-12-30", "Put yourself forward", "long")],
        nextMove: { ...NEXT_MOVE, title: "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together" },
        headingId: "mw-long",
      },
    },
  ],
});
