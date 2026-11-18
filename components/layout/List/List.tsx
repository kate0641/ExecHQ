"use client";

import Link from "next/link";
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";

/* -----------------------------------------------------------------------------
   THE ITEMS
   -------------------------------------------------------------------------- */

export type ListLeading =
  | { type: "icon"; name: IconName }
  | { type: "avatar"; initials: string }
  | { type: "checkbox"; checked: boolean; onChange: (checked: boolean) => void };

export interface ListTrailing {
  /** A status or count, such as `LoopStatus`. */
  badge?: ReactNode;
  /** A quiet word or two: a date, a count. */
  meta?: string;
  /** Buttons or links. Not in a selectable list, whose rows are options. */
  actions?: ReactNode;
}

export interface ListItemData {
  id: string;
  /** The item's name: the first line. */
  primary: string;
  /** The second line, for a two-line item. */
  secondary?: ReactNode;
  leading?: ListLeading;
  trailing?: ListTrailing;
  /** The whole row opens this, from the primary line's link. */
  href?: string;
  disabled?: boolean;
}

export interface ListProps {
  items: readonly ListItemData[];
  /** Names the list for assistive technology. */
  label: string;
  /**
   * - `single`: one line a row; any secondary line is left out.
   * - `two`: the primary line, and the secondary under it where there is one.
   */
  lines?: "single" | "two";
  /** Lines between rows: across the whole row, or starting past the leading
   *  element. */
  dividers?: "none" | "full" | "inset";
  /** Rows can be chosen: one at a time, or several. Arrow keys move between
   *  rows, Space or Enter chooses. */
  selection?: "none" | "single" | "multiple";
  /** The chosen rows. Left out, the list keeps its own choice, starting from
   *  `defaultSelected`. */
  selected?: readonly string[];
  defaultSelected?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Rows can be put in a new order: by dragging the handle, by the keyboard
   *  (Space to pick up, arrows to move, Space to drop, Escape to cancel), or
   *  by the up and down buttons. */
  reorderable?: boolean;
  /** Told the new order. Left out, the list keeps its own order. */
  onReorder?: (ids: string[]) => void;
  /** Drawn on a raised surface with a border, or bare inside a card. */
  framed?: boolean;
  /** Catalogue only: shows the first row in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/* -----------------------------------------------------------------------------
   PARTS
   -------------------------------------------------------------------------- */

function Leading({ leading, label }: { leading: ListLeading; label: string }) {
  if (leading.type === "icon") {
    return (
      <span className="list__leading list__leading--icon" aria-hidden="true">
        <Icon name={leading.name} size={18} />
      </span>
    );
  }
  if (leading.type === "avatar") {
    return (
      <span className="list__leading list__leading--avatar" aria-hidden="true">
        {leading.initials}
      </span>
    );
  }
  return (
    <span className="list__leading list__leading--checkbox">
      <input
        type="checkbox"
        className="list__checkbox"
        checked={leading.checked}
        aria-label={label}
        onChange={(event) => leading.onChange(event.target.checked)}
      />
    </span>
  );
}

function Trailing({ trailing }: { trailing?: ListTrailing }) {
  if (!trailing || (!trailing.badge && !trailing.meta && !trailing.actions)) return null;
  return (
    <span className="list__trailing">
      {trailing.meta ? <span className="list__meta">{trailing.meta}</span> : null}
      {trailing.badge ? <span className="list__badge">{trailing.badge}</span> : null}
      {trailing.actions ? <span className="list__actions">{trailing.actions}</span> : null}
    </span>
  );
}

const move = <T,>(list: readonly T[], from: number, to: number): T[] => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/* -----------------------------------------------------------------------------
   THE LIST
   -------------------------------------------------------------------------- */

/**
 * Rows of items, one or two lines each, with a leading icon, avatar or
 * checkbox and trailing badges, metadata or actions, and dividers between.
 *
 * Three ways to use it, never mixed:
 * - **Plain**: a list of rows. A row with `href` opens from its primary line,
 *   and the whole row is the target; its actions sit above that target.
 * - **Selectable** (`selection`): each row is a toggle button that says
 *   whether it is chosen. One row is in the tab order at a time; Up, Down,
 *   Home and End move; Space or Enter chooses. A row is itself the control,
 *   so it holds no links or buttons of its own.
 * - **Reorderable** (`reorderable`): each row has a handle. Drag it; or with
 *   it focused, Space picks the row up, Up and Down move it, Space drops it
 *   and Escape puts it back. Up and down buttons do the same in one press, so
 *   dragging is never the only way (WCAG 2.2 SC 2.5.7).
 *
 * Spacing, dividers and type come from the LISTS tokens.
 */
export function List({
  items,
  label,
  lines = "two",
  dividers = "full",
  selection = "none",
  selected: selectedProp,
  defaultSelected = [],
  onSelectionChange,
  reorderable = false,
  onReorder,
  framed = true,
  demo,
  className,
}: ListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const instructionsId = useId();
  const [active, setActive] = useState(0);
  // Reordering: the order while she drags or moves by keyboard, before it is
  // committed; and which row she is holding.
  const [preview, setPreview] = useState<string[] | null>(null);
  const [held, setHeld] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const drag = useRef<{ id: string; startOrder: string[] } | null>(null);

  // Uncontrolled where the page does not manage them: the catalogue, a demo.
  const [ownSelected, setOwnSelected] = useState<readonly string[]>(defaultSelected);
  const selected = selectedProp ?? ownSelected;
  const [ownOrder, setOwnOrder] = useState<string[] | null>(null);
  const settled = (onReorder ? null : ownOrder) ?? items.map((i) => i.id);

  const selectable = selection !== "none";
  const order = preview ?? settled;
  const shown = order.map((id) => items.find((i) => i.id === id)).filter((i): i is ListItemData => Boolean(i));
  const nameOf = (id: string) => items.find((i) => i.id === id)?.primary ?? "";

  const classes = [
    "list",
    `list--${lines}`,
    `list--dividers-${dividers}`,
    framed ? "list--framed" : null,
    selectable ? "list--selectable" : null,
    reorderable ? "list--reorderable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* --- Selection ----------------------------------------------------------- */

  const choose = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.disabled) return;
    const next = selection === "single" ? [id] : selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    onSelectionChange?.(next);
    if (selectedProp === undefined) setOwnSelected(next);
  };

  const focusOption = (index: number) => {
    const clamped = Math.max(0, Math.min(shown.length - 1, index));
    setActive(clamped);
    listRef.current?.querySelectorAll<HTMLElement>(".list__option")[clamped]?.focus();
  };

  function onOptionKey(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(shown.length - 1);
        break;
      // Space and Enter press the button, which chooses it.
    }
  }

  /* --- Reordering ---------------------------------------------------------- */

  const commit = (next: string[], said: string) => {
    setPreview(null);
    setHeld(null);
    onReorder?.(next);
    if (!onReorder) setOwnOrder(next);
    setAnnounce(said);
  };

  const focusHandle = (id: string) =>
    setTimeout(() => listRef.current?.querySelector<HTMLElement>(`[data-handle="${CSS.escape(id)}"]`)?.focus(), 0);

  function onHandleKey(event: ReactKeyboardEvent<HTMLButtonElement>, id: string) {
    const current = preview ?? settled;
    const index = current.indexOf(id);
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (held === id) {
        commit(current, `${nameOf(id)} dropped at position ${index + 1} of ${current.length}.`);
      } else {
        setHeld(id);
        setPreview(current);
        setAnnounce(`${nameOf(id)} picked up, position ${index + 1} of ${current.length}. Up and Down move it, Space drops it, Escape puts it back.`);
      }
    } else if (held === id && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      const to = event.key === "ArrowUp" ? Math.max(0, index - 1) : Math.min(current.length - 1, index + 1);
      if (to !== index) {
        setPreview(move(current, index, to));
        setAnnounce(`Position ${to + 1} of ${current.length}.`);
        focusHandle(id);
      }
    } else if (held === id && event.key === "Escape") {
      event.preventDefault();
      setPreview(null);
      setHeld(null);
      setAnnounce(`${nameOf(id)} put back where it was.`);
      focusHandle(id);
    }
  }

  /** One press up or down: the single-pointer way to reorder. */
  const nudge = (id: string, by: -1 | 1) => {
    const current = settled;
    const from = current.indexOf(id);
    const to = from + by;
    if (to < 0 || to >= current.length) return;
    commit(move(current, from, to), `${nameOf(id)} moved to position ${to + 1} of ${current.length}.`);
  };

  function onHandleDown(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, startOrder: settled };
    setHeld(id);
    setPreview(settled);
  }

  function onHandleMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    const list = listRef.current;
    if (!d || !list) return;
    // Which row the pointer is over, by the rows' middles.
    const rows = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    const current = preview ?? d.startOrder;
    let to = rows.findIndex((row) => {
      const r = row.getBoundingClientRect();
      return event.clientY < r.top + r.height / 2;
    });
    if (to === -1) to = rows.length - 1;
    const from = current.indexOf(d.id);
    if (to !== from) setPreview(move(current, from, to));
  }

  function onHandleUp() {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const final = preview ?? d.startOrder;
    if (final.join() === d.startOrder.join()) {
      setPreview(null);
      setHeld(null);
      return;
    }
    commit(final, `${nameOf(d.id)} moved to position ${final.indexOf(d.id) + 1} of ${final.length}.`);
  }

  /* --- Rows ----------------------------------------------------------------- */

  return (
    <>
      <ul
        ref={listRef}
        className={classes}
        aria-label={label}
        aria-describedby={reorderable ? instructionsId : undefined}
      >
        {shown.map((item, index) => {
          const isSelected = selected.includes(item.id);
          const two = lines === "two" && Boolean(item.secondary);
          const rowClasses = [
            "list__item",
            two ? "list__item--two" : "list__item--single",
            item.href ? "list__item--link" : null,
            isSelected ? "is-selected" : null,
            held === item.id ? "is-held" : null,
            item.disabled ? "is-disabled" : null,
            index === 0 && demo ? `is-${demo}` : null,
          ]
            .filter(Boolean)
            .join(" ");

          const text = (
            <span className="list__text">
              {item.href && !selectable ? (
                <Link href={item.href} className="list__primary list__link">
                  {item.primary}
                </Link>
              ) : (
                <span className="list__primary">{item.primary}</span>
              )}
              {two ? <span className="list__secondary">{item.secondary}</span> : null}
            </span>
          );

          if (selectable) {
            // Each row is a toggle button that says whether it is chosen. One
            // row is in the tab order at a time; the arrow keys move between them.
            return (
              <li key={item.id} className={rowClasses}>
                <button
                  type="button"
                  className="list__option"
                  aria-pressed={isSelected}
                  disabled={item.disabled}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => {
                    setActive(index);
                    choose(item.id);
                  }}
                  onKeyDown={(e) => onOptionKey(e, index)}
                >
                  {item.leading?.type === "checkbox" ? (
                    // The row is the control: the box only shows the choice.
                    <span className="list__leading list__leading--checkbox" aria-hidden="true">
                      <span className={["list__check", isSelected ? "is-on" : null].filter(Boolean).join(" ")}>
                        {isSelected ? <Icon name="check" size={14} /> : null}
                      </span>
                    </span>
                  ) : item.leading ? (
                    <Leading leading={item.leading} label={item.primary} />
                  ) : null}
                  {text}
                  <Trailing trailing={{ badge: item.trailing?.badge, meta: item.trailing?.meta }} />
                  {selection === "single" && isSelected ? <Icon name="check" size={16} className="list__tick" /> : null}
                </button>
              </li>
            );
          }

          return (
            <li key={item.id} className={rowClasses}>
              {reorderable ? (
                <button
                  type="button"
                  className="list__handle"
                  data-handle={item.id}
                  aria-label={`Move ${item.primary}`}
                  aria-pressed={held === item.id}
                  onKeyDown={(e) => onHandleKey(e, item.id)}
                  onBlur={() => {
                    if (held === item.id && !drag.current) {
                      setPreview(null);
                      setHeld(null);
                    }
                  }}
                  onPointerDown={(e) => onHandleDown(e, item.id)}
                  onPointerMove={onHandleMove}
                  onPointerUp={onHandleUp}
                  onPointerCancel={onHandleUp}
                >
                  <Icon name="menu" size={16} />
                </button>
              ) : null}
              {item.leading ? <Leading leading={item.leading} label={item.primary} /> : null}
              {text}
              <Trailing trailing={item.trailing} />
              {reorderable ? (
                <span className="list__nudge">
                  <button type="button" className="list__nudge-button" aria-label={`Move ${item.primary} up`} disabled={index === 0} onClick={() => nudge(item.id, -1)}>
                    <Icon name="chevron" size={14} className="list__nudge-up" />
                  </button>
                  <button
                    type="button"
                    className="list__nudge-button"
                    aria-label={`Move ${item.primary} down`}
                    disabled={index === shown.length - 1}
                    onClick={() => nudge(item.id, 1)}
                  >
                    <Icon name="chevron" size={14} className="list__nudge-down" />
                  </button>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {reorderable ? (
        <>
          <span className="u-visually-hidden" id={instructionsId}>
            To move a row, focus its handle and press Space, then Up or Down, then Space to drop it. Escape puts it back.
          </span>
          <output className="u-visually-hidden">{announce}</output>
        </>
      ) : null}
    </>
  );
}

export default List;
