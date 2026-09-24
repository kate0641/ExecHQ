"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface RevisionChip {
  id: string;
  label: string;
}

export interface RevisionChipsProps {
  /** Heading for the set, e.g. "Change it". */
  label: string;
  /** The chips on offer now, applied ones included. */
  options: readonly RevisionChip[];
  /** The ids already applied. Shown faded, with a check. */
  applied: readonly string[];
  /** Applies a revision, or undoes an applied one. */
  onToggle: (id: string) => void;
  className?: string;
}

/**
 * Revisions as chips that build on each other. Pressing one applies it: the
 * chip fades and takes a check to show it is in use, and any follow-ups it
 * unlocks fade in beside it. Pressing a faded chip undoes it.
 *
 * Toggle buttons, so the applied state is announced as pressed. New options
 * are announced once, politely, by name — a chip appearing silently would be
 * invisible to anyone not looking at it.
 */
export function RevisionChips({ label, options, applied, onToggle, className }: RevisionChipsProps) {
  const known = useRef(new Set(options.map((option) => option.id)));
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const fresh = options.filter((option) => !known.current.has(option.id));
    options.forEach((option) => known.current.add(option.id));
    if (fresh.length) {
      setAnnouncement(`New option${fresh.length > 1 ? "s" : ""}: ${fresh.map((o) => o.label).join(", ")}`);
    }
  }, [options]);

  return (
    <fieldset className={["revision-chips", className].filter(Boolean).join(" ")}>
      <legend className="revision-chips__label">{label}</legend>
      <div className="revision-chips__options">
        {options.map((option) => {
          const isApplied = applied.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={["revision-chips__chip", isApplied ? "is-applied" : null]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isApplied}
              onClick={() => onToggle(option.id)}
            >
              {isApplied ? <Icon name="check" size={14} /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
      <output className="u-visually-hidden">{announcement}</output>
    </fieldset>
  );
}

export default RevisionChips;
