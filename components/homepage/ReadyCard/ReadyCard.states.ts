import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { ReadyCard } from "./ReadyCard";

const brief = HOME_STATES["drafted-not-used"].records.find((r) => r.id === "check-in-brief")!;
const noop = () => {};

export const readyCardStates = defineComponentStates({
  name: "ReadyCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "An artifact that is ready but not marked used. It never nags: it says the artifact is ready and makes marking it used a single tap.",
  component: ReadyCard,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Marking used is local and immediate: there is nothing to wait for.",
    error: "Marking used is local: nothing can fail.",
    empty: "Only shown when something is ready.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Brief, ready — default",
      props: {
        record: brief,
        about: { lead: "For your short-term action", title: "Brief your manager before Thursday’s check-in" },
        onUsed: noop,
        openHref: "/toolbox-flow/concept-1",
        checkBack: "in two days",
      },
    },
    {
      label: "A long title wraps",
      props: {
        record: { ...brief, title: "Brief for your manager check-in on scope, the planning workstream and the Q1 review" },
        onUsed: noop,
        openHref: "/toolbox-flow/concept-1",
      },
    },
  ],
});
