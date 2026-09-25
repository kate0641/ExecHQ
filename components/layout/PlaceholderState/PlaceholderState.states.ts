import { defineComponentStates } from "@/components/types";
import { SCAFFOLDING } from "@/components/not-applicable";
import { PlaceholderState } from "./PlaceholderState";

export const placeholderStateStates = defineComponentStates({
  name: "PlaceholderState",
  group: "feedback",
  status: "draft",
  flows: [
    "onboarding",
    "login",
    "navigation",
    "homepage",
    "profile",
    "plan",
    "toolbox",
    "toolbox-flow",
    "daily-briefing",
    "enterprise",
  ],
  description:
    "Fills the content area of a page that has not been designed yet. The sprint number comes from the flow's manifest entry.",
  component: PlaceholderState,
  notApplicable: {
    hover: SCAFFOLDING,
    focus: SCAFFOLDING,
    active: SCAFFOLDING,
    disabled: SCAFFOLDING,
    loading: SCAFFOLDING,
    error: SCAFFOLDING,
    empty: SCAFFOLDING,
    filled: SCAFFOLDING,
    "long text": SCAFFOLDING,
  },
  variants: [
    {
      label: "Default",
      props: { sprint: 3, title: "Plan" },
    },
    {
      label: "With description and spec",
      props: {
        sprint: 4,
        title: "Daily Briefing",
        description:
          "A standalone daily read: three curated items, why each matters, and an optional route into Thought Leadership Builder.",
        specPath: "specs/daily-briefing.md",
      },
    },
  ],
});
