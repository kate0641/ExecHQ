/**
 * Builder briefs.
 *
 * The agent's background for each Playbook builder: what it makes, what it
 * knows and asks, the draft section by section, how it changes, how it is
 * used and followed up, and how the agent behaves. Every builder's brief has
 * the same sections, because the four share one workflow and differ only in
 * what they ask and make. Reference pages like the plan briefs, not product
 * screens. One markdown file per brief in `/builders`, read at build time on
 * the server and drawn by the spec renderer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface BuilderBriefEntry {
  slug: string;
  /** The builder's name, or the shared page's title. */
  title: string;
  /** What it makes, for the builders. */
  makes?: string;
  description: string;
}

/** In reading order: the shared rules first, then the four builders. */
export const BUILDER_BRIEFS: readonly BuilderBriefEntry[] = [
  {
    slug: "shared",
    title: "Rules for every builder",
    description: "The one workflow all four share, the three kinds of wording in a draft, changing and versions, the Loop, the library, and how the agent behaves in every builder.",
  },
  {
    slug: "positioning",
    title: "Positioning Builder",
    makes: "Positioning statement, bios and leadership narrative",
    description: "Who she is, the value she creates and where she is headed, in forms she can reuse.",
  },
  {
    slug: "pitch",
    title: "Pitch Builder",
    makes: "Pitches for speaking, podcasts and press",
    description: "A sendable pitch with subject lines and its follow-up.",
  },
  {
    slug: "situation-brief",
    title: "Situation Brief",
    makes: "A one-page brief for a moment that matters",
    description: "What she wants from a review, board meeting, negotiation or hard conversation, what she will say, and what they will ask.",
  },
  {
    slug: "thought-leadership",
    title: "Thought Leadership Builder",
    makes: "LinkedIn posts and articles",
    description: "Her point of view in public, from her own idea, a plan step or a Briefing read.",
  },
];

export interface BuilderBrief extends BuilderBriefEntry {
  /** Path shown on the page so the file is easy to find and open. */
  path: string;
  /** File contents, or null when the brief isn't written yet. */
  content: string | null;
}

const BUILDERS_DIR = join(process.cwd(), "builders");

export function getBuilderBrief(slug: string): BuilderBrief | undefined {
  const entry = BUILDER_BRIEFS.find((brief) => brief.slug === slug);
  if (!entry) return undefined;
  const path = `builders/${slug}.md`;
  try {
    return { ...entry, path, content: readFileSync(join(BUILDERS_DIR, `${slug}.md`), "utf8").trim() };
  } catch {
    return { ...entry, path, content: null };
  }
}
