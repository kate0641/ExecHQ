import { defineComponentStates } from "@/components/types";
import { SignalSources } from "./SignalSources";

const noop = () => {};
const none = { fileName: null, status: "none" as const };
const file = "Content_2025-09-28_2026-09-28.xlsx";
const base = { onOpenLinkedIn: noop, linkedin: none };

export const signalSourcesStates = defineComponentStates({
  name: "SignalSources",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The signal sources as cards with their status. LinkedIn is the only source: its card shows the file's progress once there is one, and opens the upload step to manage it.",
  component: SignalSources,
  variants: [
    { label: "Nothing connected", props: base },
    {
      label: "LinkedIn file loading, being read",
      props: { ...base, linkedin: { fileName: file, status: "reading" as const } },
    },
    {
      label: "LinkedIn ready",
      props: { ...base, linkedin: { fileName: file, status: "ready" as const } },
    },
    {
      label: "LinkedIn steps emailed",
      props: { ...base, linkedin: { ...none, status: "sent" as const } },
    },
  ],
});
