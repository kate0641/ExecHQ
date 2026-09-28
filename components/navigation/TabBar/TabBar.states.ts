import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { navForChrome } from "@/lib/manifest";
import { TabBar } from "./TabBar";

/** The bar's four destinations, from the manifest. Profile sits in the top
 *  right instead. */
const items = navForChrome("app").filter((d) => d.flowSlug !== "profile");

export const tabBarStates = defineComponentStates({
  name: "TabBar",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "Navigation Concept 2. Labelled icons and a soft pill that glides to where you are. The icons carry one true thing each instead of a count: a dot on Home when a follow-up is due, the date on Briefing, a filled tip on the Toolbox pencil while a draft is open.",
  component: TabBar,
  notApplicable: {
    disabled: "Every destination is always reachable; none is ever switched off.",
    loading: "Destinations come from the manifest: there is nothing to wait for.",
    error: "Nothing is fetched or submitted, so nothing can fail.",
    empty: "Always the four destinations from the manifest.",
    filled: NOT_AN_INPUT,
    "long text": "Labels are one-word destination names, fixed in the manifest.",
  },
  variants: [
    {
      label: "Stacked, on Home — default",
      description: "Mobile: icon over label, the pill behind the icon.",
      props: { items, current: "homepage", layout: "stacked", day: 20 },
    },
    {
      label: "Stacked, a follow-up is due",
      description: "Home carries the quiet dot. It never counts.",
      props: { items, current: "plan", layout: "stacked", day: 20, followUpDue: true },
    },
    {
      label: "Stacked, a draft is open",
      description: "The Toolbox pencil has its tip filled in.",
      props: { items, current: "homepage", layout: "stacked", day: 20, draftOpen: true },
    },
    {
      label: "Stacked, tucked while reading",
      description: "Scrolling down folds the labels away. Scrolling up brings them back.",
      props: { items, current: "homepage", layout: "stacked", day: 20, tucked: true, followUpDue: true },
    },
    {
      label: "Inline, on Plan",
      description: "Tablet: icon and label side by side, the pill around both.",
      props: { items, current: "plan", layout: "inline", day: 20 },
    },
    {
      label: "Header, on Briefing",
      description: "Web: the pills sit in the header, beside the Profile icon.",
      props: { items, current: "daily-briefing", layout: "header", day: 20 },
    },
    {
      label: "Stacked — hover on Plan",
      props: { items, current: "homepage", layout: "stacked", day: 20, demo: { flowSlug: "plan", state: "hover" } },
    },
    {
      label: "Stacked — focus on Toolbox",
      props: { items, current: "homepage", layout: "stacked", day: 20, demo: { flowSlug: "toolbox", state: "focus" } },
    },
    {
      label: "Stacked — pressed on Briefing",
      props: { items, current: "homepage", layout: "stacked", day: 20, demo: { flowSlug: "daily-briefing", state: "active" } },
    },
  ],
});
