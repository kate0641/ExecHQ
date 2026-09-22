import { defineComponentStates } from "@/components/types";
import { REFINEMENT_QUESTIONS } from "@/mock/onboarding";
import { RefinementQuestion } from "./RefinementQuestion";

export const refinementQuestionStates = defineComponentStates({
  name: "RefinementQuestion",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One optional refinement question. No required marker and no validation, because no answer is a valid outcome. The skip path deliberately lives in the step's actions instead of here, so it sits at the same weight as the primary action rather than inside the question.",
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
