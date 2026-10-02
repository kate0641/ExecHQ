import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { mapFor } from "@/lib/map";
import { HOME_STATES, MAP_COPY } from "@/mock/homepage";
import { MapRoundup } from "./MapRoundup";

const noop = () => {};
const now = mapFor({ records: HOME_STATES["follow-up-due"].records });
const completedShort = now.map((r) =>
  r.horizon === "short"
    ? { ...r, segments: r.segments.map((s) => ({ ...s, state: "done" as const })), done: r.segments.length, complete: true }
    : r
);
const base = {
  rings: now,
  hrefFor: () => "/plan/concept-1",
  lineFor: () => MAP_COPY.rowOpen,
  idPrefix: "roundup-demo",
};

export const mapRoundupStates = defineComponentStates({
  name: "MapRoundup",
  group: "cards",
  status: "draft",
  flows: ["homepage", "plan"],
  description:
    "Every action on her map, grouped under its ring and always in view. On the homepage each row leads to the Plan to read the context. On the Plan page an action she has not started opens the sheet where she starts it or says it is not for her. A complete ring offers a new action.",
  component: MapRoundup,
  notApplicable: {
    hover: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    focus: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    active: "Its rows are links and buttons; the row styles share the catalogue’s other lists.",
    disabled: "Every row can always be used.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — every ring, linking to the Plan", props: base },
    { label: "A complete ring offers a new one", props: { ...base, idPrefix: "roundup-demo-2", rings: completedShort, onAsk: noop } },
    { label: "Complete, nothing new to offer", props: { ...base, idPrefix: "roundup-demo-3", rings: completedShort, noneLeft: () => true } },
    {
      label: "Empty — a ring with nothing on it",
      props: { ...base, idPrefix: "roundup-demo-4", rings: now.map((r) => (r.horizon === "long" ? { ...r, segments: [], done: 0, complete: false } : r)) },
    },
    {
      label: "Long text — a long action title wraps",
      props: {
        ...base,
        idPrefix: "roundup-demo-5",
        rings: now.map((r) =>
          r.horizon === "short"
            ? { ...r, segments: r.segments.map((s, i) => (i === 0 ? { ...s, action: { ...s.action, title: "Put what you lead into words and say it to the person who decides on scope across brand, product marketing and communications" } } : s)) }
            : r
        ),
      },
    },
    { label: "On the Plan — not started opens the sheet", props: { ...base, idPrefix: "roundup-demo-6", hrefFor: undefined, onOpen: noop } },
  ],
});
