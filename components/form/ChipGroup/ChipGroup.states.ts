import { defineComponentStates } from "@/components/types";
import { POSITIONING_C1 } from "@/mock/onboarding";
import { ChipGroup } from "./ChipGroup";

const noop = () => {};
const { team, strengths } = POSITIONING_C1;

export const chipGroupStates = defineComponentStates({
  name: "ChipGroup",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Pressable chips for picking one, or up to a set number. Toggle buttons, so single and multiple choice look and behave the same and no arrow key ever chooses. At the limit, the other chips disable and the legend's note says why.",
  component: ChipGroup,
  variants: [
    { label: "Single — empty", props: { label: team.label, options: team.options, value: [], onChange: noop } },
    {
      label: "Single — chosen",
      props: { label: team.label, options: team.options, value: ["11–50"], onChange: noop },
    },
    {
      label: "Multiple — at the limit",
      description: "Three chosen of up to three: the rest are disabled.",
      props: {
        label: strengths.label,
        note: strengths.note,
        options: strengths.options,
        value: strengths.options.slice(0, 3),
        max: strengths.max,
        onChange: noop,
      },
    },
  ],
});
