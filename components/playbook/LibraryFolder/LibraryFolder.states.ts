import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryFolder } from "./LibraryFolder";

const noop = () => {};
const pitches = { tool: "pitch" as const, name: "Pitches", summary: "3 · 2 drafts · 1 waiting to hear", date: "Oct 21", onOpen: noop };

export const libraryFolderStates = defineComponentStates({
  name: "LibraryFolder",
  group: "cards",
  status: "draft",
  flows: ["playbook"],
  description:
    "One of the library's folders in Playbook Concept 2: one per tool, filed by ExecHQ, never made or moved by her. In the grid, a light blue card deepening to blue 300 by its arrow, the tool's icon small in a navy circle beside its name (designer, 27 Oct); how many it holds, where they stand, and when it last changed. A button in the grid; the open folder's card above its list: the disc, its name, what the tool makes and Start (option A, 14 Oct).",
  component: LibraryFolder,
  notApplicable: {
    disabled: "A folder can always be opened, even empty.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Opening a folder only shows what is already here: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Pitches — default", props: pitches },
    { label: "Positioning", props: { tool: "positioning", name: "Positioning", summary: "1 · 1 draft", date: "Oct 5", onOpen: noop } },
    { label: "Briefs", props: { tool: "situation-brief", name: "Briefs", summary: "2 · 1 draft · 1 ready to use", date: "Oct 22", onOpen: noop } },
    { label: "Posts, nothing yet — empty", props: { tool: "thought-leadership", name: "Posts", summary: "Nothing here yet", onOpen: noop } },
    { label: "Open beside its list (web) — selected", props: { ...pitches, current: true } },
    { label: "As the open folder's card, with Start", props: { ...pitches, summary: "Pitches for stages, shows and press", as: "header", headingLevel: 2, action: createElement("a", { href: "#", className: "btn btn--primary btn--md" }, "Start a pitch") } },
    { label: "Hover", props: { ...pitches, demo: "hover" } },
    { label: "Focus", props: { ...pitches, demo: "focus" } },
    { label: "Pressed", props: { ...pitches, demo: "active" } },
    { label: "One ready to use", props: { ...pitches, summary: "1 · 1 ready to use", date: "Oct 20" } },
    { label: "One used, sent or published", props: { ...pitches, summary: "1 · 1 used, sent or published", date: "Oct 18" } },
    { label: "One waiting to hear", props: { ...pitches, summary: "1 · 1 waiting to hear", date: "Oct 16" } },
    { label: "One with an outcome logged", props: { ...pitches, summary: "1 · 1 with an outcome logged", date: "Oct 14" } },
    { label: "One closed", props: { ...pitches, summary: "1 · 1 closed", date: "Oct 9" } },
    { label: "Several, all drafts", props: { ...pitches, summary: "3 · 3 drafts", date: "Oct 21" } },
    { label: "A long summary wraps", props: { ...pitches, summary: "6 · 2 drafts · 1 ready to use · 1 used, sent or published · 1 waiting to hear · 1 closed" } },
  ],
});
