import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { CHAT_C2, DRAFT_C1, PLAN_TEMPLATES, firstDraftFor } from "@/mock/onboarding";
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
    "A draft in Concept 2's thread: the story's first draft with ideas for where to use it, or one part of it for review. Gaps stay dashed; once approved it says so.",
  component: DraftSection,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default, the first draft",
      props: {
        eyebrow: CHAT_C2.storyDraft.eyebrow,
        title: CHAT_C2.storyDraft.title,
        segments: [
          {
            text: firstDraftFor(
              "C-suite in 3 years",
              { "scope-kind": "a-seat-at-the-top-table", "scope-block": "nobody-sees-my-work" },
              { role: "", own: "", result: "" }
            ),
          },
        ],
        usesLabel: DRAFT_C1.usesLabel,
        uses: PLAN_TEMPLATES[0].uses,
      },
    },
    { label: "Draft", props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: drafted } },
    { label: "With gaps", props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: withGaps } },
    {
      label: "Approved",
      props: { eyebrow: CHAT_C2.draft.eyebrow, title: "What I do", segments: drafted, approvedLabel: CHAT_C2.draft.approved },
    },
  ],
});
