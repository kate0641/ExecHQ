"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";
import { FLOW_COPY as C } from "@/mock/toolbox";

export interface WorkspaceTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface WorkspacePanelProps {
  tabs: readonly WorkspaceTab[];
  active: string;
  onActive: (id: string) => void;
  /** Pulled up. Down, it is a peek-height bar at the foot of the screen. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** On the web it is a side panel beside the draft, always open. */
  side?: boolean;
  /** Render in place, for the catalogue. */
  inline?: boolean;
  className?: string;
}

/**
 * Concept 2's workspace: the draft has the screen, and the inputs, changes and
 * versions live in a panel pulled up from a peek bar at its foot. It never
 * covers the draft unasked, and it leaves the page behind it alone. On the web
 * it becomes a side panel, always open beside the draft.
 *
 * The peek bar is a real button, so nothing needs dragging (WCAG 2.2 SC
 * 2.5.7). The tabs are buttons that say which is showing.
 */
export function WorkspacePanel({ tabs, active, onActive, open, onOpenChange, side = false, inline = false, className }: WorkspacePanelProps) {
  const bodyId = useId();
  const body = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(open);
  // Pulled up, focus goes to the tabs; put down, back to the bar.
  useEffect(() => {
    if (side || open === wasOpen.current) return;
    wasOpen.current = open;
    if (open) body.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }, [open, side]);

  const isOpen = side || open;
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const classes = ["workspace-panel", side ? "workspace-panel--side" : "workspace-panel--sheet", isOpen ? "is-open" : "is-peek", inline ? "workspace-panel--inline" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={classes} aria-label={C.peek}>
      {side ? null : (
        <button type="button" className="workspace-panel__bar" aria-expanded={open} aria-controls={bodyId} onClick={() => onOpenChange(!open)}>
          <span className="workspace-panel__grab" aria-hidden="true" />
          <span className="workspace-panel__bar-label">{open ? current.label : C.peek}</span>
          <span className="workspace-panel__bar-action">
            {open ? C.hidePanel : C.showPanel}
            <Icon name="chevron" size={16} className="workspace-panel__chevron" />
          </span>
        </button>
      )}
      <div className="workspace-panel__body" id={bodyId} hidden={!isOpen} ref={body}>
        {tabs.length > 1 ? (
          <div className="workspace-panel__tabs">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" className="workspace-panel__tab" aria-pressed={tab.id === current.id} onClick={() => onActive(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="workspace-panel__content">{current.content}</div>
      </div>
    </aside>
  );
}

export default WorkspacePanel;
