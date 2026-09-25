import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { CHAT_C2 } from "@/mock/onboarding";
import { ChatMessage } from "./ChatMessage";

export const chatMessageStates = defineComponentStates({
  name: "ChatMessage",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One message in Concept 2's conversation. ExecHQ's words are uncontained, on the page at full width, with the mark and name at the start of each run. The user's sit right as dark bubbles and can carry a “Change this answer” link. Typing shows three dots, hidden from screen readers because the message itself is announced when it lands.",
  component: ChatMessage,
  notApplicable: {
    empty: "A message only appears once it has text; Typing covers the wait before it.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "From ExecHQ — starts a run", props: { from: "advisor", lead: true, children: CHAT_C2.direction } },
    { label: "From ExecHQ — later in a run", props: { from: "advisor", children: CHAT_C2.directionHint } },
    { label: "From you", props: { from: "you", children: "C-suite in 3 years", onEdit: () => {} } },
    { label: "Typing", states: ["loading"], props: { from: "advisor", lead: true, typing: true } },
    {
      label: "Card",
      description: "A wider message for a read-back, a plan or a story.",
      props: {
        from: "advisor",
        card: true,
        children: createElement("p", null, "You want to reach the C-suite within three years."),
      },
    },
  ],
});
