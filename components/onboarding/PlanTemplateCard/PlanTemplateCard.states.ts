import { defineComponentStates } from "@/components/types";
import { PLAN_TEMPLATES, recommendPlan } from "@/mock/onboarding";
import { PlanTemplateCard } from "./PlanTemplateCard";

const recommended = recommendPlan("I want to lead a larger organisation");

export const planTemplateCardStates = defineComponentStates({
  name: "PlanTemplateCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One plan template as a choice, built on a native radio so arrow-key navigation and '2 of 5' come from the platform rather than from key handlers. The recommendation carries a rationale tied to what the user said; the others carry their 'best for' line, so switching is informed rather than a guess.",
  component: PlanTemplateCard,
  variants: [
    {
      label: "Recommended — selected",
      props: {
        plan: recommended,
        recommended: true,
        selected: true,
        name: "catalogue-a",
      },
    },
    {
      label: "Recommended — not selected",
      props: { plan: recommended, recommended: true, name: "catalogue-b" },
    },
    {
      label: "Alternative",
      props: { plan: PLAN_TEMPLATES[1], name: "catalogue-c" },
    },
    {
      label: "Alternative — selected",
      props: { plan: PLAN_TEMPLATES[2], selected: true, name: "catalogue-d" },
    },
    {
      label: "The unsure path's plan",
      props: { plan: PLAN_TEMPLATES[4], name: "catalogue-e" },
    },
  ],
});
