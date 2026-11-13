import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT } from "@/components/not-applicable";
import { GUIDE_C3, PLAN_TEMPLATES } from "@/mock/onboarding";
import { PlanOption } from "./PlanOption";

const noop = () => {};
const c = GUIDE_C3.pick;
const base = { onToggle: noop, onUse: noop, signsLabel: c.signs, useLabel: c.cta };

export const planOptionStates = defineComponentStates({
  name: "PlanOption",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One plan on onboarding's plans page (Kate, 2026-11-13). Pressed, it opens in place: “Pick this if” with three signs she can see herself in, what she comes away with, and Use this plan, which chooses it and moves on. Pressed again, it closes. After I can't decide, ExecEngine's pick is marked and opens with its reason.",
  component: PlanOption,
  surface: "inverse",
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every plan can always be opened and chosen.",
    error: "Nothing to get wrong: it opens, closes or is used.",
    empty: "Always describes a plan.",
    filled: "Not an input: choosing it moves on at once, so it is never shown chosen.",
  },
  variants: [
    { label: "Default, closed", props: { ...base, plan: PLAN_TEMPLATES[0], open: false } },
    { label: "Open", description: "Pressed: why it's hers, and Use this plan.", props: { ...base, plan: PLAN_TEMPLATES[0], open: true } },
    {
      label: "Hover, focus and pressed",
      description: "The card's border strengthens on hover and while pressed; focus draws the ring around the whole card. Point at it or tab to it.",
      states: ["hover", "focus", "active"],
      props: { ...base, plan: PLAN_TEMPLATES[2], open: false },
    },
    {
      label: "ExecEngine's pick, open",
      description: "After I can't decide: marked, and open with its reason above the signs.",
      props: {
        ...base,
        plan: PLAN_TEMPLATES[0],
        open: true,
        recommended: true,
        reason: "You want to become CEO or run a business unit. They'd say you're missing proof you can run something bigger, so the plan builds it.",
      },
    },
    {
      label: "Long text",
      description: "A long plan name, line and signs wrap inside the card.",
      props: {
        ...base,
        open: true,
        plan: {
          ...PLAN_TEMPLATES[4],
          bestFor: "You want a different role here, in another part of the business, or you aren't sure yet which one.",
          pickIf: [
            "You feel stuck or restless in your current role, but can't yet name what you'd rather be doing next.",
            ...(PLAN_TEMPLATES[4].pickIf ?? []).slice(1),
          ],
        },
      },
    },
  ],
});
