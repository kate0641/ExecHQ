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
    "Tap-to-answer chips above the chat composer. Choosing one sends it as the user's message. A way past the question is styled quieter than the answers.",
  component: QuickReplies,
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
    { label: "Empty", description: "Nothing to tap: renders nothing.", props: { label: "None", replies: [], onChoose: noop } },
  ],
});
