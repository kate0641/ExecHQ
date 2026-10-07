import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { LinkedInMore } from "./LinkedInMore";

const noop = () => {};
const base = { status: "none", fileName: null, onChoose: noop, onSendSteps: noop } as const;

export const linkedInMoreStates = defineComponentStates({
  name: "LinkedInMore",
  group: "form controls",
  status: "draft",
  flows: ["signals"],
  description:
    "An invitation, under the numbers she types, to add more LinkedIn data. It is the onboarding's analytics upload, kept behind a text link that opens it in a drawer so the form stays short: optional, and there for later too. LinkedIn has no connection to make, so she exports a spreadsheet and brings it here. The file is never read or sent in the prototype.",
  component: LinkedInMore,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Reading is shown inside the upload as a status; nothing here waits.",
    "long text": "Its words are fixed; the only text that varies is a file name, which the upload wraps.",
  },
  variants: [
    { label: "Empty — closed, nothing uploaded — default", props: base },
    { label: "Open — the drawer with the steps and the upload", props: { ...base, demoOpen: true } },
    { label: "Reading the file — the drawer closed, no link while it reads", props: { ...base, status: "reading", fileName: "Content_2025-10-01_2026-10-01_Jane.xlsx" } },
    { label: "Reading the file — in the drawer", props: { ...base, demoOpen: true, status: "reading", fileName: "Content_2025-10-01_2026-10-01_Jane.xlsx" } },
    { label: "Filled — read and ready: it says what she has, and the link says newer", props: { ...base, status: "ready", fileName: "Content_2025-10-01_2026-10-01_Jane.xlsx" } },
    { label: "Read, with no posts in it", props: { ...base, status: "empty", fileName: "Content_2025-10-01_2026-10-01_Jane.xlsx" } },
    { label: "Error — not a LinkedIn export", props: { ...base, demoOpen: true, status: "wrong-file", fileName: "notes.docx" } },
    { label: "Steps emailed", props: { ...base, demoOpen: true, status: "sent", email: "jane@example.com" } },
  ],
});
