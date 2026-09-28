import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { RecentWork } from "./RecentWork";

const records = HOME_STATES["follow-up-due"].records;
const hrefFor = () => "/toolbox-flow/concept-1";
const labels: Record<string, string> = { story: "Short-term", "check-in-brief": "Short-term", pitch: "Medium-term" };
const labelFor = (r: { id: string }) => labels[r.id];

export const recentWorkStates = defineComponentStates({
  name: "RecentWork",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The user’s artifacts, most recently touched first, each with its Loop status and a small label for the ring it belongs to. Filter chips show how many are in each group — never a score.",
  component: RecentWork,
  notApplicable: {
    disabled: "Every artifact can always be opened.",
    loading: "Read from the local Loop: there is nothing to wait for.",
    error: "Read from the local Loop: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Three artifacts — default", props: { records, hrefFor, labelFor } },
    { label: "Filtered to Waiting", props: { records, hrefFor, labelFor, defaultFilter: "waiting" } },
    { label: "Without filters", props: { records, hrefFor, filterable: false } },
    { label: "Empty, nothing made yet", props: { records: [], hrefFor } },
    { label: "A long list stops at its limit", props: { records, hrefFor, labelFor, limit: 2 } },
    { label: "Item — hover", props: { records, hrefFor, labelFor, demo: "hover" } },
    { label: "Item — focus", props: { records, hrefFor, labelFor, demo: "focus" } },
    { label: "Item — pressed", props: { records, hrefFor, labelFor, demo: "active" } },
  ],
});
