"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import type { OutcomeType } from "@/lib/loop";
import type { MilestoneAnswer, StageFeeling } from "@/lib/stage-checkins";
import { OUTCOME_OPTIONS } from "@/mock/loop";
import { STAGE_CHECKIN_COPY as C } from "@/mock/plan";

/** How it went: the three answers that say what happened, and "Nothing yet", as "What came of it?" asks. */
const TONES = OUTCOME_OPTIONS.filter((o) => o.type !== "no-longer-relevant");

/** One thing she did in the stage. */
export interface CheckInItem {
  id: string;
  /** Where it came from: one of her steps, something ExecHQ made with her, or something she added. */
  from: "step" | "execHQ" | "you";
  title: string;
  /** What happened, and when, in words: "Used 13 Oct". */
  what: string;
  /** She passed on it: listed, never asked about. */
  passed?: boolean;
  /** What came of it, as she has said. Unset: not reported yet. */
  feedback?: { tone?: OutcomeType; words?: string };
  /** Asks how it went as well as her words. Something she added takes only her words. */
  asksTone: boolean;
}

export interface StageCheckInAnswers {
  milestone?: MilestoneAnswer;
  feeling?: StageFeeling;
  words?: string;
}

export interface StageCheckInProps {
  /** The stage she finished, from 0, and how many there are. */
  stageIndex: number;
  stageCount: number;
  stageTitle: string;
  /** What finishing the stage looks like. */
  milestone: string;
  /** The stage after it, if there is one. */
  nextStageTitle?: string;
  items: CheckInItem[];
  /** She said what came of something. The page keeps it on the thing itself. */
  onReport: (item: CheckInItem, answer: { tone?: OutcomeType; words?: string }) => void;
  /** She reached the end: her answers about the stage. */
  onSave: (answers: StageCheckInAnswers) => void;
  /** She put it off. */
  onLater: () => void;
  /** She is done reading it back. */
  onContinue: () => void;
  /** Something she passed on before is back on her plan for another look: the read-back says so. */
  offeredAgain?: boolean;
  /** Her answers from before, when she comes back to a check-in she has done. */
  saved?: StageCheckInAnswers;
  /** Where it opens: at the start, or on the read-back of one she has done. */
  startAt?: "start" | "summary";
  /** Opened from the roadmap rather than with the page: the heading takes focus at once, and leaving goes back
   *  to her plan rather than on to the next stage, which she is already in. */
  focusOnOpen?: boolean;
  /** Catalogue only: which page, and her answers so far. */
  demoPage?: number;
  demoAnswers?: StageCheckInAnswers;
  demoFolded?: boolean;
  className?: string;
}

/**
 * The stage check-in. ExecHQ decides a stage is finished, from her work, and before it builds on it, asks
 * how it went, one thing a page, with onboarding's page and answer drawer: what she did, with what she has
 * already said; what came of each thing she has not said yet; whether she got what finishing looks like;
 * and how she feels about her plan now. It ends on a read-back in her words. Every part can be skipped,
 * and "Later" is always there. What came of a thing goes on the thing, so it is one record wherever she
 * says it.
 */
export function StageCheckIn({
  stageIndex,
  stageCount,
  stageTitle,
  milestone,
  nextStageTitle,
  items,
  onReport,
  onSave,
  onLater,
  onContinue,
  offeredAgain,
  saved,
  startAt = "start",
  focusOnOpen,
  demoPage,
  demoAnswers,
  demoFolded,
  className,
}: StageCheckInProps) {
  const headingId = useId();
  // The things to ask about are fixed when it opens, so answering one never moves the pages.
  const [asking] = useState(() => items.filter((i) => !i.passed && !i.feedback).map((i) => i.id));
  const pages = ["intro", ...asking.map((id) => `item:${id}`), "milestone", "feeling", "summary"];
  const [page, setPage] = useState(Math.min(demoPage ?? (startAt === "summary" ? pages.length - 1 : 0), pages.length - 1));
  const [open, setOpen] = useState(!demoFolded);
  const [drafts, setDrafts] = useState<Record<string, { tone?: OutcomeType; words: string }>>({});
  const [answers, setAnswers] = useState<StageCheckInAnswers>(demoAnswers ?? saved ?? {});
  // Focus goes to the new page's heading, never on first paint unless she opened it from the roadmap.
  const first = useRef(!focusOnOpen);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById(headingId)?.focus();
  }, [page, headingId]);

  const go = (to: number) => {
    setPage(to);
    setOpen(true);
  };
  const next = () => {
    if (pages[page + 1] === "summary") onSave(answers);
    go(page + 1);
  };
  const top = { part: C.part, position: stageTitle, partIndex: page, partCount: pages.length, headingId };
  const classes = ["stage-checkin", "plan-guided", className].filter(Boolean).join(" ");
  const unreported = items.filter((i) => !i.passed && !i.feedback).length;
  const label = <T extends string>(list: readonly { id: T; label: string }[], id?: T) => list.find((o) => o.id === id)?.label;

  const did = items.length ? (
    <ul className="stage-checkin__did">
      {items.map((item) => (
        <li key={item.id} className="stage-checkin__thing">
          <span className="stage-checkin__from">{item.from === "execHQ" ? C.fromExecHQ : item.from === "you" ? C.fromYou : C.fromSteps}</span>
          <span className="stage-checkin__title">{item.title}</span>
          <span className="stage-checkin__what">{item.passed ? C.passed : item.what}</span>
          {item.passed ? null : item.feedback ? (
            <span className="stage-checkin__said">
              {item.feedback.tone ? <b>{TONES.find((t) => t.type === item.feedback?.tone)?.label}.</b> : null}{" "}
              {item.feedback.words ? <q>{item.feedback.words}</q> : null}
            </span>
          ) : (
            <span className="stage-checkin__pending">{C.unreported}</span>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className="stage-checkin__none">{C.nothingDone}</p>
  );

  const at = pages[page];

  if (at === "intro") {
    return (
      <GuidePage
        {...top}
        kicker={C.introKicker(stageIndex + 1, stageCount)}
        title={C.introTitle(stageTitle)}
        lede={C.introLede}
        className={classes}
        drawer={
          <AnswerDrawer
            question={C.introQuestion}
            questionId={headingId}
            open={open}
            onToggle={() => setOpen(!open)}
            primaryLabel={C.start}
            onPrimary={next}
            secondaryLabel={C.later}
            onSecondary={onLater}
          >
            <p className="stage-checkin__note">{C.introNote(unreported)}</p>
          </AnswerDrawer>
        }
      >
        {did}
      </GuidePage>
    );
  }

  if (at.startsWith("item:")) {
    const item = items.find((i) => `item:${i.id}` === at);
    if (!item) return null;
    const draft = drafts[item.id] ?? { words: "" };
    const ready = item.asksTone ? Boolean(draft.tone) : Boolean(draft.words.trim());
    const setDraft = (patch: Partial<typeof draft>) => setDrafts((all) => ({ ...all, [item.id]: { ...draft, ...patch } }));
    return (
      <GuidePage
        {...top}
        key={item.id}
        kicker={`${item.from === "execHQ" ? C.fromExecHQ : item.from === "you" ? C.fromYou : C.fromSteps} · ${item.what}`}
        title={C.itemTitle}
        lede={`${item.title}.`}
        why={C.itemWhy}
        whyLabel={C.itemWhyLabel}
        className={classes}
        drawer={
          <AnswerDrawer
            question={item.asksTone ? C.toneLabel : C.wordsLabel}
            questionId={headingId}
            open={open}
            onToggle={() => setOpen(!open)}
            primaryLabel={C.next}
            primaryDisabled={!ready}
            onPrimary={() => {
              onReport(item, { tone: draft.tone, words: draft.words.trim() || undefined });
              next();
            }}
            secondaryLabel={C.skipOne}
            onSecondary={next}
          >
            {item.asksTone ? (
              <ChipGroup
                label={C.toneLabel}
                labelHidden
                options={TONES.map((t) => t.label)}
                value={draft.tone ? [TONES.find((t) => t.type === draft.tone)!.label] : []}
                onChange={([picked]) => setDraft({ tone: TONES.find((t) => t.label === picked)?.type })}
              />
            ) : null}
            <Input
              label={C.wordsLabel}
              labelHidden={!item.asksTone}
              hint={item.asksTone ? C.wordsHint : undefined}
              multiline
              rows={2}
              value={draft.words}
              onChange={(event) => setDraft({ words: event.target.value })}
            />
          </AnswerDrawer>
        }
      />
    );
  }

  if (at === "milestone") {
    return (
      <GuidePage
        {...top}
        kicker={C.milestoneKicker(stageTitle)}
        title={C.milestoneTitle}
        why={milestone}
        whyLabel={C.milestoneWhyLabel}
        className={classes}
        drawer={
          <AnswerDrawer
            question={C.milestoneQuestion}
            questionId={headingId}
            open={open}
            onToggle={() => setOpen(!open)}
            primaryLabel={C.next}
            primaryDisabled={!answers.milestone}
            onPrimary={next}
            secondaryLabel={C.skip}
            onSecondary={() => {
              setAnswers((a) => ({ ...a, milestone: undefined }));
              next();
            }}
          >
            <ChipGroup
              label={C.milestoneQuestion}
              labelHidden
              options={C.milestones.map((m) => m.label)}
              value={answers.milestone ? [label(C.milestones, answers.milestone)!] : []}
              onChange={([picked]) => setAnswers((a) => ({ ...a, milestone: C.milestones.find((m) => m.label === picked)?.id }))}
            />
          </AnswerDrawer>
        }
      />
    );
  }

  if (at === "feeling") {
    return (
      <GuidePage
        {...top}
        kicker={C.feelingKicker}
        title={C.feelingTitle}
        lede={C.feelingLede}
        className={classes}
        drawer={
          <AnswerDrawer
            question={C.feelingQuestion}
            questionId={headingId}
            open={open}
            onToggle={() => setOpen(!open)}
            primaryLabel={C.seeStage}
            primaryDisabled={!answers.feeling}
            onPrimary={next}
            secondaryLabel={C.skip}
            onSecondary={() => {
              setAnswers((a) => ({ ...a, feeling: undefined }));
              next();
            }}
          >
            <ChipGroup
              label={C.feelingQuestion}
              labelHidden
              options={C.feelings.map((f) => f.label)}
              value={answers.feeling ? [label(C.feelings, answers.feeling)!] : []}
              onChange={([picked]) => setAnswers((a) => ({ ...a, feeling: C.feelings.find((f) => f.label === picked)?.id }))}
            />
            <Input
              label={C.feelingWordsLabel}
              hint={C.wordsHint}
              multiline
              rows={2}
              value={answers.words ?? ""}
              onChange={(event) => setAnswers((a) => ({ ...a, words: event.target.value }))}
            />
            <p className="stage-checkin__note">{C.privacy}</p>
          </AnswerDrawer>
        }
      />
    );
  }

  // The read-back. The reply says what her answers changed: the milestone first, then how she feels, then
  // a different way at anything that did not go the way she hoped, then anything offered again.
  const unsure = answers.feeling === "stuck" || answers.feeling === "less-sure";
  const words = answers.words?.trim();
  const notHoped = items.some((i) => asking.includes(i.id) && i.feedback?.tone === "negative");
  const reply = [
    unsure ? C.replyThanksUnsure : C.replyThanks,
    answers.milestone === "not-yet" ? C.replyNotYet : answers.milestone === "partly" ? C.replyPartly(nextStageTitle) : C.replyYes(nextStageTitle),
    unsure ? C.replyUnsureMore : null,
    notHoped ? C.replyOtherWay : null,
    offeredAgain ? C.replyAgain : null,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <GuidePage
      {...top}
      kicker={C.summaryKicker(stageTitle)}
      title={C.summaryTitle}
      className={classes}
      // Not on to the next stage when she is already in it, or when she said this one is not finished yet.
      primaryLabel={focusOnOpen || answers.milestone === "not-yet" ? C.onTo(undefined) : C.onTo(nextStageTitle)}
      onPrimary={onContinue}
      secondaryLabel={C.change}
      onSecondary={() => go(pages.indexOf("milestone"))}
    >
      <ReflectionReply from="ExecHQ" text={reply} />
      <section className="stage-checkin__section" aria-labelledby={`${headingId}-did`}>
        <h2 className="stage-checkin__heading" id={`${headingId}-did`}>
          {C.didHeading}
        </h2>
        {did}
        {unreported ? <p className="stage-checkin__note">{C.stillOpen(unreported)}</p> : null}
      </section>
      <section className="stage-checkin__section" aria-labelledby={`${headingId}-went`}>
        <h2 className="stage-checkin__heading" id={`${headingId}-went`}>
          {C.wentHeading}
        </h2>
        <ul className="stage-checkin__did">
          <li className="stage-checkin__thing">
            <span className="stage-checkin__from">{C.milestoneLabel}</span>
            <span className="stage-checkin__title">{milestone}</span>
            <span className="stage-checkin__said">{answers.milestone ? <b>{label(C.milestones, answers.milestone)}.</b> : C.notAnswered}</span>
          </li>
          <li className="stage-checkin__thing">
            <span className="stage-checkin__from">{C.feelingLabel}</span>
            <span className="stage-checkin__title">{label(C.feelings, answers.feeling) ?? C.notAnswered}</span>
            {words ? (
              <span className="stage-checkin__said">
                <q>{words}</q>
              </span>
            ) : null}
          </li>
        </ul>
      </section>
    </GuidePage>
  );
}

export default StageCheckIn;
