"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { WEEKDAYS_SHORT, longDay, monthGrid, monthKey, monthLabel, monthOf, shiftMonth, type Month } from "@/lib/calendar";
import { addDays, shortDate, type LoopDate } from "@/lib/loop";
import { stageAt, type StageWindow } from "@/lib/roadmap-dates";
import { CALENDAR_COPY as C, type CalendarItem, type CalendarStep } from "@/mock/plan";

export interface PlanCalendarProps {
  windows: StageWindow[];
  /** What she put on her own calendar. */
  items: CalendarItem[];
  /** Her plan steps, on the day each is suggested for or pinned to. Read-only here. */
  steps?: CalendarStep[];
  /** Takes her to a step's card, where she moves or accepts it. */
  onOpenStep?: (stepId: string) => void;
  today: LoopDate;
  /** The day in view, shared with the Agenda: picking one here opens its stage there. */
  selected: LoopDate;
  onSelect: (date: LoopDate) => void;
  onAdd: (date: LoopDate) => void;
  onEdit: (item: CalendarItem) => void;
  onDelete: (item: CalendarItem) => void;
  /** Sits right under the heading: the switch between the Agenda and the Calendar, and Add. */
  controls?: ReactNode;
  /** Catalogue only: the first item asks whether to delete. */
  demoDelete?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * A month calendar with the roadmap's stages tinted across the days, her own
 * items on the days they fall on, and a panel for the day she picked, where she
 * can add, edit or delete. It covers the months the plan and her items cover,
 * and no more. She adds everything by hand.
 *
 * The grid is one tab stop: the arrow keys move between days, Home and End go to
 * the ends of the week, and Page Up and Page Down change month. A tint is never
 * the only cue to a stage: each stage's first day says so, the legend names the
 * stages, and the day panel says which stage a day is in.
 */
export function PlanCalendar({
  windows,
  items,
  steps = [],
  onOpenStep,
  today,
  selected,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  demoDelete,
  controls,
  headingId = "plan-calendar",
  className,
}: PlanCalendarProps) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const dayPanel = useRef<HTMLElement>(null);
  const scrollToDay = useRef(false);
  const [month, setMonth] = useState<Month>(() => monthOf(selected));
  const [seen, setSeen] = useState(selected);
  // Picking a day somewhere else (the Agenda) brings its month into view.
  if (seen !== selected) {
    setSeen(selected);
    if (monthKey(monthOf(selected)) !== monthKey(month)) setMonth(monthOf(selected));
  }

  // The months she can move between: what the plan and her items cover.
  const dates = [windows[0]?.start, windows[windows.length - 1]?.end, ...items.map((i) => i.date), ...steps.map((i) => i.date), today].filter(Boolean) as LoopDate[];
  const first = monthOf(dates.reduce((a, b) => (a < b ? a : b)));
  const last = monthOf(dates.reduce((a, b) => (a > b ? a : b)));
  const index = (m: Month) => m.y * 12 + m.m;
  const canPrev = index(month) > index(first);
  const canNext = index(month) < index(last);

  const grid = monthGrid(month);
  const itemsOn = (date: LoopDate) => items.filter((i) => i.date === date);
  const stepsOn = (date: LoopDate) => steps.filter((i) => i.date === date);
  /** What shows on a day, hers first. The kind is carried in words and in the mark, never colour. */
  const entriesOn = (date: LoopDate) => [
    ...itemsOn(date).map((i) => ({ id: i.id, title: i.title, kind: "yours" as const })),
    ...stepsOn(date).map((i) => ({ id: i.id, title: i.title, kind: "step" as const })),
  ];
  const inView = selected >= grid[0] && selected <= grid[grid.length - 1] && monthKey(monthOf(selected)) === monthKey(month);
  const tabStop = inView ? selected : grid.find((d) => monthKey(monthOf(d)) === monthKey(month)) ?? grid[0];

  // After a tap the day's panel is where the answer is, so bring it into view.
  useEffect(() => {
    if (!scrollToDay.current) return;
    scrollToDay.current = false;
    dayPanel.current?.scrollIntoView({ block: "nearest" });
  });

  // After an arrow key the selection has moved; put the keyboard on its day.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    root.current?.querySelector<HTMLElement>(`[data-date="${selected}"]`)?.focus();
  });

  /** Moving to another month moves the selection with it, so the panel below always matches the grid:
   *  today if it is in that month, otherwise the first day. */
  function changeMonth(by: number) {
    const target = shiftMonth(month, by);
    setMonth(target);
    onSelect(monthKey(monthOf(today)) === monthKey(target) ? today : `${monthKey(target)}-01`);
  }

  function onKey(event: KeyboardEvent) {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: LoopDate | undefined;
    if (event.key in step) next = addDays(selected, step[event.key]);
    else if (event.key === "Home") next = addDays(selected, -((new Date(`${selected}T00:00:00Z`).getUTCDay() + 6) % 7));
    else if (event.key === "End") next = addDays(selected, 6 - ((new Date(`${selected}T00:00:00Z`).getUTCDay() + 6) % 7));
    else if (event.key === "PageUp" || event.key === "PageDown") {
      const target = shiftMonth(monthOf(selected), event.key === "PageUp" ? -1 : 1);
      if (index(target) < index(first) || index(target) > index(last)) return;
      next = `${monthKey(target)}-${selected.slice(8, 10)}`;
    }
    if (!next) return;
    const target = monthOf(next);
    if (index(target) < index(first) || index(target) > index(last)) return;
    event.preventDefault();
    moved.current = true;
    onSelect(next);
  }

  const stage = stageAt(windows, selected);
  const day = itemsOn(selected);
  const daySteps = stepsOn(selected);
  const [asking, setAsking] = useState<string | null>(demoDelete ? (day[0]?.id ?? null) : null);

  return (
    <section className={["pcal", className].filter(Boolean).join(" ")} aria-labelledby={headingId} ref={root}>
      <h2 className="pcal__heading" id={headingId}>
        {C.heading}
      </h2>
      {controls}
      <ul className="pcal__legend" aria-label={C.legend}>
        {windows.map((w) => (
          <li key={w.index}>
            <span className={`pcal__key pcal__key--${w.index + 1}`}>{C.legendItem(w.index + 1, w.title)}</span>
          </li>
        ))}
      </ul>

      <div className="pcal__nav">
        <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => changeMonth(-1)} aria-label={C.prev}>
          <Icon name="chevron-left" size={16} />
        </Button>
        <h3 className="pcal__month" aria-live="polite">
          {monthLabel(month)}
        </h3>
        <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => changeMonth(1)} aria-label={C.next}>
          <Icon name="chevron" size={16} />
        </Button>
      </div>

      <p className="u-visually-hidden" id={`${uid}-hint`}>
        {C.gridHint}
      </p>
      <div className="pcal__grid">
        {WEEKDAYS_SHORT.map((d) => (
          <div className="pcal__dow" key={d} aria-hidden="true">
            {d}
          </div>
        ))}
        {grid.map((date) => {
          const s = stageAt(windows, date);
          const here = entriesOn(date);
          const outside = monthKey(monthOf(date)) !== monthKey(month);
          const starts = s >= 0 && windows[s].start === date;
          const label = [
            longDay(date),
            s >= 0 ? C.inStage(s + 1) : "",
            starts ? C.stageStart(s + 1) : "",
            here.length ? C.items(here.length) : "",
            date === today ? C.today : "",
          ]
            .filter(Boolean)
            .join(", ");
          return (
            <button
              key={date}
              type="button"
              data-date={date}
              className={[
                "pcal__cell",
                s >= 0 ? `pcal__cell--${s + 1}` : null,
                outside ? "is-outside" : null,
                date === today ? "is-today" : null,
                date === selected ? "is-selected" : null,
              ]
                .filter(Boolean)
                .join(" ")}
              tabIndex={date === tabStop ? 0 : -1}
              aria-label={label}
              aria-current={date === today ? "date" : undefined}
              aria-pressed={date === selected}
              aria-describedby={`${uid}-hint`}
              onClick={() => {
                scrollToDay.current = true;
                onSelect(date);
              }}
              onKeyDown={onKey}
            >
              <span className="pcal__n">
                <span className="pcal__num" aria-hidden="true">{Number(date.slice(8, 10))}</span>
                {starts ? (
                  <span className="pcal__start" aria-hidden="true">
                    S{s + 1}
                  </span>
                ) : null}
              </span>
              {here.slice(0, 2).map((i) => (
                <span className={`pcal__chip pcal__chip--${i.kind}`} key={`${i.kind}-${i.id}`} aria-hidden="true">
                  {i.title}
                </span>
              ))}
              {here.length > 2 ? (
                <span className="pcal__more" aria-hidden="true">
                  {C.more(here.length - 2)}
                </span>
              ) : null}
              {here.length ? (
                <span className="pcal__dots" aria-hidden="true">
                  {here.map((i) => (
                    <i className={`pcal__dot--${i.kind}`} key={`${i.kind}-${i.id}`} />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <section className="pcal__day" aria-labelledby={`${uid}-day`} ref={dayPanel}>
        <h3 className="pcal__day-title" id={`${uid}-day`}>
          {longDay(selected)}
        </h3>
        <p className="pcal__small">
          {stage >= 0 ? (
            <>
              <Badge tone="neutral">{`Stage ${stage + 1}`}</Badge> {windows[stage].title}
            </>
          ) : (
            C.outside
          )}
        </p>
        {day.length || daySteps.length ? (
          <ul className="pcal__items">
            {daySteps.map((step) => (
              <li className="pcal__item" key={step.id}>
                <span className="pcal__tag">
                  {C.step} · {step.suggested ? C.suggested : C.pinned}
                </span>
                <span className="pcal__item-title">{step.title}</span>
                {onOpenStep ? (
                  <span className="pcal__item-actions">
                    <Button variant="ghost" size="sm" onClick={() => onOpenStep(step.id)}>
                      {C.openStep}
                    </Button>
                  </span>
                ) : null}
              </li>
            ))}
            {day.map((item) => (
              <li className="pcal__item" key={item.id}>
                <span className="pcal__tag">{C.yours}</span>
                <span className="pcal__item-title">{item.title}</span>
                {item.note ? <span className="pcal__small">{item.note}</span> : null}
                {asking === item.id ? (
                  <span className="pcal__item-actions">
                    <span className="pcal__ask">{C.deleteAsk}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onDelete(item);
                        setAsking(null);
                      }}
                    >
                      {C.deleteYes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAsking(null)}>
                      {C.deleteNo}
                    </Button>
                  </span>
                ) : (
                  <span className="pcal__item-actions">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      {C.edit}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAsking(item.id)}>
                      {C.delete}
                    </Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="pcal__small">{C.nothingDay}</p>
        )}
        <div>
          <Button variant="secondary" size="sm" onClick={() => onAdd(selected)}>
            <Icon name="plus" size={14} />
            {C.addTo(shortDate(selected))}
          </Button>
        </div>
        <p className="pcal__small">{C.manualOnly}</p>
      </section>
    </section>
  );
}

export default PlanCalendar;
