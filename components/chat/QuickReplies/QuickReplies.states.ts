import { defineComponentStates } from "@/components/types";
import { CHAT_C2, DIRECTION_PROMPTS_C1 } from "@/mock/onboarding";
import { QuickReplies } from "./QuickReplies";

const noop = () => {};

export const quickRepliesStates = defineComponentStates({
  name: "QuickReplies",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Tap-to-answer chips above the chat composer. Choosing one sends it as the user's message. A way past the question is styled quieter than the answers; in a pick-several question the chips are toggles.",
  component: QuickReplies,
  notApplicable: {
    loading: "The replies are fixed for each question: nothing to wait for.",
    error: "Choosing a reply cannot fail; there is nothing to check.",
  },
  variants: [
    {
      label: "Direction prompts",
      props: { label: CHAT_C2.direction, replies: DIRECTION_PROMPTS_C1.map((p) => ({ label: p.label })), onChoose: noop },
    },
    {
      label: "With a skip",
      props: {
        label: "What kind of step up?",
        replies: [{ label: "Bigger team" }, { label: "Broader remit" }, { label: CHAT_C2.skip, quiet: true }],
        onChoose: noop,
      },
    },
    {
      label: "Pick several",
      description: "Chosen answers stay pressed; a done chip moves on.",
      props: {
        label: CHAT_C2.builder.strengths.question,
        replies: [
          { label: "Building teams", pressed: true },
          { label: "Setting strategy", pressed: false },
          { label: "Growing revenue", pressed: true },
          { label: CHAT_C2.builder.strengths.done, quiet: true },
        ],
        onChoose: noop,
      },
    },
    { label: "Empty", description: "Nothing to tap: renders nothing.", props: { label: "None", replies: [], onChoose: noop } },
  ],
});
