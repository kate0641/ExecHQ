import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB as B } from "@/mock/homepage";
import { BriefingEditorial } from "./BriefingEditorial";

const base = { href: "/daily-briefing/concept-1", heading: B.heading, meta: B.meta("Tue 20 Oct", B.reads), lead: B.lead, tag: B.tag };

export const briefingEditorialStates = defineComponentStates({
  name: "BriefingEditorial",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "Today’s Briefing as a page of reading, on Homepage Concept 3: the lead headline in the serif under a thin top rule, the date and reads above, why it matters as a tag. Visibly apart from plan recommendations. Content stubbed until Sprint 4.",
  component: BriefingEditorial,
  notApplicable: {
    disabled: "The Briefing is always reachable.",
    loading: "Written from the Briefing stub: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "The Briefing always has its reads.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Lead read with why it matters — default", props: base },
    { label: "No read touches the plan", description: "Without a tag, the headline stands alone.", props: { ...base, tag: undefined } },
    { label: "A long headline wraps", props: { ...base, lead: "How planning season decides who gets new work, and why the people who ask early usually get it" } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
