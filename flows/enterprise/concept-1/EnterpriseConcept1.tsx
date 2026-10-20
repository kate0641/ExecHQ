"use client";

import { useEffect, useRef, useState } from "react";
import { CohortFigure } from "@/components/enterprise/CohortFigure";
import { CohortForm } from "@/components/enterprise/CohortForm";
import { FigureDefinition } from "@/components/enterprise/FigureDefinition";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { WeeklyTrend } from "@/components/enterprise/WeeklyTrend";
import { WindowSelector } from "@/components/enterprise/WindowSelector";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C1_COPY,
  CSV_COPY,
  DIRECTION_COPY,
  LATE_COPY,
  QUESTION_POINTS,
  answerFor,
  comparesWeeks,
  directionFor,
  figureFor,
  isAboveMinimum,
  programDay,
  trendFor,
  type Cohort,
  type DataPointId,
  type QuestionId,
  type WindowId,
  WINDOWS,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { useCohort, type CohortControls } from "../useCohort";

const C = C1_COPY;

/** The cohort's name, dates and age: the top of the dashboard. */
function CohortHeader({ cohort, headingRef, children }: { cohort: Cohort; headingRef?: React.Ref<HTMLHeadingElement>; children?: React.ReactNode }) {
  const day = programDay(cohort);
  return (
    <header className="ent-header">
      <div className="ent-header__title">
        <p className="t-eyebrow">{C.eyebrow}</p>
        <h1 className="ent-header__name" ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
          {cohort.name}
        </h1>
        <p className="ent-header__dates">
          {C.dates(cohort.startsOn, cohort.endsOn)}
          <span aria-hidden="true"> · </span>
          <span className="u-visually-hidden">, </span>
          {day > 0 && !cohort.fresh ? C.age(day) : C.notStarted}
        </p>
      </div>
      {children ? <div className="ent-header__tools">{children}</div> : null}
    </header>
  );
}

/** The order the cards come in: follow-through leads, because it is what a
 *  sponsor has to defend; using and joining sit side by side under it. */
const CARD_ORDER: QuestionId[] = ["following", "using", "joined"];

/** Shares drawn as well as said: a ring for joining against the size
 *  expected, bars for the lead share of follow-through and for setting up. */
const METERS: Partial<Record<DataPointId, "ring" | "bar">> = {
  "follow-through": "bar",
  invites: "ring",
  onboarding: "bar",
};

/** One question as a card: its heading and one-sentence answer, its figures,
 *  an opened definition inside the card, and anything that belongs with it. */
function QuestionCard({
  cohort,
  question,
  window,
  open,
  setOpen,
  children,
}: {
  cohort: Cohort;
  question: QuestionId;
  window: WindowId;
  open: DataPointId | null;
  setOpen: (id: DataPointId | null) => void;
  children?: React.ReactNode;
}) {
  const answer = answerFor(cohort, question, window);
  const points = QUESTION_POINTS[question];
  const openHere = open && points.includes(open) ? open : null;
  return (
    <section className={`ent-card ent-card--${question}`} aria-labelledby={`q-${question}`}>
      <div className="ent-card__lead">
        <h2 className="ent-card__heading" id={`q-${question}`}>
          {C.questions[question]}
        </h2>
        {answer ? <p className="ent-card__answer">{answer}</p> : null}
      </div>
      <div className="ent-card__figures">
        {points.map((id, i) => {
          const figure = figureFor(cohort, id, window);
          return (
            <CohortFigure
              key={id}
              // The page says once why figures are filling in.
              figure={figure.state === "filling" ? { ...figure, note: undefined } : figure}
              size={i === 0 ? "lg" : "md"}
              direction={directionFor(cohort, id, window)}
              meter={METERS[id]}
              // In the hero, the figures after the first are tiles.
              className={question === "following" && i > 0 ? "ent-tile" : undefined}
              explaining={open === id}
              onExplain={() => setOpen(open === id ? null : id)}
            />
          );
        })}
      </div>
      {openHere ? (
        <div className="ent-card__definition">
          <FigureDefinition id={openHere} window={window} onClose={() => setOpen(null)} />
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** The dashboard: one page, the three questions as cards, and the cohort's
 *  code in the joining card, where it belongs. */
function Dashboard({ controls, headingRef }: { controls: CohortControls; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const cohort = controls.cohort!;
  const [window, setWindow] = useState<WindowId>("30d");
  const [open, setOpen] = useState<DataPointId | null>(null);
  const above = isAboveMinimum(cohort, window);
  const day = programDay(cohort);
  const filling = above && window !== "launch" && day < (window === "30d" ? 30 : 90);

  return (
    <div className="ent-page">
      <CohortHeader cohort={cohort} headingRef={headingRef}>
        <WindowSelector value={window} onChange={setWindow} asOf={cohort.asOf} upcoming={cohort.fresh} />
        {/* The toggle does not print: the export says the window in words. */}
        <p className="ent-header__print">{C.printWindow(WINDOWS[window].long, cohort.asOf)}</p>
        <div className="ent-exports">
          <Button variant="secondary" size="sm" onClick={() => globalThis.print()}>
            <Icon name="download" size={16} />
            {C.export}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadCsv(cohort, window)} aria-describedby="ent-csv-hint">
            <Icon name="download" size={16} />
            {C.exportCsv}
          </Button>
          <span className="u-visually-hidden" id="ent-csv-hint">
            {CSV_COPY.hint}
          </span>
        </div>
      </CohortHeader>

      {cohort.lateSince ? (
        <p className="ent-notice">
          <Icon name="warning" size={18} />
          {LATE_COPY.notice(cohort.asOf)}
        </p>
      ) : null}

      {!above ? (
        <div className="ent-notice">
          <Icon name="lock" size={18} />
          <div>
            <h2 className="ent-notice__heading">{C.building.heading}</h2>
            <p>{C.building.body}</p>
          </div>
        </div>
      ) : filling ? (
        <p className="ent-notice ent-notice--quiet">
          <Icon name="clock" size={18} />
          {C.filling(day)}
        </p>
      ) : null}

      <div className="ent-board">
        {CARD_ORDER.map((question) => (
          <QuestionCard key={question} cohort={cohort} question={question} window={window} open={open} setOpen={setOpen}>
            {/* Whether they are still using it is a trend, not a snapshot:
                always since launch, whichever window is chosen. */}
            {question === "using" ? <WeeklyTrend className="ent-card__trend" trend={trendFor(cohort)} /> : null}
            {question === "joined" ? (
              <div className="ent-card__code">
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
            ) : null}
          </QuestionCard>
        ))}
      </div>

      <div className="ent-page__foot">
        {comparesWeeks(cohort, window) ? (
          <p className="ent-page__privacy">
            <Icon name="trend-up" size={16} />
            {DIRECTION_COPY.rule}
          </p>
        ) : null}
        <p className="ent-page__privacy">
          <Icon name="shield" size={16} />
          {C.privacy}
        </p>
      </div>
    </div>
  );
}

/** First visit: set the cohort up, then hand over its code. */
function Setup({ controls, onDone }: { controls: CohortControls; onDone: () => void }) {
  const { cohort } = controls;
  const readyRef = useRef<HTMLHeadingElement>(null);
  // The form leaves the page once the cohort is made: focus goes to what replaced it.
  const ready = Boolean(cohort);
  useEffect(() => {
    if (ready) readyRef.current?.focus();
  }, [ready]);

  if (cohort) {
    return (
      <div className="ent-page ent-page--narrow">
        <div className="ent-setup__lead">
          <h1 className="ent-header__name" ref={readyRef} tabIndex={-1}>
            {C.setup.readyHeading}
          </h1>
          <p>{C.setup.readyLead}</p>
        </div>
        <InviteCode
          code={cohort.code}
          joined={cohort.joined}
          expectedSize={cohort.expectedSize}
          open={cohort.open}
          onRegenerate={controls.regenerate}
          onClose={controls.close}
          justRegenerated={controls.justRegenerated}
        />
        <Button className="ent-setup__next" onClick={onDone}>
          {C.setup.toDashboard}
        </Button>
      </div>
    );
  }
  return (
    <div className="ent-page ent-page--narrow">
      <div className="ent-setup__lead">
        <h1 className="ent-header__name">{C.setup.heading}</h1>
        <p>{C.setup.lead}</p>
      </div>
      <CohortForm onCreate={controls.create} headingHidden />
    </div>
  );
}

function Concept1Page({ controls }: { controls: CohortControls }) {
  const { cohort, justCreated } = controls;
  const [leftSetup, setLeftSetup] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Until a cohort exists, and right after one is made, the page is the
  // setup. Leaving it lands on the dashboard's heading.
  const settingUp = !cohort || (justCreated && !leftSetup);
  useEffect(() => {
    if (leftSetup) headingRef.current?.focus();
  }, [leftSetup]);

  return (
    <div className="ent">
      {settingUp ? <Setup controls={controls} onDone={() => setLeftSetup(true)} /> : <Dashboard controls={controls} headingRef={headingRef} />}
    </div>
  );
}

function Concept1ForCohort({ id }: { id: ReturnType<typeof useCohortId> }) {
  const controls = useCohort(id);
  return <Concept1Page controls={controls} />;
}

/**
 * Enterprise Dashboard, Concept 1 — The three questions.
 *
 * One page of cards answering the sponsor's three questions, each in one
 * sentence with its figures, the first set large. Follow-through leads, as
 * the hero, because it is what a sponsor defends to their leadership (Kate,
 * 2026-10-20); still using it and did they join sit side by side under it,
 * with the weekly trend in the first and the cohort's code in the second.
 * Any figure opens its definition inside its card. A sponsor with no cohort
 * yet sees only the setup.
 */
export function EnterpriseConcept1() {
  const id = useCohortId();
  return <Concept1ForCohort key={id} id={id} />;
}

export default EnterpriseConcept1;
