import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { FigureDefinition } from "./FigureDefinition";

const noop = () => {};
const controls = "Its one control is a Button, which shows its own states.";

export const figureDefinitionStates = defineComponentStates({
  name: "FigureDefinition",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "What a dashboard figure counts, where it comes from, the window it covers and the privacy rule it is under, one sentence each, so a talent lead can repeat it to their own leadership.",
  component: FigureDefinition,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    ...FIXED_CONTENT,
    empty: "Every figure has a definition, a source, a window and a rule.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "In a window — default", props: { id: "active", window: "30d", onClose: noop, headingId: "fd-1" } },
    { label: "Counted since launch", props: { id: "plans", window: "30d", onClose: noop, headingId: "fd-2" } },
    { label: "Joined: never hidden", props: { id: "invites", window: "launch", onClose: noop, headingId: "fd-3" } },
    { label: "A long definition wraps", props: { id: "follow-through", window: "90d", onClose: noop, headingId: "fd-4" } },
    { label: "On the page, no close", props: { id: "loop", window: "launch", headingId: "fd-5" } },
  ],
});
