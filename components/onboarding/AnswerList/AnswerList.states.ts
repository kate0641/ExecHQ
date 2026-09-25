import { defineComponentStates } from "@/components/types";
import { REFINEMENT_BY_NEED } from "@/mock/onboarding";
import { AnswerList } from "./AnswerList";

const question = REFINEMENT_BY_NEED.positioning[2];
const noop = () => {};

export const answerListStates = defineComponentStates({
  name: "AnswerList",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One-tap answers for a refinement question: pressing one answers and moves on, so there is no Next button. Buttons rather than radios, so arrow keys never answer by accident. Stacked at one width and centred, matching the direction prompts.",
  component: AnswerList,
  notApplicable: {
    loading: "The answers are fixed for each question: nothing to wait for.",
    error: "Choosing an answer cannot fail; there is nothing to check.",
    empty: "Only ever shown with its answers.",
  },
  variants: [
    {
      label: "Default",
      props: { label: question.question, options: question.options, onChoose: noop },
    },
    {
      label: "Answered",
      description: "Coming back to a question shows the earlier answer as pressed.",
      props: {
        label: question.question,
        options: question.options,
        value: question.options[1].value,
        onChoose: noop,
      },
    },
  ],
});
