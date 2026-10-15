import { defineComponentStates } from "@/components/types";
import { SUGGESTED_PUBLISHERS } from "@/mock/briefing";
import { PublisherPicker } from "./PublisherPicker";

const noop = () => {};

export const publisherPickerStates = defineComponentStates({
  name: "PublisherPicker",
  group: "form controls",
  status: "draft",
  flows: ["daily-briefing", "profile"],
  description:
    "Where her reads come from. On her first visit it comes before the first set loads, the suggested set first with one press to take it; choosing her own opens the full list, at least three. Later the same list changes them, on the Briefing page (Concept 1) or in Profile.",
  component: PublisherPicker,
  notApplicable: {
    hover: "Its rows take the settings row's hover, and its buttons are Button, which shows its own states.",
    focus: "Its rows take the system's focus ring, and its buttons are Button, which shows its own states.",
    active: "Its rows take the settings row's pressed fill, and its buttons are Button, which shows its own states.",
    loading: "The list is written in the mock: there is nothing to wait for.",
    error: "Below the fewest she can choose, the button is unavailable and the count says why: there is no error to show.",
    "long text": "Publisher names are short, and a row's name wraps beside its check.",
  },
  variants: [
    { label: "First visit, suggested set — default", props: { mode: "first", onDone: noop } },
    { label: "First visit, choosing her own — filled", props: { mode: "first", onDone: noop, startOwn: true } },
    { label: "Settings, her publishers chosen", props: { mode: "settings", chosen: SUGGESTED_PUBLISHERS, onDone: noop, onCancel: noop } },
    {
      label: "Settings, too few — Save unavailable",
      description: "Fewer than three chosen: Save is unavailable and the count says how many she needs.",
      props: { mode: "settings", chosen: ["marlow", "calder"], onDone: noop, onCancel: noop },
    },
    { label: "Settings, none chosen — empty", props: { mode: "settings", chosen: [], onDone: noop }, states: ["disabled"] },
  ],
});
