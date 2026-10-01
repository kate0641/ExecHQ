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
    "Deleting the account: exactly what goes, read from the account as it is, with a way to take a copy first and no guilt language. Assumes deletion is immediate.",
  component: DeletionDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    error: "Deleting cannot fail in the prototype.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "One draft — default", props: { ...base, drafts: 1, headingId: "dd-1" } },
    { label: "No drafts — none", props: { ...base, drafts: 0, headingId: "dd-2" } },
    { label: "Several drafts, a longer list — long text", props: { ...base, drafts: 3, headingId: "dd-3" } },
    { label: "Downloading a copy first — loading", description: "The link says so while the download starts.", props: { ...base, drafts: 1, downloading: true, headingId: "dd-4" } },
  ],
});
