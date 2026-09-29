import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { OrganisationDetail } from "./OrganisationDetail";

const noop = () => {};
const controls = "Its one control is a Button, which shows its own states.";

export const organisationDetailStates = defineComponentStates({
  name: "OrganisationDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "The organisation her account came through: who it is, her role, and in plain words what it can and never sees. Leaving asks once. PROVISIONAL what an organisation sees, flagged on the page.",
  component: OrganisationDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "Read from the local account: there is nothing to wait for.",
    error: "Leaving cannot fail in the prototype.",
  },
  variants: [
    { label: "A member, filled — default", props: { org: MAYA.org, onLeave: noop, onClose: noop, headingId: "od-1" } },
    { label: "Asking to leave — confirm", props: { org: MAYA.org, onLeave: noop, startConfirming: true, onClose: noop, headingId: "od-2" } },
    { label: "Not part of one — empty", props: { org: undefined, onLeave: noop, onClose: noop, headingId: "od-3" } },
    {
      label: "A long name wraps",
      props: {
        org: { ...MAYA.org!, name: "The Northgate Institute for Executive Leadership and Corporate Governance" },
        onLeave: noop,
        onClose: noop,
        headingId: "od-4",
      },
    },
    { label: "In the web pane, no close", props: { org: MAYA.org, onLeave: noop, headingId: "od-5" } },
  ],
});
