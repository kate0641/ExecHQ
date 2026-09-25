"use client";

import { useId, useMemo, useState } from "react";
import { Badge, StatusBadge } from "@/components/primitives/Badge";
import { Input } from "@/components/form/Input";
import { componentId, registry, registryByGroup } from "@/components/registry";
import { missingStates } from "@/components/states-coverage";
import { STATUS_LABELS, STATUS_ORDER, flows, type Status } from "@/lib/manifest";

type StatusFilter = Status | "all";
type FlowFilter = string | "all";

/**
 * The component catalogue.
 *
 * Renders the real components imported through `components/registry.ts`, never
 * copies, and takes every variant from each component's own `*.states.ts` file
 * — so the catalogue cannot drift out of sync with the components themselves.
 *
 * Component status is filtered here and set in the states files. "Approved only"
 * shows the set handed off to engineering.
 */
export function ComponentCatalogue() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [flowFilter, setFlowFilter] = useState<FlowFilter>("all");
  const [selectedId, setSelectedId] = useState<string>(() =>
    registry.length > 0 ? componentId(registry[0]) : ""
  );
  const statusFilterId = useId();
  const flowFilterId = useId();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return registry.filter((component) => {
      const matchesQuery =
        needle === "" ||
        component.name.toLowerCase().includes(needle) ||
        component.group.toLowerCase().includes(needle) ||
        component.description.toLowerCase().includes(needle);
      const matchesStatus =
        statusFilter === "all" || component.status === statusFilter;
      const matchesFlow =
        flowFilter === "all" || component.flows.includes(flowFilter);
      return matchesQuery && matchesStatus && matchesFlow;
    });
  }, [query, statusFilter, flowFilter]);

  const groups = registryByGroup(filtered);
  const selected =
    filtered.find((component) => componentId(component) === selectedId) ?? filtered[0];

  return (
    <div className="catalogue">
      <div className="catalogue__menu">
        <div className="catalogue__filters">
          <Input
            label="Search components"
            labelHidden
            type="search"
            placeholder="Search components"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="catalogue__filter">
            <label className="catalogue__filter-label" htmlFor={statusFilterId}>
              Status
            </label>
            <select
              className="catalogue__select"
              id={statusFilterId}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((status) => (
                <option value={status} key={status}>
                  {status === "approved"
                    ? "Approved only"
                    : `${STATUS_LABELS[status]} only`}
                </option>
              ))}
            </select>
          </div>

          <div className="catalogue__filter">
            <label className="catalogue__filter-label" htmlFor={flowFilterId}>
              Flow
            </label>
            <select
              className="catalogue__select"
              id={flowFilterId}
              value={flowFilter}
              onChange={(event) => setFlowFilter(event.target.value)}
            >
              <option value="all">All flows</option>
              {flows.map((flow) => (
                <option value={flow.slug} key={flow.slug}>
                  {flow.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className="catalogue__nav" aria-label="Components">
          {groups.length === 0 ? (
            <p className="catalogue__empty">
              No components match that search and those filters.
            </p>
          ) : (
            groups.map(({ group, components }) => (
              <div className="catalogue__group" key={group}>
                <h2 className="catalogue__group-title t-eyebrow">{group}</h2>
                <ul className="catalogue__list">
                  {components.map((component) => {
                    const id = componentId(component);
                    const isSelected = selected && componentId(selected) === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className={`catalogue__item${isSelected ? " is-selected" : ""}`}
                          onClick={() => setSelectedId(id)}
                          aria-current={isSelected ? "true" : undefined}
                        >
                          <span className="catalogue__item-name">{component.name}</span>
                          <StatusBadge status={component.status} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </nav>
      </div>

      <div className="catalogue__detail">
        {selected ? (
          <>
            <header className="catalogue__detail-header">
              <div className="catalogue__detail-heading">
                <h2 className="catalogue__detail-title">{selected.name}</h2>
                <div className="u-row">
                  <Badge>{selected.group}</Badge>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <p className="catalogue__detail-description">{selected.description}</p>
              <p className="catalogue__detail-flows">
                {selected.flows.length === 0
                  ? "Used by the prototype shell. Not yet assigned to a flow."
                  : `Used in: ${selected.flows.join(", ")}`}
              </p>
              <CoverageNote component={selected} />
            </header>

            <ul className="catalogue__variants">
              {selected.variants.map((variant) => (
                <li className="catalogue__variant" key={variant.label}>
                  <div className="catalogue__variant-meta">
                    <p className="catalogue__variant-label">{variant.label}</p>
                    {variant.description ? (
                      <p className="catalogue__variant-description">
                        {variant.description}
                      </p>
                    ) : null}
                  </div>
                  <div
                    className={`catalogue__stage catalogue__stage--${selected.surface}`}
                  >
                    {variant.element}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="catalogue__empty">
            Nothing selected. Clear the search or the filters to see components.
          </p>
        )}
      </div>
    </div>
  );
}

/** What the selected component does not show yet, and what it rules out. */
function CoverageNote({ component }: { component: (typeof registry)[number] }) {
  const missing = missingStates(component);
  const ruledOut = Object.entries(component.notApplicable);

  return (
    <div className="catalogue__coverage">
      <p>
        {missing.length === 0
          ? "Shows every state that applies."
          : `Not shown yet: ${missing.join(", ")}.`}
      </p>
      {ruledOut.length > 0 ? (
        <ul className="catalogue__coverage-list">
          {ruledOut.map(([state, reason]) => (
            <li key={state}>
              No {state} state: {reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default ComponentCatalogue;
