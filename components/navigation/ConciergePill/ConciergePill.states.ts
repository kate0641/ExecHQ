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
    "Navigation Concept 1's way in: where you are, and “Ask or go”. It opens the advisor. Floating at the foot of the phone; in the header on tablet and web.",
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
    { label: "Header, on Home — default", props: { here: home } },
    {
      label: "Floating, on the phone",
      description: "Sits over the foot of the page; the page leaves room for it.",
      props: { here: { label: "Plan", icon: "flag" }, layout: "floating" },
    },
    { label: "A follow-up is due", props: { here: home, followUpDue: true } },
    { label: "Open", description: "While the advisor is showing.", props: { here: home, expanded: true } },
    { label: "Header — hover", props: { here: home, demo: "hover" } },
    { label: "Header — focus", props: { here: home, demo: "focus" } },
    { label: "Header — pressed", props: { here: home, demo: "active" } },
  ],
});
