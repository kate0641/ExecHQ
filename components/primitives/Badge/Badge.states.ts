import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { Badge } from "./Badge";

export const badgeStates = defineComponentStates({
  name: "Badge",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "Status and metadata label. The word is always present, so the badge never depends on colour alone to carry meaning.",
  component: Badge,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always has a label.",
    "long text": "Labels come from a short fixed set: statuses, groups, flags.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Neutral", props: { children: "Web only" } },
    { label: "Sprint", props: { tone: "sprint", children: "Sprint 3" } },
    { label: "Draft", props: { tone: "draft", srPrefix: "Status:", children: "Draft" } },
    { label: "In review", props: { tone: "in-review", srPrefix: "Status:", children: "In review" } },
    { label: "Approved", props: { tone: "approved", srPrefix: "Status:", children: "Approved" } },
  ],
});
