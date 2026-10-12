import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { TODAYS_READS } from "@/mock/briefing";
import { PassageNote } from "./PassageNote";

const noop = () => {};
const read = TODAYS_READS[0];

export const passageNoteStates = defineComponentStates({
  name: "PassageNote",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Concept 3's one highlighted passage from a read, and ExecHQ's note on why this sentence. The whole passage is one button: tapping it opens the sheet with Respond to this. The note sits under the passage on a phone and tablet, and in the margin on web.",
  component: PassageNote,
  notApplicable: {
    disabled: "The passage can always be tapped.",
    loading: "Written in the mock: there is nothing to wait for.",
    error: "Tapping it only opens a sheet: nothing can fail.",
    empty: "Every read in Concept 3 has its passage.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Inline, phone and tablet — default", props: { read, placement: "inline", onOpen: noop } },
    { label: "In the margin, web", props: { read, placement: "margin", onOpen: noop } },
    { label: "Inline — hover", props: { read, placement: "inline", onOpen: noop, demo: "hover" } },
    { label: "Inline — focus", props: { read, placement: "inline", onOpen: noop, demo: "focus" } },
    { label: "Inline — pressed", props: { read, placement: "inline", onOpen: noop, demo: "active" } },
    {
      label: "A long passage wraps",
      props: { read: { ...read, passage: `${read.passage} ${TODAYS_READS[2].passage}` }, placement: "inline", onOpen: noop },
    },
  ],
});
