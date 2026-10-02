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
  notApplicable: {
    loading: "The options are fixed for each question: nothing to wait for.",
  },
  variants: [
    { label: "Single — empty", props: { label: team.label, options: team.options, value: [], onChange: noop } },
    {
      label: "Single — chosen",
      props: { label: team.label, options: team.options, value: ["11–50"], onChange: noop },
    },
    {
      label: "Equal width",
      description: "Long options, one to a row at the same width.",
      props: {
        label: "Where do you want to go next?",
        options: ["Reach the C-suite within three years", "Take on a bigger leadership role", "Be seen as an executive"],
        value: ["Be seen as an executive"],
        max: 3,
        equalWidth: true,
        onChange: noop,
      },
    },
    {
      label: "With a line under each",
      description: "Each option says a little more about itself.",
      props: {
        label: "Which matters most right now?",
        options: ["Be seen as an executive", "Find my next move"],
        details: {
          "Be seen as an executive": "Read as an executive, not only a strong operator.",
          "Find my next move": "Working out where to go before choosing.",
        },
        value: ["Find my next move"],
        equalWidth: true,
        onChange: noop,
      },
    },
    {
      label: "Multiple — at the limit", states: ["disabled", "filled"],
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
