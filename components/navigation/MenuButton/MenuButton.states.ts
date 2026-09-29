import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { MenuButton } from "./MenuButton";

export const menuButtonStates = defineComponentStates({
  name: "MenuButton",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "Opens the Drawer concept's menu on mobile. Icon-only, named “Menu”. Carries the quiet dot when a follow-up is due, so a closed menu never hides it.",
  component: MenuButton,
  notApplicable: {
    disabled: "The menu is always available.",
    loading: "Opens a local menu: nothing to wait for.",
    error: "Opens a local menu: nothing can fail.",
    empty: "Always has its icon and name.",
    filled: NOT_AN_INPUT,
    "long text": "Shows an icon only.",
  },
  variants: [
    { label: "Closed — default", props: {} },
    { label: "Open", description: "The icon stays the same: tapping the page beside the menu closes it.", props: { expanded: true } },
    { label: "A follow-up is due", props: { followUpDue: true } },
    { label: "Closed — hover", props: { demo: "hover" } },
    { label: "Closed — focus", props: { demo: "focus" } },
    { label: "Closed — pressed", props: { demo: "active" } },
  ],
});
