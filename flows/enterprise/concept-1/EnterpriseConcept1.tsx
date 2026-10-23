"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { CohortFigure } from "@/components/enterprise/CohortFigure";
import { CohortForm } from "@/components/enterprise/CohortForm";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { Meter } from "@/components/enterprise/Meter";
import { WeeklyTrend } from "@/components/enterprise/WeeklyTrend";
import { ReadinessBars } from "@/components/enterprise/ReadinessBars";
import { DateRangePicker } from "@/components/enterprise/DateRangePicker";
import { DropdownMenu } from "@/components/form/DropdownMenu";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C1_COPY,
  DATA_POINTS,
  DEFAULT_RANGE,
  LATE_COPY,
  READINESS_COPY,
  QUESTION_POINTS,
  SEEN_COPY,
  answerFor,
  comparesWeeks,
  directionFor,
  figureFor,
  isAboveMinimum,
  periodWords,
  readinessFor,
  programDay,
  resolveRange,
  seenFor,
  stillToJoin,
  storyFor,
  weeksIn,
  TREND_COPY,
  trendFor,
  type Cohort,
  type DataPointId,
  type DateRange,
  type QuestionId,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { CohortConcierge } from "./CohortConcierge";
import { useCohort, type CohortControls } from "../useCohort";

const C = C1_COPY;

/** One band (Kate, 2026-10-20, option A): the name, a line of what
 *  matters about the program and the dates the figures cover on the left,
 *  the dates and the export on the right. */
function CohortHeader({
  cohort,
  window,
  onWindow,
  headingRef,
}: {
  cohort: Cohort;
  window: DateRange;
  onWindow: (next: DateRange) => void;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const day = programDay(cohort);
  const started = day > 0 && !cohort.fresh;
  const meta = started
    ? [C.meta.started(cohort.startsOn), weeksIn(day), C.meta.people(cohort.joined)]
    : [C.meta.starts(cohort.startsOn), C.meta.people(cohort.joined)];

  return (
    <header className="ent-header">
      <div className="ent-header__row">
        <div className="ent-header__title">
          <h1 className="ent-header__name" ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
            {cohort.name}
          </h1>
          <p className="ent-header__meta">
            {meta.map((part, i) => (
              <span key={part}>
                {i > 0 ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="u-visually-hidden">, </span>
                  </>
                ) : null}
                {part}
              </span>
            ))}
          </p>
          <p className="ent-header__meta">{C.covers(periodWords(window).covers, cohort.asOf)}</p>
        </div>
        <div className="ent-header__tools">
          <DateRangePicker cohort={cohort} value={window} onChange={onWindow} align="end" />
          <DropdownMenu
            className="ent-export"
            label={C.exportMenu}
            icon="download"
            align="end"
            entries={[
              { type: "item", id: "pdf", label: C.exportPdf, onSelect: () => globalThis.print() },
              { type: "item", id: "csv", label: C.exportCsv, onSelect: () => downloadCsv(cohort, window, { signals: true }) },
            ]}
          />
        </div>
      </div>
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

/** One question as a card: its heading and one-sentence answer, its figures
 *  each with its definition under it, and anything that belongs with it.
 *  No info icons (Kate, 2026-10-22): the definitions say what the popover
 *  did, the footer gives the sources and the rule, and a figure that counts
 *  since launch whatever the dates says so beside its number. */
function QuestionCard({
  cohort,
  question,
  window,
  children,
}: {
  cohort: Cohort;
  question: QuestionId;
  window: DateRange;
  children?: React.ReactNode;
}) {
  const answer = answerFor(cohort, question, window);
  const points = QUESTION_POINTS[question];
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
          // No Filling in tag here (Kate, 2026-10-20): a young window shows
          // as it is. Followed through's definition says recent actions
          // still have time.
          const shown: typeof figure = figure.state === "filling" ? { ...figure, state: "shown", note: undefined } : figure;
          const sinceLaunch = DATA_POINTS[id].sinceLaunch && shown.detail;
          return (
            <CohortFigure
              key={id}
              figure={sinceLaunch ? { ...shown, detail: C.sinceLaunch(shown.detail!) } : shown}
              size={i === 0 ? "lg" : "md"}
              direction={directionFor(cohort, id, window)}
              meter={METERS[id]}
              // In the hero, the figures after the first are tiles.
              className={question === "following" && i > 0 ? "ent-tile" : undefined}
              brief={C.briefs[id] ?? DATA_POINTS[id].brief}
            />
          );
        })}
      </div>
      {children}
    </section>
  );
}

/**
 * Are they being seen? (Kate, 2026-10-20, option C): signals, what
 * participants put out in the world, as a third card in the row. A ring for
 * any channel, then the channels with at least the minimum of people behind
 * them; the rest are named together and held back, since a public signal
 * could otherwise be searched for and point to one person.
 */
function SeenCard({ cohort, window }: { cohort: Cohort; window: DateRange }) {
  const seen = seenFor(cohort, window);
  return (
    <section className="ent-card ent-card--seen" aria-labelledby="q-seen">
      <div className="ent-card__lead">
        <h2 className="ent-card__heading" id="q-seen">
          {SEEN_COPY.heading}
        </h2>
        {seen ? <p className="ent-card__answer">{SEEN_COPY.answer(window)}</p> : null}
      </div>
      {seen ? (
        <>
          <p className="ent-seen__any">
            <Meter kind="ring" fraction={seen.any.fraction}>
              <span className="cohort-figure__value">{seen.any.value}</span>
            </Meter>
            <span className="ent-seen__any-label">
              {SEEN_COPY.ring}
              <span className="u-visually-hidden">: {seen.any.detail}</span>
            </span>
          </p>
          <p className="cohort-figure__brief">{SEEN_COPY.brief}</p>
          <ul className="ent-seen__channels" aria-label={SEEN_COPY.listLabel}>
            {seen.shown.map((channel) => (
              <li key={channel.label}>
                <span>{channel.label}</span>
                <span className="ent-seen__count">
                  <strong>{channel.value}</strong> {channel.of}
                </span>
              </li>
            ))}
            {seen.hidden.length > 0 ? (
              <li className="ent-seen__hidden">
                <span>{SEEN_COPY.hidden(seen.hidden)}</span>
                <span className="ent-seen__count">
                  <Icon name="lock" size={14} />
                  {SEEN_COPY.fewer}
                  <span className="u-visually-hidden">: {SEEN_COPY.fewerLabel}</span>
                </span>
              </li>
            ) : null}
          </ul>
          <p className="ent-seen__note">{SEEN_COPY.note}</p>
        </>
      ) : (
        <p className="ent-seen__locked">
          <Icon name="lock" size={16} />
          {SEEN_COPY.hiddenAll}
        </p>
      )}
    </section>
  );
}

/**
 * Ready for what's next (Concept 1b, Kate, 2026-10-23): the readiness pulse,
 * a card of its own under the opening, before the measures. The cohort's
 * average answer at the start and now, and the spread of both. Hidden until
 * the minimum have answered twice; not tied to the dates chosen.
 */
function ReadinessCard({ cohort }: { cohort: Cohort }) {
  const ready = readinessFor(cohort);
  if (!ready) return null;
  const R = READINESS_COPY;
  return (
    <section className="ent-card ent-card--readiness" aria-labelledby="q-readiness">
      <div className="ent-card__lead">
        <h2 className="ent-card__heading" id="q-readiness">
          {R.heading}
        </h2>
        {ready.state === "shown" ? <p className="ent-card__answer">{R.answer(ready.movedUp!, ready.answered)}</p> : null}
      </div>
      {ready.state === "shown" ? (
        <div className="ent-readiness">
          <div className="cohort-figure cohort-figure--lg">
            <p className="cohort-figure__label">{R.label}</p>
            <p className="cohort-figure__value">
              {ready.start!.average}
              <span className="ent-readiness__arrow" aria-hidden="true">
                →
              </span>
              <span className="u-visually-hidden"> to </span>
              {ready.now!.average}
              <span className="cohort-figure__detail">{R.detail(ready.answered, cohort.activated)}</span>
            </p>
            <p className="cohort-figure__brief">{R.brief}</p>
          </div>
          <ReadinessBars start={ready.start!.spread} now={ready.now!.spread} />
        </div>
      ) : (
        <p className="ent-seen__locked">
          <Icon name="lock" size={16} />
          {R.hidden}
        </p>
      )}
    </section>
  );
}

/** The dashboard: the story in order, the four measures as cards, and the
 *  page closing on who is still to join, with the cohort's code. */
function Dashboard({ controls, headingRef, readiness }: { controls: CohortControls; headingRef?: React.Ref<HTMLHeadingElement>; readiness?: boolean }) {
  const cohort = controls.cohort!;
  // The dates chosen (Kate, 2026-10-22): this week to start with.
  const [choice, setChoice] = useState<DateRange>(DEFAULT_RANGE);
  const window = resolveRange(choice, cohort);
  const above = isAboveMinimum(cohort, window);
  const story = storyFor(cohort, window, readiness);

  return (
    <div className="ent-page">
      <CohortHeader cohort={cohort} window={window} onWindow={setChoice} headingRef={headingRef} />

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
      ) : null}

      {/* The story in the order it happened, before the evidence (Kate,
          2026-10-22, Bookends). */}
      {story ? (
        <p className="ent-story">
          {story.map((sentence, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              {sentence.map((part, j) => (typeof part === "string" ? <Fragment key={j}>{part}</Fragment> : <strong key={j}>{part.strong}</strong>))}
            </Fragment>
          ))}
        </p>
      ) : null}

      {readiness ? <ReadinessCard cohort={cohort} /> : null}

      <div className="ent-board">
        {CARD_ORDER.map((question) => (
          <Fragment key={question}>
            {/* Being seen sits between using and joining (Kate, 2026-10-20). */}
            {question === "joined" ? <SeenCard cohort={cohort} window={window} /> : null}
            <QuestionCard cohort={cohort} question={question} window={window}>
              {/* Whether they are still using it is a trend, not a snapshot:
                  always since launch, whichever dates are chosen. */}
              {question === "using" ? (
                <div className="ent-card__trend">
                  <WeeklyTrend trend={trendFor(cohort)} highlight={window} />
                  <p className="cohort-figure__brief">{TREND_COPY.brief}</p>
                </div>
              ) : null}
            </QuestionCard>
          </Fragment>
        ))}
      </div>

      {/* The page ends on who is still to come, with the code to bring them
          in (Kate, 2026-10-22): the end of the story, not part of a card. */}
      <section className="ent-close" aria-label={C.closeLabel}>
        <p className="ent-close__line">{stillToJoin(cohort, window)}</p>
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
      </section>

      <footer className="ent-page__foot">
        <p className="ent-page__privacy">
          <Icon name="shield" size={16} />
          {C.footer(comparesWeeks(cohort, window))}
        </p>
      </footer>

      <CohortConcierge cohort={cohort} window={window} />
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

function Concept1Page({ controls, readiness }: { controls: CohortControls; readiness?: boolean }) {
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
      {settingUp ? <Setup controls={controls} onDone={() => setLeftSetup(true)} /> : <Dashboard controls={controls} headingRef={headingRef} readiness={readiness} />}
    </div>
  );
}

function Concept1ForCohort({ id, readiness }: { id: ReturnType<typeof useCohortId>; readiness?: boolean }) {
  const controls = useCohort(id);
  return <Concept1Page controls={controls} readiness={readiness} />;
}

/**
 * Enterprise Dashboard, Concept 1 — The four measures.
 *
 * One page that tells the cohort's story (Kate, 2026-10-22, Bookends): an
 * opening in the order it happened, then four cards, each a measure headed
 * by a statement, opened by one plain sentence and evidenced by its figures,
 * the first set large, each with its definition under it. It ends on who is
 * still to join, with the code. Putting it into
 * practice leads, as the hero, because it is what a sponsor defends to their
 * leadership (Kate, 2026-10-20); Staying with it, Showing up in the world and
 * Getting started sit side by side under it, with the weekly trend in the
 * first and the cohort's code in the last.
 * A sponsor with no cohort yet sees only the setup.
 *
 * `readiness` turns on Concept 1b's readiness pulse (Kate, 2026-10-23), kept
 * apart so Concept 1 is untouched until it is chosen.
 */
export function EnterpriseConcept1({ readiness = false }: { readiness?: boolean } = {}) {
  const id = useCohortId();
  return <Concept1ForCohort key={id} id={id} readiness={readiness} />;
}

export default EnterpriseConcept1;
