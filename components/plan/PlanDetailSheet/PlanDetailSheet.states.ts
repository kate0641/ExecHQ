import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { PlanDetailSheet } from "./PlanDetailSheet";

const noop = () => {};
const base = {
  open: true,
  inline: true,
  onClose: noop,
  planId: "leadership-scope",
  rationale: "You said you want to lead a broader team, so this plan puts your leadership story first and the conversations that decide a bigger role after it.",
  stage: 1,
  direction: "I want to move from running campaigns to leading a broader marketing organization.",
  editHref: "/onboarding/concept-3?edit=1",
};

export const planDetailSheetStates = defineComponentStates({
  name: "PlanDetailSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "More about her plan and her direction, opened from Edit on the Plan: the plan and why she has it, the stages with the one she is in marked, and her direction in her own words. It edits nothing itself. Change my direction starts the onboarding questions again, with her answers kept, and she chooses her plan at the end.",
  component: PlanDetailSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    empty: "She always has a plan and a direction from onboarding.",
  },
  variants: [
    { label: "Default — second stage, direction from onboarding", props: base },
    { label: "Edited by her", props: { ...base, edited: true, direction: "I want to lead a CMO-level marketing team." } },
    { label: "First stage", props: { ...base, stage: 0 } },
    {
      label: "A long direction wraps",
      props: {
        ...base,
        direction:
          "I want to move from running campaigns to leading a broader marketing organization, with a seat in the planning conversations about budget and headcount, within the next two planning cycles.",
      },
    },
  ],
});
