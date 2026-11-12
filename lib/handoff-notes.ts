/**
 * Dev handoff notes.
 *
 * Notes for the developers building ExecEngine: how a design decision becomes a
 * build rule, and what each screen does. Reference pages like the plan and
 * builder briefs, not product screens. One markdown file per note in
 * `/handoff`, read at build time on the server and drawn by the spec renderer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface HandoffNoteEntry {
  slug: string;
  title: string;
  description: string;
}

/** Newest first. */
export const HANDOFF_NOTES: readonly HandoffNoteEntry[] = [
  {
    slug: "onboarding-progress-and-word-budget",
    title: "Onboarding: a progress line, and forty words a screen",
    description:
      "A thin line with no words at the top of every onboarding page after the Welcome, filled to how far she is; and the rule that every screen says what it needs in 40 words or fewer (12 Nov).",
  },
  {
    slug: "renamed-execengine",
    title: "Renamed: ExecHQ is now ExecEngine",
    description:
      "Every on-screen mention, the address bar and the Profile download say ExecEngine; the logo sets \"Engine\" in type until the artwork arrives. Storage keys and code names keep exechq (12 Nov).",
  },
  {
    slug: "plan-fold-to-card",
    title: "Plan: folding leaves no bar",
    description:
      "On phone and tablet, folding the answer drawer takes it off the screen; the move card gains a \"Where are you with this?\" button that opens and folds it, filled while open (11 Nov).",
  },
  {
    slug: "plan-direction-card",
    title: "Plan: See your plan is gone",
    description:
      "The plan sheet and its See your plan link are removed (9 Nov). Why this plan and Change your direction, the two things only the sheet had, move onto the Your direction card above the roadmap.",
  },
  {
    slug: "plan-timing",
    title: "Plan: when a move falls",
    description:
      "The exact rules for each move's suggested day and its words (\"This week\", \"Next month\"), Change when's choices and stage periods, with a worked example and four choices still open (9 Nov).",
  },
  {
    slug: "stay-on-track-web",
    title: "Home on web: Stay on track's cards",
    description:
      "A web-only change to Homepage 4b (9 Nov): Stay on track's cards keep the Signal Picture column's width and sit side by side, with the dots left out when every card is in view.",
  },
  {
    slug: "homepage-weekly-check-in",
    title: "Homepage: the weekly check-in",
    description:
      "Homepage 4b replaces 4 (26 Oct). The one change: a weekly check-in card in Stay on track, a new slider, the direction in its question, what each answer changes in the plan, and the totals it feeds to the Admin Dashboard.",
  },
  {
    slug: "mobile-browser",
    title: "Mobile browser",
    description:
      "ExecEngine runs in the phone's browser, not as an app (19 Oct). How to size screens to the room Safari leaves, the four layout patterns, and what each screen pins and flexes.",
  },
];

export interface HandoffNote extends HandoffNoteEntry {
  /** Path shown on the page so the file is easy to find and open. */
  path: string;
  /** File contents, or null when the note isn't written yet. */
  content: string | null;
}

const HANDOFF_DIR = join(process.cwd(), "handoff");

export function getHandoffNote(slug: string): HandoffNote | undefined {
  const entry = HANDOFF_NOTES.find((note) => note.slug === slug);
  if (!entry) return undefined;
  const path = `handoff/${slug}.md`;
  try {
    return { ...entry, path, content: readFileSync(join(HANDOFF_DIR, `${slug}.md`), "utf8").trim() };
  } catch {
    return { ...entry, path, content: null };
  }
}
