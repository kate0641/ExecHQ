import { createElement, type ComponentProps, type ElementType, type ReactElement } from "react";
import type { Status } from "@/lib/manifest";

/**
 * Every component ships a sibling `*.states.ts` file declaring its variants and
 * every state it supports. `components/registry.ts` collects those files and the
 * catalogue reads only from the registry, so the catalogue cannot drift out of
 * sync with the components themselves.
 *
 * Component status is tracked HERE, not in prototype.config.ts, because one
 * component may appear across several flows at different stages. Only Kate
 * changes it.
 */

export const COMPONENT_GROUPS = [
  "primitives",
  "form controls",
  "navigation",
  "layout",
  "cards",
  "feedback",
] as const;

export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

/**
 * The states every component is checked for. `components/states-coverage.ts`
 * says how a variant counts as showing one, and the build fails when a
 * component neither shows a state nor says why it does not apply.
 */
export const COMPONENT_STATES = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "error",
  "empty",
  "filled",
  "long text",
] as const;

export type ComponentState = (typeof COMPONENT_STATES)[number];

export interface ComponentVariant<P> {
  /** The state or variant this shows, e.g. "Primary — disabled". */
  label: string;
  /** Optional note about when to use it, or how the state is reached. */
  description?: string;
  /** States this variant shows, where the label does not already say so. */
  states?: ComponentState[];
  props: P;
}

export interface ComponentStatesSpec<C extends ElementType> {
  name: string;
  group: ComponentGroup;
  /** Changed by Kate only, when she says the component has passed review. */
  status: Status;
  /** Flow slugs this component is used in. Empty means shell-only for now. */
  flows: string[];
  description: string;
  /** The real component, imported from its own file. Never a copy. */
  component: C;
  variants: ComponentVariant<ComponentProps<C>>[];
  /** Render the variants on the inverse surface instead of the default one. */
  surface?: "default" | "inverse";
  /** States that do not apply to this component, each with the reason — e.g.
   *  `{ loading: "Static text; there is nothing to wait for." }`. */
  notApplicable?: Partial<Record<ComponentState, string>>;
}

export interface RegisteredVariant {
  label: string;
  description?: string;
  states: ComponentState[];
  element: ReactElement;
}

export interface RegisteredComponent {
  name: string;
  group: ComponentGroup;
  status: Status;
  flows: string[];
  description: string;
  surface: "default" | "inverse";
  notApplicable: Partial<Record<ComponentState, string>>;
  variants: RegisteredVariant[];
}

/**
 * Type-erases a states file for the registry while keeping the props of each
 * variant checked against the real component's props at the point of writing.
 */
export function defineComponentStates<C extends ElementType>(
  spec: ComponentStatesSpec<C>
): RegisteredComponent {
  return {
    name: spec.name,
    group: spec.group,
    status: spec.status,
    flows: spec.flows,
    description: spec.description,
    surface: spec.surface ?? "default",
    notApplicable: spec.notApplicable ?? {},
    variants: spec.variants.map((variant) => ({
      label: variant.label,
      description: variant.description,
      states: variant.states ?? [],
      element: createElement(spec.component, variant.props),
    })),
  };
}
