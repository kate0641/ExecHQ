import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import type { PlanSpark, TimelineSparks } from "@/lib/plan-sparks";
import { CALENDAR_SEED, SPARK_NOTES as N } from "@/mock/plan";
import { RoadmapTimeline } from "./RoadmapTimeline";

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

const spark = (id: string, kind: PlanSpark["kind"], text: string, on = "2026-10-12"): PlanSpark => ({
  id,
  kind,
  label: N.labels[kind],
  text,
  on,
});
const empty = (n: number) => Array.from({ length: n }, () => [] as PlanSpark[]);
const sparks = (byStage: PlanSpark[][], afterEarlier: PlanSpark[][] = []): TimelineSparks => ({ byStage, afterEarlier });

export const roadmapTimelineStates = defineComponentStates({
  name: "RoadmapTimeline",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "The roadmap as a timeline: the draft she started with, stage by stage down a rail, with little sparks that say what happened and how her plan moved with her. The stage she is in is open and the rest are one tap away. Times are words, never days, and a stage's pace is a suggestion that moves as she does. She can finish a stage whenever she likes, and when her work says she has, it offers to mark it. Finishing recommends the next stage; she starts it or says “Not yet”. A plan she has left stays above as the draft she began with, with a spark where it changed.",
  component: RoadmapTimeline,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Read from the plan data: there is nothing to wait for.",
    error: "Read from the plan data: nothing can fail.",
    filled: "Not an input, so there is nothing to fill in.",
  },
  variants: [
    { label: "Step up, in stage one — default, no sparks yet", props: { ...base, headingId: "rt-default" } },
    {
      label: "Sparks on the stage she is in",
      description: "A step finished, a step passed on, something recorded: what happened and how the plan moved, never why.",
      props: {
        ...base,
        sparks: sparks([
          [
            spark("a", "step", N.completed("Use your leadership story in your next 1:1")),
            spark("b", "step", N.declined("Post about the planning cycle"), "2026-10-14"),
            spark("c", "record", N.recorded("Drafted Your leadership story"), "2026-10-16"),
          ],
          ...empty(3),
        ]),
        headingId: "rt-sparks",
      },
    },
    {
      label: "More sparks than fit: the rest fold away",
      props: {
        ...base,
        sparks: sparks([
          [
            spark("a", "step", N.completed("Use your leadership story in your next 1:1")),
            spark("b", "step", N.declined("Post about the planning cycle")),
            spark("c", "record", N.recorded("Drafted Your leadership story")),
            spark("d", "signal", N.added("a podcast")),
            spark("e", "step", N.deferred("Brief your manager", "Next month")),
          ],
          ...empty(3),
        ]),
        headingId: "rt-many",
      },
    },
    {
      label: "Her work says she has finished the stage",
      description: "It offers to mark the stage finished, and “Not yet” is as easy as agreeing.",
      props: { ...base, startStage: 0, evidenceStage: 1, headingId: "rt-suggest" },
    },
    {
      label: "Finished early: the next stage is recommended",
      description: "Finishing on the 20th pulls the later stages earlier, and a spark says so.",
      props: {
        ...base,
        choices: { ...choices, confirmed: 0, finishedOn: { 0: "2026-10-20" }, recommended: 1 },
        onChoices: noop,
        sparks: sparks([[spark("f", "stage", N.finished("Say what you lead", -1, "Show the proof"), "2026-10-20")], ...empty(3)]),
        headingId: "rt-next",
      },
    },
    {
      label: "Not yet: the next stage stays marked",
      props: {
        ...base,
        choices: { ...choices, confirmed: 0, finishedOn: { 0: "2026-10-20" }, recommended: 1, nextDismissed: true },
        onChoices: noop,
        headingId: "rt-notyet",
      },
    },
    {
      label: "Past the suggested pace",
      description: "Said plainly, never as a failing, and a spark says the later stages moved back.",
      props: {
        ...base,
        today: "2026-11-20",
        sparks: sparks([[spark("p", "pace", N.pastPace, "2026-11-20")], ...empty(3)]),
        headingId: "rt-past",
      },
    },
    {
      label: "The last stage: the plan keeps going",
      props: {
        ...base,
        today: "2027-01-15",
        choices: { ...choices, confirmed: 3, finishedOn: { 0: "2026-10-29", 1: "2026-11-25", 2: "2026-12-20", 3: "2027-01-12" }, recommended: null },
        onChoices: noop,
        headingId: "rt-last",
      },
    },
    {
      label: "Her plan steps inside the stages",
      description: "A step says when in words, and is marked Suggested until she accepts it or moves it.",
      props: {
        ...base,
        steps: [
          { id: "brief-manager", title: "Brief your manager before Thursday’s check-in", date: "2026-10-22", suggested: false },
          { id: "ask-manager-scope", title: "Ask your manager what broader scope means to them", date: "2026-10-23", suggested: true },
          { id: "scope-case", title: "Build a documented case for broader scope", date: "2027-01-11", suggested: true },
        ],
        headingId: "rt-steps",
      },
    },
    { label: "Empty — nothing on her calendar", props: { ...base, items: [], headingId: "rt-empty" } },
    {
      label: "After a direction change: the first draft stays above, with a spark where it changed",
      description: "The plan she left is kept in brief as the draft she started with; the new plan carries on beneath it.",
      props: {
        ...base,
        planId: "executive-presence",
        startedOn: "2026-10-20",
        choices: {
          planId: "executive-presence",
          startedOn: "2026-10-20",
          snoozedAt: null,
          history: [{ planId: "leadership-scope", startedOn: "2026-10-05", endedOn: "2026-10-20", atStage: 1 }],
          directionEdits: [{ on: "2026-10-20", switched: true }],
        },
        onChoices: noop,
        sparks: sparks(empty(4), [[spark("d", "direction", N.directionMoved("Step up", "Build your executive presence"), "2026-10-20")]]),
        headingId: "rt-switched",
      },
    },
    {
      label: "A direction change that kept the plan",
      props: {
        ...base,
        sparks: sparks([[spark("k", "direction", N.directionKept, "2026-10-18")], ...empty(3)]),
        headingId: "rt-kept",
      },
    },
    {
      label: "A long reason wraps",
      props: {
        ...base,
        rationale:
          "You said you want a larger organization and a broader remit, that you are two levels below the people who decide, that the planning cycle starts next month, and that your manager has never seen your results written down, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
        headingId: "rt-long",
      },
    },
  ],
});
