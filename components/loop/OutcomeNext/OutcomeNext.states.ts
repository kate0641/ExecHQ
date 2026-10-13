import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { BRIEF_AFTER, NEXT_STEP_COPY as C } from "@/mock/toolbox";
import { OutcomeNext } from "./OutcomeNext";

const noop = () => {};
const yes = BRIEF_AFTER.positive;
const planStep = {
  id: "plan-step",
  eyebrow: C.planStep.label,
  title: "Build a stakeholder message map for the workstream",
  body: C.planStep.youSaid("They asked me to lead the Q1 planning workstream"),
  action: { label: C.planStep.add, onClick: noop },
};
const followUp = { id: "follow-up", title: C.followUp.title, body: C.followUp.body, action: { label: C.followUp.action, onClick: noop } };
const base = { readback: yes.readback, ask: yes.ask, onAsk: noop, offers: [planStep, followUp], onNotNow: noop, headingId: "outcome-next-demo" };

export const outcomeNextStates = defineComponentStates({
  name: "OutcomeNext",
  group: "cards",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "What comes after she says how something went (the Situation Brief first): her answer said back, one question more where it helps (What's the next step?), then what to do next, each with one action: the Plan step her words point to (added only when she says so), the follow-up email, a new brief, or her Plan. Not now folds it to one line.",
  component: OutcomeNext,
  notApplicable: {
    ...CONTROLS_INSIDE,
    disabled: "Every offer can always be taken or set aside.",
    loading: "Built by rules from her answer: there is nothing to wait for.",
    empty: "A step with nothing to offer shows only its line: shown as rescheduled.",
  },
  variants: [
    { label: "Yes, a next step: what is it? — default", props: base },
    { label: "Answered — filled", props: { ...base, typed: "They asked me to lead the Q1 planning workstream" }, states: ["filled"] },
    { label: "Asked with nothing typed — error", props: { ...base, startError: true } },
    { label: "What's next: a Plan step and the follow-up email", props: { ...base, asked: true } },
    { label: "Added to the Plan", props: { ...base, asked: true, offers: [{ ...planStep, done: { said: C.planStep.added, link: { label: C.planStep.open, href: "/plan/concept-3" } } }, followUp] } },
    { label: "It hasn't happened yet: rescheduled", props: { readback: BRIEF_AFTER["no-response-yet"].readback, asked: true, offers: [], note: C.rescheduled("on Friday 30 October") } },
    { label: "Not now: folded to one line", props: { ...base, folded: true } },
    {
      label: "A long step wraps — long text",
      props: { ...base, asked: true, offers: [{ ...planStep, title: "Plan your first conversation with the review’s sponsor before the planning cycle opens in January", body: C.planStep.youSaid("They asked me to come back with a plan for the workstream and a view on who else should be in the room") }, followUp] },
    },
  ],
});
