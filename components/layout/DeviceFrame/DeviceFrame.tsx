"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
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
 *
 * Because the frame lives in the root layout, `.device__content` survives
 * navigation, and so would its scroll position. Each page's position is kept
 * instead: a new page opens at the top, and a page you come back to — Home,
 * most of all — opens where you left it (the brief: returning restores
 * context rather than resetting it). Kept for the tab's life only.
 */
const scrollPositions = new Map<string, number>();

export function DeviceFrame({ children }: { children: ReactNode }) {
  const { viewport } = useViewport();
  const [tone, setTone] = useState<StatusBarTone>("default");
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  // Before paint, so a returning page never flashes at the wrong position.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    content.scrollTop = scrollPositions.get(pathname) ?? 0;
    const remember = () => scrollPositions.set(pathname, content.scrollTop);
    content.addEventListener("scroll", remember, { passive: true });
    return () => content.removeEventListener("scroll", remember);
  }, [pathname]);

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
          <div className="device__content" ref={contentRef}>
            {children}
          </div>
        </StatusBarToneSetter.Provider>
      </div>
    </div>
  );
}

export default DeviceFrame;
