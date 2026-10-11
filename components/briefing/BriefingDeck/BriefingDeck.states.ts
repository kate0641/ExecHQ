import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { BriefingDeck } from "./BriefingDeck";

const noop = () => {};
const base = { reads: TODAYS_READS, open: 0, onOpen: noop };

export const briefingDeckStates = defineComponentStates({
  name: "BriefingDeck",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Today's three reads as a stack of cards (Briefing Concept 1, option B): one read open in full with its publisher, headline, why it is here and its actions; the other two as top strips tucked against it. Pressing a strip opens that read in its place. Each card says 1 of 3, so the stack reads as a finished set. Cards stay in reading order for screen readers and the keyboard. Tinted from the deck tokens; the publisher is always named.",
  component: BriefingDeck,
  notApplicable: {
    disabled: "Every read can always be opened.",
    loading: "Today's three are already here: there is nothing to wait for.",
    error: "Opening a read only shows what is here: nothing can fail.",
    empty: "The Briefing always has three reads once publishers are chosen.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "First read open — default", props: base },
    { label: "Second read open", props: { ...base, open: 1 } },
    { label: "First one read", props: { ...base, open: 1, isRead: (id: string) => id === TODAYS_READS[0].id } },
    { label: "Strip — hover", props: { ...base, open: 2, demo: "hover" } },
    { label: "Strip — focus", props: { ...base, open: 2, demo: "focus" } },
    { label: "Strip — pressed", props: { ...base, open: 2, demo: "active" } },
    { label: "A long headline wraps", props: { ...base, reads: TODAYS_READS.map((r, i) => (i === 0 ? { ...r, title: `${r.title}, and why the people who ask early usually get it` } : r)) } },
  ],
});
