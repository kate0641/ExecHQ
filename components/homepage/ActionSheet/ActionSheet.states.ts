import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { NEW_ACTIONS } from "@/mock/plan-stub";
import { ActionSheet } from "./ActionSheet";

const noop = () => {};
const base = { open: true, inline: true, action: NEW_ACTIONS[0], onClose: noop, onStart: noop, onSkip: noop, startHref: "/toolbox-flow/concept-1" };

export const actionSheetStates = defineComponentStates({
  name: "ActionSheet",
  group: "layout",
  status: "draft",
  flows: ["homepage"],
  description:
    "Where she reads about an action she has not started, then starts it or says it is not for her. Skipping asks why, and none of it is required. The Plan page will use the same sheet.",
  component: ActionSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing she types can be wrong: every field is optional.",
    empty: "Only ever opened for an action.",
  },
  variants: [
    { label: "Read — start or not for me", props: base },
    { label: "Not for me — why, optional", props: { ...base, demoStep: "skip" } },
    { label: "A long title wraps", props: { ...base, action: { ...NEW_ACTIONS[3], title: "Map who decides on a broader role across brand, product marketing and communications" } } },
  ],
});
