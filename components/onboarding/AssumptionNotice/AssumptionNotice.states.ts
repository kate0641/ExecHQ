import { defineComponentStates } from "@/components/types";
import { assumptionFor } from "@/mock/onboarding";
import { AssumptionNotice } from "./AssumptionNotice";

const positioning = assumptionFor("I want to lead a larger organisation");
const exploration = assumptionFor("I have hit a ceiling and cannot name the next role");

export const assumptionNoticeStates = defineComponentStates({
  name: "AssumptionNotice",
  group: "feedback",
  status: "draft",
  flows: ["onboarding"],
  description:
    "States a default the system applied because the user skipped something. Two fixed beats, set by the PRD: state the assumption, then promise refinement. It is its own component rather than a Notice because that pattern is a product rule, not a style.",
  component: AssumptionNotice,
  variants: [
    { label: "After skipping refinement", props: positioning },
    { label: "The unsure path", props: exploration },
  ],
});
