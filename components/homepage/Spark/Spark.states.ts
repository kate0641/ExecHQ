import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { SPARK_COPY as S } from "@/mock/accounts-stub";
import { Spark } from "./Spark";

const podcast = { id: "presence:p1", source: S.source.podcast, text: S.podcast("The Modern CMO", "second") };
const speaking = { id: "presence:s1", source: S.source.speaking, text: S.speaking("Growth Summit", "second") };
const press = { id: "presence:r1", source: S.source.press, text: S.press("Marketing Week", "third") };

const base = { label: S.label, dismissLabel: S.dismiss, dismissName: S.dismissNote, onDismiss: () => {} };

export const sparkStates = defineComponentStates({
  name: "Spark",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "A small note at the top of the signals section when something she can see has moved, such as a podcast or a talk she added. It names the thing and says so warmly, but never that her work caused it, and there are no streaks. At most two, newest first, dismissed for good in one press. Data stubbed until the Signal Picture in Sprint 3.",
  component: Spark,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Worked out from local data: there is nothing to wait for.",
    error: "Worked out from local data: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "One note — default", props: { ...base, items: [podcast] } },
    { label: "Two notes", props: { ...base, items: [press, speaking] } },
    {
      label: "A long note wraps",
      props: {
        ...base,
        items: [
          {
            ...podcast,
            text: S.podcast("The Modern CMO with Jordan Ellis: leadership, planning and the long road from campaigns to the whole marketing team", "second"),
          },
        ],
      },
    },
    {
      label: "Nothing to note — empty",
      description: "It is simply not there: no heading, no placeholder.",
      props: { ...base, items: [] },
    },
  ],
});
