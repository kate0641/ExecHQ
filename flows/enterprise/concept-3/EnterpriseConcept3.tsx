"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { FigureDefinition } from "@/components/enterprise/FigureDefinition";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C3_COPY,
  CSV_COPY,
  DATA_POINT_IDS,
  ENTERPRISE_COPY,
  firstIssueOn,
  figureFor,
  isAboveMinimum,
  letterIssues,
  programDay,
  whatMoved,
  type Cohort,
  type CohortId,
  type LetterIssue,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { useCohort, type CohortControls } from "../useCohort";

const C = C3_COPY;
const FORM = ENTERPRISE_COPY.form;

/** The foot of every issue: the code, how many joined, and the code's tools on request. */
function CodeLine({ cohort, controls }: { cohort: Cohort; controls: CohortControls }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="letter__code">
      <p>
        {C.codeLine(cohort.code, cohort.joined, cohort.expectedSize, cohort.open)}{" "}
        <button type="button" className="letter__link" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? C.hideManage : C.manage}
        </button>
      </p>
      {open ? (
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
      ) : null}
    </div>
  );
}

/** One Monday's letter. */
function Issue({ issue, previous, headingRef }: { issue: LetterIssue; previous?: LetterIssue; headingRef: React.Ref<HTMLHeadingElement> }) {
  const { cohort, window } = issue;
  const c = cohort.byWindow[window];
  const above = isAboveMinimum(cohort, window);
  const moved = whatMoved(issue, previous);
  const active = figureFor(cohort, "active", window);

  return (
    <>
      <header className="letter__head">
        <p className="t-eyebrow">{C.eyebrow(issue.number, issue.on)}</p>
        <h1 className="letter__headline" ref={headingRef} tabIndex={-1}>
          {above ? C.headline(cohort.joined, cohort.expectedSize, c.active, programDay(cohort)) : C.headline(cohort.joined, cohort.expectedSize)}
        </h1>
        <p className="letter__covers">{C.covers(programDay(cohort))}</p>
      </header>

      <div className="letter__body">
        <p>{above ? C.joining(cohort.joined, cohort.expectedSize, cohort.activated) : C.joining(cohort.joined, cohort.expectedSize)}</p>
        {above ? (
          <>
            <p>{C.using(c.active, active.value ?? "", c.briefingWeekly)}</p>
            <p>{C.following(cohort.planAccepted, c.actionsCompleted, c.actionsAccepted, c.artifacts, c.artifactsUsed, c.outcomesRecorded)}</p>
          </>
        ) : (
          <p className="letter__hidden">
            <Icon name="lock" size={16} />
            {C.hidden}
          </p>
        )}

        {previous && above ? (
          <section className="letter__moved" aria-labelledby="letter-moved">
            <h2 className="letter__subheading" id="letter-moved">
              {C.movedHeading}
            </h2>
            {moved.length > 0 ? (
              <>
                <ul>
                  {moved.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="letter__fine">{C.movedRule}</p>
              </>
            ) : (
              <p>{C.movedNone}</p>
            )}
          </section>
        ) : null}

        <p className="letter__sign">
          <AdvisorMark size={18} />
          {C.signOff}
        </p>
      </div>

      <details className="letter__definitions">
        <summary>{C.definitions}</summary>
        <div className="letter__definitions-list">
          {DATA_POINT_IDS.filter((id) => above || id === "invites").map((id) => (
            <FigureDefinition key={id} id={id} window={window} headingLevel={3} />
          ))}
        </div>
      </details>
    </>
  );
}

/** Issue 0, before a cohort exists: three questions, one at a time. */
function SetupLetter({ controls }: { controls: CohortControls }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [error, setError] = useState<string>();
  const questionRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Each new question takes focus, so a screen reader hears it.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    questionRef.current?.focus();
  }, [step]);

  function next(event: FormEvent) {
    event.preventDefault();
    if (step === 1 && !name.trim()) return setError(FORM.nameMissing);
    if (step === 2 && (!/^\d+$/.test(size) || Number(size) < 1)) return setError(FORM.sizeMissing);
    if (step === 3) {
      if (!startsOn || !endsOn) return setError(FORM.datesMissing);
      if (endsOn <= startsOn) return setError(FORM.endsBeforeStart);
      controls.create({ name: name.trim(), expectedSize: Number(size), startsOn, endsOn });
      return;
    }
    setError(undefined);
    setStep(step + 1);
  }

  const question = step === 1 ? C.setup.name : step === 2 ? C.setup.size : C.setup.dates;

  return (
    <>
      <header className="letter__head">
        <p className="t-eyebrow">{C.issueName(0)}</p>
        <p className="letter__intro">{C.setup.intro}</p>
      </header>
      <form className="letter__question" onSubmit={next} noValidate>
        <p className="letter__step">{C.setup.step(step)}</p>
        <h1 className="letter__headline" ref={questionRef} tabIndex={-1}>
          {question}
        </h1>
        {step === 1 ? (
          <Input label={FORM.name} labelHidden hint={C.setup.nameHint} value={name} onChange={(e) => setName(e.target.value)} error={error} />
        ) : step === 2 ? (
          <Input
            label={FORM.size}
            labelHidden
            hint={C.setup.sizeHint}
            inputMode="numeric"
            value={size}
            onChange={(e) => setSize(e.target.value.replace(/[^\d]/g, ""))}
            error={error}
          />
        ) : (
          <div className="cohort-form__dates">
            <Input label={C.setup.starts} type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} error={error} />
            <Input
              label={C.setup.ends}
              type="date"
              value={endsOn}
              onChange={(e) => setEndsOn(e.target.value)}
              aria-invalid={error ? true : undefined}
            />
          </div>
        )}
        <div className="letter__actions">
          <Button type="submit">{step === 3 ? C.setup.create : C.setup.next}</Button>
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => {
                setError(undefined);
                setStep(step - 1);
              }}
            >
              {C.setup.back}
            </Button>
          ) : null}
        </div>
      </form>
    </>
  );
}

/** Issue 0, once the cohort exists: the code, and when the first issue comes. */
function ReadyLetter({ cohort, controls, headingRef }: { cohort: Cohort; controls: CohortControls; headingRef: React.Ref<HTMLHeadingElement> }) {
  return (
    <>
      <header className="letter__head">
        <p className="t-eyebrow">{C.eyebrow(0, cohort.startsOn)}</p>
        <h1 className="letter__headline" ref={headingRef} tabIndex={-1}>
          {C.ready.headline}
        </h1>
      </header>
      <div className="letter__body">
        <p>{C.ready.body}</p>
        <InviteCode
          code={cohort.code}
          joined={cohort.joined}
          expectedSize={cohort.expectedSize}
          open={cohort.open}
          onRegenerate={controls.regenerate}
          onClose={controls.close}
          justRegenerated={controls.justRegenerated}
        />
        <p>{C.ready.then(firstIssueOn(cohort))}</p>
        <p className="letter__sign">
          <AdvisorMark size={18} />
          {C.signOff}
        </p>
      </div>
    </>
  );
}

function Concept3Page({ controls }: { controls: CohortControls }) {
  const { cohort } = controls;
  const issues = cohort ? letterIssues(cohort) : [];
  // The latest issue opens first; 0 is the setup letter.
  const [chosen, setChosen] = useState<number>(issues.length);
  const shown = Math.min(chosen, issues.length);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ready = Boolean(cohort);
  const wasReady = useRef(ready);

  useEffect(() => {
    if (ready && !wasReady.current) headingRef.current?.focus();
    wasReady.current = ready;
  }, [ready]);

  function open(n: number) {
    setChosen(n);
    // The letter changes in place: focus goes to its headline.
    setTimeout(() => headingRef.current?.focus(), 0);
  }

  const issue = shown > 0 ? issues[shown - 1] : undefined;

  return (
    <div className="ent letter-view">
      {cohort ? (
        <nav className="letter-archive" aria-label={C.archiveLabel}>
          <p className="letter-archive__heading" aria-hidden="true">
            {C.archive}
          </p>
          <ul className="letter-archive__list">
            {issues.length === 0 ? (
              <li className="letter-archive__upcoming">
                {C.upcoming}
                <span>{C.issueDate(firstIssueOn(cohort))}</span>
              </li>
            ) : null}
            {[...issues].reverse().map((item) => (
              <li key={item.number}>
                <button
                  type="button"
                  className="letter-archive__item"
                  aria-current={item.number === shown ? "true" : undefined}
                  onClick={() => open(item.number)}
                >
                  {C.issueName(item.number)}
                  <span>{C.issueDate(item.on)}</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="letter-archive__item" aria-current={shown === 0 ? "true" : undefined} onClick={() => open(0)}>
                {C.issueName(0)}
                <span>{C.setupName}</span>
              </button>
            </li>
          </ul>
        </nav>
      ) : null}

      <article className="letter" aria-label={issue ? C.issueName(issue.number) : C.issueName(0)}>
        {!cohort ? (
          <SetupLetter controls={controls} />
        ) : issue ? (
          <Issue issue={issue} previous={issues[shown - 2]} headingRef={headingRef} />
        ) : (
          <ReadyLetter cohort={cohort} controls={controls} headingRef={headingRef} />
        )}

        {cohort ? (
          <footer className="letter__foot">
            {issue ? <CodeLine cohort={cohort} controls={controls} /> : null}
            <p className="letter__privacy">
              <Icon name="shield" size={14} />
              {C.privacy}
            </p>
            {issue ? (
              <div className="letter__save">
                <Button variant="secondary" size="sm" onClick={() => globalThis.print()}>
                  <Icon name="download" size={16} />
                  {C.save}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => downloadCsv(issue.cohort, issue.window)} aria-describedby="letter-csv-hint">
                  <Icon name="download" size={16} />
                  {C.saveCsv}
                </Button>
                <span className="u-visually-hidden" id="letter-csv-hint">
                  {CSV_COPY.hint}
                </span>
              </div>
            ) : null}
          </footer>
        ) : null}
      </article>
    </div>
  );
}

function Concept3ForCohort({ id }: { id: CohortId }) {
  const controls = useCohort(id);
  return <Concept3Page controls={controls} />;
}

/**
 * Enterprise Dashboard, Concept 3 — The weekly letter (wildcard).
 *
 * No dashboard. The weekly refresh is the product's rhythm: each Monday an
 * issue, written in the advisor's voice, says how the cohort stands, in
 * sentences, over the last 30 days or the program so far. Past issues stack
 * into an archive down the left in place of a window choice. "Since the last
 * issue" names directions only, and only when at least the minimum cohort
 * size is behind a change. Issue 0 is the setup: three questions, one at a
 * time, then the code. The code and its tools sit at the foot of every issue.
 */
export function EnterpriseConcept3() {
  const id = useCohortId();
  return <Concept3ForCohort key={id} id={id} />;
}

export default EnterpriseConcept3;
