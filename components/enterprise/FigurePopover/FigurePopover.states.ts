import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { FigurePopover } from "./FigurePopover";

const noop = () => {};
const close = "Its one control, the close button, is an icon button with the standard hover, focus and pressed styles.";

export const figurePopoverStates = defineComponentStates({
  name: "FigurePopover",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "How a dashboard figure is measured, opened from the info icon beside its name: the figure's name, one sentence of what it measures, its source and the window it covers. Floats beside the icon, flips to stay on screen, and closes on Escape, a press outside or its close button.",
  component: FigurePopover,
  notApplicable: {
    hover: close,
    focus: close,
    active: close,
    disabled: close,
    ...FIXED_CONTENT,
    empty: "Every figure has a definition, a source and a window.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "In a window — default", props: { id: "artifacts", window: "30d", onClose: noop, inline: true } },
    { label: "Counted since launch", props: { id: "plans", window: "30d", onClose: noop, inline: true } },
    { label: "Joined: never hidden", props: { id: "invites", window: "launch", onClose: noop, inline: true } },
    { label: "A long definition wraps", props: { id: "follow-through", window: "30d", onClose: noop, inline: true } },
  ],
});
