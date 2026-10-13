import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { ENRICHERS, TL_INPUTS_FROM_BRIEFING, TL_MAYA_ANSWERS } from "@/mock/toolbox";
import { EnricherCard } from "@/components/toolbox/EnricherCard";
import { InputPanel } from "./InputPanel";

const noop = () => {};
const base = { inputs: TL_INPUTS_FROM_BRIEFING, values: {}, onChange: noop, onWrite: noop };
const enricher = createElement(EnricherCard, { enricher: ENRICHERS.wins, onAdd: noop, onSkip: noop });

export const inputPanelStates = defineComponentStates({
  name: "InputPanel",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "What a tool needs before its first draft, and nothing more. What ExecHQ already knows arrives filled in, says where it came from, and can be changed with Edit; only what only she can answer is asked. An enricher can be offered, but never blocks the draft.",
  component: InputPanel,
  notApplicable: {
    ...CONTROLS_INSIDE,
    empty: "A tool always knows something already: at least her direction.",
  },
  variants: [
    { label: "From today's Briefing — default", props: base },
    { label: "Her point of view answered — filled", props: { ...base, values: TL_MAYA_ANSWERS } },
    { label: "With an enricher offered", props: { ...base, values: TL_MAYA_ANSWERS, enricher } },
    { label: "Write pressed, point of view missing — error", props: { ...base, showErrors: true } },
    { label: "Writing the first draft — loading", props: { ...base, values: TL_MAYA_ANSWERS, writing: true } },
    { label: "Optional questions folded away (Concept 2)", props: { ...base, collapseOptional: true }, description: "Only what she must answer shows first; \"Add more detail\" opens the rest." },
    { label: "Optional questions opened (Concept 2)", props: { ...base, collapseOptional: true, startExpanded: true } },
    { label: "Compact (Concept 1's last step)", props: { ...base, values: TL_MAYA_ANSWERS, compact: true }, description: "One instruction line, each known fact as one compact row with its name, source and Edit on a quiet line, and no note under the button." },
    {
      label: "A long known answer wraps",
      props: { ...base, inputs: TL_INPUTS_FROM_BRIEFING.map((i) => (i.id === "example" ? { ...i, value: `${i.value} ${i.value} ${i.value}` } : i)) },
    },
  ],
});
