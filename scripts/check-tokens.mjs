/**
 * Guards the greyscale-via-tokens rule.
 *
 * Every colour in this prototype is declared once in styles/tokens.css. Any
 * literal colour value found anywhere else fails this check, so swapping in the
 * real brand palette stays a single-file edit.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SEARCH_DIRS = ["app", "components", "lib", "styles"];
const ALLOWED = ["styles/tokens.css"];
const EXTENSIONS = [".css", ".ts", ".tsx", ".js", ".jsx"];

const COLOUR_PATTERNS = [
  { name: "hex colour", re: /#[0-9a-fA-F]{3,8}\b/g },
  { name: "rgb()/rgba()", re: /\brgba?\s*\(/g },
  { name: "hsl()/hsla()", re: /\bhsla?\s*\(/g },
  { name: "oklch()/oklab()", re: /\bokl(ch|ab)\s*\(/g },
  { name: "colour keyword", re: /:\s*(white|black|red|blue|green|grey|gray)\b/g },
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else if (EXTENSIONS.some((ext) => full.endsWith(ext))) {
      yield full;
    }
  }
}

const violations = [];

for (const dir of SEARCH_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (ALLOWED.includes(rel)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      for (const { name, re } of COLOUR_PATTERNS) {
        re.lastIndex = 0;
        if (re.test(line)) {
          violations.push(`${rel}:${index + 1}  ${name}  ${line.trim()}`);
          break;
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error(
    `Hard-coded colour values found outside styles/tokens.css (${violations.length}):\n`
  );
  for (const violation of violations) console.error(`  ${violation}`);
  console.error("\nDeclare the colour as a token in styles/tokens.css and reference it with var().");
  process.exit(1);
}

console.log("check:tokens — no hard-coded colour values outside styles/tokens.css");
