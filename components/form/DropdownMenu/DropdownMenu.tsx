"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";

/* -----------------------------------------------------------------------------
   THE ITEMS
   -------------------------------------------------------------------------- */

interface ItemBase {
  id: string;
  label: string;
  /** A quiet word at the end of the row: a count, a shortcut. */
  hint?: string;
  disabled?: boolean;
}

/** Does something, then closes the menu. */
export interface MenuActionItem extends ItemBase {
  type: "item";
  icon?: IconName;
  onSelect: () => void;
}

/** On or off. Stays open, so several can be set in one go. */
export interface MenuCheckboxItem extends ItemBase {
  type: "checkbox";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** One of a set. Choosing closes the menu. */
export interface MenuRadioGroup {
  type: "radio-group";
  id: string;
  /** Names the group for assistive technology, and shows above it. */
  label: string;
  /** Hides the label visually where a submenu already says it. */
  labelHidden?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly { value: string; label: string; hint?: string; disabled?: boolean }[];
}

export interface MenuSeparator {
  type: "separator";
  id: string;
}

/** Opens a further menu beside this one. */
export interface MenuSubmenu extends ItemBase {
  type: "submenu";
  icon?: IconName;
  items: readonly MenuEntry[];
}

/** Words at the top of the panel, not a choice: who is signed in. */
export interface MenuHeading {
  type: "heading";
  id: string;
  title: string;
  detail?: string;
}

export type MenuEntry = MenuActionItem | MenuCheckboxItem | MenuRadioGroup | MenuSeparator | MenuSubmenu | MenuHeading;

/* -----------------------------------------------------------------------------
   POSITIONING
   The panel opens below its trigger, lined up with its start edge (submenus
   open to the right). If that would run past the screen it opens in, it flips:
   above instead of below, end-aligned instead of start, left instead of
   right. The screen is the simulated device when there is one, else the
   window. As a last resort it scrolls inside itself.
   -------------------------------------------------------------------------- */

interface Placement {
  vertical: "below" | "above";
  /** For a submenu, "end" opens it to the left, and "over" lays it over its
   *  parent menu, just below its item, where neither side has room (a phone). */
  horizontal: "start" | "end" | "over";
  /** Pixels a submenu moves up to stay on screen. */
  shiftUp: number;
  /** The most the panel may be tall before it scrolls. */
  maxHeight?: number;
}

const DEFAULT_PLACEMENT: Placement = { vertical: "below", horizontal: "start", shiftUp: 0 };

function boundaryOf(el: HTMLElement): { top: number; right: number; bottom: number; left: number } {
  const screen = el.closest(".device__screen");
  if (screen) return screen.getBoundingClientRect();
  return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
}

function usePlacement(panel: RefObject<HTMLElement | null>, anchor: RefObject<HTMLElement | null>, sub: boolean): Placement {
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT);
  useLayoutEffect(() => {
    const el = panel.current;
    const at = anchor.current;
    if (!el || !at) return;
    const edge = parseFloat(getComputedStyle(el).getPropertyValue("--menu-edge")) * 16 || 8;
    const box = boundaryOf(el);
    const rect = el.getBoundingClientRect();
    const anchorRect = at.getBoundingClientRect();
    const next: Placement = { ...DEFAULT_PLACEMENT };

    if (sub) {
      // To the right of its item; to the left if that runs off the screen;
      // over the parent menu, below its item, if neither side has room.
      if (rect.right > box.right - edge) {
        next.horizontal = anchorRect.left - rect.width > box.left + edge ? "end" : "over";
      }
      // Beside its item, it moves up to stay on screen. Laid over the parent,
      // it stays just below its item, so the item that opened it still shows.
      const overflow = rect.bottom - (box.bottom - edge);
      if (overflow > 0 && next.horizontal !== "over") next.shiftUp = Math.min(overflow, rect.top - (box.top + edge));
    } else {
      // Below the trigger; above if there is more room there.
      const below = box.bottom - edge - anchorRect.bottom;
      const above = anchorRect.top - (box.top + edge);
      if (rect.height > below && above > below) next.vertical = "above";
      next.maxHeight = Math.max(160, next.vertical === "above" ? above : below);
      // Start-aligned; end-aligned if the start would run off the right edge.
      if (rect.right > box.right - edge) next.horizontal = "end";
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a measured position, set once before paint
    setPlacement(next);
  }, [panel, anchor, sub]);
  return placement;
}

/* -----------------------------------------------------------------------------
   KEYBOARD
   -------------------------------------------------------------------------- */

const ITEM_SELECTOR = ':scope > li > [role^="menuitem"], :scope > li > fieldset > [role^="menuitem"]';

function itemsOf(menu: HTMLElement | null): HTMLElement[] {
  return menu ? Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)) : [];
}

function focusItem(menu: HTMLElement | null, which: "first" | "last" | number) {
  const items = itemsOf(menu);
  if (!items.length) return;
  const index = which === "first" ? 0 : which === "last" ? items.length - 1 : (which + items.length) % items.length;
  items[index].focus();
}

/* -----------------------------------------------------------------------------
   ONE PANEL
   -------------------------------------------------------------------------- */

interface PanelProps {
  entries: readonly MenuEntry[];
  id: string;
  labelledBy: string;
  anchor: RefObject<HTMLElement | null>;
  /** A submenu opens beside its item, not below a button. */
  sub?: boolean;
  align: "start" | "end";
  /** Where focus goes when the panel opens. */
  focusOnOpen: "first" | "last" | "none";
  /** Closes everything, and puts focus back on the trigger when asked. */
  closeAll: (returnFocus: boolean) => void;
  /** Closes just this submenu and puts focus back on its item. */
  closeSelf?: () => void;
}

function MenuPanel({ entries, id, labelledBy, anchor, sub = false, align, focusOnOpen, closeAll, closeSelf }: PanelProps) {
  const panel = useRef<HTMLUListElement>(null);
  const [openSub, setOpenSub] = useState<{ id: string; focus: "first" | "none" } | null>(null);
  const placement = usePlacement(panel, anchor, sub);
  const typed = useRef({ text: "", at: 0 });
  const baseId = useId();

  useEffect(() => {
    if (focusOnOpen !== "none") focusItem(panel.current, focusOnOpen);
  }, [focusOnOpen]);

  const indexOfFocused = () => itemsOf(panel.current).indexOf(document.activeElement as HTMLElement);

  function onKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    // Keys pressed inside an open submenu belong to it.
    if (event.target instanceof HTMLElement && event.target.closest('[role="menu"]') !== panel.current) return;
    const i = indexOfFocused();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(panel.current, i + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(panel.current, i < 0 ? -1 : i - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(panel.current, "first");
        break;
      case "End":
        event.preventDefault();
        focusItem(panel.current, "last");
        break;
      case "ArrowLeft":
        if (sub) {
          event.preventDefault();
          closeSelf?.();
        }
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        if (sub) closeSelf?.();
        else closeAll(true);
        break;
      case "Tab":
        // Tab leaves the menu altogether, wherever it goes next.
        closeAll(false);
        break;
      default:
        // Type-ahead: the next item starting with what she typed.
        if (event.key.length === 1 && /\S/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const now = Date.now();
          typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + event.key.toLowerCase(), at: now };
          const items = itemsOf(panel.current);
          const start = Math.max(0, i);
          const order = [...items.slice(start + (typed.current.text.length === 1 ? 1 : 0)), ...items.slice(0, start + 1)];
          order.find((el) => (el.dataset.label ?? "").toLowerCase().startsWith(typed.current.text))?.focus();
        }
    }
  }

  /** Enter and Space activate, as the ARIA menu pattern asks; a click does too. */
  const activateKeys = (event: ReactKeyboardEvent<HTMLElement>, run: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      run();
    }
  };

  const classes = [
    "menu",
    sub ? "menu--sub" : "menu--root",
    `menu--${placement.vertical}`,
    `menu--${
      sub
        ? placement.horizontal === "over"
          ? "over"
          : placement.horizontal === "end"
            ? "left"
            : "right"
        : placement.horizontal === "end" || align === "end"
          ? "end"
          : "start"
    }`,
  ].join(" ");

  return (
    <ul
      ref={panel}
      className={classes}
      id={id}
      role="menu"
      aria-labelledby={labelledBy}
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      style={{
        ...(placement.shiftUp ? { transform: `translateY(-${placement.shiftUp}px)` } : {}),
        ...(placement.maxHeight ? { maxHeight: `${placement.maxHeight}px` } : {}),
      }}
    >
      {entries.map((entry) => {
        if (entry.type === "separator") {
          return (
            <li key={entry.id} role="none" className="menu__separator-wrap">
              <hr className="menu__separator" />
            </li>
          );
        }

        if (entry.type === "heading") {
          return (
            <li key={entry.id} role="none" className="menu__heading">
              <span className="menu__heading-title">{entry.title}</span>
              {entry.detail ? <span className="menu__heading-detail">{entry.detail}</span> : null}
            </li>
          );
        }

        if (entry.type === "radio-group") {
          const groupLabelId = `${baseId}-${entry.id}-label`;
          return (
            <li key={entry.id} role="none">
              <span className={entry.labelHidden ? "u-visually-hidden" : "menu__group-label"} id={groupLabelId}>
                {entry.label}
              </span>
              {/* A fieldset is a group to assistive technology: the radios' set. */}
              <fieldset aria-labelledby={groupLabelId} className="menu__group">
                {entry.options.map((option) => {
                  const checked = option.value === entry.value;
                  const select = () => {
                    if (option.disabled) return;
                    entry.onValueChange(option.value);
                    closeAll(true);
                  };
                  return (
                    <div
                      key={option.value}
                      role="menuitemradio"
                      aria-checked={checked}
                      aria-disabled={option.disabled || undefined}
                      tabIndex={-1}
                      data-label={option.label}
                      className="menu__item"
                      onClick={select}
                      onKeyDown={(e) => activateKeys(e, select)}
                      onPointerEnter={() => setOpenSub(null)}
                    >
                      <span className="menu__mark menu__mark--radio" aria-hidden="true">
                        {checked ? <span className="menu__dot" /> : null}
                      </span>
                      <span className="menu__label">{option.label}</span>
                      {option.hint ? <span className="menu__hint">{option.hint}</span> : null}
                    </div>
                  );
                })}
              </fieldset>
            </li>
          );
        }

        if (entry.type === "checkbox") {
          const toggle = () => {
            if (!entry.disabled) entry.onCheckedChange(!entry.checked);
          };
          return (
            <li key={entry.id} role="none">
              <div
                role="menuitemcheckbox"
                aria-checked={entry.checked}
                aria-disabled={entry.disabled || undefined}
                tabIndex={-1}
                data-label={entry.label}
                className="menu__item"
                onClick={toggle}
                onKeyDown={(e) => activateKeys(e, toggle)}
                onPointerEnter={() => setOpenSub(null)}
              >
                <span className="menu__mark menu__mark--check" aria-hidden="true">
                  {entry.checked ? <Icon name="check" size={14} /> : null}
                </span>
                <span className="menu__label">{entry.label}</span>
                {entry.hint ? <span className="menu__hint">{entry.hint}</span> : null}
              </div>
            </li>
          );
        }

        if (entry.type === "submenu") {
          const subId = `${baseId}-${entry.id}`;
          const itemId = `${subId}-item`;
          const isOpen = openSub?.id === entry.id;
          const open = (focus: "first" | "none") => {
            if (!entry.disabled) setOpenSub({ id: entry.id, focus });
          };
          return (
            <li key={entry.id} role="none" className="menu__sub-wrap">
              <div
                role="menuitem"
                id={itemId}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? subId : undefined}
                aria-disabled={entry.disabled || undefined}
                tabIndex={-1}
                data-label={entry.label}
                className={["menu__item", isOpen ? "is-open" : null].filter(Boolean).join(" ")}
                onClick={() => (isOpen ? setOpenSub(null) : open("first"))}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open("first");
                  }
                }}
                onPointerEnter={() => open("none")}
              >
                <span className="menu__mark" aria-hidden="true">
                  {entry.icon ? <Icon name={entry.icon} size={16} /> : null}
                </span>
                <span className="menu__label">{entry.label}</span>
                {entry.hint ? <span className="menu__hint">{entry.hint}</span> : null}
                <Icon name="chevron" size={14} className="menu__chevron" />
              </div>
              {isOpen ? (
                <SubmenuPanel
                  entry={entry}
                  id={subId}
                  itemId={itemId}
                  focusOnOpen={openSub.focus}
                  closeAll={closeAll}
                  closeSelf={() => {
                    setOpenSub(null);
                    document.getElementById(itemId)?.focus();
                  }}
                />
              ) : null}
            </li>
          );
        }

        const select = () => {
          if (entry.disabled) return;
          entry.onSelect();
          closeAll(true);
        };
        return (
          <li key={entry.id} role="none">
            <div
              role="menuitem"
              aria-disabled={entry.disabled || undefined}
              tabIndex={-1}
              data-label={entry.label}
              className="menu__item"
              onClick={select}
              onKeyDown={(e) => activateKeys(e, select)}
              onPointerEnter={() => setOpenSub(null)}
            >
              <span className="menu__mark" aria-hidden="true">
                {entry.icon ? <Icon name={entry.icon} size={16} /> : null}
              </span>
              <span className="menu__label">{entry.label}</span>
              {entry.hint ? <span className="menu__hint">{entry.hint}</span> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** A submenu's panel, anchored to its own item. */
function SubmenuPanel({
  entry,
  id,
  itemId,
  focusOnOpen,
  closeAll,
  closeSelf,
}: {
  entry: MenuSubmenu;
  id: string;
  itemId: string;
  focusOnOpen: "first" | "none";
  closeAll: (returnFocus: boolean) => void;
  closeSelf: () => void;
}) {
  // Looked up when it is read: the panel measures itself before an effect
  // here could have run.
  const anchor = useMemo(
    () => ({
      get current() {
        return document.getElementById(itemId);
      },
    }),
    [itemId]
  );
  return (
    <MenuPanel
      entries={entry.items}
      id={id}
      labelledBy={itemId}
      anchor={anchor}
      sub
      align="start"
      focusOnOpen={focusOnOpen}
      closeAll={closeAll}
      closeSelf={closeSelf}
    />
  );
}

/* -----------------------------------------------------------------------------
   THE MENU BUTTON
   -------------------------------------------------------------------------- */

export interface DropdownMenuProps {
  /** The trigger's words, which also name the menu. */
  label: string;
  icon?: IconName;
  /** A count or value after the label: "2" filters on. Read with it. */
  badge?: string;
  /** Read after the label by screen readers: ", 2 filters on". */
  srSuffix?: string;
  /** Initials in a round button in place of the words, which stay as its
   *  accessible name: an account menu. */
  avatar?: string;
  entries: readonly MenuEntry[];
  /** Which edge of the trigger the panel lines up with. It still flips to
   *  stay on screen. */
  align?: "start" | "end";
  /** Opens with the panel showing (catalogue). */
  defaultOpen?: boolean;
  /** Draws the panel in the flow under the button instead of floating over
   *  what follows (catalogue, where it would cover the next example). */
  inline?: boolean;
  /** Catalogue only: shows the trigger in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  disabled?: boolean;
  className?: string;
}

/**
 * A menu button: a button that opens a floating panel of choices. It follows
 * the ARIA menu-button pattern: the trigger says it has a menu and whether it
 * is open; the panel is a `menu` of `menuitem`, `menuitemcheckbox` and
 * `menuitemradio`, with separators, groups and submenus.
 *
 * Keyboard: Enter, Space or Down opens it on the first item, Up on the last;
 * Up and Down move, Home and End jump, typing a letter jumps to an item;
 * Enter or Space chooses; Right opens a submenu and Left closes it; Escape
 * closes and puts focus back on the button; Tab leaves. A click outside
 * closes it. Disabled items can be reached, and say they are unavailable,
 * but do nothing.
 *
 * Written from scratch: no menu library.
 */
export function DropdownMenu({
  label,
  icon,
  badge,
  srSuffix,
  avatar,
  entries,
  align = "start",
  defaultOpen = false,
  inline = false,
  demo,
  disabled = false,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState<null | "first" | "last" | "none">(defaultOpen ? "none" : null);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const triggerId = useId();

  const closeAll = useCallback((returnFocus: boolean) => {
    setOpen(null);
    if (returnFocus) trigger.current?.focus();
  }, []);

  // A press anywhere outside closes it, and leaves focus where she pressed.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!wrap.current?.contains(event.target as Node)) closeAll(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, closeAll]);

  return (
    <div className={["dropdown", inline ? "dropdown--inline" : null, className].filter(Boolean).join(" ")} ref={wrap}>
      <button
        ref={trigger}
        type="button"
        id={triggerId}
        className={["dropdown__trigger", avatar ? "dropdown__trigger--avatar" : null, open ? "is-open" : null, demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
        aria-haspopup="menu"
        aria-expanded={Boolean(open)}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onClick={() => setOpen(open ? null : "first")}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen("first");
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen("last");
          }
        }}
      >
        {avatar ? (
          <>
            <span aria-hidden="true">{avatar}</span>
            <span className="u-visually-hidden">{label}</span>
          </>
        ) : (
          <>
            {icon ? <Icon name={icon} size={16} /> : null}
            <span>{label}</span>
            {badge ? <span className="dropdown__badge">{badge}</span> : null}
            {srSuffix ? <span className="u-visually-hidden">{srSuffix}</span> : null}
            <Icon name="chevron" size={14} className="dropdown__chevron" />
          </>
        )}
      </button>
      {open ? (
        <MenuPanel
          entries={entries}
          id={menuId}
          labelledBy={triggerId}
          anchor={trigger}
          align={align}
          focusOnOpen={open}
          closeAll={closeAll}
        />
      ) : null}
    </div>
  );
}

export default DropdownMenu;
