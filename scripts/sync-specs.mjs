/**
 * Creates a stub interaction spec for any flow in the manifest that does not
 * have one yet, so adding a flow stays a single edit to prototype.config.ts.
 *
 * Existing spec files are never touched.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SPECS_DIR = join(ROOT, "specs");

const { prototypeConfig } = await import(join(ROOT, "prototype.config.ts"));

mkdirSync(SPECS_DIR, { recursive: true });

let created = 0;
for (const flow of prototypeConfig.flows) {
  const file = join(SPECS_DIR, `${flow.slug}.md`);
  if (existsSync(file)) continue;
  writeFileSync(
    file,
    `# ${flow.title} — interaction spec\n\nNot yet written.\n`,
    "utf8"
  );
  created += 1;
  console.log(`created specs/${flow.slug}.md`);
}

console.log(
  created === 0
    ? "sync:specs — every flow already has a spec file"
    : `sync:specs — created ${created} spec file(s)`
);
