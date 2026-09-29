import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { LoopRow } from "./LoopRow";

const due = HOME_STATES["follow-up-due"].records;
const pitch = due.find((r) => r.id === "pitch")!;
const noop = () => {};

export const loopRowStates = defineComponentStates({
  name: "LoopRow",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "One draft in Homepage Concept 2’s “Stay on track” that isn’t the one open: title, where it stands, what it’s waiting on. A row that needs the user opens it in place; one that’s only waiting is a quiet line.",
  component: LoopRow,
  notApplicable: {
    disabled: "A row that can’t be opened is shown as a quiet line, not a disabled button.",
    loading: "Read from the local Loop: there is nothing to wait for.",
    error: "Read locally: nothing can fail.",
    empty: "Only shown for a draft that exists.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Needs her, a follow-up — default", props: { record: pitch, line: "Sent last Thursday. What came of it?", onOpen: noop } },
    { label: "Only waiting, quiet", props: { record: pitch, line: "I’ll ask about it on Tuesday." } },
    { label: "A long title wraps", props: { record: { ...pitch, title: "Pitch for the Q1 planning review and the cross-functional planning office" }, line: "Sent last Thursday. What came of it?", onOpen: noop } },
    { label: "Hover", props: { record: pitch, line: "Sent last Thursday. What came of it?", onOpen: noop, demo: "hover" } },
    { label: "Focus", props: { record: pitch, line: "Sent last Thursday. What came of it?", onOpen: noop, demo: "focus" } },
    { label: "Pressed", props: { record: pitch, line: "Sent last Thursday. What came of it?", onOpen: noop, demo: "active" } },
  ],
});
