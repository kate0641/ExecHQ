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

export interface ComponentVariant<P> {
  /** The state or variant this shows, e.g. "Primary — disabled". */
  label: string;
  /** Optional note about when to use it, or how the state is reached. */
  description?: string;
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
}

export interface RegisteredVariant {
  label: string;
  description?: string;
  element: ReactElement;
}

export interface RegisteredComponent {
  name: string;
  group: ComponentGroup;
  status: Status;
  flows: string[];
  description: string;
  surface: "default" | "inverse";
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
    variants: spec.variants.map((variant) => ({
      label: variant.label,
      description: variant.description,
      element: createElement(spec.component, variant.props),
    })),
  };
}
