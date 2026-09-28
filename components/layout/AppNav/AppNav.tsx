"use client";

import Link from "next/link";
import { useEffect } from "react";
import { renderBuiltNav, type NavPart } from "@/flows/navigation/registry";
import type { NavDestination } from "@/flows/navigation/types";
import { setNavChoice, useNavChoice } from "@/lib/nav-choice";

export interface AppNavProps {
  destinations: NavDestination[];
  currentFlow: string;
  label: string;
  /** Set on a navigation concept's own page: that concept is shown, and it
   *  becomes the reviewer's choice for every other signed-in page. */
  concept?: string;
}

/**
 * The signed-in navigation: whichever navigation concept the reviewer is
 * judging, or the baseline below while that concept is not built yet.
 *
 * The baseline is the Sprint 0 shell nav — a top bar on web and tablet, a tab
 * bar on mobile — kept only so every destination stays reachable before the
 * concepts land. It is not a design direction.
 */
export function AppNav({ destinations, currentFlow, label, concept }: AppNavProps) {
  const chosen = useNavChoice();
  const shown = concept ?? chosen;
  const built = renderBuiltNav(shown, "nav", { destinations, currentFlow, label });

  useEffect(() => {
    if (concept) setNavChoice(concept);
  }, [concept]);

  return (
    <div className="app-nav" data-nav-concept={built === undefined ? "baseline" : shown}>
      {built !== undefined ? built : (
        <nav className="chrome__nav" aria-label={label}>
          <ul className="chrome__nav-list">
            {destinations.map((item) => (
              <li className="chrome__nav-item" key={item.flowSlug}>
                <Link
                  href={item.href}
                  className="chrome__nav-link"
                  aria-current={item.flowSlug === currentFlow ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/**
 * What the chosen navigation concept puts in the chrome header, before or
 * after the wordmark. Renders nothing for a concept with nothing there, and
 * for the baseline.
 */
export function AppNavSlot({
  part,
  ...props
}: AppNavProps & { part: Exclude<NavPart, "nav"> }) {
  const chosen = useNavChoice();
  const shown = props.concept ?? chosen;
  const content = renderBuiltNav(shown, part, {
    destinations: props.destinations,
    currentFlow: props.currentFlow,
    label: props.label,
  });
  if (!content) return null;
  return (
    <div className={`chrome__${part === "headerStart" ? "header-start" : part === "headerCentre" ? "header-centre" : "header-end"}`}>
      {content}
    </div>
  );
}

export default AppNav;
