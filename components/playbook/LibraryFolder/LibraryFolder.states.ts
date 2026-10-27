import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryFolder } from "./LibraryFolder";

const noop = () => {};
const pitches = { tool: "pitch" as const, name: "Pitches", summary: "Last change Oct 21", date: "3 items", dateLabel: "", onOpen: noop };

export const libraryFolderStates = defineComponentStates({
  name: "LibraryFolder",
  group: "cards",
  status: "draft",
  flows: ["playbook"],
  description:
    "One of the library's folders in Playbook Concept 2: one per tool, filed by ExecHQ, never made or moved by her. In the grid, a light blue card deepening to blue 300 by its arrow, the tool's icon small in a navy circle beside its name (designer, 27 Oct), with when it last changed and how many it holds. A button in the grid; the open folder's card above its list: the disc, its name, what the tool makes and Start (option A, 14 Oct).",
  component: LibraryFolder,
  notApplicable: {
    disabled: "A folder can always be opened, even empty.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Opening a folder only shows what is already here: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Pitches — default", props: pitches },
    { label: "Positioning", props: { tool: "positioning", name: "Positioning", summary: "Last change Oct 5", date: "1 item", dateLabel: "", onOpen: noop } },
    { label: "Briefs", props: { tool: "situation-brief", name: "Briefs", summary: "Last change Oct 22", date: "2 items", dateLabel: "", onOpen: noop } },
    { label: "Posts, nothing yet — empty", props: { tool: "thought-leadership", name: "Posts", summary: "Nothing here yet", onOpen: noop } },
    { label: "Open beside its list (web) — selected", props: { ...pitches, current: true } },
    { label: "As the open folder's card, with Start", props: { ...pitches, summary: "Pitches for stages, shows and press", as: "header", headingLevel: 2, action: createElement("a", { href: "#", className: "btn btn--primary btn--md" }, "Start a pitch") } },
    { label: "Hover", props: { ...pitches, demo: "hover" } },
    { label: "Focus", props: { ...pitches, demo: "focus" } },
    { label: "Pressed", props: { ...pitches, demo: "active" } },
    { label: "Many items", props: { ...pitches, summary: "Last change Oct 9", date: "24 items" } },
    { label: "A long name wraps", props: { ...pitches, name: "Thought leadership pieces" } },
  ],
});
