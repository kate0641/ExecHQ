import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { GoodExample } from "./GoodExample";

const s = GUIDE_C3.story;

export const goodExampleStates = defineComponentStates({
  name: "GoodExample",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A strong example answer and why it works. Concept 3's builder coaches as it asks; the example is never put in the user's field.",
  component: GoodExample,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always has its example.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "What you do", props: { label: s.goodLabel, whyLabel: s.goodWhy, ...s.doing.good } },
    { label: "A result", props: { label: s.goodLabel, whyLabel: s.goodWhy, ...s.known.good } },
  ],
});
