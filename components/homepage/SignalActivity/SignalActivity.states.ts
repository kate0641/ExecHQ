import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { signalActivity, windowLabel } from "@/lib/signals";
import { HOME_STATES } from "@/mock/homepage";
import { SIGNAL_COPY } from "@/mock/plan-stub";
import { SignalActivity } from "./SignalActivity";

const at = (state: keyof typeof HOME_STATES) => {
  const { records, today } = HOME_STATES[state];
  return { today, window: windowLabel(today), signals: signalActivity(records, today) };
};
const due = at("follow-up-due");
const ready = at("drafted-not-used");
const first = at("first-return");

export const signalActivityStates = defineComponentStates({
  name: "SignalActivity",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Provisional, until the Signal Picture in Sprint 3. One tracked signal and its last seven days as a dated list of facts, labelled by who can vouch for them: what ExecHQ saw is unmarked (a key says so), what the user reported is marked “Your word”, which opens how ExecHQ knows. No counts, bars or trends. With nothing in the window it shows one quiet line.",
  component: SignalActivity,
  notApplicable: {
    disabled: "“Your word” can always be opened.",
    loading: "Read from the local Loop: there is nothing to wait for.",
    error: "Read locally: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Focal, the signal the next step touches — default",
      props: {
        name: ready.signals[2].signal.name,
        entries: ready.signals[2].entries,
        eyebrow: SIGNAL_COPY.focalEyebrow,
        window: ready.window,
        tone: "focal",
        today: ready.today,
        keyLine: SIGNAL_COPY.key,
        headingLevel: 2,
        headingId: "signal-demo-focal",
      },
    },
    {
      label: "“Your word” opened",
      description: "Tapping the label says how ExecHQ knows a fact it didn’t see.",
      props: {
        name: ready.signals[0].signal.name,
        entries: ready.signals[0].entries,
        today: ready.today,
        headingId: "signal-demo-open",
        demo: { open: ready.signals[0].entries.findIndex((e) => e.source === "reported") },
      },
    },
    ...(["hover", "focus", "active"] as const).map((state) => ({
      label: `“Your word” — ${state === "active" ? "pressed" : state}`,
      props: {
        name: ready.signals[1].signal.name,
        entries: ready.signals[1].entries,
        today: ready.today,
        headingId: `signal-demo-${state}`,
        demo: { label: state },
      },
    })),
    {
      label: "Plain, seen and told",
      props: { name: ready.signals[1].signal.name, entries: ready.signals[1].entries, today: ready.today, headingId: "signal-demo-plain" },
    },
    {
      label: "In the user’s own words",
      props: { name: ready.signals[0].signal.name, entries: ready.signals[0].entries, today: ready.today, headingId: "signal-demo-quote" },
    },
    {
      label: "Nothing in the window — empty",
      props: { name: due.signals[0].signal.name, entries: [], headingId: "signal-demo-quiet" },
    },
    {
      label: "Focal, plan just started — empty",
      props: {
        name: first.signals[1].signal.name,
        entries: [],
        quiet: SIGNAL_COPY.quietStarted("today"),
        eyebrow: SIGNAL_COPY.focalEyebrow,
        window: first.window,
        tone: "focal",
        headingLevel: 2,
        headingId: "signal-demo-started",
      },
    },
    {
      label: "Long name and entries wrap",
      props: {
        name: "A broader remit across marketing, sales operations and the planning office",
        entries: [
          {
            source: "reported",
            text: "My manager said the operating committee will decide who runs the Q1 planning review, and that my pitch is on the list",
            on: "2026-10-24",
            quote: true,
          },
          { source: "observed", text: "Finished your pitch for the Q1 planning review and the cross-functional planning office", on: "2026-10-22" },
        ],
        headingId: "signal-demo-long",
      },
    },
  ],
});
