import { defineComponentStates } from "@/components/types";
import { SignalSources } from "./SignalSources";

const noop = () => {};
const none = { fileName: null, status: "none" as const };
const file = "Content_2025-09-28_2026-09-28.xlsx";
const base = { onAddLink: noop, onDisconnect: noop, onOpenLinkedIn: noop, linkedin: none };

export const signalSourcesStates = defineComponentStates({
  name: "SignalSources",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The signal sources as rows with their status. LinkedIn's row opens the upload step and shows the file's progress; the website's opens a sheet to add it by link, saying what is brought in and what it is used for.",
  component: SignalSources,
  variants: [
    { label: "Nothing connected", props: { ...base, connections: {}, signalLinks: {} } },
    {
      label: "LinkedIn file loading, being read",
      props: { ...base, connections: {}, signalLinks: {}, linkedin: { fileName: file, status: "reading" as const } },
    },
    {
      label: "LinkedIn ready",
      props: { ...base, connections: {}, signalLinks: {}, linkedin: { fileName: file, status: "ready" as const } },
    },
    {
      label: "LinkedIn steps emailed",
      props: { ...base, connections: {}, signalLinks: {}, linkedin: { ...none, status: "sent" as const } },
    },
    {
      label: "Website added by link",
      props: { ...base, connections: { website: "connected" }, signalLinks: { website: "https://mayachen.com" } },
    },
  ],
});
