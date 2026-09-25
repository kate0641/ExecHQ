import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { CHAT_C2, goalFor, narrativeFor } from "@/mock/onboarding";
import { StorySummaryCard } from "./StorySummaryCard";

const inputs = {
  name: "Maya Chen",
  role: "VP of Marketing",
  own: "brand and demand",
  teamSize: "51–200",
  strengths: ["Building teams", "Growing revenue"],
  result: "grew pipeline 40% in a year",
  audience: "My manager",
};
const goal = goalFor("C-suite in 3 years");
const noop = () => {};

export const storySummaryCardStates = defineComponentStates({
  name: "StorySummaryCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The finished story, short enough for a conversation: the narrative's three parts and what else is ready, with every output one tap away. Concept 2.",
  component: StorySummaryCard,
  notApplicable: {
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: {
        title: "The story of what you lead",
        parts: narrativeFor(inputs, goal),
        also: CHAT_C2.storyAlso("Promotion conversation"),
        detailsLabel: CHAT_C2.storyOpen,
        onDetails: noop,
      },
    },
    {
      label: "After a change",
      props: {
        title: "The story of what you lead",
        parts: narrativeFor(inputs, goal, ["shorter"]),
        also: CHAT_C2.storyAlso(null),
        detailsLabel: CHAT_C2.storyOpen,
        onDetails: noop,
        status: CHAT_C2.revisedStatus("Shorter"),
      },
    },
    {
      label: "With gaps", states: ["empty"],
      props: {
        title: "The story of what you lead",
        parts: narrativeFor({ ...inputs, role: "", teamSize: "" }, goal),
        detailsLabel: CHAT_C2.storyOpen,
        onDetails: noop,
      },
    },
  ],
});
