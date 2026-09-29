import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { nextToFill, ringsFor } from "@/lib/rings";
import { HOME_STATES, type HomeStateId } from "@/mock/homepage";
import { ACTIONS } from "@/mock/plan-stub";
import { RingsHero } from "./RingsHero";

const base = { greeting: "Good morning, Maya", date: "Tuesday 20 October", planLine: "Step up", planName: "Increase leadership scope", startHref: "/toolbox-flow/concept-1", planHref: "/plan/concept-1" };
function forState(id: HomeStateId) {
  const rings = ringsFor(HOME_STATES[id].records);
  return { ...base, rings, next: nextToFill(rings) };
}
const allDone = (() => {
  const rings = ringsFor(
    HOME_STATES["nothing-pending"].records,
    ACTIONS.filter((a) => a.id !== "scope-case")
  );
  return { ...base, rings, next: nextToFill(rings) };
})();

export const ringsHeroStates = defineComponentStates({
  name: "RingsHero",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "Homepage Concept 1’s focal point: three rings, one per Active Landscape horizon, each named where it sits, and the one action that fills the next segment. A segment fills only when the Loop confirms the work; filled segments are solid, unfilled hollow, the next outlined in the accent. Each ring reads out as text.",
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
    { label: "A ring opened", props: { ...forState("follow-up-due"), open: "short" } },
    {
      label: "A long action title wraps",
      props: {
        ...forState("first-return"),
        next: (() => {
          const f = forState("first-return");
          const n = f.next!;
          return { ...n, segment: { ...n.segment, action: { ...n.segment.action, title: "Use your leadership story to open your next 1:1 with your manager, before the planning cycle" } } };
        })(),
      },
    },
    { label: "Ring — hover", props: { ...forState("follow-up-due"), demo: { horizon: "medium", state: "hover" } } },
    { label: "Ring — focus", props: { ...forState("follow-up-due"), demo: { horizon: "short", state: "focus" } } },
    { label: "Ring — pressed", props: { ...forState("follow-up-due"), demo: { horizon: "long", state: "active" } } },
  ],
});
