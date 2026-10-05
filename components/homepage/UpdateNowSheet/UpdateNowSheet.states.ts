import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { UpdateNowSheet } from "./UpdateNowSheet";

const initial = { followers: 1240, counts: { podcast: 1, press: 2, speaking: 1, writing: 3 } };
const base = { open: true, inline: true, onClose: () => {}, onSave: () => {}, initial };

export const updateNowSheetStates = defineComponentStates({
  name: "UpdateNowSheet",
  group: "layout",
  status: "draft",
  flows: ["homepage"],
  description:
    "The sheet she says where she is now with, once her starting point is set: the same form, opened on her latest numbers, with a Cancel. Only the Now column changes; her starting point stays. Shown in place here.",
  component: UpdateNowSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saving is local and instant: there is nothing to wait for.",
    error: "Every answer is optional and any number is valid, so there is nothing to get wrong.",
    empty: "It always opens on her latest numbers.",
    "long text": "Its labels are fixed; the only text she types is a number.",
  },
  variants: [
    { label: "Open — on her latest numbers", props: base },
    { label: "Open — starting from zero", props: { ...base, initial: { counts: { podcast: 0, press: 0, speaking: 0, writing: 0 } } } },
    { label: "Closed", props: { ...base, open: false } },
  ],
});
