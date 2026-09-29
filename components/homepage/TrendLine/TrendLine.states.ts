import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LINKEDIN_STUB as L } from "@/mock/accounts-stub";
import { TrendLine } from "./TrendLine";

const labels = L.followers.map((_, i) => `Week ${i + 1}`);
const base = { values: L.followers, labels, caption: L.chartCaption, summary: L.chartSummary };

export const trendLineStates = defineComponentStates({
  name: "TrendLine",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "A single-series trend from a connected account: a line over a faint area, the latest value marked, and a crosshair with a readout on hover. The caption names it; the summary reads the change out. Says what changed, never why.",
  component: TrendLine,
  notApplicable: {
    focus: "Not focusable: the summary carries the whole trend for keyboard and screen reader users.",
    active: "Nothing to press: hovering only reads a point out.",
    disabled: "A chart is never switched off.",
    loading: "Drawn from the accounts stub: there is nothing to wait for.",
    error: "Drawn locally: nothing can fail.",
    empty: "Only drawn when the account has a series; with none, the card leaves it out.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Followers, 90 days — default", props: base },
    { label: "Hover, a week read out", props: { ...base, demoIndex: 8 } },
    {
      label: "A long caption wraps",
      props: { ...base, caption: "Followers, counted weekly from your LinkedIn analytics export, over the last 90 days" },
    },
  ],
});
