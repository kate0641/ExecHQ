/**
 * Read helpers over `prototype.config.ts`.
 *
 * Nothing else in the prototype should reach into the config directly — go
 * through here so route shapes and status defaults are defined once.
 */
import {
  prototypeConfig,
  type Concept,
  type Flow,
  type NavChrome,
  type NavItem,
  type Status,
} from "@/prototype.config";

export type { Concept, Flow, NavChrome, NavItem, Status };

export const flows: readonly Flow[] = prototypeConfig.flows;

export const DEFAULT_STATUS: Status = "draft";

export const STATUS_LABELS: Record<Status, string> = {
  draft: "Draft",
  "in-review": "In review",
  approved: "Approved",
};

export const STATUS_ORDER: readonly Status[] = ["draft", "in-review", "approved"];

/** A concept's status, applying the `draft` default. */
export function conceptStatus(concept: Concept): Status {
  return concept.status ?? DEFAULT_STATUS;
}

export function getFlow(slug: string): Flow | undefined {
  return flows.find((flow) => flow.slug === slug);
}

export function getConcept(
  flowSlug: string,
  conceptSlug: string
): { flow: Flow; concept: Concept } | undefined {
  const flow = getFlow(flowSlug);
  const concept = flow?.concepts.find((item) => item.slug === conceptSlug);
  if (!flow || !concept) return undefined;
  return { flow, concept };
}

/** Route convention: /<flow-slug>/<concept-slug>. Defined once, here. */
export function conceptHref(flowSlug: string, conceptSlug: string): string {
  return `/${flowSlug}/${conceptSlug}`;
}

/** Where a flow points when linked as a whole: its first concept. */
export function flowHref(flow: Flow): string | undefined {
  const first = flow.concepts[0];
  return first ? conceptHref(flow.slug, first.slug) : undefined;
}

/** Every route the manifest declares — feeds `generateStaticParams`. */
export function allConceptParams(): { flow: string; concept: string }[] {
  return flows.flatMap((flow) =>
    flow.concepts.map((concept) => ({ flow: flow.slug, concept: concept.slug }))
  );
}

/** Nav items resolved to hrefs, skipping any whose flow has no concepts yet. */
export function resolveNav(
  items: readonly NavItem[]
): { label: string; href: string; flowSlug: string }[] {
  return items.flatMap((item) => {
    const flow = getFlow(item.flowSlug);
    const href = flow && flowHref(flow);
    return href ? [{ label: item.label, href, flowSlug: flow.slug }] : [];
  });
}

export function navForChrome(
  chrome: NavChrome
): { label: string; href: string; flowSlug: string }[] {
  if (chrome === "app") return resolveNav(prototypeConfig.appNav);
  if (chrome === "enterprise") return resolveNav(prototypeConfig.enterpriseNav);
  return [];
}

/** Flows grouped by sprint, in sprint order — how the hub lists them. */
export function flowsBySprint(): { sprint: number; flows: Flow[] }[] {
  const grouped = new Map<number, Flow[]>();
  for (const flow of flows) {
    const bucket = grouped.get(flow.sprint);
    if (bucket) bucket.push(flow);
    else grouped.set(flow.sprint, [flow]);
  }
  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([sprint, list]) => ({ sprint, flows: list }));
}
