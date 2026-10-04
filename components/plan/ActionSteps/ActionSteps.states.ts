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

export const actionStepsStates = defineComponentStates({
  name: "ActionSteps",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "The Plan’s next steps: never more than five, across three horizons (short-term up to three, medium-term one, long-term milestone one), each with its reasons. The limit shows as a count and as free places, never a bar. A decline fills its place at once from the ranked queue, shaped by the reason given, or says why nothing did. Operable: accept, decline with a reason, do later, change, mark done.",
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
      description: "Concept 1: compact cards in a swipe-or-step row, short-term to long-term, with chips that jump to a horizon and the free place at the end.",
      props: { today, startHref, initial: start, layout: "carousel", headingId: "as-row" },
    },
    {
      label: "Swiping row — empty, a place is free",
      props: { today, startHref, initial: justOne, layout: "carousel", demoEmpty: { medium: "nothing-suitable" }, headingId: "as-row-empty" },
    },
  ],
});
