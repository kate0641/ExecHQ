import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { EntryDrawer } from "./EntryDrawer";

const noop = () => {};
const base = { open: true, inline: true, onClose: noop, onSave: noop, today: "2026-11-03" };

export const entryDrawerStates = defineComponentStates({
  name: "EntryDrawer",
  group: "layout",
  status: "draft",
  flows: ["signals"],
  description:
    "How she tells ExecHQ about what she did outside it: one row for each thing, with what it was, when, an optional link or note and what came of it, or her LinkedIn followers as of a day. It opens with one row and grows when she wants more, so one thing is as quick as it ever was and several need no other route. Rows she leaves empty are ignored, and each is checked against her picture so she is not asked to add what is already there. She can still read her picture above it while she fills it in. Nothing is looked up and nothing leaves the browser.",
  component: EntryDrawer,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Saved on her device at once: there is nothing to wait for.",
    filled: "Shown by the “rows filled in” variant.",
  },
  variants: [
    { label: "Empty — one row, default", props: base },
    {
      label: "Offered after a piece is published — type and date chosen",
      description: "Opened from the offer: the first row's type and date are filled in.",
      props: { ...base, initial: { type: "published", on: "2026-11-02" } },
    },
    {
      label: "Rows filled in — several things",
      props: {
        ...base,
        demoRows: [
          { type: "podcast", on: "2026-10-17", text: "https://example.com/modern-cmo", impact: "Two people wrote to me afterwards." },
          { type: "spoke", on: "2026-10-29", text: "Growth Summit panel" },
          { type: "published", on: "2026-10-30" },
        ],
      },
    },
    {
      label: "Followers — a number and the day it is from",
      description: "Her LinkedIn followers are a number as of a day, not an event, so the row swaps the note for a number. Only the Now column moves.",
      props: { ...base, demoRows: [{ type: "followers", on: "2026-11-03", followers: "1,310" }] },
    },
    {
      label: "Already in her picture — is it this one?",
      description: "A row's kind and date match something already there, whether ExecHQ recorded it or she added it. It says so and offers to leave that row out.",
      props: {
        ...base,
        demoRows: [{ type: "published", on: "2026-11-02" }, { type: "press", on: "2026-10-20" }],
        existing: [{ id: "post:0", source: "recorded", text: "Published “Why I review my plan every quarter”", on: "2026-11-02", areaId: "seen-as-leader", activity: "publishing", editable: false }],
      },
    },
    {
      label: "Error — a row half filled in",
      props: { ...base, demoErrors: true, demoRows: [{ type: "podcast", on: "" }] },
    },
    {
      label: "Error — followers is not a whole number",
      props: { ...base, demoErrors: true, demoRows: [{ type: "followers", on: "2026-11-03", followers: "lots" }] },
    },
    { label: "Error — nothing filled in", props: { ...base, demoErrors: true } },
    {
      label: "Long text — a long note wraps",
      props: {
        ...base,
        demoRows: [{ type: "spoke", on: "2026-10-29", text: "Panel on planning for growth at the Growth Summit, with the heads of marketing from three other firms, followed by a question about how we set targets across teams" }],
      },
    },
  ],
});
