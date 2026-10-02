import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { MAP_COPY } from "@/mock/homepage";
import { BriefingCallout } from "./BriefingCallout";

const base = { href: "/daily-briefing/concept-1", label: MAP_COPY.briefing("October 2nd") };

export const briefingCalloutStates = defineComponentStates({
  name: "BriefingCallout",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "One line at the top of the homepage that leads to today’s Briefing. It says there is one and which day it is for, and never what is in it.",
  component: BriefingCallout,
  notApplicable: {
    disabled: "Shown only when there is a Briefing to read.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "With no Briefing, the page leaves it out.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default", props: base },
    { label: "A longer date wraps", props: { ...base, label: MAP_COPY.briefing("Wednesday 30th September, for the week ahead of your Q1 planning review") } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
