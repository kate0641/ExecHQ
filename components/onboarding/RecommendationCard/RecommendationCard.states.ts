import { defineComponentStates } from "@/components/types";
import { GUIDE_C3, PLAN_TEMPLATES, earlyReasonFor } from "@/mock/onboarding";
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
  variants: [
    {
      label: "Early",
      props: {
        lead: GUIDE_C3.rec.lead,
        name: first.name,
        formalName: first.formalName,
        reason: earlyReasonFor("C-suite in 3 years", first),
      },
    },
    {
      label: "With a status",
      props: {
        lead: GUIDE_C3.rec.lead,
        name: presence.name,
        formalName: presence.formalName,
        reason: earlyReasonFor("Be seen as an executive", presence),
        status: "Checked against your answers",
      },
    },
  ],
});
