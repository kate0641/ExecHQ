import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB as B } from "@/mock/homepage";
import { BriefingCard } from "./BriefingCard";

const noop = () => {};
const base = {
  meta: B.meta("Tuesday 20 October", B.reads),
  lead: B.lead,
  why: B.why,
  others: B.others,
  href: "/daily-briefing/concept-1",
  closeLabel: B.close,
  onClose: noop,
};

export const briefingCardStates = defineComponentStates({
  name: "BriefingCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Today’s Briefing at the head of Homepage Concept 2: the lead read and why it matters, the other reads by headline, and the way in. A light card, apart from the plan, that can be closed until tomorrow. Content stubbed until Sprint 4.",
  component: BriefingCard,
  notApplicable: {
    disabled: "Closing and reading are always available.",
    loading: "Written from the Briefing stub: there is nothing to wait for.",
    error: "Written from the Briefing stub: nothing can fail.",
    empty: "The Briefing always has its reads; once closed, the card is gone, not empty.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Lead read with why it matters — default", props: { ...base, headingId: "bc-default" } },
    { label: "No read touches the plan", description: "Without a why, the lead read stands alone.", props: { ...base, why: undefined, headingId: "bc-nowhy" } },
    {
      label: "A long headline wraps",
      props: { ...base, lead: "How planning season decides who gets new work, and why the people who ask early usually get it", headingId: "bc-long" },
    },
    { label: "Close — hover", props: { ...base, demo: "hover", headingId: "bc-hover" } },
    { label: "Close — focus", props: { ...base, demo: "focus", headingId: "bc-focus" } },
    { label: "Close — pressed", props: { ...base, demo: "active", headingId: "bc-active" } },
  ],
});
