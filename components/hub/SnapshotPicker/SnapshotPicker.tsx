"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Icon } from "@/components/primitives/Icon";
import { getFlow } from "@/lib/manifest";
import { resetLoop, selectSnapshot, useLoop } from "@/lib/loop-store";
import { SNAPSHOT_IDS, SNAPSHOTS, type SnapshotId } from "@/mock/snapshots";

/** What each option shows in the dock, where a word will not fit. The full
 *  label is its accessible name and its tooltip. */
const SNAPSHOT_GLYPHS: Record<SnapshotId, string> = {
  "day-one": "D1",
  "week-three": "W3",
  "month-three": "M3",
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * Picks which point in Maya's first months the signed-in pages show, and puts
 * every snapshot back as it started.
 *
 * Only on signed-in pages (the manifest's `app` chrome): nothing anywhere else
 * reads the Loop, so the control would do nothing there. The choice and every
 * change made in a snapshot are kept by `lib/loop-store.ts`.
 */
export function SnapshotPicker() {
  const pathname = usePathname();
  const flow = getFlow(pathname.split("/")[1] ?? "");
  const loop = useLoop();
  const [announcement, setAnnouncement] = useState("");
  const resetHintId = useId();

  if (flow?.chrome !== "app") return null;

  const options = SNAPSHOT_IDS.map((id) => {
    const snapshot = SNAPSHOTS[id];
    return {
      value: id,
      label: snapshot.label,
      icon: (
        <span className="snapshot-picker__glyph" aria-hidden="true">
          {SNAPSHOT_GLYPHS[id]}
        </span>
      ),
      description: `${DATE_FORMAT.format(new Date(`${snapshot.today}T00:00:00Z`))}. ${snapshot.summary}`,
    };
  });

  return (
    <div className="snapshot-picker">
      <span className="devtools__rule" aria-hidden="true" />
      <ToggleGroup
        label="Snapshot"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={options}
        value={loop.id}
        onChange={(next) => {
          selectSnapshot(next as SnapshotId);
          setAnnouncement(`Snapshot: ${SNAPSHOTS[next as SnapshotId].label}`);
        }}
      />
      <button
        type="button"
        className="devtools__reset"
        aria-disabled={!loop.anyChanged}
        aria-describedby={resetHintId}
        title={
          loop.anyChanged
            ? "Reset all three snapshots"
            : "Reset all three snapshots — nothing has changed yet"
        }
        onClick={() => {
          if (!loop.anyChanged) return;
          resetLoop();
          setAnnouncement("All three snapshots are back as they started.");
        }}
      >
        <Icon name="reset" size={16} />
        <span className="u-visually-hidden">Reset all three snapshots</span>
      </button>
      <span className="u-visually-hidden" id={resetHintId}>
        {loop.anyChanged
          ? "Undoes every change made in Day one, Week three and Month three."
          : "Unavailable. Nothing has changed in any snapshot yet."}
      </span>
      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default SnapshotPicker;
