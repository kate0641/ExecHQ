import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { GENERATING_COPY } from "@/mock/onboarding";
import { GeneratingState } from "./GeneratingState";

export const generatingStateStates = defineComponentStates({
  name: "GeneratingState",
  group: "feedback",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The thinking state. A status rather than a progress bar, because nothing here can honestly report how far along it is. The pulse stops under prefers-reduced-motion and the label alone still says what is happening.",
  component: GeneratingState,
  notApplicable: {
    ...NOT_INTERACTIVE,
    empty: "Always says what is being prepared.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Interpreting", states: ["loading"], props: { label: GENERATING_COPY.interpreting } },
    { label: "Planning", states: ["loading"], props: { label: GENERATING_COPY.planning } },
    { label: "Drafting", states: ["loading"], props: { label: GENERATING_COPY.drafting } },
  ],
});
