"use client";

import { ToggleGroup } from "@/components/form/ToggleGroup";
import { ENTERPRISE_COPY, WINDOW_IDS, WINDOWS, type WindowId } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.window;

export interface WindowSelectorProps {
  value: WindowId;
  onChange: (next: WindowId) => void;
  /** The Monday the figures were last refreshed. */
  asOf: string;
  /** No update yet: `asOf` is the first one to come. */
  upcoming?: boolean;
  className?: string;
}

/**
 * The dashboard's window: 30 days, 90 days or since launch, and when the
 * figures were last refreshed. Nothing shorter than 30 days is offered and the
 * figures change once a week, so no window can isolate one person's activity.
 * Both rules are on screen, not only in a policy.
 */
export function WindowSelector({ value, onChange, asOf, upcoming = false, className }: WindowSelectorProps) {
  return (
    <div className={["window-selector", className].filter(Boolean).join(" ")}>
      <ToggleGroup
        label={C.label}
        labelHidden
        size="sm"
        shape="pill"
        options={WINDOW_IDS.map((id) => ({ value: id, label: WINDOWS[id].label }))}
        value={value}
        onChange={(next) => onChange(next as WindowId)}
      />
      <p className="window-selector__refreshed">{upcoming ? C.firstUpdate(asOf) : C.refreshed(asOf)}</p>
    </div>
  );
}

export default WindowSelector;
