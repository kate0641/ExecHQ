import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { DONE_C1, PLAN_C1, PLAN_TEMPLATES, quickWinFor } from "@/mock/onboarding";
import { ThisWeekCard } from "./ThisWeekCard";

const [first, , moment] = PLAN_TEMPLATES;

export const thisWeekCardStates = defineComponentStates({
  name: "ThisWeekCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The first action in a plan, on a dark card: what, one line of detail, and why now. On the plan it is the draft the next screen writes, so the promise is kept one tap later. On Done it is the quick win that comes next. No effort estimate in onboarding.",
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
    {
      label: "Quick win on Done, story left as a draft",
      props: { label: DONE_C1.nextLabel, whyLabel: DONE_C1.nextWhy, ...quickWinFor(first, false) },
    },
    {
      label: "Quick win on Done, story sharpened",
      props: { label: DONE_C1.nextLabel, whyLabel: DONE_C1.nextWhy, ...quickWinFor(first, true) },
    },
  ],
});
