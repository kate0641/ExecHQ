import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { OUTLETS, suggestedOutlets } from "@/mock/toolbox";
import { OutletSuggestions } from "./OutletSuggestions";

const noop = () => {};
const speaking = suggestedOutlets("Speaking");

export const outletSuggestionsStates = defineComponentStates({
  name: "OutletSuggestions",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "“Not sure yet” under Who are you pitching? (Kate, 14 Oct): up to three outlets of the kind she is pitching for, each with why it fits. Picking one fills in her answer; she can still type her own. Every outlet here is made up.",
  component: OutletSuggestions,
  notApplicable: {
    disabled: "Every outlet can always be picked.",
    loading: "The outlets are ExecHQ’s own list; nothing to wait for.",
    error: CONTENT_INSIDE.error,
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Folded — default", props: { outlets: speaking, type: "Speaking", onPick: noop } },
    { label: "Open, two that fit", props: { outlets: suggestedOutlets("Podcast"), type: "Podcast", onPick: noop, startOpen: true } },
    { label: "Open, one chosen", props: { outlets: speaking, type: "Speaking", chosen: speaking[0].name, onPick: noop, startOpen: true } },
    { label: "Hover", props: { outlets: speaking.slice(0, 1), type: "Speaking", onPick: noop, startOpen: true, optionClassName: "is-hover" } },
    { label: "Focus", props: { outlets: speaking.slice(0, 1), type: "Speaking", onPick: noop, startOpen: true, optionClassName: "is-focus" } },
    { label: "Pressed", props: { outlets: speaking.slice(0, 1), type: "Speaking", onPick: noop, startOpen: true, optionClassName: "is-active" } },
    { label: "No pitch type yet", props: { outlets: suggestedOutlets(undefined), onPick: noop, startOpen: true } },
    { label: "Nothing that fits — none shown", props: { outlets: [], onPick: noop } },
    {
      label: "A long name and reason wrap",
      props: { outlets: [{ ...OUTLETS[2], name: "The Commercial Strategy and Revenue Operations Leadership Summit, Europe", fits: `${OUTLETS[2].fits} ${OUTLETS[2].fits}` }], type: "Speaking", onPick: noop, startOpen: true },
    },
  ],
});
