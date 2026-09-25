import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { AdvisorMark } from "./AdvisorMark";

export const advisorMarkStates = defineComponentStates({
  name: "AdvisorMark",
  group: "primitives",
  status: "draft",
  flows: ["onboarding"],
  description:
    "ExecHQ's mark in the conversation, chosen on 2026-09-24: a centre with six points gathered around it. Drawn in currentColor; always decorative.",
  component: AdvisorMark,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always drawn in full; it takes no content.",
    "long text": "Contains no text.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "In a message — 20px", props: { size: 20 } },
    { label: "Large — 48px", props: { size: 48 } },
  ],
});
