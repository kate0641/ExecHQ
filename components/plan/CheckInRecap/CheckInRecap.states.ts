import { defineComponentStates } from "@/components/types";
import { CheckInRecap } from "./CheckInRecap";

const noop = () => {};

export const checkInRecapStates = defineComponentStates({
  name: "CheckInRecap",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Her stage check-in, on the finished stage in the Plan's roadmap. Done, it reads back where she landed against what finishing looks like and how she feels about her plan, in her words, and opens the whole read-back, where she can change an answer. Put off with Later, it says what checking in is for and opens the check-in.",
  component: CheckInRecap,
  notApplicable: {
    active: "Its one control opens the check-in at once.",
    disabled: "It can always be opened.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Nothing here can fail: it only reads what she said.",
    filled: "Not an input: it reads back what she said.",
  },
  variants: [
    {
      label: "Default — her check-in, in her words",
      props: { status: "done" as const, milestone: "partly" as const, feeling: "stuck" as const, words: "Busy quarter, hard to find time.", onOpen: noop },
    },
    { label: "Done without her words", props: { status: "done" as const, milestone: "yes" as const, feeling: "more-sure" as const, onOpen: noop } },
    { label: "Empty — every question skipped", props: { status: "done" as const, onOpen: noop } },
    { label: "Put off: Check in on this stage", props: { status: "later" as const, onOpen: noop } },
    { label: "Hover", props: { status: "done" as const, milestone: "yes" as const, feeling: "same" as const, onOpen: noop, className: "is-hover" } },
    { label: "Focus", props: { status: "done" as const, milestone: "yes" as const, feeling: "same" as const, onOpen: noop, className: "is-focus" } },
    {
      label: "Long text — her words wrap",
      props: {
        status: "done" as const,
        milestone: "not-yet" as const,
        feeling: "less-sure" as const,
        words:
          "The reorganisation moved my manager to another group, so I am not sure who decides on scope now, and I would like the next stage to start with finding that out before anything else.",
        onOpen: noop,
      },
    },
  ],
});
