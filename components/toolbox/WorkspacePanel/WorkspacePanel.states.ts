import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { RevisionControls } from "@/components/toolbox/RevisionControls";
import { WorkspacePanel } from "./WorkspacePanel";

const noop = () => {};
const tabs = [
  { id: "revise", label: "Revise", content: createElement(RevisionControls, { onRevise: noop }) },
  { id: "versions", label: "Versions", content: createElement("p", null, "Every change is saved.") },
  { id: "inputs", label: "Inputs", content: createElement("p", null, "What you gave ExecHQ for this draft.") },
];
const base = { tabs, active: "revise", onActive: noop, onOpenChange: noop, inline: true };

export const workspacePanelStates = defineComponentStates({
  name: "WorkspacePanel",
  group: "layout",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "Concept 2's workspace: inputs, changes and versions in a panel pulled up from a peek-height bar at the foot of the draft; never over the draft unasked. The bar is a real button, so nothing needs dragging. On the web it is a side panel, always open.",
  component: WorkspacePanel,
  notApplicable: {
    ...CONTENT_INSIDE,
    hover: "The bar and tabs share the plain button hover.",
    active: "A press opens, closes or switches at once.",
    disabled: "Every tab is always open to her.",
    empty: "Before the first draft it holds the inputs, so it is never empty.",
    "long text": "Fixed, short labels; what is inside scrolls.",
  },
  variants: [
    { label: "Resting at the peek bar — default", props: { ...base, open: false }, states: ["focus"] },
    { label: "Pulled up, on Revise", props: { ...base, open: true } },
    { label: "Pulled up, on Versions", props: { ...base, open: true, active: "versions" } },
    { label: "Side panel, on the web", props: { ...base, open: false, side: true } },
  ],
});
