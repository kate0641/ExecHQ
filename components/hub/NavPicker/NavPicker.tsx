"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { conceptHref, getFlow } from "@/lib/manifest";
import { NAVIGATION_FLOW, NAV_CONCEPTS, setNavChoice, useNavChoice } from "@/lib/nav-choice";
import { isNavBuilt } from "@/flows/navigation/registry";

/**
 * Picks which navigation concept wraps the signed-in pages.
 *
 * On a navigation concept's own page it moves to the other concept's page, so
 * the address, the hub and the status always match what is on screen. On any
 * other signed-in page it swaps the navigation in place. Either way the choice
 * is remembered (`lib/nav-choice.ts`).
 *
 * Only on signed-in pages, like the snapshot picker. With a single concept
 * left there is nothing to pick, so it draws nothing.
 */
export function NavPicker() {
  const pathname = usePathname();
  const router = useRouter();
  const [flowSlug, conceptSlug] = pathname.split("/").slice(1);
  const flow = getFlow(flowSlug ?? "");
  const chosen = useNavChoice();
  const [announcement, setAnnouncement] = useState("");

  if (flow?.chrome !== "app" || NAV_CONCEPTS.length < 2) return null;

  const onNavPage = flow.slug === NAVIGATION_FLOW;
  const value = onNavPage ? conceptSlug : chosen;

  const options = NAV_CONCEPTS.map(({ slug, title }, index) => ({
    value: slug,
    label: `Navigation ${title.toLowerCase()}`,
    icon: (
      <span className="dock-picker__glyph" aria-hidden="true">
        N{index + 1}
      </span>
    ),
    description: isNavBuilt(slug)
      ? undefined
      : "Not built yet, so the baseline navigation shows in its place.",
  }));

  return (
    <div className="dock-picker">
      <span className="devtools__rule" aria-hidden="true" />
      <ToggleGroup
        label="Navigation concept"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={options}
        value={value}
        onChange={(next) => {
          setNavChoice(next);
          if (onNavPage) router.push(conceptHref(NAVIGATION_FLOW, next));
          const title = NAV_CONCEPTS.find((c) => c.slug === next)?.title ?? next;
          setAnnouncement(`Navigation: ${title}`);
        }}
      />
      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default NavPicker;
