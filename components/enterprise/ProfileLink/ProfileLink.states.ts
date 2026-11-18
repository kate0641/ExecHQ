import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ProfileLink } from "./ProfileLink";

export const profileLinkStates = defineComponentStates({
  name: "ProfileLink",
  group: "navigation",
  status: "draft",
  flows: ["enterprise", "sponsor-profile"],
  description:
    "The sponsor's initials in a round link at the right of the enterprise header, opening their profile, where Sign out sits at the foot (Kate, 2026-10-22). It replaced the account menu. Its name, said to screen readers and in its tooltip, is Your profile. On the profile itself it is marked as the current page.",
  component: ProfileLink,
  notApplicable: {
    loading: "Who is signed in is known before the page draws: nothing to wait for.",
    error: "A link to a page that is always there: nothing can fail.",
    empty: "Someone is always signed in on the dashboard.",
    disabled: "The profile is always reachable while signed in.",
    filled: NOT_AN_INPUT,
    "long text": "Two initials, whatever the name: the full name is only spoken, never shown.",
  },
  variants: [
    { label: "Initials — default", props: {} },
    { label: "Hover", props: { demo: "hover" } },
    { label: "Focus", props: { demo: "focus" } },
    { label: "Pressed", props: { demo: "active" } },
    { label: "On the profile — current", props: { demo: "current" } },
  ],
});
