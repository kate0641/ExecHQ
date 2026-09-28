import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { DIRECTION_INTRO_C1, PRIVACY_SPLASH } from "@/mock/onboarding";
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
    "Concept 1's privacy screen: a two-tone heading, short stacked lines, a large lock, and one action pinned to the foot. No progress marks: it is part of the opening, and the marks start with the Direction question. The same layout, with a flag, is the bridge into Direction.",
  component: PrivacySplash,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...FIXED_CONTENT,
    empty: "Always has its privacy promise.",
    filled: NOT_AN_INPUT,
  },
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
    {
      label: "Direction bridge",
      description:
        "Concept 1's step between the privacy promise and the Direction question: why that question comes first. A flag in place of the lock.",
      props: {
        titleLead: DIRECTION_INTRO_C1.titleLead,
        titleRest: DIRECTION_INTRO_C1.titleRest,
        lines: DIRECTION_INTRO_C1.lines,
        icon: "flag",
        spaced: true,
        primaryLabel: DIRECTION_INTRO_C1.action,
      },
    },
  ],
});
