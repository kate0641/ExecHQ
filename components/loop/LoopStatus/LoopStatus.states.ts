import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import {
  abandonRecord,
  answerFollowUp,
  closeRecord,
  createRecord,
  markReady,
  markUsed,
  startEditing,
  type ArtifactKind,
} from "@/lib/loop";
import { LoopStatus } from "./LoopStatus";

/** A record of this kind, as it is the moment it exists. Every variant below
 *  runs the Loop's own moves from here, so each is a state it can reach. */
function artifact(kind: ArtifactKind) {
  return createRecord({ id: kind, kind, title: "Example", name: "it", on: "2026-10-05" });
}

const noCheckBack = { checkBackDays: null };

export const loopStatusStates = defineComponentStates({
  name: "LoopStatus",
  group: "feedback",
  status: "draft",
  flows: ["homepage"],
  description:
    "An artifact's place in the Loop, the same wherever the artifact appears. The word always carries the meaning; the shape beside it fills in as the artifact moves along, so status never depends on colour.",
  component: LoopStatus,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Every artifact is in a state from the moment it exists.",
    "long text": "Labels come from a fixed set of short words in mock/loop.ts.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Draft",
      description: "The moment the artifact exists, the Loop record does too.",
      props: { record: artifact("positioning") },
    },
    {
      label: "Draft, still editing",
      props: { record: startEditing(artifact("positioning"), "2026-10-06") },
    },
    {
      label: "Ready to use",
      props: { record: markReady(artifact("positioning"), "2026-10-06") },
    },
    {
      label: "Used, for a brief or positioning",
      description:
        "Shown only when the user asked not to be checked on. Otherwise marking it used goes straight to waiting.",
      props: { record: markUsed(artifact("situation-brief"), "2026-10-06", noCheckBack) },
    },
    {
      label: "Sent, for a pitch",
      props: { record: markUsed(artifact("pitch"), "2026-10-06", noCheckBack) },
    },
    {
      label: "Published, for a post",
      props: { record: markUsed(artifact("thought-leadership"), "2026-10-06", noCheckBack) },
    },
    {
      label: "Waiting to hear",
      props: { record: markUsed(artifact("pitch"), "2026-10-06") },
    },
    {
      label: "Outcome logged",
      props: {
        record: answerFollowUp(markUsed(artifact("pitch"), "2026-10-06"), "2026-10-11", {
          type: "positive",
        }),
      },
    },
    {
      label: "Done",
      props: {
        record: closeRecord(
          answerFollowUp(markUsed(artifact("pitch"), "2026-10-06"), "2026-10-11", {
            type: "positive",
          }),
          "2026-10-11"
        ),
      },
    },
    {
      label: "Done, set aside",
      description: "Closed without being used. Not a failure, and never asked about again.",
      props: { record: abandonRecord(artifact("pitch"), "2026-10-06") },
    },
    {
      label: "Label only",
      description: "Without the second line, for places where the label alone is enough.",
      props: { record: startEditing(artifact("positioning"), "2026-10-06"), detail: false },
    },
  ],
});
