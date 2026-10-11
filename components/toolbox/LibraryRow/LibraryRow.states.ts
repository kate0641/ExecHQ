import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEF_READY, EXAMPLE_TODAY, PITCH_WAITING, STORY_CLOSED, STORY_DRAFT, STORY_OUTCOME } from "@/components/toolbox/library-examples";
import { LibraryRow } from "./LibraryRow";

const noop = () => {};
const base = { today: EXAMPLE_TODAY, href: "/toolbox-flow/concept-1?artifact=x", onMore: noop, onClose: noop };

export const libraryRowStates = defineComponentStates({
  name: "LibraryRow",
  group: "cards",
  status: "draft",
  flows: ["toolbox"],
  description:
    "One artifact in the library: tool, Loop status (the same component as the Plan and homepage), title (opens the draft), its first line, when it last changed, versions, plan area, and the step or Briefing read it came from. Her onboarding statement invites building it out; an outcome suggests closing it. Counts of real things only.",
  component: LibraryRow,
  notApplicable: {
    disabled: "An artifact can always be opened.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Nothing loads: nothing can fail.",
    empty: "A row is only shown for an artifact; the empty library is LibraryEmpty.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Ready to use — default", props: { ...base, item: BRIEF_READY } },
    { label: "Her onboarding statement, build it out", props: { ...base, today: "2026-10-05", item: STORY_DRAFT, buildOutHref: "/toolbox-flow/concept-1?tool=positioning" } },
    { label: "Waiting to hear", props: { ...base, item: PITCH_WAITING } },
    { label: "Outcome logged, close suggested", props: { ...base, today: "2026-10-20", item: STORY_OUTCOME } },
    { label: "Closed", props: { ...base, item: STORY_CLOSED } },
    { label: "Title — hover", props: { ...base, item: BRIEF_READY, demo: "hover" } },
    { label: "Title — focus", props: { ...base, item: BRIEF_READY, demo: "focus" } },
    { label: "Title — pressed", props: { ...base, item: BRIEF_READY, demo: "active" } },
    { label: "A long title wraps", props: { ...base, item: { ...BRIEF_READY, record: { ...BRIEF_READY.record, title: "Brief for your manager check-in on the planning workstream, the Q1 review and what comes after" } } } },
  ],
});
