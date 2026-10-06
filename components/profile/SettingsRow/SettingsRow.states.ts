import { defineComponentStates } from "@/components/types";
import { PROFILE_COPY } from "@/mock/profile";
import { SettingsRow } from "./SettingsRow";

const R = PROFILE_COPY.rows;
const noop = () => {};

export const settingsRowStates = defineComponentStates({
  name: "SettingsRow",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "One row of a SettingsGroup. Opens a detail (a sheet on mobile and tablet, the detail pane on web), goes to a page, shows a value, holds a Switch, or marks a setting that comes later.",
  component: SettingsRow,
  notApplicable: {
    loading: "Read from the local account: there is nothing to wait for.",
    error: "A row reports no error itself; the detail it opens shows its own.",
  },
  variants: [
    { label: "Opens a detail — default", props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), onOpen: noop } },
    { label: "Opens a detail — hover", props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), onOpen: noop, className: "is-hover" } },
    { label: "Opens a detail — focus", props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), onOpen: noop, className: "is-focus" } },
    { label: "Opens a detail — active", props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), onOpen: noop, className: "is-active" } },
    {
      label: "Current in the web pane — selected",
      description: "On web, the row whose detail is showing beside the list.",
      props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), onOpen: noop, current: true },
    },
    {
      label: "Without an icon",
      description: "The You group's rows carry no icon.",
      props: { label: R.direction, value: R.directionValue, onOpen: noop },
    },
    { label: "Without a value — none", props: { icon: "download", label: R.export, onOpen: noop } },
    { label: "Action — default", description: "Does something at once, such as a download, so it has no chevron.", props: { kind: "action", icon: "download", label: R.export, value: R.exportValue, onAction: noop } },
    { label: "Action — loading", description: "While it works: the value says so.", props: { kind: "action", icon: "download", label: R.export, value: R.exportWorking, onAction: noop, busy: true } },
    { label: "Danger", props: { icon: "trash", label: R.delete, tone: "danger", onOpen: noop } },
    { label: "Goes to a page", props: { icon: "flag", label: R.plan, value: R.planValue("Step up", "Increase leadership scope"), href: "/plan/concept-1" } },
    { label: "Read only", props: { kind: "static", icon: "mail", label: "Email", value: "maya.chen@example.com" } },
    {
      label: "Switch — on",
      props: { kind: "switch", icon: "bell", label: "Quiet hours", description: "No emails from 9pm to 7am. They are sent when quiet hours end.", checked: true, onChange: noop },
    },
    {
      label: "Switch — off",
      props: { kind: "switch", icon: "bell", label: "Quiet hours", description: "Off. Emails can arrive at any hour.", checked: false, onChange: noop },
    },
    {
      label: "Arrives later — unavailable",
      description: "A setting a later sprint designs. Not a control: it says when it comes.",
      props: { kind: "later", icon: "briefing", label: "Publishers you follow", tag: "With the Briefing" },
    },
    { label: "Opens a detail — disabled", props: { icon: "bell", label: R.notifications, value: R.notificationsValue(2), disabled: true } },
    {
      label: "A long value is cut short",
      props: { icon: "globe", label: "Website", value: "maya-chen-marketing-leadership.example.com", onOpen: noop },
    },
  ],
});
