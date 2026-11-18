import { defineComponentStates } from "@/components/types";
import { PROFILE_COPY } from "@/mock/profile";
import { ProfileHeader } from "./ProfileHeader";

const base = { name: "Maya Chen", title: "Senior Director, Campaigns", initialOf: "Maya", noName: PROFILE_COPY.noName, onOpen: () => {} };

export const profileHeaderStates = defineComponentStates({
  name: "ProfileHeader",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "The top of the profile: monogram, her name and her optional current title. The whole card opens the account detail, where the name and title are edited.",
  component: ProfileHeader,
  notApplicable: {
    loading: "Read from the local account: there is nothing to wait for.",
    error: "Nothing on it can fail.",
    disabled: "The account can always be opened.",
  },
  variants: [
    { label: "With a name — default", props: base },
    { label: "Hover", props: { ...base, className: "is-hover" } },
    { label: "Focus", props: { ...base, className: "is-focus" } },
    { label: "Active", props: { ...base, className: "is-active" } },
    { label: "No title given", props: { ...base, title: undefined } },
    { label: "No name given — empty", props: { ...base, name: undefined, title: undefined, initialOf: undefined } },
    { label: "Current in the web pane — selected", props: { ...base, current: true } },
    {
      label: "A long name and title are cut short",
      props: { ...base, name: "Maya Alexandra Chen-Whitfield", title: "Senior Vice President, Global Brand and Campaign Marketing" },
    },
  ],
});
