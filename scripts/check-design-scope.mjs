/**
 * The pull request check for design branches.
 *
 * Run by `.github/workflows/pull-request.yml` on every pull request whose
 * branch starts `design/`. Compares the branch with the base it will merge
 * into and fails when it:
 *
 *   - changes a file outside the design areas (`scripts/design-areas.mjs`), or
 *   - changes a `status:` line — in a states file or the manifest — because
 *     only Kate promotes a status, and only after final review.
 *
 * Usage: node scripts/check-design-scope.mjs <base-ref>
 * e.g.   node scripts/check-design-scope.mjs origin/main
 */
import { execFileSync } from "node:child_process";
import { DESIGN_AREAS, inDesignArea } from "./design-areas.mjs";

const base = process.argv[2];
if (!base) {
  console.error("Usage: node scripts/check-design-scope.mjs <base-ref>");
  process.exit(1);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const range = `${base}...HEAD`;

const changed = git("diff", "--name-only", range).split("\n").filter(Boolean);
const outside = changed.filter((path) => !inDesignArea(path));

const statusLines = git("diff", "--unified=0", range, "--", "*.states.ts", "prototype.config.ts")
  .split("\n")
  .filter((line) => /^[+-]\s*status:/.test(line));

const problems = [];
if (outside.length > 0) {
  problems.push(
    `These files are outside the design areas (${DESIGN_AREAS.join(", ")}):\n` +
      outside.map((path) => `      ${path}`).join("\n") +
      "\n    Take them out of this branch, or ask Kate to make the change."
  );
}
if (statusLines.length > 0) {
  problems.push(
    "This branch changes a status line. Only Kate changes a status, after final review:\n" +
      statusLines.map((line) => `      ${line}`).join("\n")
  );
}

if (problems.length > 0) {
  console.error("\ncheck-design-scope — this design branch needs changes:\n");
  for (const problem of problems) console.error(`  - ${problem}\n`);
  process.exit(1);
}

console.log(`check-design-scope — ${changed.length} changed file(s), all inside the design areas`);
