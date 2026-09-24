"use client";

import { useState, type ReactNode } from "react";
import { StatusBarToneSetter, type StatusBarTone } from "@/lib/device-tone";
import { useViewport } from "@/lib/viewport-context";

/**
 * The canvas the product pages render inside.
 *
 * Mobile and tablet get a device frame drawn entirely in CSS — bezel, rounded
 * corners, and a status bar area on mobile. No image assets. Web fills the
 * available width with no frame.
 *
 * Content scrolls inside `.device__screen`, never the browser window, so the
 * frame stays fixed in view.
 *
 * The status bar follows whatever tone the screen on it asks for through
 * `useStatusBarTone`, so a screen with a dark top edge can run it to the top.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { viewport } = useViewport();
  const [tone, setTone] = useState<StatusBarTone>("default");

  return (
    <div className={`device device--${viewport}`}>
      <div className="device__screen">
        {viewport === "mobile" ? (
          <div
            className={`device__statusbar device__statusbar--${tone}`}
            aria-hidden="true"
          >
            <span className="device__statusbar-time">9:41</span>
            <span className="device__statusbar-indicators">
              <span className="device__signal" />
              <span className="device__wifi" />
              <span className="device__battery" />
            </span>
          </div>
        ) : null}
        <StatusBarToneSetter.Provider value={setTone}>
          <div className="device__content">{children}</div>
        </StatusBarToneSetter.Provider>
      </div>
    </div>
  );
}

export default DeviceFrame;
