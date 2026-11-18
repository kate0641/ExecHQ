import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEF_READY, PITCH_WAITING, STORY_DRAFT } from "@/components/playbook/library-examples";
import { ArtifactActions } from "./ArtifactActions";

const noop = () => {};
const base = { openHref: "/playbook-flow/concept-3?artifact=x", reuseHref: "/playbook-flow/concept-3?reuse=x", onMarkReady: noop, onMarkUsed: noop, onExport: noop, onClose: noop, onDelete: noop, onDismiss: noop };

export const artifactActionsStates = defineComponentStates({
  name: "ArtifactActions",
  group: "layout",
  status: "draft",
  flows: ["playbook"],
  description:
    "Everything she can do with an artifact from the library, in a sheet: open it, use it as the start of a new one, move its status on (Mark ready, Mark sent), export where in scope, close it, or delete it. Deleting asks once and says exactly what else goes: its record in ExecHQ and its items on her Signal Picture.",
  component: ArtifactActions,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Every action takes effect at once on her device.",
    error: "Nothing here can fail.",
    empty: "Only opened on an artifact.",
    filled: NOT_AN_INPUT,
    "long text": "The title wraps like any heading; the actions are fixed words.",
  },
  variants: [
    { label: "A draft — default", props: { ...base, item: STORY_DRAFT } },
    { label: "Ready: Mark used, PDF and Word", props: { ...base, item: BRIEF_READY } },
    { label: "Waiting to hear", props: { ...base, item: PITCH_WAITING } },
    { label: "Delete, asked once", props: { ...base, item: PITCH_WAITING, startConfirming: true } },
  ],
});
