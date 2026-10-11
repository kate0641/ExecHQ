import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { SourceLabel } from "./SourceLabel";

const read = TODAYS_READS[0];

export const sourceLabelStates = defineComponentStates({
  name: "SourceLabel",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing", "toolbox-flow"],
  description:
    "Where a draft came from when it came from the Briefing: \"Started from today's Briefing\", then the read, and the passage when she started from one. It stays with the artifact for its whole life, in Thought Leadership Builder and the library.",
  component: SourceLabel,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Written from the read: there is nothing to wait for.",
    error: "Shows what is already known: nothing can fail.",
    empty: "Only shown on a draft that has a source.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Full, in the builder — default", props: { read } },
    { label: "From a passage", props: { read, passage: read.passage } },
    { label: "Compact, in the library", props: { read, size: "compact" } },
    { label: "A long headline wraps", props: { read: { ...read, title: `${read.title}, and why the people who ask early usually get it` } } },
  ],
});
