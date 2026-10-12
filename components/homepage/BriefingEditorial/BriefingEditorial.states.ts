import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB as B } from "@/mock/homepage";
import { BriefingEditorial } from "./BriefingEditorial";

const base = {
  href: "/daily-briefing/concept-1",
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
    "Today’s Briefing on the homepage: the three reads as equal bullets under a thin top rule, each headline in the serif on one line with its publication under it. Long headlines end in an ellipsis, so the card keeps its height. Visibly apart from plan recommendations.",
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
    { label: "With a cover image", description: "A photograph across the top fading into the navy; the words in white on the navy below. On Home.", props: { ...base, cover: true } },
    {
      label: "Long headlines end in an ellipsis",
      description: "Each headline stops after one line, so the card keeps its height. The full headlines stay in the link’s name.",
      props: {
        ...base,
        reads: [
          { title: "How planning season quietly decides who gets new work, new budget and the next promotion", publisher: "Marlow Management Review" },
          { title: "What chief marketing officers look for when they widen a remit beyond brand and into growth", publisher: "The Calder Quarterly" },
          { title: "Why strong operators get passed over for scope, and the three things that reliably change it", publisher: "Ridgeline Leadership Journal" },
        ],
      },
    },
    { label: "One read only", description: "With one read given, the card shows one bullet.", props: { ...base, reads: base.reads.slice(0, 1) } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
