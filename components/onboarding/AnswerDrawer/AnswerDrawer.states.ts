import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { GUIDE_C3 } from "@/mock/onboarding";
import { AnswerDrawer } from "./AnswerDrawer";

const noop = () => {};
const time = GUIDE_C3.reflect.time;
const base = {
  question: time.title,
  lede: time.lede,
  kicker: GUIDE_C3.reflect.kicker,
  onToggle: noop,
  primaryLabel: GUIDE_C3.drawer.answer,
  onPrimary: noop,
};

export const answerDrawerStates = defineComponentStates({
  name: "AnswerDrawer",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Concept 3's drawer: the question and its answer together, with the page's context behind. Folds to a peek bar carrying the question; a drawn keyboard sits under it while a field has focus.",
  component: AnswerDrawer,
  variants: [
    { label: "Open", props: { ...base, open: true, primaryDisabled: true } },
    {
      label: "Stepped",
      props: {
        ...base,
        question: "What’s your current role?",
        lede: undefined,
        kicker: "What you do",
        step: "1 of 3",
        open: true,
        primaryLabel: GUIDE_C3.drawer.next,
        children: createElement("input", { className: "field__control", "aria-label": "Your current role" }),
      },
    },
    { label: "Peek", props: { ...base, open: false, peekStatus: GUIDE_C3.drawer.peek } },
  ],
});
