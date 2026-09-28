import { defineComponentStates } from "@/components/types";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { StoryOutputs } from "./StoryOutputs";

const filled = {
  name: "Maya Chen",
  role: "VP of Marketing",
  own: "brand and demand",
  teamSize: "51–200",
  strengths: ["Building teams", "Growing revenue"],
  result: "grew pipeline 40% in a year",
  audience: "My manager",
};
const empty = { name: "", role: "", own: "", teamSize: "", strengths: [], result: "", audience: "" };
const noop = () => {};
const base = {
  direction: "C-suite in 3 years",
  nextStage: PLAN_TEMPLATES[0].stages?.[1]?.title,
  edits: {},
  onSaveEdit: noop,
};

export const storyOutputsStates = defineComponentStates({
  name: "StoryOutputs",
  group: "cards",
  status: "draft",
  flows: [],
  description:
    "The Positioning Builder's four outputs, with their tabs, bio lengths, revision chips, hand edits and next use. Out of onboarding since 2026-09-28, where StoryDraft shows the first draft instead; kept for the full builder in the Toolbox.",
  component: StoryOutputs,
  variants: [
    { label: "Filled", props: { ...base, inputs: filled } },
    { label: "Nothing filled in", description: "Every fact only the user knows is a gap.", props: { ...base, inputs: empty } },
    { label: "Opening on the opener", props: { ...base, inputs: filled, showFirst: "opener" } },
  ],
});
