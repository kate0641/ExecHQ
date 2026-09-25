import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { PLAN_C1, PLAN_TEMPLATES } from "@/mock/onboarding";
import { ThisWeekCard } from "./ThisWeekCard";

const [first, , moment] = PLAN_TEMPLATES;

export const thisWeekCardStates = defineComponentStates({
  name: "ThisWeekCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The first action in a plan, on a dark card: what, one line of detail, and why now. Always the draft the next screen builds, so the promise is kept one tap later. No effort estimate in onboarding.",
  component: ThisWeekCard,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: { label: PLAN_C1.thisWeek, whyLabel: PLAN_C1.why, ...first.thisWeek! },
    },
    {
      label: "A different plan",
      props: { label: PLAN_C1.thisWeek, whyLabel: PLAN_C1.why, ...moment.thisWeek! },
    },
  ],
});
