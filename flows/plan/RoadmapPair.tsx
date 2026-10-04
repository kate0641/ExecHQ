"use client";

import { useState, type ReactNode } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { CALENDAR_COPY as C } from "@/mock/plan";

/**
 * The roadmap's two views of one plan: the Agenda, which is the roadmap, and the
 * Calendar beside it. On a phone she switches between them; on a tablet or web
 * they sit side by side and stay linked. "Add to my calendar" is always in reach.
 */
export function RoadmapPair({ agenda, calendar, onAdd }: { agenda: ReactNode; calendar: ReactNode; onAdd: () => void }) {
  const [pane, setPane] = useState<"agenda" | "calendar">("agenda");
  return (
    <div className="rpair" data-pane={pane}>
      <div className="rpair__bar">
        <div className="rpair__switch">
          <ToggleGroup
            label={C.view}
            labelHidden
            shape="pill"
            size="sm"
            options={[
              { value: "agenda", label: C.agenda },
              { value: "calendar", label: C.calendar },
            ]}
            value={pane}
            onChange={(v) => setPane(v === "calendar" ? "calendar" : "agenda")}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={onAdd}>
          <Icon name="plus" size={14} />
          {C.add}
        </Button>
      </div>
      <div className="rpair__panes">
        <div className="rpair__agenda">{agenda}</div>
        <div className="rpair__cal">{calendar}</div>
      </div>
    </div>
  );
}

export default RoadmapPair;
