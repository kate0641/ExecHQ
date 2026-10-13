import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT } from "@/components/not-applicable";
import { PickAnswer } from "./PickAnswer";

const noop = () => {};
const options = ["My manager", "My manager’s manager", "The CEO", "The CFO", "Peers from other teams", "HR"];
const base = { label: "Who will be there?", mode: "many" as const, options, picked: [], other: "", onChange: noop };

export const pickAnswerStates = defineComponentStates({
  name: "PickAnswer",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "Toolbox flow Concept 3's way of answering: the options one to a line, the same width, to check all that apply (or pick one, where there is only one answer), then Other, a field always there for her own words. Where ExecHQ knows something only she would say, it leads the chips.",
  component: PickAnswer,
  notApplicable: {
    ...FIXED_CONTENT,
    loading: "Its options are written in: there is nothing to wait for.",
    disabled: "Every option can always be picked.",
    empty: "A question always has its options, and Other.",
    error: "Nothing to get wrong: until she picks or writes something, Next stays off (or reads Skip).",
    hover: "Its chips are a ChipGroup, which shows its own hover.",
    focus: "Its chips are a ChipGroup, which shows its own focus.",
    active: "Its chips are a ChipGroup, which shows its own pressed state.",
  },
  variants: [
    { label: "Check all that apply — default", props: base },
    { label: "Two picked — filled", props: { ...base, picked: ["The CEO", "The CFO"] } },
    { label: "Her own words in Other", props: { ...base, picked: ["The CEO"], other: "Our new COO" } },
    { label: "Pick one", props: { ...base, label: "Who are you pitching?", mode: "one" as const, options: ["the Marketing Leaders podcast", "An industry conference", "A trade publication"], picked: ["An industry conference"] } },
    { label: "A long option wraps — long text", props: { ...base, options: ["Agreement that I lead the Q1 planning workstream, with a budget and a seat at the offsite", ...options.slice(0, 3)] } },
  ],
});
