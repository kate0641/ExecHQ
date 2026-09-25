import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { Sheet } from "./Sheet";

const noop = () => {};

export const sheetStates = defineComponentStates({
  name: "Sheet",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A sheet that slides up over the phone screen rather than the browser window. It does the modal work itself: focus moves in and stays inside, Escape closes it, the screen behind goes inert, and focus returns to the opener. Shown in place here.",
  component: Sheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    empty: "Only ever opened with content in it.",
  },
  variants: [
    {
      label: "Open",
      props: {
        open: true,
        inline: true,
        onClose: noop,
        label: "LinkedIn",
        children: createElement("p", null, "Connect LinkedIn so your drafts match how you already show up."),
      },
    },
  ],
});
