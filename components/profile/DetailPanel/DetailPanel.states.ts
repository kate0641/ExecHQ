import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "./DetailPanel";

const body = createElement("p", { className: "detail-panel__body" }, PROFILE_COPY.signOut.body("maya.chen@example.com"));
const button = "Its one control is a Button, which shows its own states.";

export const detailPanelStates = defineComponentStates({
  name: "DetailPanel",
  group: "layout",
  status: "draft",
  flows: ["profile"],
  description:
    "The frame every profile detail sits in: a heading and, in a sheet, a close button. The same detail rises as a sheet on mobile and tablet and fills the pane on web.",
  component: DetailPanel,
  notApplicable: {
    ...CONTENT_INSIDE,
    hover: button,
    focus: button,
    active: button,
    disabled: button,
    empty: "Always holds a detail.",
  },
  variants: [
    { label: "In a sheet — default", props: { heading: PROFILE_COPY.signOut.heading, onClose: () => {}, children: body } },
    { label: "In the web pane, no close", props: { heading: PROFILE_COPY.signOut.heading, children: body } },
    {
      label: "A long heading wraps",
      props: { heading: "Leave your organization?", onClose: () => {}, lead: "A line under the heading." },
    },
  ],
});
