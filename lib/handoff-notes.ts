/**
 * Dev handoff notes.
 *
 * Notes for the developers building ExecHQ: how a design decision becomes a
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
    slug: "mobile-browser",
    title: "Mobile browser",
    description:
      "ExecHQ runs in the phone's browser, not as an app (19 Oct). How to size screens to the room Safari leaves, the four layout patterns, and what each screen pins and flexes.",
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
