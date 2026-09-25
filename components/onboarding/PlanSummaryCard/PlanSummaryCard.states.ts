import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { CHAT_C2, PLAN_C1, PLAN_TEMPLATES } from "@/mock/onboarding";
import { PlanSummaryCard } from "./PlanSummaryCard";

const [first, , moment] = PLAN_TEMPLATES;
const noop = () => {};
const base = { eyebrow: PLAN_C1.eyebrow, thisWeekLabel: PLAN_C1.thisWeek, nowLabel: PLAN_C1.now };

export const planSummaryCardStates = defineComponentStates({
  name: "PlanSummaryCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A plan short enough for a conversation: name, this week's one thing and the stages as a line each, with the full plan one tap away. Concept 2's plan card.",
  component: PlanSummaryCard,
  notApplicable: {
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: {
        ...base,
        name: first.name,
        formalName: first.formalName,
        thisWeek: first.thisWeek?.title,
        toward: `${first.horizon}, toward the C-suite in 3 years`,
        stages: first.stages ?? [],
        detailsLabel: CHAT_C2.planFullWeeks,
        onDetails: noop,
      },
    },
    {
      label: "Working toward a date",
      description: "A plan without a 12-week span links to the full plan instead.",
      props: {
        ...base,
        name: moment.name,
        formalName: moment.formalName,
        thisWeek: moment.thisWeek?.title,
        toward: `${moment.horizon}, toward your board presentation`,
        stages: moment.stages ?? [],
        detailsLabel: CHAT_C2.planFull,
        onDetails: noop,
      },
    },
    {
      label: "No link",
      props: { ...base, name: first.name, thisWeek: first.thisWeek?.title, stages: first.stages ?? [] },
    },
  ],
});
