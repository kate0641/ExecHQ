import { defineComponentStates } from "@/components/types";
import { Badge } from "./Badge";

export const badgeStates = defineComponentStates({
  name: "Badge",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "Status and metadata label. The word is always present, so the badge never depends on colour alone to carry meaning.",
  component: Badge,
  variants: [
    { label: "Neutral", props: { children: "Web only" } },
    { label: "Sprint", props: { tone: "sprint", children: "Sprint 3" } },
    { label: "Draft", props: { tone: "draft", srPrefix: "Status:", children: "Draft" } },
    { label: "In review", props: { tone: "in-review", srPrefix: "Status:", children: "In review" } },
    { label: "Approved", props: { tone: "approved", srPrefix: "Status:", children: "Approved" } },
  ],
});
