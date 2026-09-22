"use client";

import type { ReactNode } from "react";
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
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { viewport } = useViewport();

  return (
    <div className={`device device--${viewport}`}>
      <div className="device__screen">
        {viewport === "mobile" ? (
          <div className="device__statusbar" aria-hidden="true">
            <span className="device__statusbar-time">9:41</span>
            <span className="device__statusbar-indicators">
              <span className="device__signal" />
              <span className="device__wifi" />
              <span className="device__battery" />
            </span>
          </div>
        ) : null}
        <div className="device__content">{children}</div>
      </div>
    </div>
  );
}

export default DeviceFrame;
