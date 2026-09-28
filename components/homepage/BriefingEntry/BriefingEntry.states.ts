import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BriefingEntry } from "./BriefingEntry";

const href = "/daily-briefing/concept-1";

export const briefingEntryStates = defineComponentStates({
  name: "BriefingEntry",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "One line into the Briefing — “Today’s Briefing · 3 reads”. It shows no article content on the homepage.",
  component: BriefingEntry,
  notApplicable: {
    disabled: "The Briefing is always reachable.",
    loading: "A link with a fixed count: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "The Briefing always has its three reads.",
    filled: NOT_AN_INPUT,
    "long text": "The label is fixed and short.",
  },
  variants: [
    { label: "Three reads — default", props: { href } },
    { label: "One read", props: { href, reads: 1 } },
    { label: "Hover", props: { href, demo: "hover" } },
    { label: "Focus", props: { href, demo: "focus" } },
    { label: "Pressed", props: { href, demo: "active" } },
  ],
});
