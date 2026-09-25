/**
 * Guards "every component appears in the catalogue as soon as it exists".
 *
 * Each component folder, `components/<group>/<Name>/`, must have a
 * `<Name>.states.ts` beside it and a line importing that file in
 * `components/registry.ts`. The prototype's own frame — the device frame, the
 * dock, the chrome and the hub — is exempt, because it is not product UI.
 *
 * Whether each component shows every state is checked separately, by the
 * build: see `components/states-coverage.ts`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const COMPONENTS = join(ROOT, "components");

/** Shell infrastructure, deliberately not in the catalogue. */
const SHELL = new Set([
  "hub/ComponentCatalogue",
  "hub/FlowList",
  "hub/HubNav",
  "hub/HubPanel",
  "hub/StyleguideViewer",
  "hub/ViewportToggle",
  "layout/AppChrome",
  "layout/DevToolbar",
  "layout/DeviceFrame",
  "layout/HubChrome",
  "layout/PrototypeShell",
]);

const registrySource = readFileSync(join(COMPONENTS, "registry.ts"), "utf8");
const problems = [];

for (const group of readdirSync(COMPONENTS)) {
  const groupDir = join(COMPONENTS, group);
  if (!statSync(groupDir).isDirectory()) continue;

  for (const name of readdirSync(groupDir)) {
    const dir = join(groupDir, name);
    if (!statSync(dir).isDirectory()) continue;
    const key = `${group}/${name}`;
    if (SHELL.has(key)) continue;

    if (!existsSync(join(dir, `${name}.states.ts`))) {
      problems.push(`components/${key} has no ${name}.states.ts. Add one — see README.md, "Adding a component to the catalogue".`);
    } else if (!registrySource.includes(`"./${key}/${name}.states"`)) {
      problems.push(`components/${key}/${name}.states.ts is not in components/registry.ts. Import it there and add it to the registry list.`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\ncheck:components — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}

console.log("check:components — every component has a states file and a catalogue entry");
