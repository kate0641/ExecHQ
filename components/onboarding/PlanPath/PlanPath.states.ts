import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { GUIDE_C3, PLAN_TEMPLATES } from "@/mock/onboarding";
import { PlanPath } from "./PlanPath";

const c = GUIDE_C3.plan;
const plan = PLAN_TEMPLATES[0];
const stages = (plan.stages ?? []).map((stage) => ({ title: stage.title, done: stage.done }));
const content = {
  where: c.where(plan.name, stages.length, stages[0]?.title ?? ""),
  thisWeek: { label: c.here, title: plan.thisWeek?.title ?? "", line: c.thisWeekLine },
  stages,
  goal: "The C‑suite within three years",
  doneLabel: c.doneLabel,
};

export const planPathStates = defineComponentStates({
  name: "PlanPath",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The plan as a path, on onboarding's navy page (Kate, 2026-11-12): the Plan page's stage bar and move card for this week, each stage with a sign it's working (“Done when…”), and her goal at the end. It builds in once; with reduced motion it shows at rest.",
  component: PlanPath,
  surface: "inverse",
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always shows this week and the plan's stages.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Building in", description: "As it first appears. Reload the catalogue to watch it again.", props: content },
    { label: "At rest", props: { ...content, animate: false } },
    {
      label: "Long text",
      description: "A longer step, stage and goal wrap within their place on the path.",
      props: {
        ...content,
        animate: false,
        thisWeek: { ...content.thisWeek, title: "Write the story of what you lead, in the words your leadership already uses" },
        goal: "A bigger leadership role where you are, with the remit to match",
      },
    },
  ],
});
