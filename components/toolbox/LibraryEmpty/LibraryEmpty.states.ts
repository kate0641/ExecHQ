import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryEmpty } from "./LibraryEmpty";

export const libraryEmptyStates = defineComponentStates({
  name: "LibraryEmpty",
  group: "feedback",
  status: "draft",
  flows: ["toolbox"],
  description:
    "The library with nothing in it, which only someone who left onboarding before saving sees: anyone who finished has their statement there. It points to her first action step, never to a blank page.",
  component: LibraryEmpty,
  notApplicable: {
    ...FIXED_CONTENT,
    hover: "Its one link shares the plain link hover.",
    active: "Its one link goes straight to the step.",
    disabled: "Her first step is always there.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Her first step — default, empty", props: { step: "Use your leadership story in your next 1:1", stepHref: "/plan/concept-3" }, states: ["focus"] },
    { label: "A long step wraps", props: { step: "Plan your first conversation with the review’s sponsor before the planning cycle opens", stepHref: "/plan/concept-3" } },
  ],
});
