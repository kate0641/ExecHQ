/**
 * The component catalogue's only data source.
 *
 * Each entry is the component's own `*.states.ts` file, which imports the real
 * component. The catalogue renders what is here and nothing else, so it cannot
 * show a copy or fall out of date with the component itself.
 *
 * Adding a component to the catalogue: write `X.states.ts` next to it, then add
 * one line to this file.
 */
import { COMPONENT_GROUPS, type ComponentGroup, type RegisteredComponent } from "./types";

import { badgeStates } from "./primitives/Badge/Badge.states";
import { buttonStates } from "./primitives/Button/Button.states";
import { iconStates } from "./primitives/Icon/Icon.states";
import { textLinkStates } from "./primitives/TextLink/TextLink.states";
import { inputStates } from "./form/Input/Input.states";
import { toggleGroupStates } from "./form/ToggleGroup/ToggleGroup.states";
import { panelStates } from "./layout/Panel/Panel.states";
import { placeholderStateStates } from "./layout/PlaceholderState/PlaceholderState.states";

export const registry: RegisteredComponent[] = [
  badgeStates,
  buttonStates,
  iconStates,
  textLinkStates,
  inputStates,
  toggleGroupStates,
  panelStates,
  placeholderStateStates,
];

/** URL-safe id for a component, used for catalogue deep links. */
export function componentId(component: RegisteredComponent): string {
  return component.name.toLowerCase();
}

export function getComponent(id: string): RegisteredComponent | undefined {
  return registry.find((component) => componentId(component) === id);
}

/** The registry grouped by type, in the order declared in `types.ts`, with
 *  empty groups dropped. */
export function registryByGroup(
  components: RegisteredComponent[] = registry
): { group: ComponentGroup; components: RegisteredComponent[] }[] {
  return COMPONENT_GROUPS.map((group) => ({
    group,
    components: components
      .filter((component) => component.group === group)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((entry) => entry.components.length > 0);
}
