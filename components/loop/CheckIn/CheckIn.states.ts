import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { CheckIn } from "./CheckIn";

const due = HOME_STATES["follow-up-due"];
const ready = HOME_STATES["drafted-not-used"];
const answered = HOME_STATES["just-answered"];
const story = due.records.find((r) => r.id === "story")!;
const brief = ready.records.find((r) => r.id === "check-in-brief")!;
const logged = answered.records.find((r) => r.id === "story")!;
const noop = () => {};
const base = { onUsed: noop, onAnswer: noop, onNote: noop };
const used = { ...base, record: story, today: due.today, about: "Use your leadership story in your next 1:1" };
const isReady = { ...base, record: brief, today: ready.today, about: "Brief your manager before Thursday’s check-in" };
const done = { ...base, record: { ...logged, outcome: logged.outcome && { ...logged.outcome, detail: undefined } }, today: answered.today, about: "Use your leadership story in your next 1:1", answered: true, readback: "Logged. You said it went well." };

export const checkInStates = defineComponentStates({
  name: "CheckIn",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The one check-in the Loop uses everywhere. It asks for where a draft stands — “Have you used it?” when ready, “What came of it?” when used — saves an answer on one tap and offers a note after. Drawn three ways: Question first (Concept 1), Stepper (Concept 2), Conversation (Concept 3); the words are the same.",
  component: CheckIn,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Answers save to the local Loop at once: there is nothing to wait for.",
    error: "Saved locally: nothing can fail.",
    empty: "Only shown when there is something to ask about.",
  },
  variants: [
    { label: "Question first, what came of it — default", props: { ...used, layout: "question", headingId: "ci-q-used" } },
    { label: "Question first, ready to use", props: { ...isReady, layout: "question", headingId: "ci-q-ready" } },
    { label: "Question first, answered, note offered — filled", props: { ...done, layout: "question", headingId: "ci-q-done" } },
    { label: "Stepper, what came of it", props: { ...used, layout: "stepper", headingId: "ci-s-used" } },
    { label: "Stepper, ready to use", props: { ...isReady, layout: "stepper", headingId: "ci-s-ready" } },
    { label: "Stepper, answered — filled", props: { ...done, layout: "stepper", headingId: "ci-s-done" } },
    { label: "Conversation, what came of it", props: { ...used, layout: "chat", headingId: "ci-c-used" } },
    { label: "Conversation, ready to use", props: { ...isReady, layout: "chat", headingId: "ci-c-ready" } },
    {
      label: "A long action name wraps",
      props: { ...used, about: "Use your leadership story to open your next 1:1 with your manager, before the planning cycle", layout: "question", headingId: "ci-long" },
    },
  ],
});
