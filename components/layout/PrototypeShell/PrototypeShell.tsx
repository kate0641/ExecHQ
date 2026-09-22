"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { DeviceFrame } from "@/components/layout/DeviceFrame";
import { HubPanel } from "@/components/hub/HubPanel";
import { ViewportToggle } from "@/components/hub/ViewportToggle";
import { useViewport } from "@/lib/viewport-context";

export interface PrototypeShellProps {
  /** The hub's flow index, rendered on the server and slotted into the panel. */
  hubIndex: ReactNode;
  children: ReactNode;
}

/**
 * The prototype's outermost frame: the developer toolbar, the canvas that
 * carries `data-viewport`, and the slide-out hub panel.
 *
 * `data-viewport` sits on `.prototype`, which contains every page. All
 * responsive CSS is written against that attribute — never `@media` — because
 * media queries respond to the browser window, not to a simulated frame
 * inside it.
 */
export function PrototypeShell({ hubIndex, children }: PrototypeShellProps) {
  const { viewport } = useViewport();
  const [hubOpen, setHubOpen] = useState(false);
  const hubTriggerRef = useRef<HTMLButtonElement>(null);
  const closeHub = useCallback(() => setHubOpen(false), []);

  return (
    <div className="prototype" data-viewport={viewport}>
      {/* The prototype's own controls sit above the canvas, clustered left, and
          before it in the DOM so reading order matches what is on screen. */}
      <div className="devtools">
        <p className="devtools__brand">
          <Link href="/" className="devtools__brand-link">
            ExecHQ prototype
          </Link>
        </p>

        <ViewportToggle />

        <button
          type="button"
          className="devtools__hub-button"
          ref={hubTriggerRef}
          onClick={() => setHubOpen((open) => !open)}
          aria-expanded={hubOpen}
        >
          {hubOpen ? "Close hub" : "Open hub"}
        </button>
      </div>

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
