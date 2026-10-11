import { defineComponentStates } from "@/components/types";
import { LibraryFilters } from "./LibraryFilters";

const noop = () => {};
const base = { onTool: noop, onStatus: noop, countTool: () => 1, countStatus: (id: string) => (id === "closed" ? 0 : 1) };

export const libraryFiltersStates = defineComponentStates({
  name: "LibraryFilters",
  group: "form controls",
  status: "draft",
  flows: ["toolbox"],
  description:
    "Concept 1's filters: chips that scroll sideways, by tool then by status (the Sprint 2 names, plus Closed). One of each; pressing a chosen chip clears it. Each says how many it holds, and a choice that would show nothing is left out.",
  component: LibraryFilters,
  notApplicable: {
    hover: "Chips share the pill hover: a stronger border.",
    active: "A press chooses it at once; chosen is shown.",
    disabled: "A choice that would show nothing is left out rather than shown unavailable.",
    loading: "Filtering is instant.",
    error: "Nothing here can fail.",
    "long text": "Chips stay on one line and the row scrolls.",
  },
  variants: [
    { label: "Nothing chosen — default", props: base, states: ["focus"] },
    { label: "Situation Brief chosen — filled", props: { ...base, tool: "situation-brief" } },
    { label: "Tool and status chosen", props: { ...base, tool: "pitch", status: "waiting" } },
    { label: "Nothing to filter — empty", props: { ...base, countTool: () => 0, countStatus: () => 0 } },
  ],
});
