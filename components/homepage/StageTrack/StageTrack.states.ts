import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ROADMAP } from "@/mock/plan-stub";
import { StageTrack } from "./StageTrack";

const planHref = "/plan/concept-1";
const base = { stages: ROADMAP, planName: "Step up", planHref };

export const stageTrackStates = defineComponentStates({
  name: "StageTrack",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "Where the user is on their roadmap, as a table of contents: the current stage opens up with “You are here” and what it asks now; the rest stay one line, with “Done” once passed. Future stages show their names only. Its one control is the link to the full plan.",
  component: StageTrack,
  notApplicable: {
    hover: "Its one control is the shared text link, which shows its own states under TextLink.",
    focus: "Its one control is the shared text link, which shows its own states under TextLink.",
    active: "Its one control is the shared text link, which shows its own states under TextLink.",
    disabled: "The full plan is always reachable.",
    loading: "Read from the plan stub: there is nothing to wait for.",
    error: "Read locally: nothing can fail.",
    empty: "A plan always has its four stages, and the user is always in one.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Second stage, first done — default", props: { ...base, current: 1, headingId: "st-demo-1" } },
    { label: "First stage, plan just started", props: { ...base, current: 0, headingId: "st-demo-0" } },
    { label: "Last stage, all before it done", props: { ...base, current: 3, headingId: "st-demo-3" } },
    {
      label: "Long stage names wrap",
      props: {
        ...base,
        stages: ROADMAP.map((s, i) =>
          i === 2 ? { ...s, title: "Get in front of the operating committee and the people who decide on scope" } : s
        ),
        current: 2,
       
        headingId: "st-demo-long",
      },
    },
  ],
});
