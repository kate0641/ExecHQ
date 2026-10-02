import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE, CONTROLS_INSIDE } from "@/components/not-applicable";
import { AddPresenceSheet } from "./AddPresenceSheet";

const base = { open: true, inline: true, onClose: () => {}, onAdd: () => {} };

export const addPresenceSheetStates = defineComponentStates({
  name: "AddPresenceSheet",
  group: "layout",
  status: "draft",
  flows: ["homepage"],
  description:
    "The sheet she adds a podcast appearance, press mention, talk or thought piece with: what it is, a title or a note, where it ran, and a link if she has one. Nothing is searched for or guessed, so what she types is what is kept. Opened fresh each time. Shown in place here.",
  component: AddPresenceSheet,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    loading: "Adding is local and instant: there is nothing to wait for.",
    empty: "It opens empty: that is its default.",
  },
  variants: [
    { label: "Open — default", props: base },
    {
      label: "Filled in",
      props: {
        ...base,
        demo: { kind: "podcast", title: "Planning as a leadership skill", where: "The Modern CMO", link: "https://example.com/episode-212" },
      },
    },
    {
      label: "Filled in with long text",
      description: "A long title, name and link stay inside their fields rather than pushing the sheet wider.",
      props: {
        ...base,
        demo: {
          kind: "speaking",
          title: "Keynote on why the quarterly planning review is the most underrated leadership habit, and what it took to make it stick across three teams",
          where: "The International Conference on Marketing Leadership and Organizational Growth",
          link: "https://example.com/events/international-conference-marketing-leadership/sessions/keynote-planning-review",
        },
      },
    },
    {
      label: "Error — nothing filled in",
      description: "Pressing Add with the form empty names each thing still missing.",
      props: { ...base, demo: { showErrors: true } },
    },
    { label: "Open to set where she started", props: { ...base, baseline: true } },
    { label: "Closed", props: { ...base, open: false } },
  ],
});
