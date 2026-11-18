import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { BriefingArticle } from "./BriefingArticle";

const read = TODAYS_READS[0];

export const briefingArticleStates = defineComponentStates({
  name: "BriefingArticle",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Briefing Concept 2's article, read in ExecHQ rather than at the publisher: the whole text with ExecHQ's notes all the way through. Each noted passage is highlighted and numbered; its note sits under the paragraph on a phone and tablet, and in the margin on web. Notes are for reading, not controls.",
  component: BriefingArticle,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Every read in Concept 2 has its article.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Inline, phone and tablet — default", props: { read, placement: "inline" } },
    { label: "In the margin, web", props: { read, placement: "margin" } },
    {
      label: "A long note wraps — long text",
      props: {
        read,
        placement: "inline",
        body: [
          [
            "Planning is where the organization decides what it will do next year. ",
            {
              text: "The remit goes to whoever has already described the problem it solves.",
              note: "You are writing part of that document, and the Q1 review is where it is read. This is the part to bring with you, with the cost of the problem today and who would need to be involved in fixing it.",
            },
          ],
        ],
      },
    },
  ],
});
