import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { PointList } from "./PointList";

export const pointListStates = defineComponentStates({
  name: "PointList",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A short list of explained points: numbered where there is a count, bulleted and boxed for supporting facts, with an optional 'how it helps' line.",
  component: PointList,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Numbered",
      props: {
        items: [
          { title: "A plan for where you want to go", detail: "Short-, medium-, and long-term steps with clear benchmarks." },
          { title: "Work done, not just advice", detail: "Most steps come with drafts made for you to use." },
          { title: "Something that grows with you", detail: "Finish a step or change direction, and the plan updates." },
        ],
        numbered: true,
      },
    },
    {
      label: "Boxed",
      props: {
        items: [{ title: "Private by design", detail: ["For your eyes only. Not your employer, not your manager, not anyone else."] }],
        label: "Before we begin",
      },
    },
    {
      label: "With how it helps",
      props: {
        items: [
          { title: "This week", detail: "The one thing to do first.", helps: "You always know the next move, so nothing stalls." },
          { title: "Done when", detail: "A clear finish line for each stage.", helps: "You can tell it’s working, not just feel busy." },
        ],
        numbered: true,
      },
    },
  ],
});
