/**
 * Plan briefs.
 *
 * The agent's background for each V1 plan: who it is for, its stages, the
 * action steps it can recommend and when, which signals each stage leans on,
 * and how the agent behaves. Reference pages like the interaction specs, not
 * product screens. One markdown file per brief in `/plans`, read at build
 * time on the server and drawn by the spec renderer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface PlanBriefEntry {
  slug: string;
  /** The user-facing plan name, or the shared page's title. */
  title: string;
  /** The template it briefs, for the plans. */
  template?: string;
  description: string;
}

/** In reading order: the shared rules first, then the five plans. */
export const PLAN_BRIEFS: readonly PlanBriefEntry[] = [
  {
    slug: "shared",
    title: "Rules for every plan",
    description: "The plan library, routing from onboarding, what to do when nothing matches, signals, and how the agent behaves on every plan.",
  },
  {
    slug: "step-up",
    title: "Step Up",
    template: "Increase leadership scope",
    description: "For a strong contributor or manager seeking a broader leadership role.",
  },
  {
    slug: "make-your-mark",
    title: "Make Your Mark",
    template: "Enhance overall executive presence",
    description: "For a leader who wants to be known for a point of view in their field.",
  },
  {
    slug: "make-the-move",
    title: "Make the Move",
    template: "Prepare for a career inflection point",
    description: "For a specific moment ahead: a promotion, a new role, a new path, a board seat.",
  },
  {
    slug: "lead-where-you-are",
    title: "Lead Where You Are",
    template: "Strengthen influence and presence in your current organization",
    description: "For more weight and visibility inside the organization she is in.",
  },
  {
    slug: "chart-a-new-course",
    title: "Chart a New Course",
    template: "Explore and clarify a new opportunity or direction",
    description: "For someone who wants something different but can't name it yet.",
  },
];

export interface PlanBrief extends PlanBriefEntry {
  /** Path shown on the page so the file is easy to find and open. */
  path: string;
  /** File contents, or null when the brief isn't written yet. */
  content: string | null;
}

const PLANS_DIR = join(process.cwd(), "plans");

export function getPlanBrief(slug: string): PlanBrief | undefined {
  const entry = PLAN_BRIEFS.find((brief) => brief.slug === slug);
  if (!entry) return undefined;
  const path = `plans/${slug}.md`;
  try {
    return { ...entry, path, content: readFileSync(join(PLANS_DIR, `${slug}.md`), "utf8").trim() };
  } catch {
    return { ...entry, path, content: null };
  }
}
