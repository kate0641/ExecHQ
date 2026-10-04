import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { CALENDAR_SEED } from "@/mock/plan";
import { RoadmapAgenda } from "./RoadmapAgenda";

const base = {
  planId: "leadership-scope",
  startedOn: "2026-10-05",
  today: "2026-10-20",
  rationale:
    "You said you want a larger organization and a broader remit, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
  evidenceStage: 0,
  items: CALENDAR_SEED,
};
const choices = { planId: "leadership-scope", startedOn: "2026-10-05", snoozedAt: null, history: [] };
const noop = () => {};

export const roadmapAgendaStates = defineComponentStates({
  name: "RoadmapAgenda",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "The roadmap as an Agenda: the stages stacked as cards, each with its suggested period, what finishing looks like, and what she has on her calendar inside it. The stage she is in is open and the rest are one tap away. Periods are a suggested pace that moves as she does, never a deadline. She can finish a stage whenever she likes, and when her work says she has, it offers to mark it. Finishing recommends the next stage; she starts it or says “Not yet”. Nothing advances on its own.",
  component: RoadmapAgenda,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Read from the plan data: there is nothing to wait for.",
    error: "Read from the plan data: nothing can fail.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "Step up, in stage one — default", props: { ...base, headingId: "ra-default" } },
    {
      label: "Her work says she has finished the stage",
      description: "It offers to mark the stage finished, and “Not yet” is as easy as agreeing.",
      props: { ...base, startStage: 0, evidenceStage: 1, headingId: "ra-suggest" },
    },
    {
      label: "Finished early: the next stage is recommended",
      description: "Finishing on the 20th pulls the later windows earlier.",
      props: {
        ...base,
        choices: { ...choices, confirmed: 0, finishedOn: { 0: "2026-10-20" }, recommended: 1 },
        onChoices: noop,
        headingId: "ra-next",
      },
    },
    {
      label: "Not yet: the next stage stays marked",
      props: {
        ...base,
        choices: { ...choices, confirmed: 0, finishedOn: { 0: "2026-10-20" }, recommended: 1, nextDismissed: true },
        onChoices: noop,
        headingId: "ra-notyet",
      },
    },
    {
      label: "Past the suggested pace",
      description: "Said plainly, and never as a failing.",
      props: { ...base, today: "2026-11-20", headingId: "ra-past" },
    },
    {
      label: "The last stage: the plan keeps going",
      props: {
        ...base,
        today: "2027-01-15",
        choices: { ...choices, confirmed: 3, finishedOn: { 0: "2026-10-29", 1: "2026-11-25", 2: "2026-12-20", 3: "2027-01-12" }, recommended: null },
        onChoices: noop,
        headingId: "ra-last",
      },
    },
    {
      label: "Her plan steps inside the stages",
      description: "A step is marked Suggested until she accepts it or moves it to a day.",
      props: {
        ...base,
        steps: [
          { id: "brief-manager", title: "Brief your manager before Thursday’s check-in", date: "2026-10-22", suggested: false },
          { id: "ask-manager-scope", title: "Ask your manager what broader scope means to them", date: "2026-10-23", suggested: true },
          { id: "scope-case", title: "Build a documented case for broader scope", date: "2027-01-11", suggested: true },
        ],
        headingId: "ra-steps",
      },
    },
    { label: "Empty — nothing on her calendar", props: { ...base, items: [], headingId: "ra-empty" } },
    {
      label: "Something outside every window",
      props: { ...base, items: [...CALENDAR_SEED, { id: "far", title: "Annual leadership offsite", date: "2027-03-02" }], headingId: "ra-outside" },
    },
    { label: "Change plan — current plan disabled", props: { ...base, demoOpen: "switch", headingId: "ra-switch" } },
    { label: "Change plan — new plan chosen", props: { ...base, demoOpen: "confirm", headingId: "ra-confirm" } },
    {
      label: "After a switch: the earlier plan stays in her history",
      props: {
        ...base,
        planId: "executive-presence",
        startedOn: "2026-10-20",
        demoHistory: [{ planId: "leadership-scope", startedOn: "2026-10-05", endedOn: "2026-10-20", atStage: 0 }],
        headingId: "ra-history",
      },
    },
    {
      label: "A long reason wraps",
      props: {
        ...base,
        rationale:
          "You said you want a larger organization and a broader remit, that you are two levels below the people who decide, that the planning cycle starts next month, and that your manager has never seen your results written down, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
        headingId: "ra-long",
      },
    },
  ],
});
