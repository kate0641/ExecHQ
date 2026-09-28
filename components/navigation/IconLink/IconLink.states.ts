import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { IconLink } from "./IconLink";

const profile = { href: "/profile/concept-1", label: "Profile", icon: "person" as const };

export const iconLinkStates = defineComponentStates({
  name: "IconLink",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "A destination reached by an icon alone, such as Profile in the top right of the Tab bar concept. Its label is the accessible name and the tooltip.",
  component: IconLink,
  notApplicable: {
    disabled: "A destination is always reachable.",
    loading: "A link: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "Always has an icon and a label.",
    filled: NOT_AN_INPUT,
    "long text": "Shows an icon only; the label is not visible.",
  },
  variants: [
    { label: "Profile — default", props: profile },
    { label: "Profile, current page", description: "On the Profile page itself.", props: { ...profile, current: true } },
    { label: "Profile — hover", props: { ...profile, demo: "hover" } },
    { label: "Profile — focus", props: { ...profile, demo: "focus" } },
    { label: "Profile — pressed", props: { ...profile, demo: "active" } },
  ],
});
