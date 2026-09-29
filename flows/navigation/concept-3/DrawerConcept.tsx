"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { DrawerNav } from "@/components/navigation/DrawerNav";
import { MenuButton } from "@/components/navigation/MenuButton";
import { useLoop, type LoopView } from "@/lib/loop-store";
import { currentStageIndex } from "@/lib/rings";
import { useViewport } from "@/lib/viewport-context";
import { DRAWER_COPY } from "@/mock/navigation";
import { ACTIONS, ROADMAP } from "@/mock/plan-stub";
import type { NavConceptProps } from "../types";

/**
 * Navigation Concept 3 — Drawer.
 *
 * Mobile: a menu button before the wordmark. Opening it makes the page step
 * aside — back and to the right, smaller and rounded — revealing the list on
 * the surface behind it. Tapping the page brings it back.
 * Tablet: a rail of icons with short labels, which widens into the full list.
 * Web: the full list as a sidebar, which folds to the rail.
 *
 * Every destination carries one line of what is waiting there, read from the
 * live Loop, so the lines change as the reviewer does things.
 */

const DRAWER_ID = "drawer-nav";
const MENU_BUTTON_ID = "drawer-menu-button";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* Whether the mobile drawer is open. Shared by the menu button in the header
   and the drawer in the nav slot, which render in different parts of the
   chrome, so it lives here rather than in either component. */
const listeners = new Set<() => void>();
let open = false;
function setOpen(next: boolean) {
  if (open === next) return;
  open = next;
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const useOpen = () => useSyncExternalStore(subscribe, () => open, () => false);

/** Set when closing should hand focus back to the menu button. It is done by
 *  the effect that makes the page live again, since an inert page can't take
 *  focus. */
let returnFocus = false;
function closeToMenuButton() {
  returnFocus = true;
  setOpen(false);
}

/** The web sidebar's folded state, kept across pages for the tab's life. */
let webFolded = false;

function linesFor(loop: LoopView): Partial<Record<string, string>> {
  const { lines } = DRAWER_COPY;
  const openDraft = loop.records.find((r) => r.state === "drafted" || r.state === "in-progress");
  const plan = loop.account.plan;
  const stage = ROADMAP[currentStageIndex(loop.records, ROADMAP.length, ACTIONS, loop.tasks)];
  return {
    homepage: loop.followUp
      ? lines.homeDue(loop.followUp.name)
      : loop.nextStep
        ? lines.homeNext(loop.nextStep.title)
        : undefined,
    plan: lines.plan(plan.name, stage.title),
    toolbox: openDraft ? lines.toolboxOpen(openDraft.title) : lines.toolbox,
    "daily-briefing": lines.briefing(WEEKDAYS[new Date(`${loop.today}T00:00:00Z`).getUTCDay()]),
  };
}

function useDrawerProps(props: NavConceptProps) {
  const loop = useLoop();
  return {
    items: props.destinations.filter((d) => d.flowSlug !== "profile"),
    current: props.currentFlow,
    label: props.label,
    lines: linesFor(loop),
    followUpDue: Boolean(loop.followUp),
    draftOpen: loop.records.some((r) => r.state === "drafted" || r.state === "in-progress"),
    account: {
      name: loop.account.name,
      email: loop.account.email,
      href: props.destinations.find((d) => d.flowSlug === "profile")?.href,
    },
  };
}

/** The drawer on mobile; the rail or sidebar on tablet and web. */
export function DrawerConceptNav(props: NavConceptProps) {
  const { viewport } = useViewport();
  return viewport === "mobile" ? <MobileDrawer {...props} /> : <SideNav {...props} />;
}

function MobileDrawer(props: NavConceptProps) {
  const isOpen = useOpen();
  const shared = useDrawerProps(props);
  const anchor = useRef<HTMLSpanElement>(null);
  const [screen, setScreen] = useState<HTMLElement | null>(null);

  // The drawer is drawn on the device screen, behind the page, so the page
  // itself can step aside. Found from where this is mounted, like Sheet.
  useEffect(() => {
    setScreen(anchor.current?.closest<HTMLElement>(".device__screen") ?? null);
  }, []);

  // A new page arrives with the drawer closed.
  useEffect(() => setOpen(false), [props.currentFlow]);

  useEffect(() => {
    if (!screen) return;
    screen.setAttribute("data-nav-drawer", isOpen ? "open" : "closed");
    const content = screen.querySelector<HTMLElement>(".device__content");
    if (content) content.inert = isOpen;
    if (!isOpen) {
      if (returnFocus) document.getElementById(MENU_BUTTON_ID)?.focus();
      returnFocus = false;
      return;
    }

    screen.querySelector<HTMLElement>(`#${DRAWER_ID} [aria-current], #${DRAWER_ID} a`)?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeToMenuButton();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (content) content.inert = false;
    };
  }, [screen, isOpen]);

  // Leaving the concept puts the page back where it belongs.
  useEffect(() => {
    return () => {
      if (!screen) return;
      screen.removeAttribute("data-nav-drawer");
      const content = screen.querySelector<HTMLElement>(".device__content");
      if (content) content.inert = false;
      setOpen(false);
    };
  }, [screen]);

  return (
    <>
      <span ref={anchor} hidden />
      {screen
        ? createPortal(
            <>
              <div className="drawer-stage" inert={!isOpen}>
                <DrawerNav {...shared} mode="drawer" id={DRAWER_ID} onNavigate={() => setOpen(false)} />
              </div>
              {isOpen ? (
                <button
                  type="button"
                  className="drawer-stage__back"
                  onClick={closeToMenuButton}
                >
                  <span className="u-visually-hidden">{DRAWER_COPY.closeToPage}</span>
                </button>
              ) : null}
            </>,
            screen
          )
        : null}
    </>
  );
}

function SideNav(props: NavConceptProps) {
  const { viewport } = useViewport();
  const shared = useDrawerProps(props);
  // Tablet starts as a rail and widens; web starts as a sidebar and folds.
  const [tabletWide, setTabletWide] = useState(false);
  const [webFoldedNow, setWebFolded] = useState(webFolded);
  const rail = viewport === "tablet" ? !tabletWide : webFoldedNow;

  return (
    <div className="drawer-host">
      <DrawerNav
        {...shared}
        mode={rail ? "rail" : "sidebar"}
        onNavigate={() => setTabletWide(false)}
        toggle={{
          label: rail ? DRAWER_COPY.widen : DRAWER_COPY.fold,
          expanded: !rail,
          onClick: () => {
            if (viewport === "tablet") setTabletWide(rail);
            else {
              webFolded = !rail;
              setWebFolded(webFolded);
            }
          },
        }}
      />
    </div>
  );
}

/** The menu button before the wordmark, on mobile only. */
export function DrawerHeaderStart() {
  const { viewport } = useViewport();
  const isOpen = useOpen();
  const loop = useLoop();
  if (viewport !== "mobile") return null;
  return (
    <MenuButton
      id={MENU_BUTTON_ID}
      expanded={isOpen}
      controls={DRAWER_ID}
      followUpDue={Boolean(loop.followUp)}
      onClick={() => setOpen(!isOpen)}
    />
  );
}
