"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface StyleguideSection {
  id: string;
  label: string;
  group: string;
  description?: string;
  /** Links or controls beside the section's title. */
  actions?: ReactNode;
  /** Where the section is edited, shown under its description. */
  source?: string;
  content: ReactNode;
}

/**
 * The design system, one section at a time, with a sidebar down the left:
 * a search that narrows the list, then the sections under their groups.
 *
 * Every section is rendered on the server — the token panels read
 * `styles/tokens.css` there — and this only chooses which one shows. The
 * choice lives in the address (`#typography`), so a section can be linked
 * to, and back and forward move between sections. The others are `hidden`,
 * which takes them out of the page and the accessibility tree alike.
 */
export function StyleguideSections({ sections }: { sections: StyleguideSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [query, setQuery] = useState("");
  const ids = sections.map((section) => section.id).join(" ");

  useEffect(() => {
    const known = ids.split(" ");
    // No section in the address, or one that is not here, means the first.
    const read = () => {
      const id = window.location.hash.slice(1);
      setActive(known.includes(id) ? id : known[0]);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [ids]);

  const needle = query.trim().toLowerCase();
  const matches = sections.filter(
    (section) =>
      !needle ||
      [section.label, section.group, section.description ?? ""].some((text) =>
        text.toLowerCase().includes(needle)
      )
  );
  const groups = [...new Set(matches.map((section) => section.group))];
  const index = sections.findIndex((section) => section.id === active);
  const next = sections[index + 1];

  return (
    <div className="styleguide-layout">
      <nav className="styleguide-layout__nav" aria-label="Design system sections">
        <div className="styleguide-layout__search">
          <input
            type="search"
            aria-label="Search sections"
            className="styleguide-layout__search-field"
            placeholder="Search sections…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {groups.map((group) => (
          <div className="styleguide-layout__group" key={group}>
            <p className="styleguide-layout__group-label">{group}</p>
            <ul className="styleguide-layout__list">
              {matches
                .filter((section) => section.group === group)
                .map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="styleguide-layout__link"
                      aria-current={section.id === active ? "page" : undefined}
                      // Switch at once; the hash change that follows agrees.
                      onClick={() => setActive(section.id)}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {matches.length === 0 ? (
          <output className="styleguide-layout__empty">
            No sections match “{query.trim()}”.
          </output>
        ) : null}
      </nav>

      <div className="styleguide-layout__content">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="styleguide-layout__section"
            aria-labelledby={`${section.id}-title`}
            hidden={section.id !== active}
          >
            <header className="styleguide-layout__header">
              <div className="styleguide-layout__heading">
                <p className="styleguide-layout__eyebrow">{section.group}</p>
                <h2 id={`${section.id}-title`} className="styleguide-layout__title">
                  {section.label}
                </h2>
                {section.description ? (
                  <p className="styleguide-layout__description">{section.description}</p>
                ) : null}
                {section.source ? (
                  <p className="styleguide-layout__source">
                    Edit · <code>{section.source}</code>
                  </p>
                ) : null}
              </div>
              {section.actions ? (
                <div className="styleguide-layout__actions">{section.actions}</div>
              ) : null}
            </header>
            {section.content}
          </section>
        ))}
        {next ? (
          <a
            href={`#${next.id}`}
            className="styleguide-layout__next"
            onClick={() => setActive(next.id)}
          >
            Next: {next.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default StyleguideSections;
