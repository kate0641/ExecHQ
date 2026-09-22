import { defineComponentStates } from "@/components/types";
import { REFINEMENT_QUESTIONS } from "@/mock/onboarding";
import { RefinementQuestion } from "./RefinementQuestion";

export const refinementQuestionStates = defineComponentStates({
  name: "RefinementQuestion",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One optional refinement question. No required marker and no validation, because no answer is a valid outcome. Answers are chips rather than a segmented control: they are short, and pills read as choices where a joined track reads as a form field. The skip path lives in the step's top bar, not here.",
  component: RefinementQuestion,
  variants: [
    { label: "Unanswered", props: { question: REFINEMENT_QUESTIONS[0] } },
    {
      label: "Answered",
      props: { question: REFINEMENT_QUESTIONS[0], value: "year" },
    },
    { label: "Audience question", props: { question: REFINEMENT_QUESTIONS[1] } },
    {
      label: "Constraint question",
      props: { question: REFINEMENT_QUESTIONS[2], value: "visibility" },
    },
  ],
});
