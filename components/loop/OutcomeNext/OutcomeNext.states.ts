import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { AFTER_ANSWER, NEXT_STEP_COPY as C } from "@/mock/toolbox";

const BRIEF_AFTER = AFTER_ANSWER["situation-brief"];
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
const followUp = { id: "follow-up", title: "Send the follow-up email", body: "It’s in the brief. Add what you agreed and when you’ll come back to them.", action: { label: "Copy the follow-up email", onClick: noop } };
const nextOnPlan = { id: "next-on-plan", eyebrow: C.nextOnPlan.label, title: "Use your leadership story in your next 1:1", action: { label: C.nextOnPlan.action, href: "/plan/concept-3" } };
const base = { readback: BRIEF_AFTER.positive.readback, offers: [planStep, followUp], onNote: noop, onNotNow: noop, headingId: "outcome-next-demo" };

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
  },
  variants: [
    { label: "It went well: a Plan step, then the follow-up email — default", props: base },
    { label: "Writing a note", props: { ...base, noteOpen: true } },
    { label: "A note added — filled", props: { ...base, noted: "The CFO wants numbers before the offsite." } },
    { label: "Added to the Plan", props: { ...base, offers: [{ ...planStep, done: { said: C.planStep.added, link: { label: C.planStep.open, href: "/plan/concept-3" } } }, followUp] } },
    { label: "Not the way I hoped: a new brief", props: { readback: BRIEF_AFTER.negative.readback, offers: [{ id: "new-brief", title: "Prepare the next conversation", body: "A new brief for what comes next, starting from this one.", action: { label: "Start a new brief", href: "/toolbox-flow/concept-3" } }, nextOnPlan], onNotNow: noop } },
    { label: "It hasn't happened yet: next on her Plan", props: { readback: BRIEF_AFTER["no-response-yet"].readback, offers: [nextOnPlan], note: C.askAgain("situation-brief", "on Friday 30 October"), onNotNow: noop } },
    {
      label: "A pitch that went well: prepare for it",
      props: {
        readback: AFTER_ANSWER.pitch.positive.readback,
        offers: [
          { id: "start", title: "Prepare for it", body: "A brief for the talk or the episode, starting from your pitch.", action: { label: "Start a brief", href: "/toolbox-flow/concept-3" } },
          { id: "share", eyebrow: C.planStep.label, title: "Share one result with someone two levels up", body: "A booking is a result worth sharing.", action: { label: C.planStep.add, onClick: noop } },
        ],
        onNotNow: noop,
      },
    },
    { label: "Not now: folded to one line", props: { ...base, folded: true } },
    {
      label: "A long step wraps — long text",
      props: { ...base, offers: [{ ...planStep, title: "Plan your first conversation with the review’s sponsor before the planning cycle opens in January", body: C.planStep.because("Agreement that I lead the Q1 planning workstream, with a budget and a seat at the leadership offsite") }, followUp] },
    },
  ],
});
