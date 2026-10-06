import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { PROFILE_COPY } from "@/mock/profile";
import { SettingsRow } from "../SettingsRow";
import { SettingsGroup } from "./SettingsGroup";

const R = PROFILE_COPY.rows;
const row = (props: Parameters<typeof SettingsRow>[0], key: string) => createElement(SettingsRow, { ...props, key });

export const settingsGroupStates = defineComponentStates({
  name: "SettingsGroup",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "A labelled card of SettingsRows. The label is a real heading, so the profile's outline reads as its groups.",
  component: SettingsGroup,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    empty: "Never shown without rows: a group with nothing in it is left off the page.",
  },
  variants: [
    {
      label: "Settings — default",
      props: {
        label: PROFILE_COPY.groups.settings,
        children: [
          row({ icon: "bell", label: R.notifications, value: R.notificationsValue(2) }, "n"),
          row({ icon: "globe", label: R.organization, value: R.noOrganization }, "o"),
        ],
      },
    },
    {
      label: "You — rows without icons",
      props: {
        label: PROFILE_COPY.groups.you,
        children: [
          row({ label: R.direction, value: R.directionValue, onOpen: () => {} }, "d"),
          row({ label: R.plan, value: R.planValue("Step up", "Increase leadership scope"), href: "/plan/concept-1" }, "p"),
        ],
      },
    },
    {
      label: "Label hidden, under the section's own heading",
      description: "The label stays for screen readers; the section above it already names the group.",
      props: {
        label: "Notifications",
        hideLabel: true,
        children: [row({ kind: "switch", icon: "bell", label: "Daily Briefing", checked: true, onChange: () => {} }, "h")],
      },
    },
    {
      label: "A long label wraps",
      props: {
        label: "Everything ExecHQ sends to your personal email address",
        children: [row({ kind: "switch", icon: "bell", label: "Loop follow-ups", checked: true, onChange: () => {} }, "f")],
      },
    },
  ],
});
