import { defineComponentStates } from "@/components/types";
import { artifactFor } from "@/mock/onboarding";
import { ArtifactDraft } from "./ArtifactDraft";

const artifact = artifactFor("I want to lead a larger organisation");

export const artifactDraftStates = defineComponentStates({
  name: "ArtifactDraft",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A deliberate stub of the Positioning Builder — the real tool is Sprint 4. It exists so the flow reaches a saved artifact. What it does have to get right is the hand-off feeling: already written when it appears, directly editable, and with the unfinished section visibly unfinished, because a document with a gap reads as started where a complete one reads as delivered.",
  component: ArtifactDraft,
  variants: [
    { label: "Editable draft", props: { artifact } },
    { label: "Saved", props: { artifact, saved: true } },
    { label: "Read only", props: { artifact, readOnly: true } },
    {
      label: "The unsure path's draft",
      props: {
        artifact: artifactFor("I have hit a ceiling and cannot name the next role"),
        readOnly: true,
      },
    },
  ],
});
