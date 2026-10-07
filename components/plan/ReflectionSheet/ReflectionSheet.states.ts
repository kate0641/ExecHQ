import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { ReflectionSheet } from "./ReflectionSheet";

const noop = () => {};
const things = ["Mon · Sent your pitch to Trade Weekly", "Wed · Briefed your manager", "Fri · Quoted in Marketing Week"];
const base = { open: true, inline: true, onClose: noop, onSave: noop, things } as const;

export const reflectionSheetStates = defineComponentStates({
  name: "ReflectionSheet",
  group: "layout",
  status: "draft",
  flows: ["plan"],
  description:
    "This week's reflection, written in a sheet: what moved (chosen from what she did, so she does not have to recall it), what came of anything (joins her record next to the thing it followed), and what is in the way (kept for her advisor, never shown back unasked). Every part is optional. It comes round at most once a week and never shows as missed, and there is no streak.",
  component: ReflectionSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    error: "Every part is optional and any words are valid, so there is nothing to get wrong.",
    filled: "Shown by the “written” variant.",
  },
  variants: [
    { label: "Empty — nothing chosen yet, default", props: { ...base } },
    {
      label: "Written — things chosen and what came of one",
      props: {
        ...base,
        demo: {
          picks: [things[2]],
          link: things[2],
          came: "My manager forwarded it to the leadership team.",
          block: "My calendar is full on Thursdays.",
        },
      },
    },
    { label: "Empty — nothing recorded this week", description: "It says so, and she can still write.", props: { ...base, things: [] } },
    {
      label: "A long thing wraps",
      props: {
        ...base,
        things: ["Tue · Put yourself forward to lead the cross-functional Q1 planning review for marketing, sales operations and finance together"],
      },
    },
  ],
});
