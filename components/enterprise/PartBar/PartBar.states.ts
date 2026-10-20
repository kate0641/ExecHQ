import { defineComponentStates } from "@/components/types";
import { NOT_INTERACTIVE } from "@/components/not-applicable";
import { PartBar } from "./PartBar";

export const partBarStates = defineComponentStates({
  name: "PartBar",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "One whole with the part that did something shaded dark, both said in words under it beside a swatch: work made against work used.",
  component: PartBar,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "Figures are refreshed weekly, not fetched live.",
    error: "When the figures are hidden the bar is not drawn at all.",
    filled: "Not an input.",
  },
  variants: [
    { label: "The pilot — default", props: { part: 19, whole: 58, partLabel: "19 used outside ExecHQ", restLabel: "39 not marked as used" } },
    { label: "None used yet — empty", props: { part: 0, whole: 6, partLabel: "0 used outside ExecHQ", restLabel: "6 not marked as used" } },
    { label: "All used", props: { part: 12, whole: 12, partLabel: "12 used outside ExecHQ", restLabel: "0 not marked as used" } },
    { label: "Thousands, long labels wrap", props: { part: 1580, whole: 3950, partLabel: "1,580 used outside ExecHQ", restLabel: "2,370 not marked as used" } },
  ],
});
