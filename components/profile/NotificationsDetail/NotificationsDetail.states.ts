import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { NotificationsDetail } from "./NotificationsDetail";

const noop = () => {};
const base = { notify: MAYA.notify, onChange: noop, onClose: noop };
const controls = "Its controls are switches, which show their own states.";

export const notificationsDetailStates = defineComponentStates({
  name: "NotificationsDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "The only notifications there are: email, one switch for the plan and one for the Daily Briefing. ExecHQ is a website, so nothing else can reach her. Each takes effect at once.",
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
    { label: "Both on, filled — default", props: { ...base, headingId: "nd-1" } },
    {
      label: "Everything off — empty",
      props: {
        ...base,
        notify: { followUps: false, briefing: false, plan: false },
        headingId: "nd-2",
      },
    },
    {
      label: "Briefing only",
      props: {
        ...base,
        notify: { followUps: false, briefing: true, plan: false },
        headingId: "nd-3",
      },
    },
    { label: "In the web pane, no close", props: { ...base, onClose: undefined, headingId: "nd-4" } },
  ],
});
