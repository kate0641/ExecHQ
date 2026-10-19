"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Icon } from "@/components/primitives/Icon";
import { getFlow } from "@/lib/manifest";
import { resetLoop, selectSnapshot, useLoop } from "@/lib/loop-store";
import { SNAPSHOT_IDS, SNAPSHOTS, type SnapshotId } from "@/mock/snapshots";

/** What each option shows in the dock, where a word will not fit: the five
 *  states in the prompt's order. The full label is its accessible name and
 *  its tooltip. */
const SNAPSHOT_GLYPHS: Record<SnapshotId, string> = {
  "first-return": "1",
  "follow-up-due": "2",
  "drafted-not-used": "3",
  "nothing-pending": "4",
  "just-answered": "5",
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * The reviewer's state switcher: picks which of the five homepage states every
 * signed-in page shows, and puts them all back as they started. A reviewer
 * tool, not product UI.
 *
 * The highlighted state is read from the Loop, not from the last pick, so it
 * always tells the truth: answering a follow-up moves it to "Just answered" on
 * its own, and the live region says so.
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
        <span className="dock-picker__glyph" aria-hidden="true">
          {SNAPSHOT_GLYPHS[id]}
        </span>
      ),
      description: `${DATE_FORMAT.format(new Date(`${snapshot.today}T00:00:00Z`))}. ${snapshot.summary}`,
    };
  });

  return (
    <div className="dock-picker">
      <span className="devtools__rule" aria-hidden="true" />
      <ToggleGroup
        label="Homepage state"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={options}
        value={loop.homeState}
        onChange={(next) => {
          setAnnouncement("");
          selectSnapshot(next as SnapshotId);
        }}
      />
      <button
        type="button"
        className="devtools__reset"
        aria-disabled={!loop.anyChanged}
        aria-describedby={resetHintId}
        title={
          loop.anyChanged
            ? "Put every state back as it started"
            : "Put every state back as it started — nothing has changed yet"
        }
        onClick={() => {
          if (!loop.anyChanged) return;
          resetLoop();
          setAnnouncement("Every state is back as it started.");
        }}
      >
        <Icon name="reset" size={16} />
        <span className="u-visually-hidden">Put every state back as it started</span>
      </button>
      <span className="u-visually-hidden" id={resetHintId}>
        {loop.anyChanged
          ? "Undoes every change made in any of the five states."
          : "Unavailable. Nothing has changed in any state yet."}
      </span>
      {/* Always the state showing now, so any change — a pick, or an answer
          that moves the page on — is read out. */}
      <output className="u-visually-hidden">
        {announcement || `Homepage state: ${SNAPSHOTS[loop.homeState].label}`}
      </output>
    </div>
  );
}

export default SnapshotPicker;
