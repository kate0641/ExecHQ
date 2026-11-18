import { defineComponentStates } from "@/components/types";
import { Meter } from "./Meter";

export const meterStates = defineComponentStates({
  name: "Meter",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "A share drawn as a ring or a bar beside the figure it repeats: a ring for the one figure a card leads with, a bar for the rest. Decoration for screen readers, which hear the figure. Never drawn for a hidden figure.",
  component: Meter,
  notApplicable: {
    hover: "Not interactive.",
    focus: "Not interactive: nothing takes focus.",
    active: "Not interactive.",
    disabled: "Not a control.",
    loading: "Figures are refreshed weekly, not fetched live.",
    error: "A figure that cannot be shown is hidden, and a hidden figure has no meter.",
    filled: "Not an input.",
    "long text": "It holds no text of its own beyond the number in a ring.",
  },
  variants: [
    { label: "Bar — default, 42%", props: { fraction: 0.42 } },
    { label: "Bar, filling in", props: { fraction: 0.88, muted: true } },
    { label: "Bar, full", props: { fraction: 1 } },
    { label: "Bar, empty", props: { fraction: 0 } },
    { label: "Ring, 38 of 50", props: { fraction: 0.76, kind: "ring", children: "38" } },
    { label: "Ring, 912 of 1,000", props: { fraction: 0.912, kind: "ring", children: "912" } },
  ],
});
