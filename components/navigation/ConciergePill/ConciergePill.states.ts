import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ConciergePill } from "./ConciergePill";

const home = { label: "Home", icon: "home" as const };

export const conciergePillStates = defineComponentStates({
  name: "ConciergePill",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "Navigation Concept 1's way in: where you are, and “Ask or go”. It opens the advisor. Floating above the foot of the screen on phone, tablet and web.",
  component: ConciergePill,
  notApplicable: {
    disabled: "The advisor is always available.",
    loading: "Opens a local panel: nothing to wait for.",
    error: "Opens a local panel: nothing can fail.",
    empty: "Always shows where you are and the prompt.",
    filled: NOT_AN_INPUT,
    "long text": "The destination is a one-word name from the manifest, and the prompt is fixed.",
  },
  variants: [
    {
      label: "On Home — default",
      description: "Sits over the foot of the page; the page leaves room for it.",
      props: { here: home },
    },
    { label: "On Plan", props: { here: { label: "Plan", icon: "flag" } } },
    { label: "A follow-up is due", props: { here: home, followUpDue: true } },
    { label: "Open", description: "While the advisor is showing.", props: { here: home, expanded: true } },
    { label: "Hover", props: { here: home, demo: "hover" } },
    { label: "Focus", props: { here: home, demo: "focus" } },
    { label: "Pressed", props: { here: home, demo: "active" } },
  ],
});
