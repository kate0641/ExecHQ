import { createElement, type ComponentProps } from "react";
import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { Button } from "@/components/primitives/Button";
import { GUIDE_C3, PLAN_TEMPLATES } from "@/mock/onboarding";
import { roadmapFor } from "@/mock/plan";
import { ACTIONS, HORIZONS } from "@/mock/plan-stub";
import { PlanPath } from "./PlanPath";

const c = GUIDE_C3.plan;
const plan = PLAN_TEMPLATES[0];
const stages = roadmapFor(plan.id).map((stage) => ({ title: stage.title, done: stage.milestone || undefined }));
const horizons = HORIZONS.map((horizon) => ({
  label: horizon.label,
  span: c.spans[horizon.id],
  items: ACTIONS.filter((action) => action.horizon === horizon.id && action.status === "accepted").map((action) => action.title),
}));
const content = {
  nowLabel: c.nowLabel,
  stage: c.stage(stages.length, stages[0]?.title ?? ""),
  first: { label: c.firstLabel, title: plan.thisWeek?.title ?? "", line: c.firstLine },
  thenLabel: c.thenLabel,
  stepCount: c.stepCount,
  firstAction: createElement(Button, { fullWidth: true } as ComponentProps<typeof Button>, c.start),
  horizons,
  together: c.together,
  stages,
  goal: "The C‑suite within three years",
  doneLabel: c.doneLabel,
  aheadLabel: c.aheadLabel,
  aheadCount: c.aheadCount(stages.length - 1),
  next: c.next,
};

export const planPathStates = defineComponentStates({
  name: "PlanPath",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Her plan, on the page that ends onboarding: what she's working on now, which stage that is, then Home's three horizons (short-term, medium-term, long-term, side by side), each one outlined group with its count of steps. The short-term is open: the first step leads as the Plan page's move card with Start your first step, its other steps follow under Then, this week. The medium-term and long-term are folded to their heading and open to show their step. The later stages and her goal fold under The stages ahead. It builds in once; with reduced motion it shows at rest.",
  component: PlanPath,
  surface: "inverse",
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "The stages ahead can always be unfolded.",
    empty: "Always shows the stage she is in and its work.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Building in", description: "As it first appears. Reload the catalogue to watch it again.", props: content },
    { label: "At rest", props: { ...content, animate: false } },
    {
      label: "Medium-term and long-term open",
      description: "Each folded horizon opened to show its step, in the same rows as the short-term's.",
      props: { ...content, animate: false, horizonsOpen: true },
    },
    {
      label: "Stages ahead open",
      description: "The fold opened: the later stages, each with its sign it's working, her goal, and what happens after stage 1.",
      props: { ...content, animate: false, aheadOpen: true },
    },
    {
      label: "Hover, focus and pressed",
      description: "The horizons' and the stages ahead's toggles underline on hover and draw the focus ring. Point at them or tab to them.",
      states: ["hover", "focus", "active"],
      props: { ...content, animate: false },
    },
    {
      label: "Changing her direction",
      description: "Reached from Change your direction on the Plan: no first-step button; the page's own Save my plan saves it.",
      props: { ...content, animate: false, firstAction: undefined },
    },
    {
      label: "Long text",
      description: "A longer step, item and goal wrap within their place.",
      props: {
        ...content,
        animate: false,
        aheadOpen: true,
        horizonsOpen: true,
        first: { ...content.first, title: "Write the story of what you lead, in the words your leadership already uses" },
        horizons: horizons.map((horizon, index) =>
          index === 1 ? { ...horizon, items: ["Put yourself forward to lead the Q1 planning review, with a one-page note on what you'd change"] } : horizon
        ),
        goal: "A bigger leadership role where you are, with the remit to match",
      },
    },
  ],
});
