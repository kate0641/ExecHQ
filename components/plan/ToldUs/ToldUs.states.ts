import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ToldUs } from "./ToldUs";

export const toldUsStates = defineComponentStates({
  name: "ToldUs",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "What she has told her plan, in her own words, filed by what it answers: who decides, what she wants to be known for, how much time she can give. It only ever shows what she chose to say, and nothing here is a score.",
  component: ToldUs,
  notApplicable: {
    hover: "Nothing in it is pressable.",
    focus: "Nothing in it is pressable.",
    active: "Nothing in it is pressable.",
    disabled: "Nothing in it is pressable.",
    loading: "Read from her device: there is nothing to wait for.",
    error: "Read from her device: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Some answered — default",
      props: {
        rows: [
          { label: "Who decides", answer: "My manager and a senior leader" },
          { label: "Known for", answer: "Leading across teams" },
        ],
      },
    },
    { label: "Empty — nothing yet", description: "Says where answers will show.", props: { rows: [] } },
    {
      label: "A long answer wraps",
      props: { rows: [{ label: "Known for", answer: "Turning around a result that other teams had written off, and bringing the people with me" }] },
    },
  ],
});
