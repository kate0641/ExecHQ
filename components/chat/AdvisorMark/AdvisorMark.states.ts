import { defineComponentStates } from "@/components/types";
import { AdvisorMark } from "./AdvisorMark";

export const advisorMarkStates = defineComponentStates({
  name: "AdvisorMark",
  group: "primitives",
  status: "draft",
  flows: ["onboarding"],
  description:
    "ExecHQ's mark in the conversation, chosen on 2026-09-24: a centre with six points gathered around it. Drawn in currentColor; always decorative.",
  component: AdvisorMark,
  variants: [
    { label: "In a message — 20px", props: { size: 20 } },
    { label: "Large — 48px", props: { size: 48 } },
  ],
});
