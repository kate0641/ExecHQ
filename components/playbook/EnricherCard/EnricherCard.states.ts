import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { ENRICHERS } from "@/mock/playbook";
import { EnricherCard } from "./EnricherCard";

const noop = () => {};
const base = { enricher: ENRICHERS.wins, onAdd: noop, onSkip: noop };

export const enricherCardStates = defineComponentStates({
  name: "EnricherCard",
  group: "cards",
  status: "draft",
  flows: ["playbook-flow"],
  description:
    "Something that would make the draft better, offered inside the flow (\"Add three recent accomplishments\"). Never a gate: Not now is as easy as adding it, and skipped, it folds away.",
  component: EnricherCard,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Adding opens its own step; the card has nothing to wait for.",
    error: "The card only offers; nothing on it can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Offered — default", props: base },
    { label: "Added", props: { ...base, state: "added", addedLine: "3 accomplishments added" } },
    { label: "Skipped — none shown", props: { ...base, state: "skipped" }, description: "Folds away entirely." },
    {
      label: "A long reason wraps",
      props: { enricher: { ...ENRICHERS.wins, why: `${ENRICHERS.wins.why} ${ENRICHERS.wins.why}` }, onAdd: noop, onSkip: noop },
    },
  ],
});
