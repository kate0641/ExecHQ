import { defineComponentStates } from "@/components/types";
import { PRIVACY } from "@/mock/onboarding";
import { PrivacyPromise } from "./PrivacyPromise";

export const privacyPromiseStates = defineComponentStates({
  name: "PrivacyPromise",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The privacy promise as its own moment, not a footnote or a checkbox beside another field. There is nothing to agree to — no consent to withhold, only a statement of fact — so it carries no control of its own.",
  component: PrivacyPromise,
  variants: [
    {
      label: "Default",
      props: { heading: PRIVACY.heading, statements: PRIVACY.statements },
    },
    {
      label: "Secondary level",
      description: "Where the screen already has an h1.",
      props: {
        heading: PRIVACY.heading,
        statements: PRIVACY.statements,
        headingLevel: 2 as const,
      },
    },
  ],
});
