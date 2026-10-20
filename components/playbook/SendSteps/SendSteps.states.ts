import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { OUTLETS } from "@/mock/playbook";
import { SendSteps } from "./SendSteps";

const noop = () => {};
const today = "2026-10-14";
const at = (id: string) => OUTLETS.find((o) => o.id === id)!;
const steps = (id: string) => ({ name: at(id).name, outlet: at(id), today, onCopy: noop, bioHref: "#" });

export const sendStepsStates = defineComponentStates({
  name: "SendSteps",
  group: "cards",
  status: "draft",
  flows: ["playbook-flow"],
  description:
    "Send it in four steps, under a pitch’s draft (Kate, 14 Oct), filled in from Where it goes: check it against their ask, get the extras, send it their way with a Copy on each part, mark it sent. Steps 1 to 3 are hers to tick; step 4 ticks itself when she marks it sent. Nothing is sent from here.",
  component: SendSteps,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Filled in from the draft and the outlet, both already there; nothing to wait for.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "A form — default", props: { ...steps("marketing-leaders-podcast"), words: 96, openQuestions: 3 } },
    { label: "Email to a named editor, two steps ticked", props: { ...steps("commercial-leader-quarterly"), words: 96, ticked: [1, 2] } },
    { label: "Over their limit", props: { ...steps("commercial-leader-quarterly"), words: 214, openQuestions: 1 }, states: ["error"], description: "The draft carries the same question." },
    { label: "A deadline to send before", props: { ...steps("commercial-strategy-summit"), words: 120 } },
    { label: "Nothing published — empty", props: steps("scope-and-scale"), description: "No ask published: check against recent episodes; the extras most outlets want." },
    { label: "No contact published", props: steps("field-notes") },
    { label: "Inside her company", props: steps("q1-planning-review") },
    { label: "Sent on Monday", props: { ...steps("marketing-leaders-podcast"), words: 96, ticked: [1, 2, 3], sentOn: "2026-10-12", sentTo: "The Marketing Leaders podcast (Guest form, marketingleaders.example/guests)" } },
    {
      label: "A long name wraps",
      props: { ...steps("commercial-leader-quarterly"), outlet: { ...at("commercial-leader-quarterly"), name: "Commercial Leader Quarterly and the Revenue Operations Review, Europe" } },
    },
  ],
});
