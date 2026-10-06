import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { decline, initialPlanState } from "@/lib/action-steps";
import { ActionSteps } from "./ActionSteps";

const today = "2026-10-20";
const startHref = "/toolbox-flow/concept-1";
const start = initialPlanState(today);

const justOne = {
  ...start,
  shown: ["use-story"],
};
const declinedPodcast = decline(
  { ...start, shown: [...start.shown.filter((id) => id !== "q1-review"), "pitch-podcast"] },
  "pitch-podcast",
  "uncomfortable-channel",
).state;

/** A question and the weekly reflection among her steps: both finish in a sheet, not the Toolbox. */
const withAnswers = {
  ...start,
  shown: ["reflect", "q-who-decides", "use-story", "sponsor-conversation", "scope-case"],
  decisions: { ...start.decisions, "use-story": { decision: "accepted" as const, on: today } },
};

export const actionStepsStates = defineComponentStates({
  name: "ActionSteps",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "The Plan’s next steps: never more than five, across three horizons (short-term up to three, medium-term one, long-term milestone one), each with its reasons. The limit shows as free places in the list, never as a count or a bar, and the swiping row draws none. A decline fills its place at once from the ranked queue, shaped by the reason given, or says why nothing did. How many she takes on is hers to say (three, four or five, or hold), and the places beyond it are not drawn. Operable: accept, decline with a reason, do later, change, mark done.",
  component: ActionSteps,
  notApplicable: {
    hover: "Its controls are the cards’ buttons, which show their own states.",
    focus: "Its controls are the cards’ buttons, which show their own states.",
    active: "Its controls are the cards’ buttons, which show their own states.",
    disabled: "Its controls are the cards’ buttons, which show their own states.",
    loading: "Written from the plan data: there is nothing to wait for.",
    error: "Written from the plan data: nothing can fail.",
    filled: NOT_AN_INPUT,
    "long text": "Titles wrap inside ActionStepCard, which shows it.",
  },
  variants: [
    { label: "Four of five places in use — default", props: { today, startHref, initial: start } },
    {
      label: "A question and the weekly reflection among her steps",
      description: "Both finish in a sheet, not the Toolbox. Answering accepts the step, files her words and offers the next. The reflection comes round at most once a week and never shows as missed.",
      props: { today, startHref, initial: withAnswers, things: ["Mon · Sent your pitch to Trade Weekly", "Fri · Quoted in Marketing Week"], headingId: "as-answers" },
    },
    {
      label: "Light capacity — three live steps",
      description: "She said she can take on three right now, so the fourth is set aside, not lost, and no free place is drawn beyond what she said.",
      props: { today, startHref, initial: start, capacity: { level: "light", hold: false }, headingId: "as-light" },
    },
    {
      label: "Holding her workload — the free places say so",
      description: "Nothing new is offered until she lifts it, and each free place says that, never a verdict.",
      props: { today, startHref, initial: justOne, capacity: { level: "full", hold: true }, headingId: "as-hold" },
    },
    {
      label: "Decline panel open on the first card",
      props: { today, startHref, initial: start, demoPanel: "decline" },
    },
    {
      label: "Empty — nothing else fits the horizon",
      description: "A decline that found nothing suitable says so in the free place.",
      props: { today, startHref, initial: justOne, demoEmpty: { medium: "nothing-suitable", long: "limit-reached" } },
    },
    {
      label: "Empty — only one step",
      props: { today, startHref, initial: justOne },
    },
    {
      label: "After a podcast decline: it is never offered again",
      description: "‘Uncomfortable channel’ avoids podcasts from here on; the replacement says so.",
      props: { today, startHref, initial: declinedPodcast },
    },
    {
      label: "Swiping row — five in one row, in order",
      description: "Concept 1: compact cards in a swipe-or-step row, short-term to long-term, with chips that jump to a horizon. A free place is not drawn.",
      props: { today, startHref, initial: start, layout: "carousel", headingId: "as-row" },
    },
    {
      label: "Swiping row — empty places are not drawn",
      description: "With only one step, the row holds only that step. There is no empty card after it.",
      props: { today, startHref, initial: justOne, layout: "carousel", headingId: "as-row-empty" },
    },
  ],
});
