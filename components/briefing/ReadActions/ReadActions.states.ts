import { defineComponentStates } from "@/components/types";
import { TODAYS_READS } from "@/mock/briefing";
import { ReadActions } from "./ReadActions";

const noop = () => {};
const read = TODAYS_READS[0];
const base = {
  title: read.title,
  saved: false,
  onSave: noop,
  onRelevance: noop,
  respondHref: "/toolbox-flow/concept-1?source=briefing&read=planning-season",
};

export const readActionsStates = defineComponentStates({
  name: "ReadActions",
  group: "form controls",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "What she can do with a read: save it, mark it read or not, say whether it was worth her time (acknowledged in the moment, with Undo), and write a post about it in Thought Leadership Builder. Compact is one row of pills for the front page's lead.",
  component: ReadActions,
  notApplicable: {
    disabled: "Every action is always open to her.",
    loading: "Each answer is kept on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: each answer is kept on her device.",
    empty: "Not a list: the actions are always there.",
    "long text": "Fixed labels only; the read's title is never shown here, only named for screen readers.",
  },
  variants: [
    { label: "Not answered yet — default", props: { ...base, isRead: true, onMarkRead: noop } },
    { label: "Saved, answered relevant — filled", props: { ...base, saved: true, relevance: "yes", isRead: true, onMarkRead: noop } },
    { label: "Answered not relevant", props: { ...base, relevance: "no" } },
    { label: "Compact, for the open card", props: { ...base, compact: true } },
    { label: "Without Write a post (Concept 3)", props: { ...base, respondHref: undefined } },
    { label: "Save — hover", props: { ...base, demo: "hover" } },
    { label: "Save — focus", props: { ...base, demo: "focus" } },
    { label: "Save — pressed", props: { ...base, demo: "active" } },
  ],
});
