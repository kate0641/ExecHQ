"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/primitives/Icon";
import { StatusBarToneSetter, type StatusBarTone } from "@/lib/device-tone";
import { useViewport, type Viewport } from "@/lib/viewport-context";

/**
 * The canvas the product pages render inside.
 *
 * Mobile and tablet get a device frame drawn entirely in CSS — bezel, rounded
 * corners, and a status bar area on mobile. No image assets. Web fills the
 * available width with no frame.
 *
 * ExecHQ runs in the phone's browser, not as an app (Kate, 2026-10-19), so
 * the phone and tablet draw Safari around the page: its address bar at the
 * top and, on the phone, its toolbar at the foot, both as they are when a
 * page first loads. `.device__screen` is only the space between them, the
 * page's real visible height, so every design is judged in the room it will
 * actually have. Sheets and menus open inside it, as they would in Safari.
 *
 * Content scrolls inside `.device__screen`, never the browser window, so the
 * frame stays fixed in view.
 *
 * The status bar and the address bar follow whatever tone the screen asks for
 * through `useStatusBarTone`, as Safari tints its bar to the page, so a screen
 * with a dark top edge can run it to the top.
 *
 * Because the frame lives in the root layout, `.device__content` survives
 * navigation, and so would its scroll position. Each page's position is kept
 * instead: a new page opens at the top, and a page you come back to — Home,
 * most of all — opens where you left it (the brief: returning restores
 * context rather than resetting it). Kept for the tab's life only.
 */
const scrollPositions = new Map<string, number>();

export function DeviceFrame({
  children,
  viewport: shown,
}: {
  children: ReactNode;
  /** The viewport to draw, when the shell overrides the reviewer's choice (the showroom's frames). */
  viewport?: Viewport;
}) {
  const { viewport: chosen } = useViewport();
  const viewport = shown ?? chosen;
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
      <div className="device__display">
        {viewport === "web" ? null : (
          <div className={`device__top device__top--${tone}`} aria-hidden="true">
            {viewport === "mobile" ? (
              <div className="device__statusbar">
                <span className="device__statusbar-time">9:41</span>
                <span className="device__statusbar-indicators">
                  <span className="device__signal" />
                  <span className="device__wifi" />
                  <span className="device__battery" />
                </span>
              </div>
            ) : null}
            <div className="browser-bar browser-bar--address">
              <span className="browser-bar__pill">
                <Icon name="menu" />
                <span className="browser-bar__address">exechq.com</span>
                <Icon name="refresh" />
              </span>
            </div>
          </div>
        )}
        <div className="device__screen">
          <StatusBarToneSetter.Provider value={setTone}>
            <div className="device__content" ref={contentRef}>
              {children}
            </div>
          </StatusBarToneSetter.Provider>
        </div>
        {viewport === "mobile" ? (
          <div className="device__bottom" aria-hidden="true">
            <div className="browser-bar browser-bar--toolbar">
              <span className="browser-bar__pill">
                <Icon name="chevron-left" />
                <span className="browser-bar__off">
                  <Icon name="chevron" />
                </span>
                <Icon name="share" />
                <Icon name="book" />
                <Icon name="copy" />
              </span>
            </div>
            <span className="device__home-indicator" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DeviceFrame;
