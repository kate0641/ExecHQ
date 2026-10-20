import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { TL_VERSIONS } from "@/mock/playbook";
import { VersionHistory } from "./VersionHistory";

const noop = () => {};
const versions = TL_VERSIONS.map(({ n, when, what }) => ({ n, when, what }));
const three = [...versions, { n: 3, when: "Mon 5 Oct, 9:31", what: "Your edits" }];

export const versionHistoryStates = defineComponentStates({
  name: "VersionHistory",
  group: "navigation",
  status: "draft",
  flows: ["playbook-flow"],
  description:
    "Every version of a draft, saved as she goes, newest first: what made it and when. She can view any, and bring one back, which saves it as a new version so nothing is lost.",
  component: VersionHistory,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Versions are saved locally as she goes: there is nothing to wait for.",
    error: "Bringing one back copies it: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Showing the latest — default", props: { versions: three, showing: 3, onView: noop, onRestore: noop } },
    { label: "Viewing an earlier one", description: "Bring this back appears on the one she is looking at.", props: { versions: three, showing: 1, onView: noop, onRestore: noop } },
    { label: "Only the first draft — none earlier", props: { versions: versions.slice(0, 1), showing: 1, onView: noop, onRestore: noop } },
    { label: "A long description wraps", props: { versions: [...versions, { n: 3, when: "Mon 5 Oct, 9:40", what: "Warmer, for senior leaders, leading with your example" }], showing: 3, onView: noop, onRestore: noop } },
  ],
});
