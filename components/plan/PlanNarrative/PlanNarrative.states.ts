import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ev } from "@/components/plan/momentum-fixtures";
import { PlanNarrative } from "./PlanNarrative";

const noop = () => {};
const e1 = ev("completed", "2026-10-30", "Use your leadership story in your next 1:1", "n1");
const e2 = ev("artifact", "2026-11-02", "Sent your pitch", "n2");
const e3 = ev("outcome", "2026-11-03", "Your pitch: it went well", "n3");
const next = { title: "Build a stakeholder message map for the workstream", stepId: "stakeholder-map" };

export const planNarrativeStates = defineComponentStates({
  name: "PlanNarrative",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "What changed, and what next: two to four plain sentences turning the windows into a reading of her situation, ending with one next best move that opens the matching action step. Every sentence has the recorded items behind it one tap away. It says what happened and what she logged, never that one thing caused another, and when history is thin it says so plainly.",
  component: PlanNarrative,
  notApplicable: {
    hover: "Its controls are a Button and disclosures, which show their own states.",
    focus: "Its controls are a Button and disclosures, which show their own states.",
    active: "Its controls are a Button and disclosures, which show their own states.",
    disabled: "Every control can always be used.",
    loading: "Written from the local record: there is nothing to wait for.",
    error: "Written from the local record: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Three sentences and a next move — default",
      props: {
        narrative: {
          lines: [
            { text: "Over the past 30 days, you completed 1 action and created or used 1 artifact and updated 1 outcome.", behind: [e1, e2, e3] },
            { text: "You added 1 thing yourself: spoke.", behind: [{ id: "n4", text: "Panel: planning for growth · Growth Summit", on: "2026-10-29" }] },
            { text: "You logged: “She asked me to lead the planning workstream.”", behind: [e3] },
          ],
          next,
        },
        onOpenStep: noop,
        headingId: "pn-default",
      },
    },
    {
      label: "First sentence open — the items behind it",
      props: {
        narrative: {
          lines: [{ text: "Over the past 30 days, you completed 1 action and created or used 1 artifact.", behind: [e1, e2] }],
          next,
        },
        demoOpen: true,
        onOpenStep: noop,
        headingId: "pn-open",
      },
    },
    {
      label: "Thin history, said plainly",
      props: {
        narrative: {
          lines: [
            { text: "You have 3 days of history, so there is not much to read yet. This fills in as you go.", behind: [] },
            { text: "In your 3 days so far, you created or used 1 artifact.", behind: [e2] },
          ],
          next,
        },
        onOpenStep: noop,
        headingId: "pn-thin",
      },
    },
    {
      label: "Empty — nothing recorded and no next move",
      props: { narrative: { lines: [] }, headingId: "pn-empty" },
    },
    {
      label: "A long next move wraps",
      props: {
        narrative: {
          lines: [{ text: "Over the past 30 days, you completed 1 action.", behind: [e1] }],
          next: { title: "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together", stepId: "x" },
        },
        onOpenStep: noop,
        headingId: "pn-long",
      },
    },
  ],
});
