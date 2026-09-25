/**
 * Which states each component shows, and which it is still missing.
 *
 * A component shows a state when one of its variants does. A variant counts
 * when its label contains one of the state's words below — "Primary — hover"
 * shows hover — or when it lists the state in `states`. The first variant
 * always counts as the default.
 *
 * A state that makes no sense for a component (a wordmark has no error state)
 * goes in the states file's `notApplicable`, with the reason. Anything neither
 * shown nor ruled out is a gap. The catalogue lists each component's gaps, and
 * the build fails on any gap not already recorded in `states-baseline.json`.
 *
 * The baseline is the list of gaps that existed when this check arrived. It
 * only ever shrinks: showing a recorded state, or ruling it out, means taking
 * it off the list, and the build says exactly which line to remove.
 */
import baseline from "./states-baseline.json";
import { registry } from "./registry";
import { COMPONENT_STATES, type ComponentState, type RegisteredComponent } from "./types";

const STATE_WORDS: Record<ComponentState, RegExp> = {
  default: /\bdefault\b/i,
  hover: /\bhover/i,
  focus: /\bfocus/i,
  active: /\b(active|pressed)\b/i,
  disabled: /\b(disabled|unavailable)\b/i,
  loading: /\b(loading|generating|saving|pending)\b/i,
  error: /\b(error|invalid|failed)\b/i,
  empty: /\b(empty|blank|none)\b/i,
  filled: /\b(filled|chosen|selected|answered)\b/i,
  "long text": /\b(long|overflow|wraps?)\b/i,
};

/** The states a component's variants show. */
export function shownStates(component: RegisteredComponent): Set<ComponentState> {
  const shown = new Set<ComponentState>();
  if (component.variants.length > 0) shown.add("default");
  for (const variant of component.variants) {
    for (const state of variant.states) shown.add(state);
    for (const state of COMPONENT_STATES) {
      if (STATE_WORDS[state].test(variant.label)) shown.add(state);
    }
  }
  return shown;
}

/** States neither shown nor ruled out, in the standard order. */
export function missingStates(component: RegisteredComponent): ComponentState[] {
  const shown = shownStates(component);
  return COMPONENT_STATES.filter(
    (state) => !shown.has(state) && !(state in component.notApplicable)
  );
}

const recorded = baseline as Record<string, string[]>;

/**
 * Everything wrong with state coverage across the registry, as sentences the
 * person fixing it can act on. Empty when all is well.
 */
export function coverageProblems(): string[] {
  const problems: string[] = [];

  for (const component of registry) {
    const missing = missingStates(component);
    const known = new Set(recorded[component.name] ?? []);

    for (const state of missing) {
      if (!known.has(state)) {
        problems.push(
          `${component.name} does not show a "${state}" state. Add a variant whose label says "${state}", ` +
            `or add it to notApplicable in ${component.name}.states.ts with the reason it does not apply.`
        );
      }
    }
    for (const state of known) {
      if (!missing.includes(state as ComponentState)) {
        problems.push(
          `${component.name} now covers "${state}". Remove "${state}" from "${component.name}" in components/states-baseline.json.`
        );
      }
    }
  }

  for (const name of Object.keys(recorded)) {
    if (!registry.some((component) => component.name === name)) {
      problems.push(
        `components/states-baseline.json lists "${name}", which is not in the registry. Remove its entry.`
      );
    }
  }

  return problems;
}
