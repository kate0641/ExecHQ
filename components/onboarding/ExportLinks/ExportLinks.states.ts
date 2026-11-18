import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { STORY_EXPORTS } from "@/mock/onboarding";
import { ExportLinks } from "./ExportLinks";

export const exportLinksStates = defineComponentStates({
  name: "ExportLinks",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Copy, Download and Email as quiet links, each taking every output at once. Each confirms what it would have done and stops; the confirmation is announced politely.",
  component: ExportLinks,
  notApplicable: {
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: { actions: STORY_EXPORTS },
    },
  ],
});
