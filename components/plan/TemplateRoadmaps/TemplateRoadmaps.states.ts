import { defineComponentStates } from "@/components/types";
import { NOT_INTERACTIVE, FIXED_CONTENT } from "@/components/not-applicable";
import { TemplateRoadmaps } from "./TemplateRoadmaps";

export const templateRoadmapsStates = defineComponentStates({
  name: "TemplateRoadmaps",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Every plan template, stage by stage, with what finishing each stage looks like. A reference for reviewing the wording of all five roadmaps together, not a screen of the product. Stages the brief adds that onboarding does not show yet are marked.",
  component: TemplateRoadmaps,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always the five plans.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "All five plans — default", props: {} },
    { label: "One plan", props: { only: ["current-org"], headingId: "tr-one" } },
    { label: "Five plans — long lists wrap", props: { headingId: "tr-long" } },
  ],
});
