import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { QuestionSheet } from "./QuestionSheet";

const noop = () => {};
const base = {
  open: true,
  inline: true,
  onClose: noop,
  onSave: noop,
  prompt: "Who decides on broader scope at your company?",
  options: ["My manager", "My manager and a senior leader", "A committee", "I am not sure yet"],
} as const;

export const questionSheetStates = defineComponentStates({
  name: "QuestionSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "One question from her plan, answered in a sheet: a few answers to pick from and a line for her own words. Optional all the way down: she can leave it, and nothing is counted against her. A saved answer is a completed action in Momentum and goes into what she has told her plan. It is how a question step finishes, in place of the Toolbox.",
  component: QuestionSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Every answer is optional and any answer is valid, so there is nothing to get wrong.",
    filled: "Shown by the “answer chosen” variant.",
  },
  variants: [
    { label: "Empty — nothing chosen, default", description: "The save button waits for an answer.", props: { ...base } },
    { label: "An answer chosen", props: { ...base, demoPick: "My manager and a senior leader" } },
    {
      label: "A long question wraps",
      props: {
        ...base,
        prompt: "What do you most want to be known for over the next year, across the people you lead and the people who decide?",
        options: ["Leading across teams", "Strategy and the decisions that follow from it", "Growing the people who work for me"],
      },
    },
  ],
});
