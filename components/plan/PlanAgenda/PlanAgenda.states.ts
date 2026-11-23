import { defineComponentStates } from "@/components/types";
import { stepById } from "@/mock/plan";
import type { AgendaItem, AgendaStage } from "./PlanAgenda";
import { PlanAgenda } from "./PlanAgenda";

const noop = () => {};
const today = "2026-10-06";
const stages: AgendaStage[] = [
  { index: 0, title: "Say what you lead", when: "Next month", finishing: "You can describe your scope in a sentence, and your bio is ready to send.", status: "current" },
  { index: 1, title: "Show the proof", when: "Next month", finishing: "Your manager has seen your three wins, in writing.", status: "later" },
  { index: 2, title: "Get in front of the deciders", when: "This quarter", finishing: "You know who decides on the role, and what they need to see from you.", status: "later" },
  { index: 3, title: "Make the case", when: "Next quarter", finishing: "You’ve asked for the broader role, with your record behind you.", status: "later" },
];
const step = (id: string, stage: number, date: string, accepted = true): AgendaItem => {
  const s = stepById(id)!;
  return { id, stage, title: s.title, date, step: s, accepted };
};
const items: AgendaItem[] = [
  step("use-story", 0, "2026-10-13"),
  step("brief-manager", 0, "2026-10-08"),
  step("add-wins", 1, "2026-10-16", false),
  step("ask-manager-scope", 1, "2026-10-27", false),
  step("q1-review", 2, "2026-10-30"),
  step("scope-case", 3, "2027-01-11"),
];
const base = { stages, items, today, startHref: "/playbook-flow/concept-3", onAsk: noop, onAccept: noop, onComplete: noop };

export const planAgendaStates = defineComponentStates({
  name: "PlanAgenda",
  group: "cards",
  feature: "Plan",
  status: "draft",
  flows: ["plan"],
  description:
    "The roadmap as an agenda: a drawer for each stage, and only the stage she is on open. In it each step is a title with a time in words; the one she is on opens to the questions she can ask about it (each opens the chat) and the way to start. What she adds herself sits in the stage it falls in, marked as hers. Only one stage is open at a time, and one step in it. The stages are overlapping cards in the stage colours. Shown under the move on Plan Concept 3.",
  component: PlanAgenda,
  notApplicable: {
    hover: "Its controls are Buttons and chips, which show their own states.",
    focus: "Its controls are Buttons and chips, which show their own states.",
    active: "Its controls are Buttons and chips, which show their own states.",
    loading: "Read from the plan data: there is nothing to wait for.",
    error: "Read from the plan data: nothing can fail.",
    filled: "Not an input: she opens moves and presses their buttons.",
  },
  variants: [
    { label: "First stage and first move open — default", props: { ...base, headingId: "pa-h-default" } },
    { label: "Another stage opened", props: { ...base, demoStage: 1, demoStep: "add-wins", headingId: "pa-h-other" } },
    { label: "Every stage closed", props: { ...base, demoStage: null, demoStep: null, headingId: "pa-h-closed" } },
    {
      label: "Disabled — a move whose tool is not designed yet",
      description: "Its button is shown but off, until that builder is designed.",
      props: {
        ...base,
        items: items.map((i, n) => (n === 0 ? { ...i, step: { ...i.step, stubbed: true } } : i)),
        demoStage: items[0]?.stage ?? 0,
        demoStep: items[0]?.id ?? null,
        headingId: "pa-disabled",
      },
    },
    { label: "Empty — nothing in the stage yet", props: { ...base, items: items.filter((i) => i.stage !== 3), demoStage: 3, demoStep: null, headingId: "pa-h-empty" } },
    {
      label: "Long text wraps",
      props: {
        ...base,
        items: [
          ...items
            .filter((i) => i.stage === 0)
            .map((i, n) => (n === 0 ? { ...i, title: "Present the planning cycle proposal to the leadership team and take questions on headcount and budget" } : i)),
        ],
        headingId: "pa-h-long",
      },
    },
    { label: "Another stage opened, deeper in", props: { ...base, demoStage: 2, demoStep: "q1-review", headingId: "pa-s-other" } },
  ],
});
