/**
 * Interaction specs.
 *
 * One markdown file per flow slug in `/specs`, rendered by the hub in the slot
 * beneath each flow. Read at build time on the server — never fetched.
 *
 * Content is rendered as plain text for now. When specs carry real structure
 * we will need a markdown renderer, which is a new dependency and therefore a
 * conversation with Kate first (see CLAUDE.md).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Spec {
  flowSlug: string;
  /** Path shown in the hub so the file is easy to find and open. */
  path: string;
  /** File contents, or null when the file is missing. */
  content: string | null;
}

const SPECS_DIR = join(process.cwd(), "specs");

export function getSpec(flowSlug: string): Spec {
  const relativePath = `specs/${flowSlug}.md`;
  try {
    return {
      flowSlug,
      path: relativePath,
      content: readFileSync(join(SPECS_DIR, `${flowSlug}.md`), "utf8").trim(),
    };
  } catch {
    return { flowSlug, path: relativePath, content: null };
  }
}
