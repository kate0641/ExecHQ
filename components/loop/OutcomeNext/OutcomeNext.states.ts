import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEF_AFTER, NEXT_STEP_COPY as C } from "@/mock/toolbox";
import { OutcomeNext } from "./OutcomeNext";

const noop = () => {};
const goal = "Agreement that I lead the Q1 planning workstream";
const planStep = {
  id: "plan-step",
  eyebrow: C.planStep.label,
  title: "Build a stakeholder message map for the workstream",
  body: C.planStep.because(goal),
  action: { label: C.planStep.add, onClick: noop },
};
const followUp = { id: "follow-up", title: C.followUp.title, body: C.followUp.body, action: { label: C.followUp.action, onClick: noop } };
const nextOnPlan = { id: "next-on-plan", eyebrow: C.nextOnPlan.label, title: "Use your leadership story in your next 1:1", action: { label: C.nextOnPlan.action, href: "/plan/concept-3" } };
const base = { readback: BRIEF_AFTER.positive.readback, offers: [planStep, followUp], onNotNow: noop, headingId: "outcome-next-demo" };

export const outcomeNextStates = defineComponentStates({
  name: "OutcomeNext",
  group: "cards",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "What comes after she says how something went (the Situation Brief first). Her one-tap answer is all the feedback: ExecHQ asks nothing more, says it back, and gives the next step whatever it was, each with one action: a Plan step from the work's own goal (added only when she says so), the follow-up email, a new brief, or what's next on her Plan. Not now folds it to one line.",
  component: OutcomeNext,
  notApplicable: {
    ...CONTROLS_INSIDE,
    disabled: "Every offer can always be taken or set aside.",
    loading: "Built by rules from her answer: there is nothing to wait for.",
    error: "Nothing here can fail: each offer is a link, a copy or an add to her Plan.",
    empty: "There is always a next step.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "It went well: a Plan step, then the follow-up email — default", props: base },
    { label: "Added to the Plan", props: { ...base, offers: [{ ...planStep, done: { said: C.planStep.added, link: { label: C.planStep.open, href: "/plan/concept-3" } } }, followUp] } },
    { label: "Not the way I hoped: a new brief", props: { readback: BRIEF_AFTER.negative.readback, offers: [{ id: "new-brief", title: C.newBrief.title, body: C.newBrief.body, action: { label: C.newBrief.action, href: "/toolbox-flow/concept-1" } }, nextOnPlan], onNotNow: noop } },
    { label: "It hasn't happened yet: next on her Plan", props: { readback: BRIEF_AFTER["no-response-yet"].readback, offers: [nextOnPlan], note: C.askAgain("on Friday 30 October"), onNotNow: noop } },
    { label: "Not now: folded to one line", props: { ...base, folded: true } },
    {
      label: "A long step wraps — long text",
      props: { ...base, offers: [{ ...planStep, title: "Plan your first conversation with the review’s sponsor before the planning cycle opens in January", body: C.planStep.because("Agreement that I lead the Q1 planning workstream, with a budget and a seat at the leadership offsite") }, followUp] },
    },
  ],
});
