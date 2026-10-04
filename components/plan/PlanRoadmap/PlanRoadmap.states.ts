import { defineComponentStates } from "@/components/types";
import { PlanRoadmap } from "./PlanRoadmap";

const base = {
  planId: "leadership-scope",
  startedOn: "2026-10-05",
  today: "2026-10-26",
  rationale:
    "You said you want a larger organization and a broader remit, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
  evidenceStage: 1,
};

export const planRoadmapStates = defineComponentStates({
  name: "PlanRoadmap",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "The roadmap: three to four stages toward her direction, the stage she is in, and what finishing it looks like. Stages are never locked or levelled and any can be opened. When the work says she has done what a stage asks, it suggests moving on and she confirms; it never advances silently. The plan’s reason from onboarding stays in view. Changing plan is quiet, keeps everything she made, and leaves the old plan in her history.",
  component: PlanRoadmap,
  notApplicable: {
    active: "A stage header is a plain open-and-close control with no separate pressed style.",
    loading: "Written from the plan data: there is nothing to wait for.",
    error: "Written from the plan data: nothing can fail.",
    empty: "A plan always has stages.",
  },
  variants: [
    { label: "Step up, in stage two — default", props: base },
    {
      label: "Moving on is suggested, and she decides",
      description: "Her work says stage one is done. The roadmap offers the next stage; “Not yet” is as easy as “Move on”.",
      props: { ...base, demoConfirmed: 0 },
    },
    { label: "Current stage only, the rest one step away", props: { ...base, compact: true } },
    {
      label: "Current stage — hover",
      states: ["hover"],
      props: { ...base, compact: true, demoState: "hover" },
    },
    {
      label: "Current stage — focus",
      states: ["focus"],
      props: { ...base, compact: true, demoState: "focus" },
    },
    {
      label: "Last stage: the plan keeps going",
      props: { ...base, evidenceStage: 3, demoConfirmed: 3 },
    },
    {
      label: "Change plan — current plan disabled",
      description: "Every plan can be chosen except the one she is on.",
      props: { ...base, demoOpen: "switch" },
    },
    {
      label: "Change plan — new plan chosen, what carries over",
      props: { ...base, demoOpen: "confirm" },
    },
    {
      label: "After a switch: the earlier plan stays in her history",
      props: {
        ...base,
        planId: "executive-presence",
        startedOn: "2026-10-26",
        demoConfirmed: 0,
        demoHistory: [{ planId: "leadership-scope", startedOn: "2026-10-05", endedOn: "2026-10-26", atStage: 1 }],
      },
    },
    {
      label: "A long reason wraps",
      props: {
        ...base,
        rationale:
          "You said you want a larger organization and a broader remit, that you are two levels below the people who decide, that the planning cycle starts next month, and that your manager has never seen your results written down, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
      },
    },
  ],
});
