"use client";

import { ToggleGroup } from "@/components/form/ToggleGroup";
import { ENTERPRISE_COPY, WINDOW_IDS, WINDOWS, type WindowId } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.window;

export interface WindowSelectorProps {
  value: WindowId;
  onChange: (next: WindowId) => void;
  /** The day the figures were last updated. */
  asOf: string;
  /** No update yet: `asOf` is the first one to come. */
  upcoming?: boolean;
  /** Leaves out the refreshed line where the page says it elsewhere. */
  hideRefreshed?: boolean;
  className?: string;
}

/**
 * The dashboard's window: 30 days, 90 days or since launch, and when the
 * figures were last updated. Being replaced by a date-range picker (Kate,
 * 2026-10-21), which allows any dates; the minimum cohort size is then the
 * only rule that keeps a short range from isolating one person.
 */
export function WindowSelector({ value, onChange, asOf, upcoming = false, hideRefreshed, className }: WindowSelectorProps) {
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
      {hideRefreshed ? null : <p className="window-selector__refreshed">{upcoming ? C.firstUpdate(asOf) : C.refreshed(asOf)}</p>}
    </div>
  );
}

export default WindowSelector;
