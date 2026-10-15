"use client";

import { useRef, type KeyboardEvent } from "react";

export interface LibraryTab {
  id: string;
  label: string;
  /** How many it holds, after the name. */
  count: number;
}

export interface LibraryTabsProps {
  tabs: readonly LibraryTab[];
  /** The chosen tab's id. */
  value: string;
  onChange: (id: string) => void;
  /** The tab list's accessible name. */
  label: string;
  /** The id prefix tying each tab to its panel: tab `${idBase}-tab-${id}`,
   *  panel `${idBase}-panel`. */
  idBase: string;
  /** Catalogue only: shows the first unchosen tab in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The library's folders as tabs on web (Toolbox Concept 2, option A, 15 Oct):
 * All, then one per tool, each with how many it holds. A real tab list: one
 * tab in the Tab order, arrow keys move between them and choose, Home and
 * End go to the ends. The panel is the page's, named by the chosen tab.
 */
export function LibraryTabs({ tabs, value, onChange, label, idBase, demo, className }: LibraryTabsProps) {
  const list = useRef<HTMLDivElement>(null);
  const demoAt = tabs.findIndex((t) => t.id !== value);

  const move = (event: KeyboardEvent<HTMLButtonElement>, at: number) => {
    const last = tabs.length - 1;
    const to =
      event.key === "ArrowRight" ? (at === last ? 0 : at + 1)
      : event.key === "ArrowLeft" ? (at === 0 ? last : at - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (to < 0) return;
    event.preventDefault();
    onChange(tabs[to].id);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[to]?.focus();
  };

  return (
    <div ref={list} role="tablist" aria-label={label} className={["library-tabs", className].filter(Boolean).join(" ")}>
      {tabs.map((tab, i) => {
        const chosen = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.id}`}
            aria-selected={chosen}
            aria-controls={`${idBase}-panel`}
            tabIndex={chosen ? 0 : -1}
            className={["library-tabs__tab", demo && i === demoAt ? `is-${demo}` : null].filter(Boolean).join(" ")}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => move(event, i)}
          >
            {tab.label}
            <span className="library-tabs__count">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LibraryTabs;
