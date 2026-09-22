import { defineComponentStates } from "@/components/types";
import { ThreadTurn } from "./ThreadTurn";

export const threadTurnStates = defineComponentStates({
  name: "ThreadTurn",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One turn in Concept 2's conversational intake. Deliberately not a chat bubble — no avatars, no tails, no alternating sides — because the visual language of messaging would promise the general-purpose chat window the product strategy rules out. It is a transcript: advisor turns as editorial text, user turns indented against a rule.",
  component: ThreadTurn,
  variants: [
    {
      label: "Advisor — question",
      props: {
        speaker: "advisor" as const,
        heading: "What would you like to move toward?",
        description:
          "A role, a scope, an aspiration or a challenge. A precise title is optional.",
      },
    },
    {
      label: "Advisor — statement",
      props: {
        speaker: "advisor" as const,
        heading: "Here is what we understood",
      },
    },
    {
      label: "You — an answer",
      props: {
        speaker: "you" as const,
        children: "I want to lead a larger marketing organisation.",
      },
    },
    {
      label: "You — a choice",
      props: { speaker: "you" as const, children: "Within a year" },
    },
    {
      label: "You — skipped",
      description: "Skipping is recorded plainly, not apologised for.",
      props: { speaker: "you" as const, children: "Skipped the rest" },
    },
    {
      label: "Past turn",
      description:
        "Answered, and now part of the record. Still fully legible — a record you cannot read is not one.",
      props: {
        speaker: "advisor" as const,
        heading: "Roughly when?",
        past: true,
      },
    },
  ],
});
