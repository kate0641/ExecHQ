import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { UsesDetail } from "./UsesDetail";

const noop = () => {};
const controls = "Its controls are switches, which show their own states.";

export const usesDetailStates = defineComponentStates({
  name: "UsesDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "What ExecHQ may draw on to suggest her next step: her Loop record, her connections and her drafts, each with its own switch. Takes effect at once; what she has made stays.",
  component: UsesDetail,
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
    { label: "All on, filled — default", props: { uses: MAYA.uses, onChange: noop, onClose: noop, headingId: "ud-1" } },
    {
      label: "One off — the note appears",
      props: { uses: { ...MAYA.uses, drafts: false }, onChange: noop, onClose: noop, headingId: "ud-2" },
    },
    {
      label: "All off — empty",
      props: { uses: { loop: false, connections: false, drafts: false }, onChange: noop, onClose: noop, headingId: "ud-3" },
    },
    { label: "In the web pane, no close", props: { uses: MAYA.uses, onChange: noop, headingId: "ud-4" } },
  ],
});
