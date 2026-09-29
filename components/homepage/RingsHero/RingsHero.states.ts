import { createElement as h } from "react";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { nextToFill, ringsFor } from "@/lib/rings";
import { HOME_STATES, type HomeStateId } from "@/mock/homepage";
import { ACTIONS } from "@/mock/plan-stub";
import { RingsHero } from "./RingsHero";

const base = {
  greeting: "Good morning, Maya",
  date: "Tuesday 20 October",
};
/** The tray as the page fills it when the next step is the moment. Each
 *  variant gets its own heading id, since the catalogue shows them together. */
let stepCount = 0;
function step(title: string, a = ACTIONS[0], horizon = "Short-term", eyebrow = `Next in ${horizon.toLowerCase()}`) {
  return h(NextStepCard, {
    eyebrow,
    title,
    whyLine: a.whyLine,
    href: "/toolbox-flow/concept-1",
    headingId: `rh-step-${++stepCount}`,
  });
}
function forState(id: HomeStateId) {
  const rings = ringsFor(HOME_STATES[id].records);
  const next = nextToFill(rings);
  return {
    ...base,
    rings,
    next,
    focus: next?.ring.horizon ?? null,
    children: next ? step(next.segment.action.title, next.segment.action, next.ring.label) : undefined,
  };
}
const allDone = (() => {
  const rings = ringsFor(
    HOME_STATES["nothing-pending"].records,
    ACTIONS.filter((a) => a.id !== "scope-case")
  );
  return { ...base, rings, next: nextToFill(rings), children: h("p", { className: "rings-hero__done" }, "Every action on your plan is in hand.") };
})();

export const ringsHeroStates = defineComponentStates({
  name: "RingsHero",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Homepage Concept 1’s focal point, Merged: one card with the greeting, the plan and where it’s heading, three rings (one per Active Landscape horizon) and a tray holding what the moment asks for, its notch on the ring it belongs to. A segment fills only when the Loop confirms the work; filled segments are solid, unfilled hollow, the next outlined in the accent. Each ring reads out as text.",
  component: RingsHero,
  notApplicable: {
    disabled: "Every ring can always be opened.",
    loading: "Drawn from the plan stub and the local Loop: there is nothing to wait for.",
    error: "Drawn locally: nothing can fail.",
    empty: "There are always three rings; a horizon with nothing accepted is never shown as missing.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "First return, a starting point — default",
      description: "Nearly empty rings, introduced as where the plan starts, not as a verdict.",
      props: { ...forState("first-return"), startNote: "Four actions on your plan. Each segment fills when you use the work it asks for." },
    },
    { label: "Follow-up due, part confirmed", props: forState("follow-up-due") },
    { label: "Nothing pending, short and medium confirmed", props: forState("nothing-pending") },
    { label: "Every action confirmed", description: "No next action left: nothing celebrates, it just says so.", props: allDone },
    {
      label: "Another ring picked",
      description: "Tapping a ring that isn’t the moment’s puts its next action in the tray, with a way back; the notch moves to it.",
      props: {
        ...forState("follow-up-due"),
        focus: "long",
        children: step(ACTIONS.find((a) => a.id === "scope-case")!.title, ACTIONS.find((a) => a.id === "scope-case")!, "Long-term"),
      },
    },
    {
      label: "A long action title wraps",
      props: { ...forState("first-return"), children: step("Use your leadership story to open your next 1:1 with your manager, before the planning cycle") },
    },
    {
      label: "Tray without a notch",
      description: "The just-answered hand-off: the next step isn’t on the plan yet, so no ring claims it.",
      props: {
        ...forState("follow-up-due"),
        focus: null,
        children: h(NextStepCard, {
          lead: h("p", { className: "home-card__readback" }, "Logged. You told me: “She asked me to lead the planning workstream.”"),
          eyebrow: "Next",
          title: "Build a stakeholder message map for the workstream",
          whyLine: "You said the new work needs influence across teams.",
          href: "/toolbox-flow/concept-1",
          stubbed: true,
          headingId: "rh-handoff",
        }),
      },
    },
    { label: "No tray", description: "Without a moment, the card is the greeting and the rings.", props: { ...forState("follow-up-due"), children: undefined, focus: null } },
    { label: "Ring — hover", props: { ...forState("follow-up-due"), demo: { horizon: "medium", state: "hover" } } },
    { label: "Ring — focus", props: { ...forState("follow-up-due"), demo: { horizon: "short", state: "focus" } } },
    { label: "Ring — pressed", props: { ...forState("follow-up-due"), demo: { horizon: "long", state: "active" } } },
  ],
});
