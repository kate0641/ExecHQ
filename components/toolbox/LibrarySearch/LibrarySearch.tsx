"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface LibrarySearchItem {
  id: string;
  title: string;
  /** Under the title: "Pitch builder · 2 days ago". */
  detail: string;
  /** What else it is found by: what the draft says, the tool's name. */
  text?: string;
  href: string;
}

export interface LibrarySearchCopy {
  /** The field's name, and its placeholder. */
  field: string;
  /** Over the list before she types. */
  recent: string;
  /** Over the list once she types. */
  matches: (n: number) => string;
  noMatch: (q: string) => string;
}

export interface LibrarySearchProps {
  /** Her library, newest first. */
  items: readonly LibrarySearchItem[];
  /** Opens the one she picked. */
  onPick: (item: LibrarySearchItem) => void;
  copy: LibrarySearchCopy;
  /** Opens with this typed (catalogue). */
  initial?: string;
  /** How many show at once. */
  limit?: number;
  /** Catalogue only: shows the first match in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/** Best first: the title starts with it, then a word in the title does, then
 *  the title has it anywhere, then only what the draft says does. -1 when
 *  nothing has it. Shared with the search field on web (Concept 2). */
export function rank(item: LibrarySearchItem, q: string): number {
  const title = item.title.toLowerCase();
  if (title.startsWith(q)) return 0;
  if (title.split(/[\s:—-]+/).some((w) => w.startsWith(q))) return 1;
  if (title.includes(q)) return 2;
  if ((item.text ?? "").toLowerCase().includes(q)) return 3;
  return -1;
}

/** The title with what she typed in bold, where the title has it. */
function marked(title: string, q: string) {
  const at = q ? title.toLowerCase().indexOf(q) : -1;
  if (at < 0) return title;
  return (
    <>
      {title.slice(0, at)}
      <mark className="library-search__hit">{title.slice(at, at + q.length)}</mark>
      {title.slice(at + q.length)}
    </>
  );
}

/**
 * Finding something in the library, inside the sheet the magnifying glass
 * opens (Toolbox Concept 2, 14 Oct). Before she types, her latest work; as
 * she types, the matches update with each letter, the best first, with what
 * she typed marked in the title. Each match is a button that opens it; Tab
 * goes from the field to them, and the count is announced as it changes.
 */
export function LibrarySearch({ items, onPick, copy, initial = "", limit = 8, demo, className }: LibrarySearchProps) {
  const id = useId();
  const [query, setQuery] = useState(initial);
  const q = query.trim().toLowerCase();

  const shown = q
    ? items
        .map((item, i) => ({ item, r: rank(item, q), i }))
        .filter((x) => x.r >= 0)
        .sort((a, b) => a.r - b.r || a.i - b.i)
        .slice(0, limit)
        .map((x) => x.item)
    : items.slice(0, limit);

  const heading = q ? (shown.length ? copy.matches(shown.length) : copy.noMatch(query.trim())) : copy.recent;

  return (
    <div className={["library-search", className].filter(Boolean).join(" ")}>
      <div className="library-search__field">
        <Icon name="search" size={18} className="library-search__icon" />
        <input
          type="search"
          aria-label={copy.field}
          aria-describedby={`${id}-heading`}
          autoComplete="off"
          placeholder={copy.field}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="field__control library-search__input"
        />
      </div>
      <p className="library-search__heading" id={`${id}-heading`} aria-live="polite">
        {heading}
      </p>
      {shown.length ? (
        <ul className="library-search__list" aria-labelledby={`${id}-heading`}>
          {shown.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={["library-search__option", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
                onClick={() => onPick(item)}
              >
                <span className="library-search__title">{marked(item.title, q)}</span>
                <span className="library-search__detail">{item.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default LibrarySearch;
