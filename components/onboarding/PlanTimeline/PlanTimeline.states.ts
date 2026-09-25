import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { PLAN_C1, PLAN_TEMPLATES } from "@/mock/onboarding";
import { PlanTimeline } from "./PlanTimeline";

const plan = PLAN_TEMPLATES[0];
const base = {
  stages: plan.stages ?? [],
  nowLabel: PLAN_C1.now,
  doneLabel: PLAN_C1.doneWhen,
  after: plan.after,
};

export const planTimelineStates = defineComponentStates({
  name: "PlanTimeline",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A plan's stages as a vertical timeline. The current stage is open with its steps and a “Done when” finish line; later stages are one line each; a dashed last mark says the plan keeps going.",
  component: PlanTimeline,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Starting out", props: base },
    {
      label: "Part way through",
      description: "The second stage is current; the first is behind.",
      props: { ...base, currentIndex: 1 },
    },
    { label: "No open end", props: { ...base, after: undefined } },
  ],
});
