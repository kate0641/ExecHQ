import { defineComponentStates } from "@/components/types";
import { ThreadTurn } from "./ThreadTurn";

export const threadTurnStates = defineComponentStates({
  name: "ThreadTurn",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One turn in Concept 2's conversational intake. Two voices down the same margin: ExecHQ as plain editorial text at full measure, the user in a filled block carrying their name. Enough to tell the voices apart at a glance without the messaging costume — and keeping full width matters, because the plan and the draft are long.",
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
      label: "You — with a way back in",
      description:
        "With the back button gone, this is how a mistake is corrected: by editing the record rather than reversing out of it.",
      props: {
        speaker: "you" as const,
        children: "maya@gmail.com",
        onEdit: () => {},
      },
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
