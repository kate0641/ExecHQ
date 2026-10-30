import { defineComponentStates } from "@/components/types";
import { LibrarySearch, type LibrarySearchItem } from "./LibrarySearch";

const items: LibrarySearchItem[] = [
  { id: "post", title: "Post: What three regions taught me about planning", detail: "Posts · Draft · Today", preview: "Running campaigns in three regions taught me that the plan is where scope gets decided.", href: "#" },
  { id: "brief", title: "Brief for your manager check-in", detail: "Briefs · Draft · 2 days ago", preview: "Objective: leave Thursday’s check-in with the planning workstream agreed as mine.", href: "#", text: "Thursday check-in scope" },
  { id: "pitch", title: "Podcast pitch: Leading through change", detail: "Pitches · Waiting to hear · 1 week ago", href: "#" },
  { id: "panel", title: "Conference panel pitch", detail: "Pitches · Draft · 2 weeks ago", href: "#" },
  { id: "story", title: "Your positioning statement", detail: "Positioning · Ready to use · Oct 2", href: "#", text: "I turn regional campaigns into one plan" },
];

const copy = {
  field: "Search your library",
  recent: "Recent",
  matches: (n: number) => (n === 1 ? "1 match" : `${n} matches`),
  noMatch: (q: string) => `Nothing in your library mentions “${q}”.`,
};

const noop = () => {};

export const librarySearchStates = defineComponentStates({
  name: "LibrarySearch",
  group: "form controls",
  status: "draft",
  flows: ["playbook"],
  description:
    "Finding something in the library, in the sheet the magnifying glass opens (Playbook Concept 2). Before she types, her latest work; as she types, the matches update with each letter, best first, with what she typed marked in the title. Each match is a button that opens it.",
  component: LibrarySearch,
  notApplicable: {
    disabled: "Search is always open while the sheet is.",
    loading: "Her library is already on the page: matching is instant.",
    error: "Matching what is already here can't fail; nothing found is the empty state.",
  },
  variants: [
    { label: "Before she types — default", props: { items, copy, onPick: noop } },
    { label: "A match — hover", props: { items, copy, onPick: noop, demo: "hover" } },
    { label: "A match — focus", props: { items, copy, onPick: noop, demo: "focus" } },
    { label: "A match — pressed", props: { items, copy, onPick: noop, demo: "active" } },
    { label: "Typing: matches, best first", props: { items, copy, onPick: noop, initial: "pi" }, states: ["filled"] },
    { label: "Found by what it says", props: { items, copy, onPick: noop, initial: "scope" } },
    {
      label: "A long title wraps — long text",
      props: { items: [{ id: "long", title: "Brief for the conversation with the review’s sponsor before the planning cycle opens in January", detail: "Situation brief · 3 days ago", href: "#" }, ...items], copy, onPick: noop, initial: "brief" },
      states: ["long text"],
    },
    { label: "Nothing matches — empty", props: { items, copy, onPick: noop, initial: "budget" }, states: ["empty"] },
  ],
});
