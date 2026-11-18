import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { mapFor } from "@/lib/map";
import { HOME_STATES } from "@/mock/homepage";
import { MapPanel } from "./MapPanel";

const noop = () => {};
const rings = mapFor({ records: HOME_STATES["follow-up-due"].records });
const short = rings[0];
const doneShort = {
  ...short,
  segments: short.segments.map((s) => ({ ...s, state: "done" as const })),
  done: short.segments.length,
  complete: true,
};
const base = { ring: short, id: "map-panel-demo", planHref: "/plan/concept-3", onOpenAction: noop };

export const mapPanelStates = defineComponentStates({
  name: "MapPanel",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The list under the ring strip for the ring she tapped. Started and finished actions lead to the Plan; ones not started open a sheet to read, start or skip. A complete ring offers a new action.",
  component: MapPanel,
  notApplicable: {
    hover: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    focus: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    active: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    disabled: "Every row can always be opened.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — a ring with started and not started", props: base },
    {
      label: "Long text — a long action title wraps",
      props: {
        ...base,
        id: "map-panel-demo-5",
        ring: { ...short, segments: short.segments.map((s, i) => (i === 0 ? { ...s, action: { ...s.action, title: "Put what you lead into words and say it to the person who decides on scope across brand, product marketing and communications" } } : s)) },
      },
    },
    { label: "A complete ring offers a new one", props: { ...base, id: "map-panel-demo-2", ring: doneShort, onAsk: noop } },
    { label: "Complete, nothing new to offer", props: { ...base, id: "map-panel-demo-3", ring: doneShort, noneLeft: true } },
    { label: "Empty — a ring with nothing on it", props: { ...base, id: "map-panel-demo-4", ring: { ...short, segments: [], done: 0, complete: false } } },
  ],
});
