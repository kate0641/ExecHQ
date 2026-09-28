"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";
import type { NavDestination } from "@/lib/manifest";

/** How the bar is laid out. The navigation concept picks one per viewport:
 *  `stacked` on mobile (icon over label), `inline` on tablet (side by side),
 *  `header` on web (pills in the header). */
export type TabBarLayout = "stacked" | "inline" | "header";

export interface TabBarProps {
  /** The destinations in the bar, in order. Profile is not among them: it
   *  sits as an icon in the top right (`IconLink`). */
  items: NavDestination[];
  /** The flow slug of the page on screen. */
  current: string;
  layout?: TabBarLayout;
  /** The nav landmark's accessible name. */
  label?: string;
  /** A follow-up is due: Home carries the quiet dot. Never a count. */
  followUpDue?: boolean;
  /** A draft is still open: the Toolbox pencil has its tip filled in. */
  draftOpen?: boolean;
  /** Today's day of the month, set on the Briefing calendar. */
  day?: number;
  /** Folded while the reader scrolls down: icons only. The labels stay in
   *  the accessibility tree throughout. */
  tucked?: boolean;
  /** Carry the pill over from the bar on the previous page, so it glides on
   *  navigation. For the one live bar; off for the catalogue, where several
   *  bars on one page would otherwise share it. */
  continuous?: boolean;
  /** Catalogue only: shows one item in a state a static page can't reach. */
  demo?: { flowSlug: string; state: "hover" | "focus" | "active" };
  className?: string;
}

const ICONS: Record<string, IconName> = {
  homepage: "home",
  plan: "flag",
  toolbox: "pencil",
  "daily-briefing": "calendar",
};

/** A short pause between the pill stretching across and settling. */
const STRETCH_MS = 170;

/** Where the pill last sat, kept outside the component: each page renders
 *  its own chrome, so the bar remounts on every navigation, and without this
 *  the pill could never travel from the old destination to the new one. */
let lastPlaced: { current: string; layout: TabBarLayout; left: number; width: number } | null = null;

/**
 * The Tab bar navigation concept's bar: labelled icons and a soft pill that
 * glides to where you are.
 *
 * The pill stretches from the old destination to the new one, then settles,
 * and the new icon draws its own line. Each icon can carry one true thing
 * instead of a count: the dot on Home when a follow-up is due, the date on
 * Briefing, a filled tip on the Toolbox pencil while a draft is open.
 *
 * Motion is CSS transitions only, so `prefers-reduced-motion` stills all of
 * it: the pill simply appears in place.
 */
export function TabBar({
  items,
  current,
  layout = "stacked",
  label = "Main",
  followUpDue = false,
  draftOpen = false,
  day,
  tucked = false,
  continuous = false,
  demo,
  className,
}: TabBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const glideRef = useRef<HTMLSpanElement>(null);

  // The icons draw on with a dash animation, which needs every stroke to
  // measure as length 1.
  useLayoutEffect(() => {
    listRef.current
      ?.querySelectorAll(".tab-bar__icon path, .tab-bar__icon circle, .tab-bar__icon rect")
      .forEach((shape) => shape.setAttribute("pathLength", "1"));
  });

  useLayoutEffect(() => {
    const track = trackRef.current;
    const list = listRef.current;
    const glide = glideRef.current;
    if (!track || !list || !glide) return;
    let settle: ReturnType<typeof setTimeout> | undefined;

    function measure() {
      const item = list!.querySelector<HTMLElement>(`[data-flow="${current}"]`);
      if (!item) return null;
      const target = layout === "stacked" ? item.querySelector<HTMLElement>(".tab-bar__pill") ?? item : item;
      const box = track!.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      return { left: rect.left - box.left, top: rect.top - box.top, width: rect.width, height: rect.height };
    }

    function place(animate: boolean) {
      const to = measure();
      if (!to) return;
      glide!.hidden = false;
      const from =
        continuous && lastPlaced && lastPlaced.layout === layout ? lastPlaced : null;
      const set = (left: number, width: number) => {
        glide!.style.transform = `translate(${left}px, ${to.top}px)`;
        glide!.style.width = `${width}px`;
        glide!.style.height = `${to.height}px`;
      };
      if (animate && from && from.current !== current) {
        // Start where it was, stretch across both, then settle on the new one.
        glide!.classList.add("is-instant");
        set(from.left, from.width);
        glide!.getBoundingClientRect();
        glide!.classList.remove("is-instant");
        const left = Math.min(from.left, to.left);
        const right = Math.max(from.left + from.width, to.left + to.width);
        set(left, right - left);
        settle = setTimeout(() => set(to.left, to.width), STRETCH_MS);
        const svg = list!.querySelector(`[data-flow="${current}"] .tab-bar__icon svg`);
        svg?.classList.remove("is-drawing");
        svg?.getBoundingClientRect();
        svg?.classList.add("is-drawing");
      } else {
        glide!.classList.add("is-instant");
        set(to.left, to.width);
        glide!.getBoundingClientRect();
        glide!.classList.remove("is-instant");
      }
      if (continuous) lastPlaced = { current, layout, left: to.left, width: to.width };
    }

    place(true);
    // Tucking, a font landing or a resize all change where the pill belongs.
    // The observer also reports once as soon as it starts watching; that
    // first report is skipped, or it would cut the glide short.
    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      clearTimeout(settle);
      place(false);
    });
    observer.observe(track);
    return () => {
      clearTimeout(settle);
      observer.disconnect();
    };
  }, [current, layout, tucked, continuous]);

  const classes = [
    "tab-bar",
    `tab-bar--${layout}`,
    tucked ? "is-tucked" : null,
    className,
  ].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label={label}>
      <div className="tab-bar__track" ref={trackRef}>
        <span className="tab-bar__glide" ref={glideRef} aria-hidden="true" hidden />
        <ul className="tab-bar__list" ref={listRef}>
          {items.map((item) => {
            const isCurrent = item.flowSlug === current;
            const name =
              item.flowSlug === "toolbox" && draftOpen ? "draft" : ICONS[item.flowSlug] ?? "document";
            const extra =
              item.flowSlug === "homepage" && followUpDue
                ? ", a follow-up is waiting"
                : item.flowSlug === "toolbox" && draftOpen
                  ? ", a draft is open"
                  : "";
            const forced = demo?.flowSlug === item.flowSlug ? `is-${demo.state}` : null;
            return (
              <li className="tab-bar__item" key={item.flowSlug}>
                <Link
                  href={item.href}
                  data-flow={item.flowSlug}
                  className={["tab-bar__link", isCurrent ? "is-current" : null, forced].filter(Boolean).join(" ")}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span className="tab-bar__pill">
                    <span className="tab-bar__icon">
                      <Icon name={name} size={20} />
                      {item.flowSlug === "daily-briefing" && day ? (
                        <span className="tab-bar__date" aria-hidden="true">{day}</span>
                      ) : null}
                    </span>
                    {item.flowSlug === "homepage" && followUpDue ? (
                      <span className="tab-bar__dot" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="tab-bar__label">
                    {item.label}
                    {extra ? <span className="u-visually-hidden">{extra}</span> : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default TabBar;
