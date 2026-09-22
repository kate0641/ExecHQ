import { defineComponentStates } from "@/components/types";
import { InterpretedDirection } from "./InterpretedDirection";

const SENTENCE =
  "You want to lead a larger organisation, and you want the step up to be a scope change rather than a title change.";

export const interpretedDirectionStates = defineComponentStates({
  name: "InterpretedDirection",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The system's reading of the direction, shown back and editable in place. The first moment the product does something rather than collects something, and one of the few genuinely editorial moments in the flow — which is what the serif is for.",
  component: InterpretedDirection,
  variants: [
    { label: "Default", props: { sentence: SENTENCE } },
    { label: "Editing", props: { sentence: SENTENCE, editing: true } },
    {
      label: "Edited by the user",
      props: {
        sentence:
          "I want a bigger organisation, but only somewhere marketing is taken seriously.",
      },
    },
  ],
});
