import { defineComponentStates } from "@/components/types";
import { DIRECTION, PROMPTED_DIRECTIONS } from "@/mock/onboarding";
import { DirectionDeck } from "./DirectionDeck";

const base = {
  directions: PROMPTED_DIRECTIONS,
  label: DIRECTION.prompt,
  onSelect: () => {},
  onWriteOwn: () => {},
  onChange: () => {},
  value: "",
};

export const directionDeckStates = defineComponentStates({
  name: "DirectionDeck",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The direction as a deck of answers, each spelled out rather than labelled — aimed at the user who feels a ceiling and cannot name a role, for whom recognising yourself in a sentence is far easier than composing one. Writing your own is a card in the same deck, and choosing it replaces the deck with a statement rather than a form field.",
  component: DirectionDeck,
  variants: [
    { label: "Default", props: { ...base, selectedId: null } },
    {
      label: "A card chosen",
      props: { ...base, selectedId: PROMPTED_DIRECTIONS[0].id },
    },
    {
      label: "The unsure card chosen",
      props: { ...base, selectedId: PROMPTED_DIRECTIONS[5].id },
    },
    {
      label: "Writing their own",
      description: "The deck gives way to a statement, not a form field.",
      props: {
        ...base,
        selectedId: "own",
        value:
          "I want to lead a larger organisation, somewhere marketing is taken seriously.",
        hint: DIRECTION.hint,
      },
    },
    {
      label: "Writing their own — empty",
      props: { ...base, selectedId: "own", hint: DIRECTION.hint },
    },
    {
      label: "Error",
      props: {
        ...base,
        selectedId: null,
        error: "Choose one, or write your own. A few words is enough.",
      },
    },
  ],
});
