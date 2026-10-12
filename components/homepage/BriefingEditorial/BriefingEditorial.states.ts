import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB as B } from "@/mock/homepage";
import { BriefingEditorial } from "./BriefingEditorial";

const base = {
  href: "/daily-briefing/concept-1",
  heading: B.heading,
  meta: B.meta("Tue 20 Oct", B.reads),
  lead: B.lead,
  publisher: B.publisher,
  tag: B.tag,
  others: B.others,
};

export const briefingEditorialStates = defineComponentStates({
  name: "BriefingEditorial",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "Today’s Briefing on the homepage: the lead headline in the serif under a thin top rule, with its publication and why it matters under it, then the other two reads as small bullets with theirs. Long headlines end in an ellipsis (the lead after two lines, the others after one), so the card keeps its height. On web the lead takes the left and the others the right. Visibly apart from plan recommendations.",
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
    { label: "No read touches the plan", description: "Without a tag, the lead shows only its publication.", props: { ...base, tag: undefined } },
    {
      label: "Long headlines end in an ellipsis",
      description: "The lead stops after two lines and the others after one, so the card keeps its height. The full headlines stay in the link’s name.",
      props: {
        ...base,
        lead: "How planning season quietly decides who gets new work, new budget and the next promotion, and why the people who ask early usually get it",
        others: [
          { title: "What chief marketing officers look for when they widen a remit beyond brand and into growth", publisher: "The Calder Quarterly" },
          { title: "Why strong operators get passed over for scope, and the three things that reliably change it", publisher: "Ridgeline Leadership Journal" },
        ],
      },
    },
    { label: "Lead read only", description: "With no other reads given, the card shows the lead alone.", props: { ...base, others: undefined } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
