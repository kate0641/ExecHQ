import { defineComponentStates } from "@/components/types";
import { stepById } from "@/mock/plan";
import { ActionStepCard } from "./ActionStepCard";

const noop = () => {};
const base = {
  accepted: true,
  startHref: "/toolbox-flow/concept-1",
  today: "2026-10-20",
  onAccept: noop,
  onDecline: noop,
  onDefer: noop,
  onEdit: noop,
  onComplete: noop,
};
const brief = stepById("brief-manager")!;
const ask = stepById("ask-manager-scope")!;

export const actionStepCardStates = defineComponentStates({
  name: "ActionStepCard",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "One action step on the Plan: its type and channel, the Plan area it moves, why this, why now and why you, the effort, and what counts as done. Accept, or Start once accepted, is the one primary move; doing it later, not wanting it, and changing it sit one step further. Declining takes one tap and never asks to confirm.",
  component: ActionStepCard,
  notApplicable: {
    loading: "Written from the plan data: there is nothing to wait for.",
    error: "Written from the plan data: nothing can fail.",
    empty: "A card always holds a step. A free place is shown by the ActionSteps list.",
  },
  variants: [
    { label: "Offered, timing in words — default", props: { ...base, step: ask, accepted: false, date: "2026-10-23", } },
    { label: "Accepted, on the day she chose", props: { ...base, step: brief, date: "2026-10-22", chosenDay: "2026-10-22" } },
    {
      label: "Accepted, no draft: she says when it’s done",
      props: { ...base, step: stepById("add-wins")! },
    },
    {
      label: "Medium-term, offered",
      props: { ...base, step: stepById("sponsor-conversation")!, accepted: false },
    },
    { label: "Long-term milestone", props: { ...base, step: stepById("scope-case")! } },
    {
      label: "Accepted — hover",
      states: ["hover"],
      props: { ...base, step: brief, demoState: "hover" },
    },
    {
      label: "Accepted — focus",
      states: ["focus"],
      props: { ...base, step: brief, demoState: "focus" },
    },
    {
      label: "Accepted — pressed",
      states: ["active"],
      props: { ...base, step: brief, demoState: "active" },
    },
    {
      label: "Stubbed reading step — disabled",
      description: "Read today’s Briefing waits for Sprint 4, so Start is unavailable and says why.",
      props: { ...base, step: stepById("read-briefing")! },
    },
    {
      label: "Replacement, with her answer heard",
      description: "What a decline did to the next pick, said in one line above it.",
      props: { ...base, step: stepById("sponsor-conversation")!, accepted: false, heard: "A lighter one this time." },
    },
    {
      label: "Said it was already done: record it",
      props: { ...base, step: ask, accepted: false, heard: "Add it to your record, so it counts.", offerRecord: true, onRecord: noop },
    },
    {
      label: "Not for me: reasons, one tap",
      description: "Optional reasons. Tapping one declines at once; there is no confirmation.",
      props: { ...base, step: brief, demoPanel: "decline" },
    },
    { label: "Do it later: pick a date", props: { ...base, step: brief, demoPanel: "defer" } },
    {
      label: "Change timing or scope — a day and a lighter version chosen",
      props: { ...base, step: brief, date: "2026-10-27", demoPanel: "edit", edit: { scope: "lighter" } },
    },
    {
      label: "Compact — for the swiping row, offered",
      description: "Everything on the card, nothing behind a button: the outcome, the plan area, when (in words until she chooses a day) and effort, why this, why now, why you, and what counts as done, with the link into the product as the main button.",
      props: { ...base, step: ask, accepted: false, compact: true, date: "2026-10-23", },
    },
    {
      label: "Compact — accepted, starts in its Toolbox workflow",
      props: { ...base, step: brief, compact: true, date: "2026-10-22" },
    },
    {
      label: "Compact — changing: the card is taken over by the questions",
      description: "A quiet text link opens it. It takes over the whole card, asks what she wants to do, then a few plain questions and a free-type box for her reasons.",
      props: { ...base, step: brief, compact: true, date: "2026-10-22", demoChanging: true },
    },
    {
      label: "Compact — a step with no workflow: she says it’s done",
      props: { ...base, step: stepById("add-wins")!, compact: true, date: "2026-10-23", },
    },
    {
      label: "Compact — a long title wraps",
      props: {
        ...base,
        step: { ...brief, title: "Brief your manager on the cross-functional planning workstream before Thursday’s check-in with finance and sales operations" },
        compact: true,
        date: "2026-10-22",
      },
    },
    {
      label: "A long title wraps",
      props: {
        ...base,
        step: { ...brief, title: "Brief your manager on the cross-functional planning workstream before Thursday’s check-in with finance and sales operations" },
      },
    },
  ],
});
