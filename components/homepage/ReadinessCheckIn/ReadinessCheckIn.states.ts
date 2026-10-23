import { defineComponentStates } from "@/components/types";
import { READINESS_HISTORY } from "@/mock/homepage";
import { ReadinessCheckIn } from "./ReadinessCheckIn";

const noop = () => {};

export const readinessCheckInStates = defineComponentStates({
  name: "ReadinessCheckIn",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The weekly check-in in Stay on track (Homepage Concept 4b, Kate, 2026-10-23): “How ready do you feel for your next step?”, five answers in one tap and Not now. The line under it says her answer counts only in her organisation’s totals. Once answered, it reads back this week against where she started, with her answers week by week. Feeds the enterprise dashboard’s Concept 1b.",
  component: ReadinessCheckIn,
  notApplicable: {
    disabled: "Always answerable while it is shown; it is only shown once a week.",
    loading: "Answering stores at once: there is nothing to wait for.",
    error: "Any of the five is a valid answer, and Not now is always there.",
    filled: "One tap is the answer: the answered state shows it.",
    "long text": "Its words are fixed: the question, two scale ends and one line.",
  },
  variants: [
    { label: "Asking — default", props: { history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop } },
    { label: "Answered, up from the start", props: { history: READINESS_HISTORY, answer: 4 } },
    { label: "Answered, the same as the start", props: { history: READINESS_HISTORY, answer: 3 } },
    { label: "Answered, down from the start", props: { history: READINESS_HISTORY, answer: 2 } },
    { label: "Her first answer — empty history", props: { history: [], answer: 3 } },
    { label: "Not now", props: { history: READINESS_HISTORY, later: true } },
    { label: "Hover, on 3", props: { history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "hover" } },
    { label: "Focus, on 3", props: { history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "focus" } },
    { label: "Pressed, on 3", props: { history: READINESS_HISTORY, onAnswer: noop, onNotNow: noop, demo: "active" } },
  ],
});
