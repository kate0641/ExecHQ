import { defineComponentStates } from "@/components/types";
import { PRIVACY_SPLASH } from "@/mock/onboarding";
import { PrivacySplash } from "./PrivacySplash";

const base = {
  titleLead: PRIVACY_SPLASH.titleLead,
  titleRest: PRIVACY_SPLASH.titleRest,
  lines: PRIVACY_SPLASH.lines,
  primaryLabel: PRIVACY_SPLASH.action,
};

export const privacySplashStates = defineComponentStates({
  name: "PrivacySplash",
  group: "feedback",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Concept 1's privacy screen: a two-tone heading, short stacked lines, a large lock, and one action pinned to the foot. No progress marks: it is part of the opening, and the marks start on the next screen.",
  component: PrivacySplash,
  variants: [
    { label: "Default", props: base },
    {
      label: "With footnote",
      description: "An optional quieter line under the phone.",
      props: {
        ...base,
        footnote: "The account is yours, permanently, whatever happens next.",
      },
    },
  ],
});
