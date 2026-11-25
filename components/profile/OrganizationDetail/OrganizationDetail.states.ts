import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { OrganizationDetail } from "./OrganizationDetail";

const noop = () => {};
const controls = "Read only: nothing on it to press. Its close, in a sheet, is the sheet’s.";

export const organizationDetailStates = defineComponentStates({
  name: "OrganizationDetail",
  group: "cards",
  feature: "Profile",
  status: "draft",
  flows: ["profile"],
  description:
    "The organization her account came through: who it is, and in plain words what it sees (totals for the whole group) and never sees (her plan or her work). Read only: she cannot leave from Profile.",
  component: OrganizationDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "Read from the local account: there is nothing to wait for.",
    error: "Read from the local account: nothing can fail.",
  },
  variants: [
    { label: "A member, filled — default", props: { org: MAYA.org, onClose: noop, headingId: "od-1" } },
    { label: "Not part of one — empty", props: { org: undefined, onClose: noop, headingId: "od-3" } },
    {
      label: "A long name wraps",
      props: {
        org: { ...MAYA.org!, name: "The Northgate Institute for Executive Leadership and Corporate Governance" },
        onClose: noop,
        headingId: "od-4",
      },
    },
    { label: "Open on the page, no close", props: { org: MAYA.org, headingId: "od-5" } },
  ],
});
