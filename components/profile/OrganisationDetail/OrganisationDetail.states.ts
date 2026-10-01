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
    "The organisation her account came through: who it is, and in plain words what it sees (a summary of the whole group) and never sees (her personally). Leaving asks once.",
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
    { label: "Open on the page, no close", props: { org: MAYA.org, onLeave: noop, onRequestLeave: noop, headingId: "od-5" } },
  ],
});
