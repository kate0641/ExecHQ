import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { BriefingReadCard } from "./BriefingReadCard";

const noop = () => {};
const [lead, second] = TODAYS_READS;

export const briefingReadCardStates = defineComponentStates({
  name: "BriefingReadCard",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "One of the day's three reads: publisher, headline in the serif, and why it is here, in ExecHQ's words beside a rule. Its own pattern, never a plan step's: no horizon, effort, reading time or done state. Lead (the dark card), row (the whole row opens it) and stack (Concept 3, a passage under it).",
  component: BriefingReadCard,
  notApplicable: {
    disabled: "A read is always there to open.",
    loading: "Today's three are written in the mock: there is nothing to wait for.",
    error: "Opening a read only shows what is already here: nothing can fail.",
    empty: "The Briefing always has three reads once publishers are chosen; the first visit is the picker.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Row — default", props: { read: second, layout: "row", onOpen: noop } },
    { label: "Row — read", description: "Opened once, it says so, and the headline steps back.", props: { read: second, layout: "row", isRead: true, onOpen: noop } },
    { label: "Row — hover", props: { read: second, layout: "row", onOpen: noop, demo: "hover" } },
    { label: "Row — focus", props: { read: second, layout: "row", onOpen: noop, demo: "focus" } },
    { label: "Row — pressed", props: { read: second, layout: "row", onOpen: noop, demo: "active" } },
    { label: "Lead", description: "The front page's dark card. Its actions go in as children.", props: { read: lead, layout: "lead", onOpen: noop } },
    { label: "Stack", props: { read: lead, layout: "stack", onOpen: noop } },
    {
      label: "Row — a long headline wraps",
      props: { read: { ...second, title: "What chief marketing officers look for when they widen a remit, and why the first ninety days decide it" }, layout: "row", onOpen: noop },
    },
  ],
});
