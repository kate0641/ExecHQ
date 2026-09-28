import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { DestinationStub } from "./DestinationStub";

export const destinationStubStates = defineComponentStates({
  name: "DestinationStub",
  group: "layout",
  status: "draft",
  flows: ["plan", "toolbox", "daily-briefing"],
  description:
    "A signed-in destination a later sprint designs. A heading and one line, so the navigation is reviewed against pages that look intentional, without committing that sprint to a layout.",
  component: DestinationStub,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always has its heading and line, from the manifest.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Plan",
      props: {
        heading: "Your plan",
        body: "Where your plan will live: the road ahead, what’s next on it, and what you’ve done so far.",
        sprint: 3,
      },
    },
    {
      label: "Long text wraps",
      description: "On mobile, a longer line wraps under the heading.",
      props: {
        heading: "Briefing",
        body: "Where your daily read will live: three things worth your time, and why each one matters, from the publishers you choose.",
        sprint: 4,
      },
    },
  ],
});
