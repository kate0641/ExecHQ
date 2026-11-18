/**
 * Claude Code hook for design sessions. Runs before every file edit and shell
 * command Claude makes in this repo (see `.claude/settings.json`).
 *
 * For Kate's sessions — decided by the git address, see `design-areas.mjs` —
 * it does nothing. For everyone else it blocks the steps a design session must
 * never take, and tells Claude why so it can explain and carry on correctly:
 *
 *   - editing a file in the repo outside the design areas
 *   - committing on `main`
 *   - pushing to `main`, force-pushing, or deleting a branch on GitHub
 *   - merging, approving or closing a pull request, or changing repo settings
 *
 * This is a guardrail against mistakes, not a lock: the real lock is that
 * `main` only changes through a pull request Kate approves. Shell commands that
 * write files are not inspected; the pull request check catches those.
 *
 * Exit 0 allows the call. Exit 2 blocks it, and what is written to stderr is
 * shown to Claude.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { DESIGN_AREAS, inDesignArea, isMaintainer } from "./design-areas.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function git(...args) {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function block(reason) {
  process.stderr.write(`Design session guard: ${reason}\n`);
  process.exit(2);
}

if (isMaintainer(git("config", "user.email"))) process.exit(0);

let call;
try {
  call = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const tool = call.tool_name ?? "";
const input = call.tool_input ?? {};

// File edits ---------------------------------------------------------------------

const filePath = input.file_path ?? input.notebook_path;
if (filePath && /^(Edit|MultiEdit|Write|NotebookEdit)$/.test(tool)) {
  const absolute = isAbsolute(filePath) ? filePath : resolve(call.cwd ?? ROOT, filePath);
  const inRepo = relative(ROOT, absolute);
  const outsideRepo = inRepo.startsWith("..") || isAbsolute(inRepo);

  if (!outsideRepo) {
    const path = inRepo.split(sep).join("/");
    if (!inDesignArea(path)) {
      block(
        `${path} is outside the design areas, so a design session does not change it. ` +
          `The design areas are: ${DESIGN_AREAS.join(", ")}. ` +
          `If this change is really needed, tell the designer it is one for Kate, and carry on without it.`
      );
    }
  }
  process.exit(0);
}

// Shell commands ---------------------------------------------------------------

if (tool === "Bash" && typeof input.command === "string") {
  const command = input.command;
  const branch = git("rev-parse", "--abbrev-ref", "HEAD");

  if (/\bgh\s+pr\s+(merge|review|close)\b/.test(command)) {
    block("merging, reviewing and closing pull requests is Kate's job. Open the pull request and stop there.");
  }
  if (/\bgh\s+(repo\s+(edit|delete|rename)|api\b.*-X\s*(PUT|PATCH|DELETE))/.test(command)) {
    block("repository settings are Kate's. Leave them as they are.");
  }

  if (/\bgit\s+push\b/.test(command)) {
    if (/\s(--force\b|--force-with-lease\b|-f\b|\+)/.test(command)) {
      block("force-pushing rewrites history other people rely on. Push normally; if the push is rejected, update the branch from main instead.");
    }
    if (/\s(--delete\b|-d\b|:\S)/.test(command)) {
      block("deleting branches on GitHub is Kate's call.");
    }
    if (/(\s|:)main(?=\s|$|[;&|)])/.test(command) || branch === "main") {
      block("nothing is pushed to main in a design session. Commit on a design/<idea> branch and push that.");
    }
  }

  if (/\bgit\s+commit\b/.test(command) && branch === "main") {
    block("this would commit on main. Start a design branch first: git switch -c design/<short-idea-name>.");
  }
}

process.exit(0);
