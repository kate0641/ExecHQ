import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { ACCOUNTS_COPY as AC, PRESENCE_STUB as P } from "@/mock/accounts-stub";
import { PresenceCard } from "./PresenceCard";

const toolbox = "/toolbox-flow/concept-1";
const profile = "/profile/concept-1";

const still = [
  { id: "podcast", label: "Podcast appearances", then: 1, now: 1 },
  { id: "press", label: "Press mentions", then: 2, now: 2 },
  { id: "speaking", label: "Speaking engagements", then: 1, now: 1 },
  { id: "writing", label: "Thought pieces", then: 3, now: 3 },
];

const moved = [
  { id: "podcast", label: "Podcast appearances", then: 1, now: 2, latest: "Planning as a leadership skill · The Modern CMO · 17 Oct" },
  { id: "press", label: "Press mentions", then: 2, now: 3, latest: "Quoted on planning cycles · Marketing Week · 1 Nov" },
  { id: "speaking", label: "Speaking engagements", then: 1, now: 2, latest: "Panel: planning for growth · Growth Summit · 29 Oct" },
  { id: "writing", label: "Thought pieces", then: 3, now: 4, latest: "Why I review my plan every quarter · LinkedIn article · 9 Oct" },
];

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
    "The four things she adds herself on the homepage: podcast appearances, press mentions, speaking engagements and thought pieces. One row each sets the count on the day her plan began beside the count now, and names what she added last. Never a score or a target: a count that has not moved shows the same number twice. Data stubbed until the Signal Picture in Sprint 3.",
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
      props: { ...base, rows: moved, summary: P.summary(4), tryThis: { ...P.tryThis, href: toolbox }, headingId: "pc-moved" },
    },
    {
      label: "Nothing added since the start",
      description: "The same number twice: the baseline has not moved, and the card says so.",
      props: { ...base, rows: still, summary: P.summary(0), tryThis: { ...P.tryThis, href: toolbox }, headingId: "pc-still" },
    },
    {
      label: "Nothing yet — empty",
      description: "No baseline and nothing added: what adding would show, and the way to Profile.",
      props: { name: P.name, mark: P.mark, invite: { ...P.invite, href: profile }, headingId: "pc-empty" },
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
        summary: P.summary(4),
        headingId: "pc-long",
      },
    },
  ],
});
