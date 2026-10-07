import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, NOT_INTERACTIVE } from "@/components/not-applicable";
import { COUNT_COPY as AC } from "@/mock/accounts-stub";
import { BaselineList } from "./BaselineList";

const moved = [
  { id: "podcast", label: "Podcast appearances", then: 1, now: 2, latest: "Planning as a leadership skill · The Modern CMO · 17 Oct" },
  { id: "press", label: "Press mentions", then: 2, now: 3, latest: "Quoted on planning cycles · Marketing Week · 1 Nov" },
  { id: "speaking", label: "Speaking engagements", then: 1, now: 2, latest: "Panel: planning for growth · Growth Summit · 29 Oct" },
  { id: "writing", label: "Thought pieces", then: 3, now: 4, latest: "Why I review my plan every quarter · LinkedIn article · 9 Oct" },
];

const base = { thenLabel: AC.then, nowLabel: AC.now };

export const baselineListStates = defineComponentStates({
  name: "BaselineList",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Where she started beside where she is now, one row per signal, on Homepage Concepts 2 and 3. The start is always on view, and a value that has not moved shows the same number twice. Her own record, so never a score or a target.",
  component: BaselineList,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...CONTENT_INSIDE,
    loading: "Read from the accounts stub: there is nothing to wait for.",
    empty: "A row is only shown for a signal she has brought in; with none, the section does not show the list.",
  },
  variants: [
    { label: "Moved — default", props: { ...base, rows: moved } },
    {
      label: "Not moved",
      description: "The same number twice: the baseline has not changed, and the list says so.",
      props: { ...base, rows: moved.map((r) => ({ ...r, now: r.then, latest: undefined })) },
    },
    {
      label: "Accounts with text values",
      props: {
        ...base,
        rows: [
          { id: "linkedin", label: "LinkedIn followers", then: "1,247", now: "1,284" },
          { id: "website", label: "Website mentions of leading a team", then: "0", now: "0", latest: "Unchanged since you started" },
        ],
      },
    },
    {
      label: "Latest is a link",
      description: "She gave a link, so the latest one is one too, and says it opens in a new tab.",
      props: {
        ...base,
        rows: [{ ...moved[0], latestHref: "https://example.com/episode-212" }, moved[1]],
      },
    },
    {
      label: "A long label and title wrap",
      props: {
        ...base,
        rows: [
          {
            id: "long",
            label: "Speaking engagements at industry conferences and internal events",
            then: 1,
            now: 2,
            latest: "Why the quarterly planning review is the most underrated leadership habit I have, and what it took to make it stick · 17 Oct",
          },
        ],
      },
    },
  ],
});
