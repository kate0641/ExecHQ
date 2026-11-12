import { defineComponentStates } from "@/components/types";
import { PlanDirection } from "./PlanDirection";

const direction = "I want to move from running campaigns to leading a broader marketing organization.";
const why =
  "You said you want a larger organization and a broader remit, so this plan starts with the narrative and the evidence that the people deciding will ask for.";
const editHref = "/onboarding/concept-3?edit=1";

export const planDirectionStates = defineComponentStates({
  name: "PlanDirection",
  group: "cards",
  feature: "Plan",
  status: "draft",
  flows: ["plan"],
  description:
    "Her direction above the roadmap in the guided check-in: “Your direction” as a grey eyebrow, then her words in full in the serif, in the system's white card. Under a hairline, why she has this plan as a quiet paragraph with no heading, then Change your direction, a text link. It replaced the plan sheet See your plan opened (9 Nov); what changing her direction means is said on the edit flow's first page.",
  component: PlanDirection,
  notApplicable: {
    hover: "Its only control is the standard text link, whose hover is shown in the design system.",
    focus: "Its only control is the standard text link, whose focus ring is shown in the design system.",
    active: "Its only control is the standard text link: pressing it leaves the page for the onboarding questions.",
    disabled: "Changing her direction is always open to her.",
    loading: "Her direction is already on the page: there is nothing to wait for.",
    error: "Nothing here can fail: the link only leaves the page.",
    empty: "She always has a direction from onboarding.",
    filled: "Not an input: it only reads her direction.",
  },
  variants: [
    { label: "Default — why this plan and the way to change it", props: { direction, why, editHref } },
    {
      label: "Edited by you — changed since onboarding",
      description: "After she has changed her direction through the questions again.",
      props: { direction, why, editHref, edited: true },
    },
    {
      label: "Chose this plan herself",
      description: "When she switched plans, why this plan is the day she chose it.",
      props: { direction, why: "You chose this plan on Mon, Oct 19, 2026.", editHref },
    },
    {
      label: "Read only — her words alone",
      description: "Without a reason or a link, it only reads her direction.",
      props: { direction },
    },
    {
      label: "Long text — a long direction wraps",
      props: {
        direction:
          "I want to move from running regional campaigns to leading a broader marketing organization across product lines, with a seat in the planning conversations that set next year’s priorities.",
        why,
        editHref,
      },
    },
  ],
});
