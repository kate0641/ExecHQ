import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { DraftUseBar } from "./DraftUseBar";

const noop = () => {};

export const draftUseBarStates = defineComponentStates({
  name: "DraftUseBar",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "What she does with a draft: copy it, worded for what she'll do (\"Copy to post on LinkedIn\"), PDF and Word where they are in scope (Situation Brief, bios, long-form articles), and Mark ready. ExecHQ never posts or sends.",
  component: DraftUseBar,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Copying is instant, and a download says so in a line.",
    error: "Copy and download are local: nothing can fail.",
    empty: "Only shown under a draft.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed, short labels.",
  },
  variants: [
    { label: "A post — default", props: { kind: "thought-leadership", onCopy: noop, onMarkReady: noop } },
    { label: "Just copied", props: { kind: "thought-leadership", onCopy: noop, onMarkReady: noop, justCopied: true } },
    { label: "A brief, with PDF and Word", props: { kind: "situation-brief", onCopy: noop, onExport: noop, onMarkReady: noop } },
    { label: "A pitch, with PDF and Word", props: { kind: "pitch", onCopy: noop, onExport: noop, onMarkReady: noop } },
    { label: "An article, with PDF and Word", props: { kind: "thought-leadership", exportable: true, onCopy: noop, onExport: noop, onMarkReady: noop } },
    { label: "A brief, downloads under More (Concept 1's bar)", props: { kind: "situation-brief", exportInMenu: true, onCopy: noop, onExport: noop, onMarkReady: noop } },
    { label: "Copy in the draft's menu, a draft (Concept 1)", props: { kind: "situation-brief", copyInMenu: true, noNotes: true, onCopy: noop, onExport: noop, onMarkReady: noop } },
    { label: "Copy in the draft's menu, ready: I've used this (Concept 1)", props: { kind: "situation-brief", copyInMenu: true, noNotes: true, ready: true, onCopy: noop, onExport: noop, onMarkReady: noop, onMarkUsed: noop } },
    { label: "Marked ready", props: { kind: "thought-leadership", ready: true, onCopy: noop, onMarkReady: noop } },
  ],
});
