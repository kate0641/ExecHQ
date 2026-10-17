"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DeviceFrame } from "@/components/layout/DeviceFrame";
import { DevToolbar } from "@/components/layout/DevToolbar";
import { StepBar } from "@/components/layout/StepBar";
import { HubPanel } from "@/components/hub/HubPanel";
import { useWholeHyphenatedWords } from "@/components/primitives/keep-hyphenated";
import { StepNavProvider, useStepNavValue } from "@/lib/step-nav";
import { useColorMode } from "@/lib/color-mode";
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
 *
 * The step bar is the opposite: it takes its own row above the canvas, so it
 * covers nothing, and appears only when the page on the canvas declares its
 * screens with `useStepNav`.
 */
export function PrototypeShell(props: PrototypeShellProps) {
  return (
    <StepNavProvider>
      <PrototypeShellInner {...props} />
    </StepNavProvider>
  );
}

function ShellStepBar() {
  const nav = useStepNavValue();
  if (!nav) return null;
  return <StepBar items={nav.items} currentId={nav.currentId} onSelect={nav.onSelect} />;
}

/**
 * How the page is shown when the showroom embeds it as one screen of a flow
 * (designer, 2026-10-15): `?frame=1` drops the dock, step bar and hub and
 * shows the phone; `&full=1` lets the phone grow to the page's whole length.
 * Read after mount, so the server and the first client paint agree.
 */
function useFrameMode(): { frame: boolean; full: boolean } {
  const [mode, setMode] = useState({ frame: false, full: false });
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after mount
    setMode({ frame: query.get("frame") === "1", full: query.get("full") === "1" });
  }, []);
  return mode;
}

function PrototypeShellInner({ hubIndex, children }: PrototypeShellProps) {
  // A hyphenated word never breaks across lines, on any page (designer, 2026-10-16).
  useWholeHyphenatedWords();
  const { viewport: chosen } = useViewport();
  const { frame, full } = useFrameMode();
  const viewport = frame ? "mobile" : chosen;
  // Keeps data-color on <html> in step with the dock's colour switch.
  useColorMode();
  const [hubOpen, setHubOpen] = useState(false);
  const hubTriggerRef = useRef<HTMLButtonElement>(null);
  const closeHub = useCallback(() => setHubOpen(false), []);
  const toggleHub = useCallback(() => setHubOpen((open) => !open), []);

  return (
    <div
      className={["prototype", frame ? "prototype--frame" : null, full ? "prototype--full" : null]
        .filter(Boolean)
        .join(" ")}
      data-viewport={viewport}
    >
      {frame ? null : (
        <>
          <DevToolbar
            hubOpen={hubOpen}
            onToggleHub={toggleHub}
            hubTriggerRef={hubTriggerRef}
          />
          <ShellStepBar />
        </>
      )}

      <div className="prototype__canvas">
        <DeviceFrame viewport={viewport}>{children}</DeviceFrame>
      </div>

      {frame ? null : (
        <HubPanel open={hubOpen} onClose={closeHub}>
          {hubIndex}
        </HubPanel>
      )}
    </div>
  );
}

export default PrototypeShell;
