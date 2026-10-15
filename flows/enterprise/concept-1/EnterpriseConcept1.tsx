"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CohortFigure } from "@/components/enterprise/CohortFigure";
import { CohortForm } from "@/components/enterprise/CohortForm";
import { FigureDefinition } from "@/components/enterprise/FigureDefinition";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { WindowSelector } from "@/components/enterprise/WindowSelector";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C1_COPY,
  QUESTION_IDS,
  QUESTION_POINTS,
  answerFor,
  figureFor,
  formatDate,
  isAboveMinimum,
  programDay,
  type Cohort,
  type DataPointId,
  type WindowId,
} from "@/mock/enterprise";
import { useCohort, type CohortControls } from "../useCohort";

const C = C1_COPY;

/** The cohort's name, dates and age: the top of both pages. */
function CohortHeader({ cohort, children }: { cohort: Cohort; children?: React.ReactNode }) {
  const day = programDay(cohort);
  return (
    <header className="ent-header">
      <div className="ent-header__title">
        <p className="t-eyebrow">{C.eyebrow}</p>
        <h1 className="ent-header__name">{cohort.name}</h1>
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

/** Overview: the three questions, each answered in a sentence, with its figures. */
function Overview({ cohort }: { cohort: Cohort }) {
  const [window, setWindow] = useState<WindowId>("30d");
  const [open, setOpen] = useState<DataPointId | null>(null);
  const above = isAboveMinimum(cohort, window);
  const day = programDay(cohort);
  const filling = above && window !== "launch" && day < (window === "30d" ? 30 : 90);

  return (
    <div className="ent-page">
      <CohortHeader cohort={cohort}>
        <WindowSelector value={window} onChange={setWindow} asOf={cohort.asOf} upcoming={cohort.fresh} />
        <Button variant="secondary" size="sm" onClick={() => globalThis.print()}>
          <Icon name="download" size={16} />
          {C.export}
        </Button>
      </CohortHeader>

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

      {QUESTION_IDS.map((question) => {
        const answer = answerFor(cohort, question, window);
        const points = QUESTION_POINTS[question];
        const openHere = open && points.includes(open) ? open : null;
        return (
          <section className="ent-question" key={question} aria-labelledby={`q-${question}`}>
            <div className="ent-question__lead">
              <h2 className="ent-question__heading" id={`q-${question}`}>
                {C.questions[question]}
              </h2>
              {answer ? <p className="ent-question__answer">{answer}</p> : null}
            </div>
            <div className="ent-question__figures">
              {points.map((id, i) => {
                const figure = figureFor(cohort, id, window);
                return (
                  <CohortFigure
                    key={id}
                    // The page says once why figures are filling in.
                    figure={figure.state === "filling" ? { ...figure, note: undefined } : figure}
                    size={i === 0 ? "lg" : "md"}
                    explaining={open === id}
                    onExplain={() => setOpen(open === id ? null : id)}
                  />
                );
              })}
            </div>
            {openHere ? (
              <div className="ent-question__definition">
                <FigureDefinition id={openHere} window={window} onClose={() => setOpen(null)} />
              </div>
            ) : null}
          </section>
        );
      })}

      <p className="ent-page__privacy">
        <Icon name="shield" size={16} />
        {C.privacy}
      </p>
    </div>
  );
}

/** Cohort: the code, how many joined, and the cohort's details. */
function CohortPage({ cohort, controls }: { cohort: Cohort; controls: CohortControls }) {
  return (
    <div className="ent-page">
      <CohortHeader cohort={cohort} />
      <div className="ent-cohort">
        <InviteCode
          code={cohort.code}
          joined={cohort.joined}
          expectedSize={cohort.expectedSize}
          open={cohort.open}
          onRegenerate={controls.regenerate}
          onClose={controls.close}
          justRegenerated={controls.justRegenerated}
        />
        <section className="ent-details" aria-labelledby="cohort-details">
          <h2 className="ent-details__heading" id="cohort-details">
            {C.cohortPage.details}
          </h2>
          <dl className="ent-details__list">
            <div>
              <dt>{C.cohortPage.name}</dt>
              <dd>{cohort.name}</dd>
            </div>
            <div>
              <dt>{C.cohortPage.expected}</dt>
              <dd>{cohort.expectedSize.toLocaleString("en-GB")}</dd>
            </div>
            <div>
              <dt>{C.cohortPage.dates}</dt>
              <dd>
                {formatDate(cohort.startsOn)} to {formatDate(cohort.endsOn)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

/** First visit: set the cohort up, then hand over its code. */
function Setup({ controls, overviewHref }: { controls: CohortControls; overviewHref: string }) {
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
        <Link className="btn btn--primary btn--md ent-setup__next" href={overviewHref}>
          {C.setup.toOverview}
        </Link>
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
  const pathname = usePathname();
  const view = useSearchParams().get("view");
  const { cohort, justCreated } = controls;
  const overviewHref = pathname;
  const cohortHref = `${pathname}?view=cohort`;

  // Until a cohort exists, and right after one is made, there is nothing to
  // navigate between: the page is the setup.
  const settingUp = !cohort || (justCreated && view !== "overview" && view !== "cohort");
  const current = view === "cohort" ? "cohort" : "overview";

  return (
    <div className="ent">
      {settingUp ? null : (
        <nav className="chrome__nav ent__nav" aria-label={C.nav.label}>
          <ul className="chrome__nav-list">
            <li className="chrome__nav-item">
              <Link
                href={`${overviewHref}?view=overview`}
                className="chrome__nav-link"
                aria-current={current === "overview" ? "page" : undefined}
              >
                <span className="u-bold-hold" data-label={C.nav.overview}>{C.nav.overview}</span>
              </Link>
            </li>
            <li className="chrome__nav-item">
              <Link href={cohortHref} className="chrome__nav-link" aria-current={current === "cohort" ? "page" : undefined}>
                <span className="u-bold-hold" data-label={C.nav.cohort}>{C.nav.cohort}</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
      {settingUp ? (
        <Setup controls={controls} overviewHref={`${overviewHref}?view=overview`} />
      ) : current === "cohort" ? (
        <CohortPage cohort={cohort!} controls={controls} />
      ) : (
        <Overview cohort={cohort!} />
      )}
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
 * Overview answers the sponsor's three questions in order (did they join,
 * are they still using it, do they follow through), each in one sentence
 * with its figures under it, the first set large. Any figure opens its
 * definition beneath its row. Cohort is the admin page: the one shared code,
 * how many joined, and the cohort's details. A sponsor with no cohort yet
 * sees only the setup.
 */
export function EnterpriseConcept1() {
  const id = useCohortId();
  // The view is read from the address (`?view=cohort`), which needs a
  // Suspense boundary or a full page load stays blank.
  return (
    <Suspense fallback={null}>
      <Concept1ForCohort key={id} id={id} />
    </Suspense>
  );
}

export default EnterpriseConcept1;
