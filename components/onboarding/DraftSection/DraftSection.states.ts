import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { CHAT_C2 } from "@/mock/onboarding";
import { DraftSection } from "./DraftSection";

const drafted = [
  { text: "I’m VP of Marketing, leading brand and demand with a team of 51–200." },
];
const withGaps = [
  { text: "I’m " },
  { gap: "your current role" },
  { text: ", leading brand and demand " },
  { gap: "your team size" },
  { text: "." },
];

export const draftSectionStates = defineComponentStates({
  name: "DraftSection",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One part of the story, drafted for review before the next is written. Gaps stay dashed; once approved it says so. Concept 2's Positioning Builder.",
  component: DraftSection,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Draft", props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: drafted } },
    { label: "With gaps", props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: withGaps } },
    {
      label: "Approved",
      props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: drafted, approvedLabel: CHAT_C2.draft.approved },
    },
  ],
});
