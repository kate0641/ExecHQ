"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { Icon } from "@/components/primitives/Icon";
import { WEEKDAYS_SHORT, longDay, monthGrid, monthKey, monthLabel, monthOf, shiftMonth, type Month } from "@/lib/calendar";
import { addDays } from "@/lib/loop";
import {
  DATE_PICKER_COPY as C,
  RANGE_PRESETS,
  RANGE_PRESET_IDS,
  mondayOf,
  presetRange,
  rangeHasFigures,
  rangeLabel,
  shiftRange,
  todayFor,
  withPreset,
  type Cohort,
  type DateRange,
  type RangePresetId,
} from "@/mock/enterprise";

const WEEKDAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface DateRangePickerProps {
  /** Whose figures: the first day and today bound what can be chosen. */
  cohort: Cohort;
  value: DateRange;
  /** Without it the picker keeps its own dates (catalogue). */
  onChange?: (next: DateRange) => void;
  /** Which edge of the field the panel lines up with. */
  align?: "start" | "end";
  /** Catalogue only: opens with the panel showing. */
  defaultOpen?: boolean;
  /** Catalogue only: draws the panel in the flow under the field. */
  inline?: boolean;
  /** Catalogue only: opens partway through picking, from this day. */
  pickingFrom?: string;
  /** Catalogue only: shows the field in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

const later = (a: string, b: string) => (a > b ? a : b);
const earlier = (a: string, b: string) => (a < b ? a : b);
const monthIndex = (month: Month) => month.y * 12 + month.m;

/**
 * The dashboard's dates (Kate, 2026-10-21): a field showing them, with
 * arrows that step to the dates before or after, and a panel with ranges on
 * the left and two months of calendar. Any dates from the program's first
 * day to today, as short as one day. The minimum cohort size still hides
 * figures for dates with too few people active; the panel says so.
 *
 * Choosing a range on the left applies it at once. On the calendar, the
 * first press sets the first day and the second the last day, in either
 * order; nothing is dragged. Weeks start on Monday.
 *
 * The panel is a non-modal `<dialog open>`. Focus moves into it, on the
 * chosen range or the last day. In the calendar the arrow keys move a day or
 * a week, Home and End go to the week's ends, Page Up and Page Down a month,
 * and Enter or Space chooses. Escape shuts it and puts focus back on the
 * field; a press outside, or Tab moving out, shuts it.
 */
export function DateRangePicker({ cohort, value, onChange, align = "end", defaultOpen = false, inline = false, pickingFrom, demo, className }: DateRangePickerProps) {
  const [own, setOwn] = useState(value);
  const range = onChange ? value : own;
  const [open, setOpen] = useState(defaultOpen);
  const [announce, setAnnounce] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const label = rangeLabel(range);
  const words = range.preset ? RANGE_PRESETS[range.preset].label : undefined;
  const before = shiftRange(range, -1, cohort);
  const after = shiftRange(range, 1, cohort);

  function choose(next: DateRange, viaArrow = false) {
    if (onChange) onChange(next);
    else setOwn(next);
    setAnnounce(C.chosen(next.preset ? `${RANGE_PRESETS[next.preset].label}, ${rangeLabel(next)}` : rangeLabel(next)));
    if (!viaArrow) {
      setOpen(false);
      trigger.current?.focus();
    }
  }

  return (
    <div className={["date-range", inline ? "date-range--inline" : null, className].filter(Boolean).join(" ")}>
      <fieldset className="date-range__field">
        <legend className="u-visually-hidden">{C.label}</legend>
        <button
          ref={trigger}
          type="button"
          className={["date-range__trigger", open ? "is-open" : null, demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={C.open(words ? `${words}, ${label}` : label)}
          onClick={() => setOpen(!open)}
        >
          <Icon name="calendar" size={16} />
          {words ? <span className="date-range__preset">{words}</span> : null}
          <span className="date-range__dates">{label}</span>
        </button>
        <button type="button" className="date-range__step" aria-label={C.earlier} disabled={!before} onClick={() => before && choose(before, true)}>
          <Icon name="chevron-left" size={16} />
        </button>
        <button type="button" className="date-range__step" aria-label={C.later} disabled={!after} onClick={() => after && choose(after, true)}>
          <Icon name="chevron" size={16} />
        </button>
      </fieldset>
      <span className="u-visually-hidden" aria-live="polite">
        {announce}
      </span>
      {open ? (
        <RangePanel
          id={panelId}
          cohort={cohort}
          range={range}
          align={align}
          inline={inline}
          pickingFrom={pickingFrom}
          anchor={trigger}
          onPick={(next) => choose(next)}
          onClose={(returnFocus) => {
            setOpen(false);
            if (returnFocus) trigger.current?.focus();
          }}
        />
      ) : null}
    </div>
  );
}

interface RangePanelProps {
  id: string;
  cohort: Cohort;
  range: DateRange;
  align: "start" | "end";
  inline: boolean;
  pickingFrom?: string;
  anchor: RefObject<HTMLButtonElement | null>;
  onPick: (next: DateRange) => void;
  onClose: (returnFocus: boolean) => void;
}

function RangePanel({ id, cohort, range, align, inline, pickingFrom, anchor, onPick, onClose }: RangePanelProps) {
  const min = cohort.startsOn;
  const max = todayFor(cohort);
  // A cohort set up on this visit has no figures until its first update.
  const started = !cohort.fresh && min <= max;
  const clamp = (day: string) => (started ? earlier(later(day, min), max) : max);

  const panel = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const [start, setStart] = useState<string | undefined>(pickingFrom);
  const [hover, setHover] = useState<string | undefined>();
  const [focusDay, setFocusDay] = useState(() => clamp(pickingFrom ?? range.to));
  // The right-hand month holds the last day: the left is the month before.
  const [view, setView] = useState<Month>(() => shiftMonth(monthOf(clamp(pickingFrom ?? range.to)), -1));
  const moveFocus = useRef(false);

  const firstMonth = monthOf(min);
  const lastMonth = monthOf(max);
  const months = [view, shiftMonth(view, 1)];
  const canBack = monthIndex(view) > monthIndex(firstMonth);
  const canForward = monthIndex(months[1]) < monthIndex(lastMonth);

  // What is drawn as chosen: the range, or the one being picked.
  // Nothing is drawn as chosen before there are figures to choose from.
  const shown = !started ? { from: "", to: "" } : start ? { from: earlier(start, hover ?? start), to: later(start, hover ?? start) } : range;

  // On opening, focus goes to the chosen range, or else to the last day.
  useLayoutEffect(() => {
    if (inline) return;
    const el = panel.current;
    const target = el?.querySelector<HTMLElement>('.date-range__choice[aria-pressed="true"]') ?? el?.querySelector<HTMLElement>('.date-range__day[tabindex="0"]');
    (target ?? el)?.focus();
  }, [inline]);

  // Keys move focus by setting the day; the button gets it once drawn.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    panel.current?.querySelector<HTMLElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay, view]);

  useEffect(() => {
    const el = panel.current;
    if (inline || !el) return;
    const inside = (node: EventTarget | null) => node instanceof Node && (el.contains(node) || Boolean(anchor.current?.contains(node)));
    function onPointer(event: PointerEvent) {
      if (!inside(event.target)) onClose(false);
    }
    function onFocusOut(event: FocusEvent) {
      if (event.relatedTarget && !inside(event.relatedTarget)) onClose(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || !inside(document.activeElement)) return;
      event.stopPropagation();
      onClose(true);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [inline, anchor, onClose]);

  function goTo(day: string) {
    const target = monthIndex(monthOf(day));
    if (target < monthIndex(view)) setView(monthOf(day));
    else if (target > monthIndex(months[1])) setView(shiftMonth(monthOf(day), -1));
    moveFocus.current = true;
    setFocusDay(day);
    // While picking, the band follows the keys as it follows the pointer.
    if (start && day >= min && day <= max) setHover(day);
  }

  function pressDay(day: string) {
    if (!started || day < min || day > max) return;
    setFocusDay(day);
    if (!start) {
      setStart(day);
      return;
    }
    setStart(undefined);
    setHover(undefined);
    onPick(withPreset({ from: earlier(start, day), to: later(start, day) }, cohort));
  }

  function onDayKey(event: ReactKeyboardEvent<HTMLButtonElement>, day: string) {
    const sameDayOfMonth = (by: number) => {
      const month = shiftMonth(monthOf(day), by);
      const last = Number(addDays(`${monthKey(shiftMonth(month, 1))}-01`, -1).slice(8, 10));
      return `${monthKey(month)}-${String(Math.min(Number(day.slice(8, 10)), last)).padStart(2, "0")}`;
    };
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => mondayOf(day),
      End: () => addDays(mondayOf(day), 6),
      PageUp: () => sameDayOfMonth(-1),
      PageDown: () => sameDayOfMonth(1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move();
    // Keep to the months there are figures for.
    if (monthIndex(monthOf(next)) < monthIndex(firstMonth) || monthIndex(monthOf(next)) > monthIndex(lastMonth)) return;
    goTo(next);
  }

  const status = !started ? C.notStarted(cohort.asOf) : start ? C.chooseEnd(start) : C.chooseStart;

  return (
    <dialog
      ref={panel}
      open
      id={id}
      className={["date-range__panel", `date-range__panel--${align}`, inline ? "date-range__panel--inline" : null].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
      tabIndex={-1}
    >
      <h2 className="u-visually-hidden" id={headingId}>
        {C.label}
      </h2>
      <ul className="date-range__choices" aria-label={C.presets}>
        {RANGE_PRESET_IDS.map((presetId: RangePresetId) => {
          const preset = presetRange(presetId, cohort);
          const has = started && rangeHasFigures(preset, cohort);
          return (
            <li key={presetId}>
              <button
                type="button"
                className="date-range__choice"
                aria-pressed={started && range.preset === presetId && !start}
                disabled={!has}
                title={has ? rangeLabel(preset) : C.noFigures}
                onClick={() => onPick(preset)}
              >
                {RANGE_PRESETS[presetId].label}
                {has ? null : <span className="u-visually-hidden">, {C.noFigures}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="date-range__calendar">
        <div className="date-range__months">
          {months.map((month, i) => (
            <div className="date-range__month" key={monthKey(month)}>
              <div className="date-range__month-head">
                {i === 0 ? (
                  <button type="button" className="date-range__nav" aria-label={C.prevMonth} disabled={!canBack} onClick={() => setView(shiftMonth(view, -1))}>
                    <Icon name="chevron-left" size={16} />
                  </button>
                ) : null}
                <span className="date-range__month-name" aria-hidden="true">
                  {monthLabel(month)}
                </span>
                {i === 1 ? (
                  <button type="button" className="date-range__nav" aria-label={C.nextMonth} disabled={!canForward} onClick={() => setView(shiftMonth(view, 1))}>
                    <Icon name="chevron" size={16} />
                  </button>
                ) : null}
              </div>
              <table className="date-range__grid">
                <caption className="u-visually-hidden">{monthLabel(month)}</caption>
                <thead>
                  <tr>
                    {WEEKDAYS_SHORT.map((day, d) => (
                      <th key={day} scope="col" abbr={WEEKDAYS_LONG[d]}>
                        {day.slice(0, 2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows(monthGrid(month)).map((week) => (
                    <tr key={week[0]}>
                      {week.map((day) => {
                        // The months either side, as in any calendar: greyed out,
                        // never chosen here, and skipped by the keys.
                        if (monthKey(monthOf(day)) !== monthKey(month)) {
                          return (
                            <td key={day}>
                              <button type="button" className="date-range__day is-outside" tabIndex={-1} aria-label={`${longDay(day)} ${day.slice(0, 4)}`} aria-disabled="true">
                                {Number(day.slice(8, 10))}
                              </button>
                            </td>
                          );
                        }
                        const off = !started || day < min || day > max;
                        const inRange = day >= shown.from && day <= shown.to;
                        const ends = [day === shown.from ? "is-start" : null, day === shown.to ? "is-end" : null];
                        return (
                          <td key={day} className={inRange ? "is-in-range" : undefined}>
                            <button
                              type="button"
                              data-day={day}
                              className={["date-range__day", inRange ? "is-in-range" : null, ...ends, day === max ? "is-today" : null].filter(Boolean).join(" ")}
                              tabIndex={day === focusDay ? 0 : -1}
                              aria-label={`${longDay(day)} ${day.slice(0, 4)}${day === max ? `, ${C.today}` : ""}`}
                              aria-pressed={inRange}
                              aria-disabled={off || undefined}
                              aria-current={day === max ? "date" : undefined}
                              onClick={() => pressDay(day)}
                              onKeyDown={(event) => onDayKey(event, day)}
                              onPointerEnter={() => start && !off && setHover(day)}
                              onFocus={() => {
                                setFocusDay(day);
                                if (start && !off) setHover(day);
                              }}
                            >
                              {Number(day.slice(8, 10))}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <p className="date-range__status" aria-live="polite">
          {status}
        </p>
        <p className="date-range__note">
          {started ? `${C.bounds(min)} ` : null}
          {C.privacy}
        </p>
      </div>
    </dialog>
  );
}

/** A month's days as weeks of seven. */
function rows(days: string[]): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
  return out;
}

export default DateRangePicker;
