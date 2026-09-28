import { defineComponentStates } from "@/components/types";
import { ExportDetail } from "./ExportDetail";

const controls = "Its controls are Buttons and radio buttons, which show their own states.";

export const exportDetailStates = defineComponentStates({
  name: "ExportDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "Downloading her data: what the file holds, read from her account, a choice of format and a plain confirmation. PROVISIONAL format and scope, flagged on the page.",
  component: ExportDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "The prototype makes no file, so there is nothing to wait for.",
    error: "The prototype makes no file, so nothing can fail.",
  },
  variants: [
    { label: "One draft — default", props: { drafts: ["Your leadership story"], onClose: () => {}, headingId: "ed-1" } },
    { label: "JSON chosen", props: { drafts: ["Your leadership story"], startFormat: "json", onClose: () => {}, headingId: "ed-2" } },
    { label: "Ready", props: { drafts: ["Your leadership story"], startReady: true, onClose: () => {}, headingId: "ed-3" } },
    { label: "No drafts yet — none", props: { drafts: [], onClose: () => {}, headingId: "ed-4" } },
    {
      label: "Several drafts, a long line wraps",
      props: {
        drafts: ["Your leadership story", "Your pitch for the Q1 planning review", "Brief for your manager check-in"],
        onClose: () => {},
        headingId: "ed-5",
      },
    },
  ],
});
