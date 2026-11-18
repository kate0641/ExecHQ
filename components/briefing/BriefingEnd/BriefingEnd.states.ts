import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { BriefingEnd } from "./BriefingEnd";

export const briefingEndStates = defineComponentStates({
  name: "BriefingEnd",
  group: "feedback",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "The end of the day's set: That's today's three. A short, confident close under a heavy rule. No Load more, nothing suggesting she keep scrolling. On the front page it says You've read today's three once all three are open.",
  component: BriefingEnd,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always says the same close.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed, short copy.",
  },
  variants: [
    { label: "Under the three — default", props: { headingId: "be-1" } },
    { label: "All three read", props: { allRead: true, headingId: "be-2" } },
    { label: "The last screen (Concept 2)", props: { layout: "screen", headingId: "be-3" } },
  ],
});
