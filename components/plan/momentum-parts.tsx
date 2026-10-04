"use client";

import { useId, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ofFigure, type MomentumEvent } from "@/lib/momentum";
import { shortDate } from "@/lib/loop";
import { MOMENTUM_COPY as C, WINDOWS, type MomentumFigure, type WindowDays } from "@/mock/plan";

/**
 * Pieces both Momentum concepts use, so the only difference a reviewer sees is
 * the one being tested: the 90-day label, and how the 30 days reads.
 */

export function MomentumWindows({ value, onChange }: { value: WindowDays; onChange: (days: WindowDays) => void }) {
  return (
    <ToggleGroup
      label={C.windowLabel}
      labelHidden
      shape="pill"
      size="sm"
      options={WINDOWS.map((w) => ({ value: String(w), label: `${w} days` }))}
      value={String(value)}
      onChange={(v) => onChange(Number(v) as WindowDays)}
    />
  );
}

/** The events behind a figure or a label, so nothing is a bare number. */
export function Behind({ events, open: initial = false }: { events: MomentumEvent[]; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  const id = useId();
  if (events.length === 0) return null;
  return (
    <div className="momentum__behind">
      <Button variant="ghost" size="sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? C.hideBehind : C.behind}
        <Icon name={open ? "chevron-up" : "chevron-down"} size={16} />
      </Button>
      <ul className="momentum__events" id={id} hidden={!open}>
        {[...events].reverse().map((e) => (
          <li key={e.id}>
            <span className="momentum__event-date">{shortDate(e.on)}</span> {e.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The three figures for a set of events: each a count in words, with what is behind it. */
export function Figures({ events, openFirst }: { events: MomentumEvent[]; openFirst?: boolean }) {
  const figures: MomentumFigure[] = ["completed", "artifact", "outcome"];
  return (
    <ul className="momentum__figures">
      {figures.map((figure, i) => {
        const own = ofFigure(events, figure);
        return (
          <li className="momentum__figure" key={figure}>
            <p className="momentum__count">{C.figures[figure](own.length)}</p>
            <Behind events={own} open={openFirst && i === 0} />
          </li>
        );
      })}
    </ul>
  );
}
