import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { BriefingFront } from "./BriefingFront";

const noop = () => {};
const base = { reads: TODAYS_READS, onOpen: noop };

export const briefingFrontStates = defineComponentStates({
  name: "BriefingFront",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Briefing Concept 2's front page, after a news app (option A): the first read as the lead story with a big picture, the other two as rows with a small one, each with its publisher and why it is here. Only ever three, all on the first screen; no topic tabs, no counts, no times. The headline is the button, and it covers the whole story, so the picture opens it too. On web the lead takes the left and the rows the right.",
  component: BriefingFront,
  notApplicable: {
    disabled: "Every read can always be opened.",
    loading: "Today's three are already here: there is nothing to wait for.",
    error: "Opening a read only shows what is here: nothing can fail.",
    empty: "The Briefing always has three reads once publishers are chosen.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Today's three — default", props: base },
    { label: "Lead read", props: { ...base, isRead: (id: string) => id === TODAYS_READS[0].id } },
    { label: "Lead — hover", props: { ...base, demo: "hover" } },
    { label: "Lead — focus", props: { ...base, demo: "focus" } },
    { label: "Lead — pressed", props: { ...base, demo: "active" } },
    { label: "A long headline wraps", props: { ...base, reads: TODAYS_READS.map((r, i) => (i === 1 ? { ...r, title: `${r.title}, and why the people who ask early usually get it` } : r)) } },
  ],
});
