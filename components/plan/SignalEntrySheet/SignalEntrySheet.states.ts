import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { SignalEntrySheet } from "./SignalEntrySheet";

const noop = () => {};
const base = { open: true, inline: true, onClose: noop, onSave: noop, today: "2026-11-03" };

export const signalEntrySheetStates = defineComponentStates({
  name: "SignalEntrySheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "How she tells ExecHQ about something she did outside it: three fields, what it was, when, and an optional link or note. Nothing is searched for and nothing leaves the browser. It opens fresh each time and is offered at the moment it is relevant, never kept as a standing form. The same sheet edits what she added.",
  component: SignalEntrySheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    filled: "Shown by the “type chosen” variant.",
  },
  variants: [
    { label: "Add — empty form, default", props: base },
    {
      label: "Offered after a piece is published — type chosen",
      description: "Opened from the offer: the type and the date are filled in.",
      props: { ...base, initial: { type: "published", on: "2026-11-02" } },
    },
    {
      label: "Editing — a podcast with a link",
      props: { ...base, editing: true, initial: { type: "podcast", on: "2026-10-17", text: "https://example.com/modern-cmo" } },
    },
    {
      label: "Editing — with what came of it",
      props: {
        ...base,
        editing: true,
        initial: { type: "podcast", on: "2026-10-17", text: "https://example.com/modern-cmo", impact: "Two people wrote to me afterwards about their own planning cycles." },
      },
    },
    { label: "Error — nothing chosen, no date", props: { ...base, demoErrors: true } },
    {
      label: "A long note wraps",
      props: {
        ...base,
        initial: {
          type: "spoke",
          on: "2026-10-29",
          text: "Panel on planning for growth at the Growth Summit, with the heads of marketing from three other firms, followed by a question about how we set targets across teams",
        },
      },
    },
  ],
});
