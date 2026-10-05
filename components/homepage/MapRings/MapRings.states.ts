import { createElement } from "react";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { mapFor } from "@/lib/map";
import { HOME_STATES } from "@/mock/homepage";
import { MapRings } from "./MapRings";

const noop = () => {};
const records = HOME_STATES["follow-up-due"].records;
const now = mapFor({ records });
const completed = now.map((r) =>
  r.horizon === "short"
    ? { ...r, segments: r.segments.map((s) => ({ ...s, state: "done" as const })), done: r.segments.length, complete: true }
    : r
);
const base = { rings: now, onSelect: noop };
const shortAction = now.find((r) => r.horizon === "short")!.segments[0].action;
const card = createElement(NextStepCard, {
  eyebrow: "Next in short-term",
  title: shortAction.title,
  why: { this: shortAction.whyThis, now: shortAction.whyNow, you: shortAction.whyYou },
  href: "/toolbox-flow/concept-1",
});

export const mapRingsStates = defineComponentStates({
  name: "MapRings",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The strip at the top of the homepage: one ring per horizon, one segment per action on her map. Solid is done, outlined is in progress, dashed is not started. Tapping a ring shows that ring's next step in a card under the strip, its notch pointing at the ring, with Start in the Toolbox.",
  component: MapRings,
  notApplicable: {
    disabled: "Every ring can always be opened.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — started, in progress and not started", props: base },
    { label: "A ring is open", props: { ...base, selected: "short" } },
    { label: "A ring is open, with its next step", props: { ...base, selected: "short", children: card, legend: true } },
    { label: "A ring is open, in another place", description: "The notch moves to the ring the card belongs to.", props: { ...base, selected: "long", children: card, legend: true } },
    { label: "A ring complete, with a check", props: { ...base, rings: completed } },
    { label: "Empty — a ring with nothing on it", props: { ...base, rings: now.map((r) => (r.horizon === "long" ? { ...r, segments: [], done: 0, complete: false } : r)) } },
    { label: "Long text — a long ring name wraps", props: { ...base, rings: now.map((r) => (r.horizon === "long" ? { ...r, label: "Long-term, a quarter or more" } : r)) } },
    { label: "Hover", props: { ...base, demo: { horizon: "medium", state: "hover" } } },
    { label: "Focus", props: { ...base, demo: { horizon: "medium", state: "focus" } } },
    { label: "Pressed", props: { ...base, demo: { horizon: "medium", state: "active" } } },
  ],
});
