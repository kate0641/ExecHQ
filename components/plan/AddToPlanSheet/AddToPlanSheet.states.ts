import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { AddToPlanSheet } from "./AddToPlanSheet";

const noop = () => {};

export const addToPlanSheetStates = defineComponentStates({
  name: "AddToPlanSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "Where she adds something of her own to her plan: what it is, and when, in words (this week to next quarter). It slides up over the phone. The words stand for a day underneath, so it lands in the stage that day falls in. Nothing is added until she has written what it is.",
  component: AddToPlanSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    empty: "A form: it opens empty by design.",
    "long text": "The title is a single field that scrolls its own text.",
  },
  variants: [
    { label: "Open — nothing written, Add is off", props: { open: true, inline: true, onClose: noop, onAdd: noop, today: "2026-10-06" } },
  ],
});
