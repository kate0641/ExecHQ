import { defineComponentStates } from "@/components/types";
import { PROFILE_COPY } from "@/mock/profile";
import { ProfileHeader } from "./ProfileHeader";

const base = { name: "Maya", email: "maya.chen@example.com", noName: PROFILE_COPY.noName, onOpen: () => {} };

export const profileHeaderStates = defineComponentStates({
  name: "ProfileHeader",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "The top of the profile: monogram, optional name and personal email. The whole card opens the account detail, where the name is edited.",
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
    { label: "No name given — empty", props: { ...base, name: undefined } },
    { label: "Current in the web pane — selected", props: { ...base, current: true } },
    {
      label: "A long email is cut short",
      props: { ...base, name: "Maya Alexandra", email: "maya.alexandra.chen-whitfield@example.com" },
    },
  ],
});
