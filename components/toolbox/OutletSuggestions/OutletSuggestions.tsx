"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import { SUGGEST_COPY as C, type Outlet } from "@/mock/toolbox";

export interface OutletSuggestionsProps {
  /** Up to three that fit (`suggestedOutlets`). */
  outlets: readonly Outlet[];
  /** What she is pitching for, said in the lead line. */
  type?: string;
  /** What she has answered, so a suggestion she picked shows as chosen. */
  chosen?: string;
  onPick: (name: string) => void;
  /** Catalogue only: opens with the suggestions showing. */
  startOpen?: boolean;
  /** Catalogue only: `is-hover`, `is-focus` or `is-active` on each outlet. */
  optionClassName?: string;
  className?: string;
}

/**
 * "Not sure yet" under Who are you pitching? (Kate, 14 Oct): up to three
 * outlets that fit what she is pitching for, each with one line on why.
 * Picking one fills in the answer; she can still type her own.
 */
export function OutletSuggestions({ outlets, type, chosen, onPick, startOpen = false, optionClassName, className }: OutletSuggestionsProps) {
  const [open, setOpen] = useState(startOpen);
  const listId = useId();
  if (!outlets.length) return null;
  const isChosen = (o: Outlet) => chosen?.trim().toLowerCase() === o.name.toLowerCase();
  return (
    <div className={["outlet-suggest", className].filter(Boolean).join(" ")}>
      <button type="button" className="outlet-suggest__toggle link" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
        {open ? C.close : C.open(outlets.length)}
      </button>
      <div id={listId} hidden={!open} className="outlet-suggest__panel">
        <p className="outlet-suggest__lead">{C.lead(type)}</p>
        <ul className="outlet-suggest__list">
          {outlets.map((o) => (
            <li key={o.id}>
              <button type="button" className={["outlet-suggest__option", optionClassName].filter(Boolean).join(" ")} aria-pressed={isChosen(o)} onClick={() => onPick(o.name)}>
                <span className="outlet-suggest__name">
                  {o.name}
                  {isChosen(o) ? (
                    <span className="outlet-suggest__chosen">
                      <Icon name="check" size={14} />
                      {C.chosen}
                    </span>
                  ) : null}
                </span>
                {o.part ? <span className="outlet-suggest__part">{`${o.part} · ${o.type}`}</span> : null}
                {o.fits ? <span className="outlet-suggest__fits">{o.fits}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OutletSuggestions;
