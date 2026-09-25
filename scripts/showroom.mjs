/**
 * `npm run showroom` — the one command a designer runs.
 *
 * Gets a laptop from a fresh clone to the showroom open in a browser tab:
 *
 *   1. Checks Node is the pinned version (`.nvmrc`), or at least new enough.
 *   2. Creates `.env.local` from `.env.example` if it is missing, and warns if
 *      an existing one does not turn the showroom on.
 *   3. Installs packages with `npm ci` when they are missing or older than
 *      `package-lock.json`. `npm ci` never rewrites the lockfile, so a design
 *      branch cannot pick up an accidental dependency change from here.
 *   4. Starts the dev server on the first free port from 3000 and prints the
 *      showroom's address.
 *
 * No dependencies beyond Node itself.
 */
import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const at = (path) => join(ROOT, path);

function say(message) {
  console.log(`\n  showroom — ${message}`);
}

function stop(message) {
  console.error(`\n  showroom — ${message}\n`);
  process.exit(1);
}

// 1. Node -------------------------------------------------------------------

const pinned = Number(readFileSync(at(".nvmrc"), "utf8").trim());
const running = Number(process.versions.node.split(".")[0]);

if (running < pinned) {
  stop(
    `this needs Node ${pinned}, and this laptop has Node ${process.versions.node}.\n` +
      `  Install Node ${pinned} from https://nodejs.org (or run "nvm use"), then try again.`
  );
}
if (running !== pinned) {
  say(
    `running on Node ${process.versions.node}. The project is pinned to Node ${pinned}, ` +
      `which is what the preview links build with. It should work, but if something ` +
      `looks different from the preview, switch to Node ${pinned}.`
  );
}

// 2. Settings file ------------------------------------------------------------

if (!existsSync(at(".env.local"))) {
  copyFileSync(at(".env.example"), at(".env.local"));
  say("created .env.local from .env.example.");
} else if (!/^\s*SHOWROOM\s*=\s*on\s*$/m.test(readFileSync(at(".env.local"), "utf8"))) {
  stop(
    ".env.local exists but does not turn the showroom on.\n" +
      '  Add the line "SHOWROOM=on" to it (see .env.example), then try again.'
  );
}

// 3. Packages -------------------------------------------------------------------

// npm writes this file at the end of every install, so its age is the age of
// the install.
const installed = at("node_modules/.package-lock.json");
const stale =
  !existsSync(installed) ||
  statSync(installed).mtimeMs < statSync(at("package-lock.json")).mtimeMs;

if (stale) {
  say("installing packages. The first time takes a minute or two.");
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["ci"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) stop("installing packages failed. The messages above say why.");
}

// 4. Dev server ------------------------------------------------------------------

function isFree(port) {
  return new Promise((resolve) => {
    const server = createServer()
      .once("error", () => resolve(false))
      .once("listening", () => server.close(() => resolve(true)))
      .listen(port);
  });
}

let port = 3000;
while (!(await isFree(port))) port += 1;

say(
  `starting. When it says "Ready", open:\n\n` +
    `      http://localhost:${port}/showroom\n\n` +
    `  Press Ctrl+C here to stop it.`
);

const nextBin = at("node_modules/next/dist/bin/next");
const next = spawn(process.execPath, [nextBin, "dev", "--port", String(port)], {
  cwd: ROOT,
  stdio: "inherit",
});
next.on("exit", (code) => process.exit(code ?? 0));
