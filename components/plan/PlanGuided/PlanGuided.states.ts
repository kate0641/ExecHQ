import { createElement } from "react";
import { PlanAgenda } from "@/components/plan/PlanAgenda";
import { defineComponentStates } from "@/components/types";
import { stepById } from "@/mock/plan";
import { PlanGuided } from "./PlanGuided";

const noop = () => {};
const moves = ["use-story", "brief-manager", "q1-review", "scope-case"].map((id) => stepById(id)!);
const stages = [
  { title: "Say what you lead", status: "current" as const },
  { title: "Show the proof", status: "later" as const },
  { title: "Get in front of the deciders", status: "later" as const },
  { title: "Make the case", status: "later" as const },
];
const sparks = [
  { id: "s1", kind: "step" as const, label: "Your steps", text: "You put off “Add three recent accomplishments”. It comes back next week.", on: "2026-10-05" },
  { id: "s2", kind: "record" as const, label: "In ExecHQ", text: "Drafted your leadership story.", on: "2026-10-06" },
];
// The roadmap under the move: the Plan agenda, with its first step closed.
const finishing = [
  "You can describe your scope in a sentence, and your bio is ready to send.",
  "Your manager has seen your three wins, in writing.",
  "You know who decides on the role, and what they need to see from you.",
  "You’ve asked for the broader role, with your record behind you.",
];
const roadmap = createElement(PlanAgenda, {
  openFirstStep: false,
  headingId: "pg-roadmap",
  stages: stages.map((s, index) => ({ index, title: s.title, when: ["Next month", "Next month", "This quarter", "Next quarter"][index], finishing: finishing[index], status: s.status })),
  items: [
    { id: "use-story", stage: 0, title: moves[0].title, date: "2026-10-13", kind: "step", step: moves[0], accepted: true },
    { id: "brief-manager", stage: 0, title: moves[1].title, date: "2026-10-08", kind: "step", step: moves[1] },
    { id: "yours-1", stage: 0, title: "Growth Summit panel", date: "2026-10-29", kind: "yours" },
    { id: "q1-review", stage: 2, title: moves[2].title, date: "2026-10-30", kind: "step", step: moves[2] },
    { id: "scope-case", stage: 3, title: moves[3].title, date: "2027-01-11", kind: "step", step: moves[3] },
  ],
  today: "2026-10-06",
  startHref: "/toolbox-flow/concept-1",
  onAsk: noop,
  onAccept: noop,
  onComplete: noop,
  onAdd: noop,
});
const base = {
  planName: "Step up",
  stageIndex: 0,
  stages,
  moves,
  whenOf: (step: { id: string }) => (step.id === "scope-case" ? "Next quarter" : step.id === "q1-review" ? "This month" : "This week"),
  today: "2026-10-06",
  startHref: "/toolbox-flow/concept-1",
  sparks,
  onAnswer: noop,
  onTalk: noop,
  onStart: noop,
  onAdd: noop,
};

export const planGuidedStates = defineComponentStates({
  name: "PlanGuided",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "The Plan as a guided check-in, built from onboarding's own parts. A short run of pages, one move each: the page says the move and why it matters, and a drawer holds where she is with it: the way to start (which is also her answer that she is working on it), I’ll do it when it is due, talk it through (which opens the chat on the move), or not for me (which asks why, one optional tap). Answering changes her plan for real and comes back as a short reply in the serif voice, then the next move. The last page says where the plan stands. The roadmap (the Plan agenda) sits on the page under the move: the open drawer covers it, and folding the drawer shows the whole road. Adding something of her own slides up as a sheet.",
  component: PlanGuided,
  notApplicable: {
    hover: "Its controls are chips and Buttons, which show their own states.",
    focus: "Its controls are chips and Buttons, which show their own states.",
    active: "Its controls are chips and Buttons, which show their own states.",
    disabled: "Every control can always be used.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it reads her plan and records what she says.",
    filled: "Not an input: she answers by choosing, and the add sheet shows its own filled state.",
  },
  variants: [
    { label: "First move — the drawer open — default", props: base },
    { label: "The drawer folded to a peek", props: { ...base, demoFolded: true } },
    { label: "Folded, with the roadmap under the move", props: { ...base, demoFolded: true, roadmap } },
    { label: "Answered: I’ll do it — the reply, then the next move", props: { ...base, demoAnswered: { "use-story": "plan" } } },
    { label: "Answered: I’ll do it, on her plan for its time", props: { ...base, demoPage: 1, demoAnswered: { "brief-manager": "plan" } } },
    { label: "Not for me: asking why, one optional tap", props: { ...base, demoPage: 2, demoAnswered: { "q1-review": "pass" } } },
    {
      label: "Not for me: after the reason, what was offered in its place",
      props: { ...base, demoPage: 2, demoAnswered: { "q1-review": "pass" }, demoPassed: { "q1-review": "A lighter one this time. Now offered: Add three recent accomplishments." } },
    },
    {
      label: "Brought back by her stage check-in: why it is here",
      props: { ...base, heardOf: (step: { id: string }) => (step.id === "use-story" ? "You passed on this before. Worth another look?" : undefined) },
    },
    { label: "A draft is under way: the start button says keep working on it", props: { ...base, workingOn: () => true } },
    { label: "A move with no tool starts by putting it in her week", props: { ...base, moves: [stepById("add-wins")!, ...moves], demoPage: 0 } },
    { label: "The last page — where the plan stands", props: { ...base, demoPage: 4 } },
    { label: "Empty — nothing to answer right now", props: { ...base, moves: [] } },
    {
      label: "Long text wraps",
      props: {
        ...base,
        moves: [
          {
            ...moves[0],
            title: "Present the planning cycle proposal to the leadership team and take questions on headcount and budget before the offsite",
            whyLine:
              "Your manager asked you to bring this to the leadership team, and the people deciding on headcount and budget will be in the room, so it is the best chance you will have this quarter to show what you lead.",
          },
        ],
      },
    },
  ],
});
