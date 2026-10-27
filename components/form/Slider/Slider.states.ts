import { defineComponentStates } from "@/components/types";
import { READINESS_HOME_COPY } from "@/mock/homepage";
import { Slider } from "./Slider";

const noop = () => {};
const steps = READINESS_HOME_COPY.answers;
const label = "How ready do you feel to lead a broader marketing organization?";

export const sliderStates = defineComponentStates({
  name: "Slider",
  group: "form controls",
  status: "draft",
  flows: ["homepage"],
  description:
    "A choice along a short scale, dragged or tapped (Kate, 2026-10-26): the browser’s own range input with each stop’s word under its place on the track. Arrow keys step it; a screen reader hears the word. The track fills to the thumb and the chosen word is bold. First used for the weekly check-in’s three answers. Try it: these examples move.",
  component: Slider,
  notApplicable: {
    loading: "Moving it changes nothing until the card around it is saved: there is nothing to wait for.",
    error: "Every stop is a valid answer.",
    empty: "A range always sits on a stop: the card starts it on her last answer, or the middle.",
    filled: "A range always sits on a stop, so every example is filled.",
  },
  variants: [
    { label: "Middle — default", props: { label, steps, value: 2, onChange: noop } },
    { label: "Lowest", props: { label, steps, value: 1, onChange: noop } },
    { label: "Highest", props: { label, steps, value: 3, onChange: noop } },
    { label: "Hover", props: { label, steps, value: 2, onChange: noop, demo: "hover" } },
    { label: "Focus", props: { label, steps, value: 2, onChange: noop, demo: "focus" } },
    { label: "Pressed", props: { label, steps, value: 2, onChange: noop, demo: "active" } },
    { label: "Disabled", props: { label, steps, value: 2, onChange: noop, disabled: true } },
    { label: "Long text: five longer stops", props: { label, steps: ["Not at all ready", "A little ready", "Getting there", "Mostly ready", "Ready to go now"], value: 4, onChange: noop } },
  ],
});
