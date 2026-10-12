"use client";

import { useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Button } from "@/components/primitives/Button";
import {
  BRIEFING_COPY,
  MIN_PUBLISHERS,
  PUBLISHER_GROUPS,
  PUBLISHERS,
  SUGGESTED_PUBLISHERS,
  publisherName,
} from "@/mock/briefing";

const C = BRIEFING_COPY.firstVisit;
const S = BRIEFING_COPY.settings;

export interface PublisherPickerProps {
  /**
   * - `first`: her first visit, before any reads load. The suggested set
   *   leads, with one press to take it; choosing her own opens the full list.
   * - `settings`: changing them later, the full list open with her choices.
   */
  mode: "first" | "settings";
  /** Her publishers now. Empty on the first visit. */
  chosen?: readonly string[];
  onDone: (ids: string[]) => void;
  /** Settings only: leaves without saving. */
  onCancel?: () => void;
  /** Opens with the full list showing (catalogue). */
  startOwn?: boolean;
  headingId?: string;
  className?: string;
}

const MAX = PUBLISHERS.length;

/**
 * Where her reads come from. On her first visit it comes before the first
 * set loads, with a suggested set she can take in one press, so the Briefing
 * is never a blank form. Later the same list changes them, from the Briefing
 * page itself or from Profile.
 */
export function PublisherPicker({ mode, chosen = [], onDone, onCancel, startOwn = false, headingId, className }: PublisherPickerProps) {
  const [own, setOwn] = useState(mode === "settings" || startOwn);
  const [picked, setPicked] = useState<string[]>(() => (chosen.length ? [...chosen] : [...SUGGESTED_PUBLISHERS]));
  const enough = picked.length >= MIN_PUBLISHERS;
  const groupsRef = useRef<HTMLDivElement>(null);

  const groups = PUBLISHER_GROUPS.map((group) => {
    const inGroup = PUBLISHERS.filter((p) => p.group === group.id);
    return (
      <ChipGroup
        key={group.id}
        label={group.label}
        options={inGroup.map((p) => p.name)}
        value={inGroup.filter((p) => picked.includes(p.id)).map((p) => p.name)}
        max={MAX}
        onChange={(names) => {
          const others = picked.filter((id) => !inGroup.some((p) => p.id === id));
          setPicked([...others, ...inGroup.filter((p) => names.includes(p.name)).map((p) => p.id)]);
        }}
      />
    );
  });

  const count = (
    <output className="publisher-picker__count">
      {C.chosen(picked.length)}
      {enough ? null : <span className="publisher-picker__min"> · {C.min(MIN_PUBLISHERS)}</span>}
    </output>
  );

  if (mode === "settings") {
    return (
      <div className={["publisher-picker", "publisher-picker--settings", className].filter(Boolean).join(" ")}>
        <h2 className="publisher-picker__heading" id={headingId} tabIndex={-1}>
          {S.publishersHeading}
        </h2>
        <p className="publisher-picker__body">{C.later}</p>
        <div className="publisher-picker__groups">{groups}</div>
        {count}
        <div className="publisher-picker__actions">
          <Button fullWidth disabled={!enough} onClick={() => onDone(picked)}>
            {S.save}
          </Button>
          {onCancel ? (
            <Button variant="secondary" fullWidth onClick={onCancel}>
              {S.cancel}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={["publisher-picker", "publisher-picker--first", className].filter(Boolean).join(" ")}>
      <h2 className="publisher-picker__heading" id={headingId} tabIndex={-1}>
        {C.heading}
      </h2>
      <p className="publisher-picker__body">{C.body}</p>

      {own ? (
        <>
          <div className="publisher-picker__groups" ref={groupsRef}>
            {groups}
          </div>
          {count}
          <Button fullWidth disabled={!enough} onClick={() => onDone(picked)}>
            {C.done}
          </Button>
        </>
      ) : (
        <>
          <section className="publisher-picker__suggested" aria-labelledby="publisher-suggested-heading">
            <h3 className="publisher-picker__suggested-heading" id="publisher-suggested-heading">
              {C.suggestedHeading}
            </h3>
            <p className="publisher-picker__why">{C.suggestedWhy}</p>
            <ul className="publisher-picker__list">
              {SUGGESTED_PUBLISHERS.map((id) => (
                <li key={id}>{publisherName(id)}</li>
              ))}
            </ul>
          </section>
          <div className="publisher-picker__actions">
            <Button fullWidth onClick={() => onDone([...SUGGESTED_PUBLISHERS])}>
              {C.useSuggested}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                // The button goes as the list opens, so focus moves to the list's first choice.
                setOwn(true);
                setTimeout(() => groupsRef.current?.querySelector("button")?.focus(), 0);
              }}
            >
              {C.chooseOwn}
            </Button>
          </div>
        </>
      )}
      <p className="publisher-picker__later">{C.later}</p>
    </div>
  );
}

export default PublisherPicker;
