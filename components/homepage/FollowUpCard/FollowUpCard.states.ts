import { defineComponentStates } from "@/components/types";
import { HOME_STATES } from "@/mock/homepage";
import { FollowUpCard } from "./FollowUpCard";

const due = HOME_STATES["follow-up-due"];
const story = due.records.find((r) => r.id === "story")!;
const pitch = due.records.find((r) => r.id === "pitch")!;
const noop = () => {};
const about = { lead: "Confirms your short-term action", title: "Use your leadership story in your next 1:1" };

export const followUpCardStates = defineComponentStates({
  name: "FollowUpCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Asks what happened with one used artifact, naming it and when it was used, and names the ring segment it confirms. Answered in place with OutcomeCapture. One at a time: another waiting is a quiet link.",
  component: FollowUpCard,
  notApplicable: {
    hover: "Its controls are OutcomeCapture and a standard text link, which show their own states.",
    focus: "Its controls are OutcomeCapture and a standard text link, which show their own states.",
    active: "Its controls are OutcomeCapture and a standard text link, which show their own states.",
    disabled: "Only shown when a follow-up is due, and then it can always be answered.",
    loading: "Written from the local Loop: there is nothing to wait for.",
    empty: "Only shown when a follow-up is due.",
    filled: "Choosing and noting happen in OutcomeCapture, which shows its filled state.",
  },
  variants: [
    { label: "Story, used last Tuesday — default", props: { record: story, today: due.today, about, onSubmit: noop } },
    {
      label: "Another is waiting",
      props: { record: story, today: due.today, about, onSubmit: noop, another: { label: "Another is waiting: your pitch for the Q1 planning review", onShow: noop } },
    },
    { label: "Without the tracker", props: { record: story, today: due.today, onSubmit: noop, showTrack: false } },
    {
      label: "Error — saving with nothing chosen",
      props: { record: story, today: due.today, about, onSubmit: noop, captureDemo: { showError: true } },
    },
    {
      label: "A long question wraps",
      props: {
        record: pitch,
        today: due.today,
        about: { lead: "Confirms your medium-term action", title: "Put yourself forward for the Q1 planning review" },
        onSubmit: noop,
      },
    },
  ],
});
