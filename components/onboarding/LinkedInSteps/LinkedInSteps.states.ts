import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { LINKEDIN_UPLOAD } from "@/mock/onboarding";
import { LinkedInSteps } from "./LinkedInSteps";

const base = {
  label: LINKEDIN_UPLOAD.stepsLabel,
  steps: LINKEDIN_UPLOAD.steps,
  linkNote: LINKEDIN_UPLOAD.linkNote,
};

export const linkedInStepsStates = defineComponentStates({
  name: "LinkedInSteps",
  group: "feedback",
  status: "draft",
  flows: ["onboarding"],
  description:
    "How to get the LinkedIn analytics export, as numbered steps: LinkedIn's three, then ours. What to press is in bold, to match LinkedIn's screen. The link opens LinkedIn in a new tab.",
  component: LinkedInSteps,
  notApplicable: {
    ...FIXED_CONTENT,
    hover: "Its one control is a plain link, styled by the shared link rules.",
    focus: "Its one control is a plain link, styled by the shared link rules.",
    active: "Its one control is a plain link, styled by the shared link rules.",
    disabled: "The link to LinkedIn is always available.",
    empty: "The steps are fixed: LinkedIn's own, then ours.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed copy, written to fit.",
  },
  variants: [{ label: "Default", props: base }],
});
