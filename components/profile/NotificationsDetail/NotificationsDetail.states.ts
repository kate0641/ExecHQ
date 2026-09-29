import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { NotificationsDetail } from "./NotificationsDetail";

const noop = () => {};
const base = { notify: MAYA.notify, cap: MAYA.followUpCap, quietHours: true, onNotify: noop, onCap: noop, onQuietHours: noop, onClose: noop };
const controls = "Its controls are checkboxes, a segmented control and a switch, which show their own states.";

export const notificationsDetailStates = defineComponentStates({
  name: "NotificationsDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "What reaches her and how: each topic by email and in the app, how often follow-ups may email her, and quiet hours. Every control takes effect at once. PROVISIONAL frequency cap, flagged on the page.",
  component: NotificationsDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "Read from the local account: there is nothing to wait for.",
    error: "Every choice is valid, so nothing can fail.",
    "long text": "Holds fixed copy and controls only; she types nothing.",
  },
  variants: [
    { label: "Defaults, filled — default", props: { ...base, headingId: "nd-1" } },
    {
      label: "Everything off — empty",
      props: {
        ...base,
        notify: {
          followUps: { email: false, app: false },
          briefing: { email: false, app: false },
          plan: { email: false, app: false },
          news: { email: false, app: false },
        },
        quietHours: false,
        headingId: "nd-2",
      },
    },
    { label: "Monthly, no quiet hours", props: { ...base, cap: "month", quietHours: false, headingId: "nd-3" } },
    { label: "In the web pane, no close", props: { ...base, onClose: undefined, headingId: "nd-4" } },
  ],
});
