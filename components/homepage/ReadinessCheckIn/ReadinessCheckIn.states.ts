import { defineComponentStates } from "@/components/types";
import { MAYA } from "@/mock/account";
import { READINESS_HISTORY } from "@/mock/homepage";

const toward = MAYA.towardVerb;
import { ReadinessCheckIn } from "./ReadinessCheckIn";

const noop = () => {};

export const readinessCheckInStates = defineComponentStates({
  name: "ReadinessCheckIn",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The weekly check-in in Stay on track (Homepage Concept 4b, Kate, 2026-10-23, simplified 2026-10-26): one question with her direction in it, “How ready do you feel to lead a broader marketing organization?”, a slider with three answers (Not yet, Getting there, Ready) starting on her last answer, Save, and Not now as an x in the top corner. The words are 1 to 3 behind the scenes. Once answered, it reads back this week against where she started, in the same words, with her answers week by week. Feeds the enterprise dashboard’s Concept 1b.",
  component: ReadinessCheckIn,
  notApplicable: {
    disabled: "Always answerable while it is shown; it is only shown once a week.",
    loading: "Answering stores at once: there is nothing to wait for.",
    error: "Any stop is a valid answer, and Not now is always there.",
    filled: "One tap is the answer: the answered state shows it.",
      },
  variants: [
    { label: "Asking — default", props: { toward, history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop } },
    { label: "Answered Ready: a stretch step offered", props: { history: READINESS_HISTORY, answer: 3, stretch: "Put yourself forward for the Q1 planning review" } },
    { label: "Answered Ready, no stretch step: the plan stays", props: { history: READINESS_HISTORY, answer: 3 } },
    { label: "Answered Not yet: a lighter step", props: { history: READINESS_HISTORY, answer: 1 } },
    { label: "Answered Getting there: the plan stays", props: { history: READINESS_HISTORY, answer: 2 } },
    { label: "Answered, down from the start", props: { history: [2, 2, 2], answer: 1 } },
    { label: "Her first answer — empty history", props: { history: [], answer: 2 } },
    { label: "After Not now", props: { history: READINESS_HISTORY, later: true } },
    { label: "No direction yet: asks about her next move", props: { history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop } },
    {
      label: "Long text: a long direction wraps",
      props: { toward: "move from leading regional sales teams to running a global commercial organization", history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop },
    },
    { label: "Hover, on the slider", props: { toward, history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "hover" } },
    { label: "Focus, on the slider", props: { toward, history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "focus" } },
    { label: "Pressed, on the slider", props: { toward, history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "active" } },
  ],
});
