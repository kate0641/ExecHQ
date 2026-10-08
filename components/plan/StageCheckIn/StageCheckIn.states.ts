import { defineComponentStates } from "@/components/types";
import type { CheckInItem } from "./StageCheckIn";
import { StageCheckIn } from "./StageCheckIn";

const noop = () => {};
const items: CheckInItem[] = [
  { id: "use-story", from: "execHQ", title: "Your leadership story", what: "Used 13 Oct", asksTone: true },
  {
    id: "add-wins",
    from: "step",
    title: "Add three recent accomplishments",
    what: "Done 9 Oct",
    feedback: { tone: "positive", words: "My manager used two of them in her own update." },
    asksTone: true,
  },
  { id: "added-1", from: "you", title: "Planning as a leadership skill · The Modern CMO", what: "Added 17 Oct", asksTone: false },
  { id: "cross-functional", from: "step", title: "Identify a cross-functional initiative", what: "", passed: true, asksTone: false },
];
const reported = items.map((i) => (i.passed || i.feedback ? i : { ...i, feedback: { tone: i.asksTone ? ("neutral" as const) : undefined, words: "Good conversation. She wants to see it in writing." } }));
const base = {
  stageIndex: 0,
  stageCount: 4,
  stageTitle: "Say what you lead",
  milestone: "You can describe your scope in a sentence, and your bio is ready to send.",
  nextStageTitle: "Show the proof",
  items,
  onReport: noop,
  onSave: noop,
  onLater: noop,
  onContinue: noop,
};

export const stageCheckInStates = defineComponentStates({
  name: "StageCheckIn",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "The stage check-in in Plan Concept 3. ExecHQ decides a stage is finished, from her work, and opens this in place of the moves: what she did in the stage, with what she has already said and a mark on what she has not; one page for each thing not yet reported (how it went and her words, kept on the thing itself, as What came of it? does); whether she got what finishing looks like; how she feels about her plan now; then a read-back in her words. Every page can be skipped, and Later puts the whole check-in off.",
  component: StageCheckIn,
  notApplicable: {
    hover: "Its controls are chips, fields and Buttons, which show their own states.",
    focus: "Its controls are chips, fields and Buttons, which show their own states.",
    active: "Its controls are chips, fields and Buttons, which show their own states.",
    disabled: "Next waits for an answer; Skip is always there. The Button shows its own disabled state.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: every answer is optional.",
  },
  variants: [
    { label: "What you did — default, two things unreported", props: base },
    { label: "Folded to a peek", props: { ...base, demoFolded: true } },
    { label: "What came of it? — something ExecHQ made with her", props: { ...base, demoPage: 1 } },
    { label: "What came of it? — something she added, her words only", props: { ...base, demoPage: 2 } },
    { label: "Did you get what finishing looks like?", props: { ...base, demoPage: 3, demoAnswers: { milestone: "partly" as const } } },
    { label: "How are you feeling about your plan now?", props: { ...base, demoPage: 4, demoAnswers: { milestone: "partly" as const, feeling: "more-sure" as const } } },
    {
      label: "Filled — the read-back, in her words",
      props: { ...base, items: reported, demoPage: 3, demoAnswers: { milestone: "yes" as const, feeling: "more-sure" as const, words: "Clearer on what I lead than I was a month ago." } },
    },
    {
      label: "The read-back when she is stuck: what comes next starts smaller",
      props: { ...base, demoPage: 5, demoAnswers: { milestone: "not-yet" as const, feeling: "stuck" as const, words: "Busy quarter, hard to find time." } },
    },
    { label: "Everything already reported: straight to how the stage went", props: { ...base, items: reported } },
    { label: "Empty — nothing from the stage in ExecHQ", props: { ...base, items: [] } },
    {
      label: "Long text wraps",
      props: {
        ...base,
        stageTitle: "Get in front of the people who decide on the broader role",
        items: [{ ...items[0], title: "Your pitch for the Q1 planning review, with the case for running the cross-functional workstream" }, ...items.slice(1)],
      },
    },
  ],
});
