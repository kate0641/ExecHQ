import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { Drawer } from "./Drawer";

const noop = () => {};
const base = {
  open: true,
  inline: true,
  onClose: noop,
  label: "Add more LinkedIn data",
  children: createElement("p", null, "Upload your LinkedIn analytics export, or email yourself the steps."),
};

export const drawerStates = defineComponentStates({
  name: "Drawer",
  group: "layout",
  status: "draft",
  flows: ["signals"],
  description:
    "A drawer that comes up from the foot of the phone screen, over the navigation pill while it is open, and leaves the page behind it alone: no scrim and nothing inert, so she can keep reading. Its handle is a button that closes it, and so is Escape. Closed, nothing of it stays on the screen, so the navigation is back at once. Shown in place here.",
  component: Drawer,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    empty: "Only ever opened with content in it.",
  },
  variants: [
    { label: "Open", props: base },
    {
      label: "Long text — a long name wraps",
      props: { ...base, label: "Add more LinkedIn data from your analytics export, whenever you have it to hand" },
    },
  ],
});
