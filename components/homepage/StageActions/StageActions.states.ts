import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { HOME_STATES } from "@/mock/homepage";
import { ACTIONS } from "@/mock/plan-stub";
import { StageActions } from "./StageActions";

const itemsAt = (state: keyof typeof HOME_STATES, skip: string) =>
  ACTIONS.filter((a) => a.status === "accepted" && a.id !== skip).map((action) => ({
    action,
    record: HOME_STATES[state].records.find((r) => r.id === action.artifactId),
  }));

export const stageActionsStates = defineComponentStates({
  name: "StageActions",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The current stage’s other live actions, each with its horizon and its work’s Loop status, or “Not started”. Accepted actions only; declined and deferred ones never reach it.",
  component: StageActions,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Read from the plan stub and the local Loop: there is nothing to wait for.",
    error: "Read locally: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Mid-stage, work moving — default", props: { heading: "Also in Show the proof", items: itemsAt("follow-up-due", "use-story"), headingId: "sa-demo-1" } },
    { label: "Plan just started, nothing begun", props: { heading: "Also in Say what you lead", items: itemsAt("first-return", "use-story"), headingId: "sa-demo-0" } },
    { label: "Most of it done", props: { heading: "Also in Show the proof", items: itemsAt("nothing-pending", "scope-case"), headingId: "sa-demo-2" } },
    { label: "Only the focal action — empty", props: { heading: "Also in Show the proof", items: [], headingId: "sa-demo-empty" } },
    {
      label: "Long titles wrap",
      props: {
        heading: "Also in Get in front of the deciders",
        items: [{ action: { ...ACTIONS[3], title: "Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance" } }],
        headingId: "sa-demo-long",
      },
    },
  ],
});
