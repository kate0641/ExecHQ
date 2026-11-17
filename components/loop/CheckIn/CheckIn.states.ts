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
const done = { ...base, record: { ...logged, outcome: logged.outcome && { ...logged.outcome, detail: undefined } }, today: answered.today, about: "Use your leadership story in your next 1:1", answered: true, readback: "You said it went well.", logged: true, readbackLead: "You told me:" };

export const checkInStates = defineComponentStates({
  name: "CheckIn",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The one check-in the Loop uses everywhere. It asks for where a draft stands — “Have you used it?” when ready, “How did it go?” when used — or, for a Plan action with no draft, “Have you done this yet?”; it saves an answer on one tap and offers a note after.",
  component: CheckIn,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Answers save to the local Loop at once: there is nothing to wait for.",
    error: "Saved locally: nothing can fail.",
    empty: "Only shown when there is something to ask about.",
  },
  variants: [
    { label: "How it went — default", props: { ...used, headingId: "ci-q-used" } },
    { label: "Ready to use", props: { ...isReady, headingId: "ci-q-ready" } },
    { label: "Answered, note offered — filled", props: { ...done, headingId: "ci-q-done" } },
    { label: "Answered, but she asked to be reminded — no Logged pill", description: "Only an outcome she gave is logged; a \u201ccheck back later\u201d has no pill.", props: { ...done, logged: false, readback: "No problem. I\u2019ll check in again in a couple of days.", headingId: "ci-q-later" } },
    {
      label: "An action with no draft",
      description: "“Have you done this yet?” — done on her word, it fills its ring and counts toward its stage.",
      props: { ...base, task: {}, today: due.today, about: "Build a documented case for broader scope", headingId: "ci-t-todo" },
    },
    {
      label: "Action done, how it went",
      props: { ...base, task: { doneOn: due.today }, today: due.today, about: "Build a documented case for broader scope", headingId: "ci-t-done" },
    },
    {
      label: "A long action name wraps",
      props: { ...used, about: "Use your leadership story to open your next 1:1 with your manager, before the planning cycle", headingId: "ci-long" },
    },
  ],
});
