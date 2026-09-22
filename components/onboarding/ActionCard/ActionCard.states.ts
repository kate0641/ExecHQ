import { defineComponentStates } from "@/components/types";
import { firstAction } from "@/mock/onboarding";
import { ActionCard } from "./ActionCard";

export const actionCardStates = defineComponentStates({
  name: "ActionCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The first recommended action with its reasoning shown rather than implied. 'Why this, why now, why you' is marked up as a definition list because they are labelled pairs — the relationship should be real, not just visual.",
  component: ActionCard,
  variants: [
    {
      label: "Default",
      props: { action: firstAction("I want to lead a larger organisation") },
    },
    {
      label: "The unsure path",
      props: {
        action: firstAction("I have hit a ceiling and cannot name the next role"),
      },
    },
    {
      label: "Top-level heading",
      props: {
        action: firstAction("I have a board presentation coming up"),
        headingLevel: 1 as const,
      },
    },
  ],
});
