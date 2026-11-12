"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import {
  C1_COPY,
  DATA_POINTS,
  DEFAULT_RANGE,
  LATE_COPY,
  followSplit,
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
  storyFigures,
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
import { useCohort, useShownCohortId, type CohortControls } from "../useCohort";

const C = C1_COPY;

/** One band: the name, a line of what
 *  matters about the program and the dates the figures cover, with the
 *  opening beside them. The dates and the export sit on the page. */
function CohortHeader({
  cohort,
  window,
  headingRef,
}: {
  cohort: Cohort;
  window: DateRange;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const day = programDay(cohort);
  const started = day > 0 && !cohort.fresh;
  // How many people first, then when it started.
  const meta = started
    ? [C.meta.people(cohort.joined), C.meta.started(cohort.startsOn), weeksIn(day)]
    : [C.meta.people(cohort.joined), C.meta.starts(cohort.startsOn)];

  const bandRef = useRef<HTMLElement>(null);
  useLongName(bandRef, cohort.name);

  /* A navy band across the page: when the figures
     are from as an eyebrow, the cohort's name large in yellow, and its line. */
  return (
    <header className="ent-header ent-band" ref={bandRef}>
      <div className="ent-band__inner">
        <div className="ent-header__title">
          <p className="t-eyebrow ent-header__asof">{C.asOf(cohort.asOf)}</p>
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
          <p className="ent-header__meta ent-header__covers">{C.coversOnly(periodWords(window).covers)}</p>
        </div>
      </div>
    </header>
  );
}

/**
 * The name is set at the display size, 48; a name too long for one line at
 * 48 steps down to the title size, 36. It is always
 * measured at 48, so it never flips back and forth, and again whenever the
 * band's width changes.
 */
function useLongName(bandRef: React.RefObject<HTMLElement | null>, name: string) {
  useLayoutEffect(() => {
    const band = bandRef.current;
    const heading = band?.querySelector<HTMLElement>(".ent-header__name");
    if (!band || !heading) return;
    let width = -1;
    const check = () => {
      if (band.clientWidth === width) return;
      width = band.clientWidth;
      delete heading.dataset.long;
      const line = parseFloat(getComputedStyle(heading).lineHeight);
      if (heading.getBoundingClientRect().height > line * 1.5) heading.dataset.long = "true";
    };
    check();
    const watch = new ResizeObserver(check);
    watch.observe(band);
    return () => watch.disconnect();
  }, [bandRef, name]);
}

/** The counts in a stat's sentence stand out in semibold ink, so the figures it doesn't lead with are seen too. Spans of
 *  time ("30 days", "12 weeks") aren't counts and stay as the sentence is. */
function statWords(text: string) {
  return text.split(/(\d[\d,]*(?! days| weeks)(?=\D|$))/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="ent-stats__count">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * The opening as four stats under the header: each sentence led by a short bar of its number against what
 * it's out of, and the number itself, the sentence kept whole as its
 * caption. "Active" has no "of", so its bar is drawn against everyone who
 * joined. The bar and number repeat the sentence, so screen readers hear
 * only the sentence.
 */
function OpeningStats({ cohort, window }: { cohort: Cohort; window: DateRange }) {
  const story = storyFor(cohort, window, true);
  const figures = storyFigures(cohort, window, true);
  if (!story || !figures) return null;
  return (
    <ul className="ent-stats">
      {story.map((sentence, i) => (
        <li key={i} className="ent-stats__item">
          <span className="ent-stats__bar" aria-hidden="true">
            <i style={{ inlineSize: `${Math.min(100, (figures[i].value / Math.max(1, figures[i].of ?? cohort.joined)) * 100)}%` }} />
          </span>
          <p className="ent-stats__figure" aria-hidden="true">
            <span className="ent-stats__value">{figures[i].value.toLocaleString("en-US")}</span>
            {figures[i].of !== undefined ? <span className="ent-stats__of">of {figures[i].of!.toLocaleString("en-US")}</span> : null}
          </p>
          <p className="ent-stats__words">{statWords(sentence.map((part) => (typeof part === "string" ? part : part.strong)).join(""))}</p>
        </li>
      ))}
    </ul>
  );
}

/** The dates and the export: on the page, first,
 *  over the stats and cards they change rather than in the header, at its
 *  right edge (2026-11-03). A late update is said on their left. */
function CohortTools({ cohort, window, onWindow }: { cohort: Cohort; window: DateRange; onWindow: (next: DateRange) => void }) {
  return (
    <div className="ent-header__tools ent-tools">
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
  );
}

/** The order the cards come in: follow-through leads, because it is what a
 *  sponsor has to defend; using and joining sit side by side under it. */
const CARD_ORDER: QuestionId[] = ["following", "using", "joined"];

/** Shares drawn as well as said: a ring for joining against the size
 *  expected, bars for the lead share of follow-through and for setting up. */
const METERS: Partial<Record<DataPointId, "ring" | "bar">> = {
  // A ring, not a bar, so it doesn't read as time passing: done, and the rest still to do.
  "follow-through": "ring",
  invites: "ring",
  // A ring too, so Getting started's two figures read alike.
  onboarding: "ring",
};

/** One question as a card: its heading and one-sentence answer, its figures
 *  each with its definition under it, and anything that belongs with it.
 *  No info icons: the definitions say what the popover
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
  const hero = question === "following";
  const split = hero ? followSplit(cohort, window) : undefined;
  const figures = points.map((id, i) => {
    const figure = figureFor(cohort, id, window);
    // No Filling in tag here: a young window shows as it
    // is. Followed through's definition says recent actions still have time.
    const shown: typeof figure = figure.state === "filling" ? { ...figure, state: "shown", note: undefined } : figure;
    const row = (hero && i > 0) || question === "using";
    // A row's definition says "since the program launched" itself, so its
    // detail stays short.
    const sinceLaunch = DATA_POINTS[id].sinceLaunch && shown.detail && !row && question !== "joined";
    return (
      <CohortFigure
        key={id}
        figure={sinceLaunch ? { ...shown, detail: C.sinceLaunch(shown.detail!) } : shown}
        size={i === 0 ? "lg" : "md"}
        direction={directionFor(cohort, id, window)}
        meter={METERS[id]}
        // In the hero, the figures after the first are rows: the number on
        // the left, its words to the right.
        // Staying with it's two figures are rows too.
        className={row ? "ent-tile" : undefined}
        layout={row ? "row" : "stack"}
        brief={C.briefs[id] ?? DATA_POINTS[id].brief}
      >
        {hero && i === 0 && split && shown.state !== "suppressed" ? (
          <ul className="ent-follow-key" aria-hidden="true">
            <li className="ent-follow-key__done">
              <b>{C1_COPY.followKey.count(split.done)}</b> {C1_COPY.followKey.done}
            </li>
            <li className="ent-follow-key__open">
              <b>{C1_COPY.followKey.count(split.open)}</b> {C1_COPY.followKey.open(split.allOpen)}
            </li>
          </ul>
        ) : null}
      </CohortFigure>
    );
  });
  const lead = (
    <div className="ent-card__lead">
      <h2 className="ent-card__heading" id={`q-${question}`}>
        {C.questions[question]}
      </h2>
      {/* Getting started's line repeated its figures; the chain says it. */}
      {answer && question !== "joined" ? <p className="ent-card__answer">{answer}</p> : null}
    </div>
  );
  // Getting started as the joining chain, once Set up can be shown
  //; below the minimum its rings stay, Set up locked.
  const chain = question === "joined" && figureFor(cohort, "onboarding", window).state !== "suppressed";
  return (
    <section className={`ent-card ent-card--${question}`} aria-labelledby={`q-${question}`}>
      {hero ? (
        // The hero: the heading, its answer and
        // follow-through's ring on the left; the other three stacked on the
        // right.
        <div className="ent-following">
          <div className="ent-following__main">
            {lead}
            {figures[0]}
          </div>
          <div className="ent-following__more">{figures.slice(1)}</div>
        </div>
      ) : (
        <>
          {lead}
          {chain ? <JoiningChain cohort={cohort} /> : <div className="ent-card__figures">{figures}</div>}
        </>
      )}
      {children}
    </section>
  );
}

/**
 * Getting started as the joining chain: who was
 * expected, who joined, who finished setting up, side by side, then one bar
 * split into the three groups, all parts of the same expected number, with
 * its key, and the two definitions at the foot. Since launch, whatever the
 * dates.
 */
function JoiningChain({ cohort }: { cohort: Cohort }) {
  const { expectedSize: expected, joined, activated: setUp } = cohort;
  const pct = (part: number, whole: number) => (whole === 0 ? "0%" : `${Math.round((part / whole) * 100)}%`);
  const n = (value: number) => value.toLocaleString("en-US");
  const K = C1_COPY.chain;
  return (
    <div className="ent-chain">
      <ol className="ent-chain__steps">
        <li>
          <span className="ent-chain__value">{n(expected)}</span>
          <span className="ent-chain__name">{K.expected}</span>
          <span className="ent-chain__of">{K.sinceLaunch}</span>
        </li>
        <li>
          <span className="ent-chain__value">{n(joined)}</span>
          <span className="ent-chain__name">{K.joined}</span>
          <span className="ent-chain__of">{K.ofExpected(pct(joined, expected))}</span>
        </li>
        <li>
          <span className="ent-chain__value">{n(setUp)}</span>
          <span className="ent-chain__name">{K.setUp}</span>
          <span className="ent-chain__of">{K.ofJoined(pct(setUp, joined))}</span>
        </li>
      </ol>
      <div className="ent-chain__bar" aria-hidden="true">
        <i className="ent-chain__part ent-chain__part--set-up" style={{ flex: setUp }} />
        <i className="ent-chain__part ent-chain__part--joined" style={{ flex: Math.max(0, joined - setUp) }} />
        <i className="ent-chain__part ent-chain__part--not-yet" style={{ flex: Math.max(0, expected - joined) }} />
      </div>
      <ul className="ent-chain__key" aria-hidden="true">
        <li className="ent-chain__key--set-up">{K.keySetUp(setUp)}</li>
        <li className="ent-chain__key--joined">{K.keyJoined(Math.max(0, joined - setUp))}</li>
        <li className="ent-chain__key--not-yet">{K.keyNotYet(Math.max(0, expected - joined))}</li>
      </ul>
      <div className="ent-chain__defs">
        <p>
          <b>{DATA_POINTS.invites.label}</b> · {K.joinedDef}
        </p>
        <p>
          <b>{DATA_POINTS.onboarding.label}</b> · {K.setUpDef}
        </p>
      </div>
    </div>
  );
}

/**
 * Are they being seen?: signals, what
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
          {/* Laid out as the page's other rings: the
              ring, then its words beside it, the count now shown. */}
          <div className="cohort-figure cohort-figure--md cohort-figure--ring ent-seen__any">
            <p className="cohort-figure__label">{SEEN_COPY.ring}</p>
            <p className="cohort-figure__ringed">
              <Meter kind="ring" fraction={seen.any.fraction}>
                <span className="cohort-figure__value">{seen.any.value}</span>
              </Meter>
              <span className="cohort-figure__detail">{seen.any.detail}</span>
            </p>
            <p className="cohort-figure__brief">{SEEN_COPY.brief}</p>
          </div>
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
                  <Icon name="lock" size={16} />
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
 * Ready for what's next: the readiness pulse, a card of
 * its own under the opening, before the measures. The cohort's
 * average answer at the start and now, and the spread of both. Hidden until
 * the minimum have answered twice; not tied to the dates chosen.
 */
function ReadinessCard({ cohort }: { cohort: Cohort }) {
  const ready = readinessFor(cohort);
  if (!ready) return null;
  const R = READINESS_COPY;
  return (
    <section className="ent-card ent-card--readiness" aria-labelledby="q-readiness">
      {/* The card's anatomy: the heading with who
          answered across from it, the answers start against now, then the
          definition at its foot. The opening already says how many feel
          more ready, so the card doesn't say it again, and the average
          gives way to the answers themselves. */}
      <div className="ent-readiness__top">
        <h2 className="ent-card__heading" id="q-readiness">
          {R.heading}
        </h2>
        {ready.state === "shown" ? <p className="ent-readiness__answered">{R.answered(ready.answered, cohort.activated)}</p> : null}
      </div>
      {ready.state === "shown" ? (
        <>
          <ReadinessBars start={ready.start!.spread} now={ready.now!.spread} />
          <p className="ent-readiness__brief">{R.brief}</p>
        </>
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
function Dashboard({ controls, headingRef }: { controls: CohortControls; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const cohort = controls.cohort!;
  // The dates chosen: this week to start with.
  const [choice, setChoice] = useState<DateRange>(DEFAULT_RANGE);
  const window = resolveRange(choice, cohort);
  const above = isAboveMinimum(cohort, window);

  return (
    <>
      <CohortHeader cohort={cohort} window={window} headingRef={headingRef} />

      {/* What changes how the whole page reads, in a light blue band right under the header: the update
          being late, then the cohort still filling. Either, both or neither. */}
      {cohort.lateSince || !above ? (
        <div className="ent-notices">
          <div className="ent-notices__inner">
            {cohort.lateSince ? (
              <p className="ent-notice">
                <Icon name="warning" size={16} className="ent-notice__icon" />
                <span>
                  <b>{LATE_COPY.lead}</b> {LATE_COPY.rest(cohort.asOf)}
                </span>
              </p>
            ) : null}
            {!above ? (
              <p className="ent-notice">
                <Icon name="lock" size={16} className="ent-notice__icon" />
                <span>
                  <b>{C.building.heading}.</b> {C.building.body}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Follow-through's ring fades, as the page's other charts do
; its stroke points at this. */}
      <svg className="u-visually-hidden" aria-hidden="true" focusable="false">
        <defs>
          {/* The ring is drawn turned a quarter, so its start is this box's
              right edge: dark there, lighter as the arc goes round. */}
          <linearGradient id="ent-follow-done" x1={1} y1={0.4} x2={0.2} y2={1}>
            <stop offset={0} className="ent-follow-done__start" />
            <stop offset={1} className="ent-follow-done__end" />
          </linearGradient>
          <linearGradient id="ent-people-ring" x1={1} y1={0.4} x2={0.2} y2={1}>
            <stop offset={0} className="ent-people-ring__start" />
            <stop offset={1} className="ent-people-ring__end" />
          </linearGradient>
        </defs>
      </svg>

      <div className="ent-page">
        {/* The dates and Export first, over everything they change. */}
        <CohortTools cohort={cohort} window={window} onWindow={setChoice} />

        {/* The story in the order it happened, before the evidence, as four stats. */}
        <OpeningStats cohort={cohort} window={window} />

        <ReadinessCard cohort={cohort} />

        <div className="ent-board">
          {CARD_ORDER.map((question) => (
            <Fragment key={question}>
              {/* Being seen sits between using and joining. */}
              {question === "joined" ? <SeenCard cohort={cohort} window={window} /> : null}
              <QuestionCard cohort={cohort} question={question} window={window}>
                {/* Whether they are still using it is a trend, not a snapshot:
                    always since launch, whichever dates are chosen. */}
                {question === "using" ? (
                  <div className="ent-card__trend">
                    {/* No shading for the dates: this week's
                        hatching is the one mark, and every week is in navy. */}
                    <WeeklyTrend trend={trendFor(cohort)} height="fill" look="fade" today={cohort.asOf} />
                    <p className="cohort-figure__brief">{TREND_COPY.brief}</p>
                  </div>
                ) : null}
              </QuestionCard>
            </Fragment>
          ))}
        </div>

        {/* The page ends on who is still to come, with the code to bring them
            in: the end of the story, not part of a card. */}
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
    </>
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

function Concept1bPage({ controls }: { controls: CohortControls }) {
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

function Concept1bForCohort({ id }: { id: ReturnType<typeof useShownCohortId> }) {
  const controls = useCohort(id);
  return <Concept1bPage controls={controls} />;
}

/**
 * Admin Dashboard (was Enterprise Dashboard), Concept 1b — With readiness. Chosen to go forward
 *; Concepts 1 and 2 are on the scratch branch.
 *
 * Concept 1 with the readiness pulse Eric asked for (2026-10-23): a card
 * under the opening, "Ready for what's next", and a last sentence in the
 * opening. What follows is Concept 1 as it was.
 *
 * One page that tells the cohort's story: an
 * opening in the order it happened, then four cards, each a measure headed
 * by a statement, opened by one plain sentence and evidenced by its figures,
 * the first set large, each with its definition under it. It ends on who is
 * still to join, with the code. Putting it into practice leads, as the hero,
 * because it is what a sponsor defends to their leadership; Staying with it, Showing up in the world and Getting started
 * sit side by side under it, with the weekly trend in the first.
 * A sponsor with no cohort yet sees only the setup.
 */
export function EnterpriseConcept1b() {
  const id = useShownCohortId();
  return <Concept1bForCohort key={id} id={id} />;
}

export default EnterpriseConcept1b;
