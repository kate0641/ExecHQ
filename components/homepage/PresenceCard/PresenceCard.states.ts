import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { COUNT_COPY as AC, ADD_COPY, PRESENCE_STUB as P } from "@/mock/accounts-stub";
import { PresenceCard } from "./PresenceCard";

const toolbox = "/toolbox-flow/concept-1";
const profile = "/profile/concept-1";

const still = [
  { id: "linkedin", label: "LinkedIn followers", then: "1,247", now: "1,247" },
  { id: "podcast", label: "Podcast appearances", then: 1, now: 1 },
  { id: "press", label: "Press mentions", then: 2, now: 2 },
  { id: "speaking", label: "Speaking engagements", then: 1, now: 1 },
  { id: "writing", label: "Thought pieces", then: 3, now: 3 },
];

const moved = [
  { id: "linkedin", label: "LinkedIn followers", then: "1,247", now: "1,284" },
  { id: "podcast", label: "Podcast appearances", then: 1, now: 2, latest: "Planning as a leadership skill · The Modern CMO · 17 Oct" },
  { id: "press", label: "Press mentions", then: 2, now: 3, latest: "Quoted on planning cycles · Marketing Week · 1 Nov" },
  { id: "speaking", label: "Speaking engagements", then: 1, now: 2, latest: "Panel: planning for growth · Growth Summit · 29 Oct" },
  { id: "writing", label: "Thought pieces", then: 3, now: 4, latest: "Why I review my plan every quarter · LinkedIn article · 9 Oct" },
];

const SUMMARY = "1 podcast appearance, 1 press mention, 1 talk and 1 piece you published.";

const base = {
  name: P.name,
  mark: P.mark,
  asOf: P.asOf("5 Oct"),
  thenLabel: AC.then,
  nowLabel: AC.now,
};

export const presenceCardStates = defineComponentStates({
  name: "PresenceCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Where she started beside where she is now, in a light card. Her LinkedIn followers lead, large, with what they were and how far they have moved. The counts she adds herself sit in aligned Start and Now columns. “Added since you started” is always there, as a sentence of what she has added or a line saying nothing yet. One quiet Add button, and the suggestion is its own card. Never a score or a target: a count that has not moved shows the same number twice.",
  component: PresenceCard,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Read from the accounts stub: there is nothing to wait for.",
    error: "Read locally: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Some added — default",
      props: { ...base, rows: moved, summary: SUMMARY, onAdd: () => {}, addLabel: ADD_COPY.open, tryThis: { ...P.tryThis, href: toolbox }, headingId: "pc-moved" },
    },
    {
      label: "Nothing added since the start",
      description: "The same number twice: the baseline has not moved, and the card says so.",
      props: { ...base, rows: still, tryThis: { ...P.tryThis, href: toolbox }, headingId: "pc-still" },
    },
    {
      label: "Nothing yet — empty",
      description: "No baseline and nothing added: what adding would show, and a button that opens the add sheet.",
      props: { name: P.name, mark: P.mark, onAdd: () => {}, invite: { ...P.invite, href: profile }, headingId: "pc-empty" },
    },
    {
      label: "A long title wraps",
      props: {
        ...base,
        rows: [
          {
            ...moved[0],
            latest:
              "Why the quarterly planning review is the most underrated leadership habit I have, and what it took to make it stick · The Modern CMO with a very long show name · 17 Oct",
          },
          ...moved.slice(1),
        ],
        summary: SUMMARY,
        headingId: "pc-long",
      },
    },
  ],
});
