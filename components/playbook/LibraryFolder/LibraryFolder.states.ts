import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryFolder } from "./LibraryFolder";

const noop = () => {};
const pitches = { tool: "pitch" as const, name: "Pitches", summary: "3 · 2 drafts · 1 waiting to hear", date: "21 Oct", onOpen: noop };

export const libraryFolderStates = defineComponentStates({
  name: "LibraryFolder",
  group: "cards",
  status: "draft",
  flows: ["playbook"],
  description:
    "One of the library's folders in Playbook Concept 2: one per tool, filed by ExecHQ, never made or moved by her. A plain card (look D, 14 Oct): the tool's icon in a disc tinted for the tool, then its name, so the tint is never the only cue; how many it holds, where they stand, and when it last changed. A button in the grid; the open folder's card above its list: the disc, its name, what the tool makes and Start (option A, 14 Oct).",
  component: LibraryFolder,
  notApplicable: {
    disabled: "A folder can always be opened, even empty.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Opening a folder only shows what is already here: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Pitches — default", props: pitches },
    { label: "Positioning", props: { tool: "positioning", name: "Positioning", summary: "1 · 1 draft", date: "5 Oct", onOpen: noop } },
    { label: "Briefs", props: { tool: "situation-brief", name: "Briefs", summary: "2 · 1 draft · 1 ready to use", date: "22 Oct", onOpen: noop } },
    { label: "Posts, nothing yet — empty", props: { tool: "thought-leadership", name: "Posts", summary: "Nothing here yet", onOpen: noop } },
    { label: "Open beside its list (web) — selected", props: { ...pitches, current: true } },
    { label: "As the open folder's card, with Start", props: { ...pitches, summary: "Pitches for stages, shows and press", as: "header", headingLevel: 2, action: createElement("a", { href: "#", className: "btn btn--primary btn--md" }, "Start a pitch") } },
    { label: "Hover", props: { ...pitches, demo: "hover" } },
    { label: "Focus", props: { ...pitches, demo: "focus" } },
    { label: "Pressed", props: { ...pitches, demo: "active" } },
    { label: "A long summary wraps", props: { ...pitches, summary: "6 · 2 drafts · 1 ready to use · 1 used, sent or published · 1 waiting to hear · 1 closed" } },
  ],
});
