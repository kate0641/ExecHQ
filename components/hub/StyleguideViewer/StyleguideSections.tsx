"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface StyleguideSection {
  id: string;
  label: string;
  group: string;
  content: ReactNode;
}

/**
 * The design system, one section at a time, with a menu down the left.
 *
 * Every section is rendered on the server — the token panels read
 * `styles/tokens.css` there — and this only chooses which one shows. The
 * choice lives in the address (`#typography`), so a section can be linked
 * to, and back and forward move between sections. The others are `hidden`,
 * which takes them out of the page and the accessibility tree alike.
 */
export function StyleguideSections({ sections }: { sections: StyleguideSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
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

  const groups = [...new Set(sections.map((section) => section.group))];
  const index = sections.findIndex((section) => section.id === active);
  const next = sections[index + 1];

  return (
    <div className="styleguide-layout">
      <nav className="styleguide-layout__nav" aria-label="Design system sections">
        {groups.map((group) => (
          <div className="styleguide-layout__group" key={group}>
            <p className="t-eyebrow">{group}</p>
            <ul className="styleguide-layout__list">
              {sections
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
      </nav>

      <div className="styleguide-layout__content">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="styleguide-layout__section"
            aria-label={section.label}
            hidden={section.id !== active}
          >
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
