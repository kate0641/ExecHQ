"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { DeviceFrame } from "@/components/layout/DeviceFrame";
import { DevToolbar } from "@/components/layout/DevToolbar";
import { HubPanel } from "@/components/hub/HubPanel";
import { useViewport } from "@/lib/viewport-context";

export interface PrototypeShellProps {
  /** The hub's flow index, rendered on the server and slotted into the panel. */
  hubIndex: ReactNode;
  children: ReactNode;
}

/**
 * The prototype's outermost frame: the canvas that carries `data-viewport`, the
 * floating toolbar, and the slide-out hub panel.
 *
 * `data-viewport` sits on `.prototype`, which contains every page. All
 * responsive CSS is written against that attribute — never `@media` — because
 * media queries respond to the browser window, not to a simulated frame
 * inside it.
 *
 * The toolbar floats above the canvas rather than sitting in the layout, so it
 * can be dragged out of the way. It comes first in the DOM so it stays first in
 * reading and tab order wherever it has been moved to.
 */
export function PrototypeShell({ hubIndex, children }: PrototypeShellProps) {
  const { viewport } = useViewport();
  const [hubOpen, setHubOpen] = useState(false);
  const hubTriggerRef = useRef<HTMLButtonElement>(null);
  const closeHub = useCallback(() => setHubOpen(false), []);
  const toggleHub = useCallback(() => setHubOpen((open) => !open), []);

  return (
    <div className="prototype" data-viewport={viewport}>
      <DevToolbar
        hubOpen={hubOpen}
        onToggleHub={toggleHub}
        hubTriggerRef={hubTriggerRef}
      />

      <div className="prototype__canvas">
        <DeviceFrame>{children}</DeviceFrame>
      </div>

      <HubPanel open={hubOpen} onClose={closeHub}>
        {hubIndex}
      </HubPanel>
    </div>
  );
}

export default PrototypeShell;
