import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { ringsFor } from "@/lib/rings";
import { HOME_STATES } from "@/mock/homepage";
import { signalById } from "@/mock/plan-stub";
import { RingDetail } from "./RingDetail";

const rings = ringsFor(HOME_STATES["follow-up-due"].records);
const [short, medium, long] = rings;
const sig = (id: string) => [signalById(id)!];

export const ringDetailStates = defineComponentStates({
  name: "RingDetail",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "What a ring holds, opened from RingsHero: each action and where it stands, then a dated timeline of what they track, each entry marked Observed (it happened in ExecHQ) or Reported (the user told us). Declined or set-aside actions are mentioned once, quietly.",
  component: RingDetail,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Drawn from the plan stub and the local Loop: there is nothing to wait for.",
    error: "Drawn locally: nothing can fail.",
    empty: "Only opened from a ring, which always has at least one action.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Short-term, part confirmed — default",
      props: { ring: short, signals: [...sig("seen-as-leader"), ...sig("decider-access")] },
    },
    { label: "Medium-term, one set aside", props: { ring: medium, signals: sig("broader-remit") } },
    { label: "Long-term, not started", props: { ring: long, signals: [] } },
    {
      label: "Long entries wrap",
      props: {
        ring: medium,
        signals: [
          {
            id: "long",
            name: "A broader remit across marketing, sales operations and the planning office",
            entries: [
              { source: "reported", text: "Your manager said the operating committee will decide who runs the Q1 planning review, and that your pitch is on the list", on: "2026-10-24" },
            ],
          },
        ],
      },
    },
  ],
});
