import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { PLAN_TEMPLATES, planForWhom, recommendationReasonC3 } from "@/mock/onboarding";
import { RecommendationCard } from "./RecommendationCard";

const [first, presence] = PLAN_TEMPLATES;

export const recommendationCardStates = defineComponentStates({
  name: "RecommendationCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "ExecHQ's recommendation stated as one: a plan and the reason for it. Concept 3 makes it early and tests it with every question after.",
  component: RecommendationCard,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "From the direction",
      props: {
        forWhom: planForWhom(first),
        reason: recommendationReasonC3("Become CEO or run a business unit", {}, { reason: "" }).trim(),
      },
    },
    {
      label: "Named, with a status",
      props: {
        lead: "ExecHQ would start you on",
        name: presence.name,
        formalName: presence.formalName,
        forWhom: planForWhom(presence),
        reason: recommendationReasonC3("Be seen as an executive beyond my company", {}, { reason: "" }).trim(),
        status: "Checked against your answers",
      },
    },
  ],
});
