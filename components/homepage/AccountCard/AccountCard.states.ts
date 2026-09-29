import { createElement as h } from "react";
import { TrendLine } from "@/components/homepage/TrendLine";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { LINKEDIN_STUB as L, WEBSITE_STUB as W } from "@/mock/accounts-stub";
import { AccountCard } from "./AccountCard";

const toolbox = "/toolbox-flow/concept-1";
const profile = "/profile/concept-1";
const linkedIn = {
  name: L.name,
  mark: L.mark,
  asOf: "Uploaded 18 Oct",
  stats: L.stats,
  chart: h(TrendLine, {
    values: L.followers,
    labels: L.followers.map((_, i) => `Week ${i + 1}`),
    caption: L.chartCaption,
    summary: L.chartSummary,
  }),
  says: L.says,
  tryThis: { ...L.tryThis, href: toolbox },
};

export const accountCardStates = defineComponentStates({
  name: "AccountCard",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "One connected account on Homepage Concept 2: source and date, three headline numbers, a chart, what they suggest, and one thing to try. Not connected, it says what connecting would show and links to Profile. Its own section, never the next-step card; says what changed, never why. Data stubbed until the Signal Picture in Sprint 3.",
  component: AccountCard,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Read from the accounts stub: there is nothing to wait for.",
    error: "Read locally: nothing can fail. A failed upload belongs to Profile’s connection flow.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "LinkedIn, connected — default", props: { ...linkedIn, headingId: "ac-li" } },
    {
      label: "Website, connected, no chart",
      props: { name: W.name, mark: W.mark, asOf: "Read 12 Oct", stats: W.stats, says: W.says, tryThis: { ...W.tryThis, href: toolbox }, headingId: "ac-web" },
    },
    {
      label: "LinkedIn, not connected — empty",
      description: "What connecting would show, and the way to Profile, where connections live.",
      props: { name: L.name, mark: L.mark, invite: { ...L.invite, href: profile }, headingId: "ac-li-off" },
    },
    {
      label: "A long finding wraps",
      props: {
        ...linkedIn,
        says: "Your audience is mostly peers in marketing and agencies. The planning post reached twice as many directors and above as your usual posts, and most of them work in software and consumer goods.",
        headingId: "ac-long",
      },
    },
  ],
});
