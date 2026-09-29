import { createElement as h } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { actionById } from "@/mock/plan-stub";
import { NextStepCard } from "./NextStepCard";

const a = actionById("brief-manager")!;
const why = { this: a.whyThis, now: a.whyNow, you: a.whyYou };
const href = "/toolbox-flow/concept-1";

export const nextStepCardStates = defineComponentStates({
  name: "NextStepCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "One action, with its why this, why now and why you as label and value rows or one sentence, and the way into its Toolbox flow (stubbed until Sprint 4). Also the just-answered hand-off, visibly marked as stubbed.",
  component: NextStepCard,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Written from the plan stub: there is nothing to wait for.",
    error: "Written from the plan stub: nothing can fail.",
    empty: "Always one action; with none, the page shows something else.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Why this, now, you — default", props: { title: a.title, why, href } },
    {
      label: "Reasons in one sentence",
      description: "Why this, why now and why you said as one line. Homepage Concept 1’s tray.",
      props: { title: a.title, whyLine: a.whyLine, href, eyebrow: "Next in short-term", headingId: "nsc-whyline" },
    },
    {
      label: "Just answered, stubbed hand-off",
      description: "After an outcome: what was logged, then the next recommendation, marked as a stand-in.",
      props: {
        title: "Build a stakeholder message map for the workstream",
        why: { now: "You said the new work needs influence across teams." },
        href,
        eyebrow: "Next",
        stubbed: true,
        lead: h("p", { className: "home-card__readback" }, "Logged. You told me: “She asked me to lead the planning workstream.”"),
      },
    },
    {
      label: "Title shown elsewhere",
      description: "For a concept that already shows the action large, e.g. inside a ring.",
      props: { title: a.title, why, href, eyebrow: "Why this one", titleHidden: true },
    },
    {
      label: "A long title wraps",
      props: { title: "Build a documented case for broader scope before the January planning cycle begins", why, href },
    },
  ],
});
