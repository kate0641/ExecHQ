"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { InviteCode } from "@/components/enterprise/InviteCode";
import { Sparkline } from "@/components/enterprise/Sparkline";
import { DropdownMenu } from "@/components/form/DropdownMenu";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import {
  C3_COPY,
  DATA_POINTS,
  ENTERPRISE_COPY,
  LATE_COPY,
  MIN_COHORT_SIZE,
  firstIssueOn,
  figureFor,
  isAboveMinimum,
  letterIssues,
  programDay,
  whatMoved,
  type Cohort,
  type CohortId,
  type DataPointId,
  type LetterIssue,
} from "@/mock/enterprise";
import { downloadCsv } from "../downloadCsv";
import { useCohort, type CohortControls } from "../useCohort";

const C = C3_COPY;

/** The definitions in the letter's own order: follow-through, use, joining. */
const DEFINITION_ORDER: DataPointId[] = ["follow-through", "plans", "artifacts", "loop", "active", "briefing", "invites", "onboarding"];
const FORM = ENTERPRISE_COPY.form;

/** The foot of every issue: the code, and its tools on request. How many
 *  joined is in the letter already. */
function CodeLine({ cohort, controls }: { cohort: Cohort; controls: CohortControls }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="letter__code">
      <p>
        {C.codeLine(cohort.code, cohort.open)}{" "}
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

/** One Monday's letter. `late` on the latest while this week's has not come. */
function Issue({ issue, previous, late, headingRef }: { issue: LetterIssue; previous?: LetterIssue; late?: boolean; headingRef: React.Ref<HTMLHeadingElement> }) {
  const { cohort, window } = issue;
  const c = cohort.byWindow[window];
  const above = isAboveMinimum(cohort, window);
  const moved = whatMoved(issue, previous);
  const active = figureFor(cohort, "active", window);
  // Each week's active people up to this issue; a week below the minimum is
  // a gap.
  const weeks = cohort.weeklyActive.map((value) => (value >= MIN_COHORT_SIZE ? value : undefined));
  const shownWeeks = weeks.filter((value): value is number => value !== undefined);
  const firstWeek = shownWeeks[0];
  const lastWeek = shownWeeks[shownWeeks.length - 1];

  return (
    <>
      {late ? (
        <p className="letter__late">
          <Icon name="warning" size={16} />
          {LATE_COPY.letter(issue.on)}
        </p>
      ) : null}
      <header className="letter__head">
        <p className="t-eyebrow">{C.eyebrow(issue.number, issue.on)}</p>
        <h1 className="letter__headline" ref={headingRef} tabIndex={-1}>
          {above ? C.headline(c.actionsCompleted, c.actionsAccepted) : C.headlineHidden(cohort.joined, cohort.expectedSize)}
        </h1>
        <p className="letter__covers">{C.covers(programDay(cohort))}</p>
      </header>

      <div className="letter__body">
        {/* What changed is why a weekly letter exists: it comes first
            (Kate, 2026-10-20), with the weeks so far drawn beside it. */}
        {previous && above ? (
          <section className="letter__moved" aria-labelledby="letter-moved">
            <div className="letter__moved-head">
              <h2 className="letter__subheading" id="letter-moved">
                {C.movedHeading}
              </h2>
              {weeks.length >= 2 ? (
                <span className="letter__trend">
                  <Sparkline values={weeks} label={C.trendLabel(firstWeek ?? 0, lastWeek ?? 0)} />
                  <span className="letter__trend-caption" aria-hidden="true">
                    {C.trendCaption}
                  </span>
                </span>
              ) : null}
            </div>
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

        {above ? (
          <>
            <p>{C.following(cohort.planAccepted, c.artifacts, c.artifactsUsed)}</p>
            <p>{C.using(c.active, active.value ?? "", c.briefingWeekly)}</p>
            <p>{C.joining(cohort.joined, cohort.expectedSize, cohort.activated)}</p>
          </>
        ) : (
          <>
            <p>{C.joining(cohort.joined, cohort.expectedSize)}</p>
            <p className="letter__hidden">
              <Icon name="lock" size={16} />
              {C.hidden}
            </p>
          </>
        )}

        <p className="letter__sign">
          <AdvisorMark size={18} />
          {C.signOff}
        </p>
      </div>

      <details className="letter__definitions">
        <summary>{C.definitions}</summary>
        <dl className="letter__definitions-list">
          {DEFINITION_ORDER.filter((id) => above || id === "invites").map((id) => (
            <div className="letter__definition" key={id}>
              <dt>{DATA_POINTS[id].label}</dt>
              <dd>{DATA_POINTS[id].brief}</dd>
            </div>
          ))}
        </dl>
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
      if (!startsOn) return setError(FORM.startMissing);
      controls.create({ name: name.trim(), expectedSize: Number(size), startsOn });
      return;
    }
    setError(undefined);
    setStep(step + 1);
  }

  const question = step === 1 ? C.setup.name : step === 2 ? C.setup.size : C.setup.starts;

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
          <Input
            className="cohort-form__date"
            label={C.setup.startsLabel}
            labelHidden
            type="date"
            value={startsOn}
            onChange={(e) => setStartsOn(e.target.value)}
            error={error}
          />
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
            {cohort.lateSince ? (
              <li className="letter-archive__upcoming">
                {C.issueName(issues.length + 1)}
                <span>{LATE_COPY.archive}</span>
              </li>
            ) : null}
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
          <Issue issue={issue} previous={issues[shown - 2]} late={Boolean(cohort.lateSince) && shown === issues.length} headingRef={headingRef} />
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
              <DropdownMenu
                className="letter__save ent-export"
                label={C.save}
                icon="download"
                entries={[
                  { type: "item", id: "pdf", label: C.savePdf, onSelect: () => globalThis.print() },
                  { type: "item", id: "csv", label: C.saveCsv, onSelect: () => downloadCsv(issue.cohort, issue.window) },
                ]}
              />
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
