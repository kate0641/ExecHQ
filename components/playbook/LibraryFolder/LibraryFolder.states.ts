import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryFolder } from "./LibraryFolder";

const noop = () => {};
const pitches = { tool: "pitch" as const, name: "Pitches", summary: "Last change Wed, Oct 21, 2026", date: "3 items", dateLabel: "", onOpen: noop };

export const libraryFolderStates = defineComponentStates({
  name: "LibraryFolder",
  group: "cards",
  feature: "Playbook",
  status: "draft",
  flows: ["playbook"],
  description:
    "One of the library's folders in Playbook Concept 2: one per tool, filed by ExecEngine, never made or moved by her. In the grid, a light blue card deepening to blue 300 by its arrow, the tool's icon small in a navy circle beside its name, with when it last changed and how many it holds. A button in the grid; the open folder's card above its list: the disc, its name, what the tool makes and Start (option A, 14 Oct).",
  component: LibraryFolder,
  notApplicable: {
    disabled: "A folder can always be opened, even empty.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Opening a folder only shows what is already here: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Pitches — default", props: pitches },
    { label: "Positioning", props: { tool: "positioning", name: "Positioning", summary: "Last change Mon, Oct 5, 2026", date: "1 item", dateLabel: "", onOpen: noop } },
    { label: "Briefs", props: { tool: "situation-brief", name: "Briefs", summary: "Last change Thu, Oct 22, 2026", date: "2 items", dateLabel: "", onOpen: noop } },
    { label: "Posts, nothing yet — empty", props: { tool: "thought-leadership", name: "Posts", summary: "Nothing here yet", onOpen: noop } },
    { label: "Open beside its list (web) — selected", props: { ...pitches, current: true } },
    { label: "As the open folder's card, with Start", props: { ...pitches, summary: "Pitches for stages, shows and press", as: "header", headingLevel: 2, action: createElement("a", { href: "#", className: "btn btn--primary btn--md btn--full" }, "Start a pitch") } },
    { label: "Hover", props: { ...pitches, demo: "hover" } },
    { label: "Focus", props: { ...pitches, demo: "focus" } },
    { label: "Pressed", props: { ...pitches, demo: "active" } },
    { label: "Many items", props: { ...pitches, summary: "Last change Fri, Oct 9, 2026", date: "24 items" } },
    { label: "A long name wraps", props: { ...pitches, name: "Thought leadership pieces" } },
  ],
});
