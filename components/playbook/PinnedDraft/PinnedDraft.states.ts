import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { PinnedDraft } from "./PinnedDraft";

const noop = () => {};
const preview = "Most new remits are handed out before anyone posts a role. The plan is where scope gets decided…";
const live = createElement("p", { className: "pinned-draft__live" }, preview);

export const pinnedDraftStates = defineComponentStates({
  name: "PinnedDraft",
  group: "cards",
  status: "draft",
  flows: ["playbook-flow"],
  description:
    "Concept 3's draft, pinned above the interview: a collapsed card that fills in as she answers and opens with a tap, because a phone can't hold the questions and the draft side by side. On the web it sits beside the interview, open.",
  component: PinnedDraft,
  notApplicable: {
    hover: "The toggle shares the plain button hover.",
    active: "A press opens or closes it at once.",
    disabled: "The draft can always be opened.",
    loading: "Writing is shown by the draft itself (DraftEditor).",
    error: "It only shows the draft: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Before any answers — default, empty", props: { label: "First draft", expanded: false, onToggle: noop }, states: ["focus"] },
    { label: "Filling in, collapsed", props: { label: "First draft", preview, expanded: false, onToggle: noop, children: live } },
    { label: "Opened", props: { label: "First draft", preview, expanded: true, onToggle: noop, children: live } },
    { label: "Beside the interview, on the web", props: { label: "First draft", expanded: true, onToggle: noop, side: true, children: live } },
    { label: "A long first line wraps", props: { label: "First draft", preview: `${preview} ${preview}`, expanded: false, onToggle: noop } },
  ],
});
