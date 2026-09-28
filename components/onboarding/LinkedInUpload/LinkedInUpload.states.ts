import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { LinkedInUpload } from "./LinkedInUpload";

const noop = () => {};
const base = { fileName: null, email: "maya.chen@example.com", onChoose: noop, onSendSteps: noop };
const file = "Content_2025-09-28_2026-09-28.xlsx";

export const linkedInUploadStates = defineComponentStates({
  name: "LinkedInUpload",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The LinkedIn analytics upload: LinkedIn's export steps, a real file picker, and the file's status once it is in. Reading runs in the background, so the page never waits. On a phone, the steps can be emailed for later. The prototype keeps only the file's name.",
  component: LinkedInUpload,
  notApplicable: {
    ...CONTROLS_INSIDE,
  },
  variants: [
    { label: "Default: empty, no file yet", props: { ...base, status: "none" as const } },
    { label: "Loading: reading the file", props: { ...base, status: "reading" as const, fileName: file } },
    { label: "Filled: ready", props: { ...base, status: "ready" as const, fileName: file } },
    {
      label: "Read, no posts in the range",
      description: "A real answer, not an error: many senior leaders rarely post.",
      props: { ...base, status: "empty" as const, fileName: file },
    },
    { label: "Error: not a LinkedIn export", props: { ...base, status: "wrong-file" as const } },
    { label: "Upload failed", description: "Shown with the retry.", states: ["error"], props: { ...base, status: "failed" as const } },
    { label: "Steps emailed for later", props: { ...base, status: "sent" as const } },
    {
      label: "Long file name wraps",
      props: { ...base, status: "reading" as const, fileName: "Content_2025-09-28_2026-09-28 (2) copy for ExecHQ final.xlsx" },
    },
  ],
});
