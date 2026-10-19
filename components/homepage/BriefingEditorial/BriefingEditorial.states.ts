import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB as B } from "@/mock/homepage";
import { BriefingEditorial } from "./BriefingEditorial";

const base = {
  href: "/daily-briefing/concept-2",
  heading: B.heading,
  meta: B.meta("Tue 20 Oct", B.reads),
  reads: B.list,
};

export const briefingEditorialStates = defineComponentStates({
  name: "BriefingEditorial",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "Today’s Briefing on the homepage: the lead headline in the serif under a thin top rule, with its publication under it, then the other two reads as small bullets with theirs. Every headline is shown in full, over as many lines as it needs; the card grows rather than cut one short. On web the lead takes the left and the others the right. Visibly apart from plan recommendations.",
  component: BriefingEditorial,
  notApplicable: {
    disabled: "The Briefing is always reachable.",
    loading: "Written from the Briefing stub: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "The Briefing always has its reads.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Today’s three reads with their publications — default", props: base },
    { label: "With a cover image", description: "A photograph across the top fading into the card; the words in white below it. Not on Home: Home shows the plain card (designer, 2026-10-12).", props: { ...base, cover: true } },
    {
      label: "Long headlines wrap, never cut",
      description: "The lead and the bullets each run to as many lines as they need, so every headline is read in full and the card grows to hold it.",
      props: {
        ...base,
        reads: [
          { title: "How planning season quietly decides who gets new work, new budget and the next promotion", publisher: "Marlow Management Review" },
          { title: "What chief marketing officers look for when they widen a remit beyond brand and into growth", publisher: "The Calder Quarterly" },
          { title: "Why strong operators get passed over for scope, and the three things that reliably change it", publisher: "Ridgeline Leadership Journal" },
        ],
      },
    },
    { label: "Lead read only", description: "With one read given, the card shows the lead alone.", props: { ...base, reads: base.reads.slice(0, 1) } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
