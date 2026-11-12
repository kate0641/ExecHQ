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
    slug: "onboarding-meatier-influence-questions",
    title: "Onboarding: meatier influence questions, and nothing that assumes leaving",
    description:
      "The influence path asks which decision she wants a say in and who decides it; answers that assumed leaving the company are swapped for ones inside it (12 Nov).",
  },
  {
    slug: "onboarding-drop-holding-you-back",
    title: "Onboarding: \"What's holding you back?\" is dropped",
    description:
      "The question before the plan on the influence path is removed, with its routing; those directions go from narrowing straight to Choose your plan (12 Nov).",
  },
  {
    slug: "onboarding-choose-your-plan",
    title: "Onboarding: she chooses her plan",
    description:
      "The Recommendation becomes Choose your plan: all five plans on one page, ExecEngine's pick first, marked and chosen to start with; See other plans is removed. About 110 words to 13 (12 Nov).",
  },
  {
    slug: "plan-names-from-briefs",
    title: "The plans take the plan briefs' names",
    description:
      "Step Up, Make Your Mark, Make the Move and Lead Where You Are, everywhere a plan is named; Find your next direction keeps its name until its brief is rewritten. Stages unchanged (12 Nov).",
  },
  {
    slug: "onboarding-direction-within-company",
    title: "Onboarding: a move within the company, not out of it",
    description:
      "\"Find my next move\" becomes \"Make a move within my company\" (another function, or another part of the business), \"Get out of where I am\" is removed, and the presentation answer drops \"board\" (12 Nov).",
  },
  {
    slug: "onboarding-where-are-you-today",
    title: "Onboarding: Where are you today?",
    description:
      "A new question before Direction, with tick boxes and Other opening a field for her own words; Direction shows \"I'm not sure yet\" with the first five; the answer opens the Recommendation's reason and the plan page's read-back (12 Nov).",
  },
  {
    slug: "onboarding-linkedin-to-signals",
    title: "Onboarding: LinkedIn moves to Signals",
    description:
      "The Signals step and the LinkedIn upload page leave onboarding; Account goes straight to Direction and Done no longer mentions LinkedIn. The Signals page's own upload is unchanged (12 Nov).",
  },
  {
    slug: "onboarding-account-personal-email",
    title: "Onboarding: a personal email, and everyone has a code",
    description:
      "Account asks for \"Your personal email\" with the reason under it, then \"Your invite code\" as a required field; \"I don't have a code\" is gone, and the page drops from 55 words to 29 (12 Nov).",
  },
  {
    slug: "onboarding-what-execengine-is",
    title: "Onboarding: What ExecEngine is, in a glance",
    description:
      "Three statements, the four Playbook tools by name and privacy in a line, built in one idea at a time over about five seconds; 40 words, down from about 120 (12 Nov).",
  },
  {
    slug: "onboarding-welcome-line",
    title: "Onboarding: the Welcome's new line",
    description:
      "The Welcome's line becomes \"Part coach, part advisor, part confidant. Private to you, and built around where you want to go.\" on phone, tablet and web; heading and serif line unchanged (12 Nov).",
  },
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
