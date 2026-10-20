"use client";

import { useEffect, useRef, useState } from "react";
import { CohortForm } from "@/components/enterprise/CohortForm";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { WeeklyTrend } from "@/components/enterprise/WeeklyTrend";
import { WindowSelector } from "@/components/enterprise/WindowSelector";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C2_COPY,
  CSV_COPY,
  DATA_POINTS,
  DIRECTION_COPY,
  LATE_COPY,
  REPORT_SECTIONS,
  TREND_COPY,
  WINDOWS,
  comparesWeeks,
  isAboveMinimum,
  programDay,
  reportLine,
  trendFor,
  type Cohort,
  type CohortId,
  type WindowId,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { useCohort, type CohortControls } from "../useCohort";

const C = C2_COPY;

/** The cohort's code, in the margin beside the header. Screen only: the
 *  exported report carries the figures, not the means of joining. */
function CodeBox({ cohort, controls }: { cohort: Cohort; controls: CohortControls }) {
  return (
    <div className="report__margin report__admin">
      <InviteCode
        layout="compact"
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

/** The report's head: who it is from, the cohort, its dates and window. */
function ReportHead({ cohort, window, headingRef }: { cohort: Cohort; window: WindowId; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const day = programDay(cohort);
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
        {C.dates(cohort.startsOn, cohort.endsOn)}, {day > 0 && !cohort.fresh ? C.day(day) : C.notStarted}.{" "}
        {window === "launch" ? C.windowLineSinceLaunch : C.windowLine(WINDOWS[window].long)}{" "}
        {cohort.fresh ? C.firstUpdate(cohort.asOf) : C.asOf(cohort.asOf)}
      </p>
    </header>
  );
}

/** The figures, a sentence each, with what each counts in the margin. */
function ReportBody({ cohort, window }: { cohort: Cohort; window: WindowId }) {
  const above = isAboveMinimum(cohort, window);
  const day = programDay(cohort);
  const days = WINDOWS[window].days;
  const filling = above && days !== undefined && day < days;

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
      ) : filling ? (
        <p className="report__row report__notice">
          <Icon name="clock" size={16} />
          {C.filling(day)}
        </p>
      ) : null}

      {REPORT_SECTIONS.map((section) => (
        <section className="report__section" key={section.id} aria-labelledby={`report-${section.id}`}>
          <h2 className="report__section-heading" id={`report-${section.id}`}>
            {section.heading}
          </h2>
          {section.points.map((id) => {
            const { figure, rest } = reportLine(cohort, id, window);
            const point = DATA_POINTS[id];
            return (
              <div className="report__row" key={id}>
                {figure.state === "suppressed" ? (
                  <p className="report__line report__line--hidden">
                    <Icon name="lock" size={16} />
                    <span>
                      <strong>{figure.label}:</strong> {C.hiddenLine}
                    </span>
                  </p>
                ) : (
                  <p className={`report__line report__line--${figure.state}`}>
                    <span className="report__figure">{figure.value}</span> {rest}
                  </p>
                )}
                <div className="report__margin report__note">
                  <p>
                    <strong className="report__note-label">{figure.label}.</strong> {point.definition}{" "}
                    <em className="report__note-source">{point.source}</em>
                  </p>
                  {figure.state === "filling" ? (
                    <Badge tone="neutral" className="report__note-tag">
                      {C.fillingTag}
                    </Badge>
                  ) : null}
                </div>
              </div>
            );
          })}
          {section.id === "using" ? (
            <div className="report__row">
              <WeeklyTrend className="report__trend" trend={trendFor(cohort)} />
              <div className="report__margin report__note">
                <p>
                  <strong className="report__note-label">{TREND_COPY.heading}.</strong> {TREND_COPY.definition}{" "}
                  <em className="report__note-source">{TREND_COPY.source}</em>
                </p>
              </div>
            </div>
          ) : null}
        </section>
      ))}
    </>
  );
}

function Concept2Page({ controls }: { controls: CohortControls }) {
  const { cohort } = controls;
  const [window, setWindow] = useState<WindowId>("30d");
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
          <WindowSelector value={window} onChange={setWindow} asOf={cohort.asOf} upcoming={cohort.fresh} />
          <div className="ent-exports">
            <Button variant="secondary" size="sm" onClick={() => globalThis.print()} aria-describedby="report-export-hint">
              <Icon name="download" size={16} />
              {C.export}
            </Button>
            <span className="u-visually-hidden" id="report-export-hint">
              {C.exportHint}
            </span>
            <Button variant="secondary" size="sm" onClick={() => downloadCsv(cohort, window)} aria-describedby="report-csv-hint">
              <Icon name="download" size={16} />
              {C.exportCsv}
            </Button>
            <span className="u-visually-hidden" id="report-csv-hint">
              {CSV_COPY.hint}
            </span>
          </div>
        </div>
      ) : null}

      <article className="report" aria-labelledby="report-title">
        {cohort ? (
          <>
            <div className="report__row">
              <ReportHead cohort={cohort} window={window} headingRef={headingRef} />
              <CodeBox cohort={cohort} controls={controls} />
            </div>
            <ReportBody cohort={cohort} window={window} />
            <footer className="report__row report__footer">
              {comparesWeeks(cohort, window) ? (
                <p>
                  <Icon name="trend-up" size={14} />
                  {DIRECTION_COPY.clauseRule}
                </p>
              ) : null}
              <p>
                <Icon name="shield" size={14} />
                {C.footer}
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
 * Northgate: a letterhead, the cohort and its dates, then each figure as a
 * sentence with the number set large, and what it counts written in the
 * margin beside it so a talent lead can repeat it word for word. The window
 * and the exports (PDF and CSV) sit above the page, outside the document. Setting up a
 * cohort fills in the report's header; its code sits in the margin, on
 * screen only.
 */
export function EnterpriseConcept2() {
  const id = useCohortId();
  return <Concept2ForCohort key={id} id={id} />;
}

export default EnterpriseConcept2;
