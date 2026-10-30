import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { LibraryTabs } from "./LibraryTabs";

const noop = () => {};
const tabs = [
  { id: "all", label: "All", count: 6 },
  { id: "positioning", label: "Positioning", count: 2 },
  { id: "pitch", label: "Pitches", count: 2 },
  { id: "situation-brief", label: "Briefs", count: 1 },
  { id: "thought-leadership", label: "Posts", count: 1 },
];
const base = { tabs, value: "all", onChange: noop, label: "Folders", idBase: "catalogue-library" };

export const libraryTabsStates = defineComponentStates({
  name: "LibraryTabs",
  group: "navigation",
  status: "draft",
  flows: ["playbook"],
  description:
    "The library's tabs: on web the folders as a column (All, then one per tool, each with how many it holds), and an open folder's status spread across the width over its cards. Arrow keys move between the tabs and choose; the chosen one is underlined and set in the stronger weight, so the line is never the only cue.",
  component: LibraryTabs,
  notApplicable: {
    disabled: "A folder can always be opened, even empty.",
    loading: "Read from the Loop on her device: there is nothing to wait for.",
    error: "Choosing a tab only shows what is already here: nothing can fail.",
    filled: NOT_AN_INPUT,
    "long text": "The tab names are the four fixed folder names and All.",
  },
  variants: [
    { label: "All chosen — default", props: base },
    { label: "A folder chosen — selected", props: { ...base, value: "pitch" } },
    { label: "Just started: one draft, three empty folders — empty", props: { ...base, tabs: [{ id: "all", label: "All", count: 1 }, { id: "positioning", label: "Positioning", count: 1 }, { id: "pitch", label: "Pitches", count: 0 }, { id: "situation-brief", label: "Briefs", count: 0 }, { id: "thought-leadership", label: "Posts", count: 0 }] } },
    { label: "A column: the folders on web (2026-10-28) — selected", props: { ...base, value: "pitch", orientation: "vertical" as const } },
    { label: "Spread across the width: an open folder's status (2026-10-28)", props: { ...base, tabs: [{ id: "all", label: "All", count: 2 }, { id: "draft", label: "Draft", count: 1 }, { id: "waiting", label: "Waiting to hear", count: 1 }, { id: "closed", label: "Closed", count: 0 }], className: "library-tabs--spread" } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
  ],
});
