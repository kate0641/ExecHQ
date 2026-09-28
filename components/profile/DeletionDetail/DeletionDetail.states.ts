import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { DeletionDetail } from "./DeletionDetail";

const noop = () => {};
const base = { email: "maya.chen@example.com", onDelete: noop, onKeep: noop, onExport: noop, onClose: noop };
const controls = "Its controls are Buttons and a text link, which show their own states.";

export const deletionDetailStates = defineComponentStates({
  name: "DeletionDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "Deleting the account: exactly what goes, read from the account as it is, with a way to take a copy first and no guilt language. PROVISIONAL: assumes deletion is immediate.",
  component: DeletionDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "Deleting is instant in the prototype.",
    error: "Deleting cannot fail in the prototype.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "One draft, website connected — default", props: { ...base, drafts: 1, connections: ["Personal website"], headingId: "dd-1" } },
    { label: "Nothing connected, no drafts — none", props: { ...base, drafts: 0, connections: [], headingId: "dd-2" } },
    {
      label: "Everything connected, a long list",
      props: { ...base, drafts: 3, connections: ["Personal website", "LinkedIn"], headingId: "dd-3" },
    },
  ],
});
