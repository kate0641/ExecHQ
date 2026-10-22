"use client";

import { useEffect, useRef, useState } from "react";
import { CohortForm } from "@/components/enterprise/CohortForm";
import { FunnelBars } from "@/components/enterprise/FunnelBars";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { Meter } from "@/components/enterprise/Meter";
import { PartBar } from "@/components/enterprise/PartBar";
import { WeeklyTrend } from "@/components/enterprise/WeeklyTrend";
import { DateRangePicker } from "@/components/enterprise/DateRangePicker";
import { DropdownMenu } from "@/components/form/DropdownMenu";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C2_COPY,
  DATA_POINTS,
  DEFAULT_RANGE,
  LATE_COPY,
  REPORT_SECTIONS,
  TREND_COPY,
  comparesWeeks,
  isAboveMinimum,
  isSinceLaunch,
  periodWords,
  programDay,
  reportJoining,
  reportLine,
  reportSummary,
  reportWork,
  resolveRange,
  trendFor,
  type Cohort,
  type CohortId,
  type DataPointId,
  type DateRange,
  type QuestionId,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { ReportAssistant } from "./ReportAssistant";
import { useCohort, type CohortControls } from "../useCohort";

const C = C2_COPY;

/** The cohort's code, in a strip at the foot of the page, outside the sheet:
 *  it is admin, not report, and the export carries the figures, never the
 *  means of joining (Kate, 2026-10-20). */
function CodeStrip({ cohort, controls }: { cohort: Cohort; controls: CohortControls }) {
  return (
    <div className="report-code">
      <InviteCode
        layout="compact"
        hideJoined
        code={cohort.code}
        joined={cohort.joined}
        expectedSize={cohort.expectedSize}
        open={cohort.open}
        onRegenerate={controls.regenerate}
        onClose={controls.close}
        justRegenerated={controls.justRegenerated}
      />
    </div>
  );
}

/** The report's head: who it is from, the cohort, the dates it covers, and
 *  what the cohort did, in two sentences. */
function ReportHead({ cohort, window, headingRef }: { cohort: Cohort; window: DateRange; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const day = programDay(cohort);
  const summary = reportSummary(cohort, window);
  return (
    <header className="report__head">
      <p className="report__letterhead">
        {C.sponsor}
        <span aria-hidden="true"> · </span>
        <span className="u-visually-hidden">, </span>
        {C.letterhead}
      </p>
      <h1 className="report__title" id="report-title" ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
        {cohort.name}
      </h1>
      <p className="report__meta">
        {day > 0 && !cohort.fresh ? `${C.started(cohort.startsOn)}, ${C.weeksIn(day)}.` : `${C.starts(cohort.startsOn)}.`}{" "}
        {isSinceLaunch(cohort, window) ? C.windowLineSinceLaunch : C.windowLine(periodWords(window).covers)}{" "}
        {cohort.fresh ? C.firstUpdate(cohort.asOf) : C.asOf(cohort.asOf)}
      </p>
      {summary ? <p className="report__summary">{summary}</p> : null}
    </header>
  );
}

/** One short sentence of what a figure measures, in the margin beside it. */
function Note({ id }: { id: DataPointId }) {
  const point = DATA_POINTS[id];
  return (
    <p className="report__note">
      <strong className="report__note-label">{point.label}.</strong> {point.brief}
    </p>
  );
}

/** The figures whose margin note says something the sentence doesn't
 *  (Kate, 2026-10-20). The rest would only repeat their line. */
const NOTED: DataPointId[] = ["follow-through", "active", "artifacts"];

/** A figure as a sentence, the number set large, and under it a bar of the
 *  share when it is one (Kate, 2026-10-20). Hidden, it names the rule. */
function Line({ cohort, id, window }: { cohort: Cohort; id: DataPointId; window: DateRange }) {
  const { figure, rest } = reportLine(cohort, id, window);
  return (
    <div className="report__row">
      {figure.state === "suppressed" ? (
        <p className="report__line report__line--hidden">
          <Icon name="lock" size={16} />
          <span>
            <strong>{figure.label}:</strong> {C.hiddenLine}
          </span>
        </p>
      ) : (
        <div className="report__figure-line">
          <p className="report__line">
            <span className="report__figure">{figure.value}</span> {rest}
          </p>
          {figure.fraction !== undefined ? <Meter fraction={figure.fraction} className="report__bar" /> : null}
        </div>
      )}
      {NOTED.includes(id) ? (
        <div className="report__margin">
          <Note id={id} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * The figures, a sentence each, with one short sentence of what each
 * measures in the margin, and three charts where a picture says more than
 * the sentence (Kate, 2026-10-20): a bar under each share, the work made
 * against the work used, and joining as a funnel.
 */
function ReportBody({ cohort, window }: { cohort: Cohort; window: DateRange }) {
  const above = isAboveMinimum(cohort, window);
  const heading = (id: QuestionId) => REPORT_SECTIONS.find((section) => section.id === id)!.heading;
  const work = reportWork(cohort, window);
  const joining = reportJoining(cohort, window);
  const trend = trendFor(cohort);

  return (
    <>
      {cohort.lateSince ? (
        <p className="report__row report__notice">
          <Icon name="warning" size={16} />
          {LATE_COPY.notice(cohort.asOf)}
        </p>
      ) : null}
      {!above ? (
        <p className="report__row report__notice">
          <Icon name="lock" size={16} />
          {C.building}
        </p>
      ) : null}

      <section className="report__section" aria-labelledby="report-following">
        <h2 className="report__section-heading" id="report-following">
          {heading("following")}
        </h2>
        <Line cohort={cohort} id="follow-through" window={window} />
        <Line cohort={cohort} id="plans" window={window} />
        <div className="report__row">
          {work ? (
            <div className="report__figure-line">
              <p className="report__line">
                <span className="report__figure">{work.made}</span> {work.rest}
              </p>
              <PartBar className="report__part" part={work.used} whole={work.whole} partLabel={work.usedLabel} restLabel={work.restLabel} />
            </div>
          ) : (
            <p className="report__line report__line--hidden">
              <Icon name="lock" size={16} />
              <span>
                <strong>{DATA_POINTS.artifacts.label}:</strong> {C.hiddenLine}
              </span>
            </p>
          )}
          <div className="report__margin">
            <Note id="artifacts" />
          </div>
        </div>
      </section>

      <section className="report__section" aria-labelledby="report-using">
        <h2 className="report__section-heading" id="report-using">
          {heading("using")}
        </h2>
        <Line cohort={cohort} id="active" window={window} />
        <Line cohort={cohort} id="briefing" window={window} />
        {/* On paper an empty placeholder reads as something that failed to
            load: while it is too early, one sentence says when it comes. */}
        {trend.state === "early" ? (
          <p className="report__line report__line--quiet">{TREND_COPY.early(trend.weeks.length)}</p>
        ) : trend.state === "shown" ? (
          <div className="report__row">
            <WeeklyTrend className="report__trend" trend={trend} />
            <div className="report__margin">
              <p className="report__note">
                <strong className="report__note-label">{TREND_COPY.heading}.</strong> {TREND_COPY.brief}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="report__section" aria-labelledby="report-joined">
        <h2 className="report__section-heading" id="report-joined">
          {heading("joined")}
        </h2>
        <div className="report__row">
          <div className="report__figure-line">
            <p className="report__line">
              <span className="report__figure">{joining.joined}</span> {joining.rest}
            </p>
            <FunnelBars className="report__funnel" steps={joining.steps} label={C.funnel.label} hiddenLabel={C.funnel.hidden} />
          </div>
        </div>
      </section>
    </>
  );
}

function Concept2Page({ controls }: { controls: CohortControls }) {
  const { cohort } = controls;
  // The dates chosen (Kate, 2026-10-22): this week to start with.
  const [choice, setChoice] = useState<DateRange>(DEFAULT_RANGE);
  const window = cohort ? resolveRange(choice, cohort) : DEFAULT_RANGE;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ready = Boolean(cohort);
  const wasReady = useRef(ready);

  // Making the cohort replaces the form with the header it wrote: focus
  // goes to its name.
  useEffect(() => {
    if (ready && !wasReady.current) headingRef.current?.focus();
    wasReady.current = ready;
  }, [ready]);

  return (
    <div className="ent report-view">
      {cohort ? (
        <div className="report-toolbar">
          {/* The report says its own date: the toolbar doesn't repeat it. */}
          <DateRangePicker cohort={cohort} value={window} onChange={setChoice} align="start" />
          <div className="report-toolbar__end">
            <DropdownMenu
              className="ent-export"
              label={C.exportMenu}
              icon="download"
              align="end"
              entries={[
                { type: "item", id: "pdf", label: C.exportPdf, onSelect: () => globalThis.print() },
                { type: "item", id: "csv", label: C.exportCsv, onSelect: () => downloadCsv(cohort, window) },
              ]}
            />
          </div>
        </div>
      ) : null}
      {/* The assistant is always beside the report (Kate, 2026-10-20): part of
          the page, not something to open or close. */}
      <div className={["report-stage", cohort ? "is-asking" : null].filter(Boolean).join(" ")}>
        <article className="report" aria-labelledby="report-title">
          {cohort ? (
            <>
              <div className="report__row">
                <ReportHead cohort={cohort} window={window} headingRef={headingRef} />
              </div>
              <ReportBody cohort={cohort} window={window} />
              <footer className="report__row report__footer">
                <p>
                  <Icon name="shield" size={14} />
                  {C.footer(comparesWeeks(cohort, window))}
                </p>
              </footer>
            </>
          ) : (
            <>
              <div className="report__row">
                <header className="report__head">
                  <p className="report__letterhead">
                    {C.sponsor}
                    <span aria-hidden="true"> · </span>
                    <span className="u-visually-hidden">, </span>
                    {C.letterhead}
                  </p>
                  <h1 className="report__title report__title--blank" id="report-title">
                    {C.setup.title}
                  </h1>
                  <p className="report__meta">{C.setup.lead}</p>
                  <CohortForm onCreate={controls.create} headingHidden />
                </header>
              </div>
              <p className="report__row report__empty">{C.setup.empty}</p>
            </>
          )}
        </article>
        {cohort ? <ReportAssistant id="report-ask" cohort={cohort} window={window} /> : null}
      </div>
      {/* The code is admin, so it waits at the foot, outside the report. */}
      {cohort ? <CodeStrip cohort={cohort} controls={controls} /> : null}
    </div>
  );
}

function Concept2ForCohort({ id }: { id: CohortId }) {
  const controls = useCohort(id);
  return <Concept2Page controls={controls} />;
}

/**
 * Enterprise Dashboard, Concept 2 — The report.
 *
 * The screen is the one-page report the sponsor exports and shares inside
 * Northgate: a letterhead, the cohort and its dates, two sentences of what
 * the cohort did, then each figure as a sentence with the number set large,
 * Follow-through first, and one short sentence of what it measures in the
 * margin beside it so a talent lead can repeat it. Bars under the shares,
 * work made against used, and joining as a funnel draw what a sentence
 * can't. The dates, the Export
 * menu and the cohort's code sit above the page, outside the document.
 * Setting up a cohort fills in the report's header.
 */
export function EnterpriseConcept2() {
  const id = useCohortId();
  return <Concept2ForCohort key={id} id={id} />;
}

export default EnterpriseConcept2;
