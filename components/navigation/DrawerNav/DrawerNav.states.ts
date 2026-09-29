import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { navForChrome } from "@/lib/manifest";
import { DrawerNav } from "./DrawerNav";

const items = navForChrome("app").filter((item) => item.flowSlug !== "profile");
const account = { name: "Maya", email: "maya.chen@example.com", href: "/profile/concept-1" };
const lines = {
  homepage: "A question about your leadership story",
  plan: "Step up · Show the proof",
  toolbox: "Open: Brief for your manager check-in",
  "daily-briefing": "Three reads for Tuesday",
  profile: "maya.chen@example.com",
};
const toggle = (expanded: boolean) => ({
  label: expanded ? "Fold the menu to a rail" : "Widen the menu",
  expanded,
  onClick: () => {},
});

export const drawerNavStates = defineComponentStates({
  name: "DrawerNav",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "Navigation Concept 3. Every destination with a line of what is waiting there, and the account at the foot. A drawer behind the page on mobile, a rail on tablet, a sidebar on web.",
  component: DrawerNav,
  notApplicable: {
    disabled: "Every destination is always reachable; none is ever switched off.",
    loading: "Destinations come from the manifest and lines from the local Loop: nothing to wait for.",
    error: "Nothing is fetched or submitted, so nothing can fail.",
    empty: "Always the five destinations from the manifest.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Sidebar, on Home — default",
      description: "Web. The lines come from the live Loop in the prototype.",
      props: { items, current: "homepage", mode: "sidebar", lines, account, draftOpen: true, toggle: toggle(true) },
    },
    {
      label: "Sidebar, a follow-up is due",
      description: "Home carries the quiet dot and says what the question is about.",
      props: { items, current: "plan", mode: "sidebar", lines, account, followUpDue: true, draftOpen: true, toggle: toggle(true) },
    },
    {
      label: "Drawer, on Plan",
      description: "Mobile. Laid out on the surface behind the page, which steps aside to show it.",
      props: { items, current: "plan", mode: "drawer", lines, account, followUpDue: true },
    },
    {
      label: "Rail, on Briefing",
      description: "Tablet, and web when folded. Icons with short labels; the lines are hidden.",
      props: { items, current: "daily-briefing", mode: "rail", lines, account, followUpDue: true, toggle: toggle(false) },
    },
    {
      label: "Sidebar, a long line truncates",
      description: "A line that outgrows the width ends in an ellipsis rather than wrapping.",
      props: {
        items,
        current: "homepage",
        mode: "sidebar",
        account,
        lines: { ...lines, toolbox: "Open: Pitch to lead the Q1 planning review for the operating committee" },
        toggle: toggle(true),
      },
    },
    {
      label: "Sidebar — hover on Toolbox",
      props: { items, current: "homepage", mode: "sidebar", lines, account, toggle: toggle(true), demo: { flowSlug: "toolbox", state: "hover" } },
    },
    {
      label: "Sidebar — focus on Plan",
      props: { items, current: "homepage", mode: "sidebar", lines, account, toggle: toggle(true), demo: { flowSlug: "plan", state: "focus" } },
    },
    {
      label: "Sidebar — pressed on the account",
      props: { items, current: "homepage", mode: "sidebar", lines, account, toggle: toggle(true), demo: { flowSlug: "profile", state: "active" } },
    },
  ],
});
