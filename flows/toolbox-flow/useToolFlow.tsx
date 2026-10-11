"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { EnricherCard } from "@/components/toolbox/EnricherCard";
import { fullName } from "@/mock/account";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Icon } from "@/components/primitives/Icon";
import { DraftEditor } from "@/components/toolbox/DraftEditor";
import { DraftUseBar } from "@/components/toolbox/DraftUseBar";
import { InputPanel } from "@/components/toolbox/InputPanel";
import { RevisionControls, type RevisionChoice } from "@/components/toolbox/RevisionControls/RevisionControls";
import { ToolUseCase } from "@/components/toolbox/ToolUseCase";
import { VersionHistory } from "@/components/toolbox/VersionHistory";
import { addDays, aheadPhrase, createRecord, daysBetween, datePhrase, shortDate } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { briefDraft, draftText, firstDraft, pitchDraft, positioningDraft, revise, revisionLabel, statementOnly } from "@/lib/toolbox-draft";
import { toolboxActions, useToolbox, type DraftState } from "@/lib/toolbox-store";
import { TODAYS_READS } from "@/mock/briefing";
import type { ArtifactKind } from "@/mock/loop";
import { stepById } from "@/mock/plan";
import {
  BRIEF_INPUTS,
  DRAFT_COPY,
  INPUT_COPY,
  FLOW_COPY as C,
  LIBRARY_SEED,
  PITCH_INPUTS,
  POSITIONING_COPY,
  POSITIONING_INPUTS,
  SEED_INPUTS,
  WINS_INPUT,
  ENRICHERS,
  STEP_PREFILLS,
  TOOL_COPY,
  REVISION_COPY,
  USE_COPY,
  TL_INPUTS_DIRECT,
  TL_INPUTS_FROM_BRIEFING,
  TOOLS,
  VERSION_COPY,
  type ToolInput,
} from "@/mock/toolbox";

export type FlowConcept = "concept-1" | "concept-2" | "concept-3";
export const TOOL_TITLE_ID = "tool-title";
export const DRAFT_LABEL_ID = "draft-label";

/** Moves focus once the new screen is drawn, so a screen reader starts there. */
export function focusSoon(id: string): void {
  setTimeout(() => document.getElementById(id)?.focus({ preventScroll: true }), 0);
}

const DAY = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
/** "Mon 5 Oct, 9:14": the snapshot's day, the reviewer's time. */
function stamp(today: string): string {
  const now = new Date();
  return `${DAY.format(new Date(`${today}T00:00:00Z`))} ${shortDate(today)}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** The kind of moment, from what she said, for the Situation Brief. */
function momentType(text: string): string | undefined {
  if (/board/i.test(text)) return "A board meeting";
  if (/negotiat/i.test(text)) return "A negotiation";
  if (/review/i.test(text)) return "A review";
  if (/conversation|1:1|check-?in|meeting/i.test(text)) return "An executive conversation";
  return undefined;
}

/** The kind of pitch, from what she said. */
function pitchType(text: string): string | undefined {
  if (/podcast|show|episode/i.test(text)) return "Podcast";
  if (/press|editor|journalist|article/i.test(text)) return "Press";
  if (/conference|panel|talk|speak|keynote|summit|forum/i.test(text)) return "Speaking";
  return undefined;
}

/** "on Thursday", "on 3 November": when a brief's moment is. */
function whenWords(date: string | undefined, today: string): string | undefined {
  if (!date) return undefined;
  return date >= today ? aheadPhrase(date, today) : datePhrase(date);
}

/** A tool's first draft, from what she gave it. */
function buildDraft(kind: ArtifactKind, v: Record<string, string>, today: string, readId?: string, passage?: string, name = "") {
  if (kind === "positioning") return positioningDraft(v, name);
  if (kind === "pitch") return pitchDraft(v);
  if (kind === "situation-brief") return briefDraft(v, whenWords(v.date, today));
  return firstDraft({ format: v.format, topic: v.topic, pov: v.pov, example: v.example, audience: v.audience, cta: v.cta }, readId, passage);
}

/** Its title in the library. */
function titleFor(kind: ArtifactKind, v: Record<string, string>, about: string): { title: string; name: string } {
  if (kind === "pitch") return { title: TOOL_COPY.pitchTitle(v.target || v.angle || "a stage"), name: TOOL_COPY.pitchName };
  if (kind === "situation-brief") return { title: TOOL_COPY.briefTitle(v.type || "your next meeting"), name: TOOL_COPY.briefName };
  return { title: C.postTitle(about), name: C.postName };
}

/**
 * Everything the three Toolbox flows share, for every tool:
 * where she came from (a Briefing read, a plan step, the Toolbox, the
 * library), what it asks, the first draft and its Loop record, revising,
 * versions, copy and mark ready. Each concept lays it out its own way.
 *
 * The first draft creates the Loop record, and the address moves to the
 * artifact, so leaving at any point finds the draft in the library exactly
 * where she left it, and opening it there comes straight back here.
 */
export function useToolFlow(concept: FlowConcept) {
  const params = useSearchParams();
  const router = useRouter();
  const loop = useLoop();
  const toolbox = useToolbox();

  const artifactId = params.get("artifact") ?? undefined;
  const reuseId = params.get("reuse") ?? undefined;
  const readId = params.get("source") === "briefing" ? (params.get("read") ?? undefined) : undefined;
  const from = params.get("from");
  const stepId = params.get("step") ?? undefined;
  const moment = params.get("moment") ?? undefined;

  const draft: DraftState | undefined = artifactId ? toolbox.drafts[artifactId] : undefined;
  const record = artifactId ? loop.records.find((r) => r.id === artifactId) : undefined;
  const read = TODAYS_READS.find((r) => r.id === (draft?.meta.readId ?? readId));
  const passage = draft?.passage ?? (read && (from === "passage" || from === "selection") ? read.passage : undefined);
  const step = stepId ? stepById(stepId) : undefined;
  const kind: ArtifactKind = record?.kind ?? (readId ? "thought-leadership" : ((params.get("tool") as ArtifactKind) ?? "thought-leadership"));
  const tool = TOOLS[kind] ?? TOOLS["thought-leadership"];

  // Reusing one of her posts makes a new artifact straight away, linked back.
  const reused = useRef(false);
  useEffect(() => {
    if (!reuseId || reused.current) return;
    const original = toolbox.drafts[reuseId];
    const source = loop.records.find((r) => r.id === reuseId);
    if (!original || !source) return;
    reused.current = true;
    const id = `post-${Date.now().toString(36)}`;
    const latest = original.versions[original.showing - 1];
    loopActions.create(createRecord({ id, kind: source.kind, title: C.newTitle(source.title), name: source.name, on: loop.today }));
    toolboxActions.saveDraft(id, {
      ...original,
      meta: { ...original.meta, versions: 1, reusedFrom: reuseId },
      versions: [{ ...latest, n: 1, when: stamp(loop.today), what: C.reusedFrom(source.title) }],
      showing: 1,
      edits: original.edits[original.showing] ? { 1: original.edits[original.showing] } : {},
    });
    router.replace(`${conceptHref("toolbox-flow", concept)}?artifact=${id}`);
  }, [reuseId, toolbox.drafts, loop.records, loop.today, router, concept]);

  // Positioning Builder is one artifact: her statement from onboarding. Opened
  // as a tool, from a plan step or from the Toolbox, it goes to that artifact.
  const positioningRecord = loop.records.find((r) => r.kind === "positioning");
  useEffect(() => {
    if (kind !== "positioning" || artifactId || !positioningRecord) return;
    router.replace(`${conceptHref("toolbox-flow", concept)}?artifact=${positioningRecord.id}${stepId ? `&step=${stepId}` : ""}`);
  }, [kind, artifactId, positioningRecord, stepId, router, concept]);

  /** Her statement, not yet built out: the builder opens on it, as the same
   *  artifact, rather than making a new one. */
  const buildingOut = Boolean(artifactId && !draft && record?.kind === "positioning");

  /** An artifact with nothing to open: designed once a concept is chosen. */
  const seedInputs = artifactId && !draft ? SEED_INPUTS[artifactId] : undefined;
  const later =
    (artifactId !== undefined && !draft && !seedInputs && !buildingOut) || (reuseId !== undefined && !toolbox.drafts[reuseId]);

  const [wins, setWins] = useState<"offered" | "added" | "skipped">("offered");
  /** What each tool asks. What a plan step already says, or what she said was
   *  coming up, arrives filled in. */
  const account = loop.account;
  const positioningInputs: readonly ToolInput[] = [
    ...POSITIONING_INPUTS.map((input) => {
      const known: Record<string, string | undefined> = {
        statement: (artifactId && LIBRARY_SEED[artifactId]?.preview) || account.direction,
        role: account.jobTitle,
        toward: account.towardShort,
      };
      return known[input.id] ? { ...input, value: known[input.id] } : input.source ? { ...input, source: undefined } : input;
    }),
    ...(wins === "added" ? [WINS_INPUT] : []),
  ];
  const baseInputs: readonly ToolInput[] =
    kind === "positioning" ? positioningInputs : kind === "pitch" ? PITCH_INPUTS : kind === "situation-brief" ? BRIEF_INPUTS : read ? TL_INPUTS_FROM_BRIEFING : TL_INPUTS_DIRECT;
  // What she said was coming up is a topic for a post, but for a brief or a
  // pitch it only says what kind of moment it is; the rest is still asked.
  const guessed = moment ? (kind === "pitch" ? pitchType(moment) : kind === "situation-brief" ? momentType(moment) : undefined) : undefined;
  const fromMoment: Record<string, string> = moment
    ? kind === "thought-leadership"
      ? { topic: moment }
      : guessed
        ? { type: guessed }
        : {}
    : {};
  const fromStep = step ? (STEP_PREFILLS[step.id] ?? (kind === "thought-leadership" ? { topic: step.title } : {})) : {};
  const inputs: readonly ToolInput[] = baseInputs.map((input) =>
    fromStep[input.id]
      ? { ...input, value: fromStep[input.id], source: input.kind === "choice" ? undefined : ("plan" as const) }
      : fromMoment[input.id]
        ? { ...input, value: fromMoment[input.id] }
        : input
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const valueOf = (id: string) => values[id] ?? inputs.find((i) => i.id === id)?.value ?? "";
  const setValue = (id: string, value: string) => setValues((v) => ({ ...v, [id]: value }));
  /** What only she can answer, one a screen in Concepts 1 and 3; what
   *  ExecHQ already knows, and anything optional, go on one last screen. */
  const asked = inputs.filter((i) => !(i.source && i.kind !== "choice") && !i.optional);
  const rest = inputs.filter((i) => !asked.includes(i));
  const [writing, setWriting] = useState(false);

  function write() {
    setWriting(true);
    window.setTimeout(() => {
      const v = Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)]));
      const sections = buildDraft(kind, v, loop.today, read?.id, passage, fullName(account));
      const preview = draftText(sections.slice(0, 1)).replace(/^.*\n/, "").split("\n")[0];
      if (buildingOut && artifactId && record) {
        // The same artifact: her statement from onboarding is version 1.
        const seed = LIBRARY_SEED[artifactId];
        toolboxActions.saveDraft(artifactId, {
          meta: { ...(seed ?? { versions: 2, preview }), versions: 2, preview, fromOnboarding: false },
          versions: [
            { n: 1, when: shortDate(record.createdOn), what: POSITIONING_COPY.onboardingVersion, sections: statementOnly(v.statement) },
            { n: 2, when: stamp(loop.today), what: POSITIONING_COPY.builtOut, sections },
          ],
          showing: 2,
          edits: {},
          answers: {},
          inputs: v,
        });
        touch();
        setWriting(false);
        focusSoon(DRAFT_LABEL_ID);
        return;
      }
      const id = `${kind === "thought-leadership" ? "post" : kind}-${Date.now().toString(36)}`;
      const about = read ? read.title : valueOf("topic") || tool.name;
      const { title, name } = titleFor(kind, v, about);
      loopActions.create(createRecord({ id, kind, title, name, on: loop.today, recommendation: step?.title }));
      toolboxActions.saveDraft(id, {
        meta: {
          area: step?.area ?? "seen-as-leader",
          planStepId: step?.id,
          readId: read?.id,
          versions: 1,
          preview,
        },
        versions: [{ n: 1, when: stamp(loop.today), what: DRAFT_COPY.label(1), sections }],
        showing: 1,
        edits: {},
        answers: {},
        inputs: v,
        passage,
      });
      setWriting(false);
      router.replace(`${conceptHref("toolbox-flow", concept)}?artifact=${id}`);
      focusSoon(DRAFT_LABEL_ID);
    }, 900);
  }

  // Her artifacts from before the Toolbox open straight into their draft:
  // made once, from what she gave them, with as many versions as she kept.
  useEffect(() => {
    if (!artifactId || draft || !seedInputs || !record) return;
    const seed = LIBRARY_SEED[artifactId];
    const sections = buildDraft(record.kind, seedInputs, loop.today);
    const count = seed?.versions ?? 1;
    toolboxActions.saveDraft(artifactId, {
      meta: seed ?? { versions: count, preview: "" },
      versions: Array.from({ length: count }, (_, i) => ({
        n: i + 1,
        when: shortDate(record.createdOn),
        what: i === 0 ? DRAFT_COPY.label(1) : C.yourEdits,
        sections,
      })),
      showing: count,
      edits: {},
      answers: {},
      inputs: seedInputs,
    });
  }, [artifactId, draft, seedInputs, record, loop.today]);

  /* --- The draft, once there is one ------------------------------------- */

  const [revising, setRevising] = useState(false);
  const version = draft ? draft.versions[draft.showing - 1] : undefined;
  const edits = draft && version ? (draft.edits[version.n] ?? {}) : {};
  const touch = () => {
    if (record && record.state === "drafted") loopActions.edit(record.id);
  };

  function doRevise(choice: RevisionChoice, followUp: string) {
    if (!draft || !version || !artifactId) return;
    setRevising(true);
    window.setTimeout(() => {
      toolboxActions.addVersion(artifactId, { when: stamp(loop.today), what: revisionLabel(choice, followUp) || REVISION_COPY.revise, sections: revise(version.sections, choice) });
      touch();
      setRevising(false);
    }, 900);
  }

  const backHref = conceptHref("toolbox", concept);
  const header: ReactNode = (
    <div className="tool-flow__bar">
      <Link href={backHref} className="tool-flow__back">
        <Icon name="chevron" size={16} className="tool-flow__back-icon" />
        {C.back}
        <span className="u-visually-hidden"> ({C.backLabel})</span>
      </Link>
      {draft ? (
        <span className="tool-flow__saved">
          <Icon name="check" size={14} />
          {C.saved}
        </span>
      ) : null}
    </div>
  );

  const source: ReactNode = read ? (
    <SourceLabel read={read} passage={passage} size={draft ? "compact" : "full"} />
  ) : buildingOut ? (
    <div className="tool-flow__carried">
      <span className="tool-flow__carried-label">{POSITIONING_COPY.fromOnboarding}</span>
      <p className="tool-flow__carried-text">{valueOf("statement")}</p>
    </div>
  ) : null;

  const useCase: ReactNode = (
    <ToolUseCase
      tool={tool}
      planStep={step?.title}
      source={source}
      noStart
      headingLevel={1}
      headingId={TOOL_TITLE_ID}
    />
  );

  /** Positioning Builder offers her accomplishments; the draft never waits. */
  const enricher: ReactNode =
    kind === "positioning" && wins === "offered" ? (
      <EnricherCard
        enricher={{ ...ENRICHERS.wins, why: "Your bios can name something you delivered, instead of leaving a question for it." }}
        onAdd={() => setWins("added")}
        onSkip={() => setWins("skipped")}
      />
    ) : null;

  const inputPanel = (subset?: readonly ToolInput[], options: { submitLabel?: string; hideNote?: boolean; onSubmit?: () => void; enricher?: ReactNode } = {}): ReactNode => (
    <InputPanel
      key={(subset ?? inputs).map((i) => i.id).join("|")}
      inputs={subset ?? inputs}
      values={values}
      onChange={(id, value) => setValues((v) => ({ ...v, [id]: value }))}
      onWrite={options.onSubmit ?? write}
      writing={!options.onSubmit && writing}
      submitLabel={options.submitLabel}
      hideNote={options.hideNote}
      enricher={options.enricher ?? enricher}
      noHeading
    />
  );

  /** Each output used on its own: copied, and the bios exported. */
  const [sectionMessage, setSectionMessage] = useState("");
  const sectionActions = (section: { id: string; heading?: string }): ReactNode => {
    const name = section.heading ?? "";
    const one = version?.sections.filter((x) => x.id === section.id) ?? [];
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            try {
              void navigator.clipboard?.writeText(draftText(one, edits, draft?.answers));
            } catch {
              // Nothing depends on it.
            }
            setSectionMessage(POSITIONING_COPY.copied(name));
          }}
        >
          {USE_COPY.copy}
          <span className="u-visually-hidden"> {name}</span>
        </Button>
        {section.id.startsWith("bio")
          ? (["PDF", "Word"] as const).map((format) => (
              <Button key={format} variant="ghost" size="sm" onClick={() => setSectionMessage(USE_COPY.exported(format))}>
                {format === "PDF" ? USE_COPY.pdfShort : USE_COPY.wordShort}
                <span className="u-visually-hidden"> of the {name.toLowerCase()}</span>
              </Button>
            ))
          : null}
      </>
    );
  };

  /** Her statement changed: offer, never force, a refresh of the rest. */
  const [refreshOffer, setRefreshOffer] = useState(false);
  const refresh: ReactNode =
    refreshOffer && draft && version && artifactId ? (
      <aside className="tool-flow__refresh" aria-label={POSITIONING_COPY.refresh.heading}>
        <p className="tool-flow__refresh-heading">{POSITIONING_COPY.refresh.heading}</p>
        <p className="tool-flow__refresh-body">{POSITIONING_COPY.refresh.body}</p>
        <div className="tool-flow__refresh-actions">
          <Button
            size="sm"
            onClick={() => {
              const statement = edits.statement ?? draft.inputs.statement;
              const v = { ...draft.inputs, statement };
              toolboxActions.addVersion(artifactId, { when: stamp(loop.today), what: POSITIONING_COPY.refresh.what, sections: buildDraft("positioning", v, loop.today, undefined, undefined, fullName(account)) });
              setRefreshOffer(false);
              setSectionMessage(POSITIONING_COPY.refresh.done);
            }}
          >
            {POSITIONING_COPY.refresh.yes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRefreshOffer(false)}>
            {POSITIONING_COPY.refresh.no}
          </Button>
        </div>
      </aside>
    ) : null;

  const draftEditor: ReactNode =
    draft && version && artifactId ? (
      <>
        {refresh}
        <output className="u-visually-hidden">{sectionMessage}</output>
        <DraftEditor
          key={`${artifactId}-${version.n}`}
          id={DRAFT_LABEL_ID}
          label={DRAFT_COPY.label(version.n)}
          intro={version.n === 1 || (kind === "positioning" && version.n === 2 && draft.versions.length === 2) ? DRAFT_COPY.introFor[kind] : undefined}
          sectionActions={kind === "positioning" ? sectionActions : undefined}
          sections={version.sections}
          edits={edits}
          answers={draft.answers}
          revising={revising ? REVISION_COPY.revising : undefined}
          header={
            <span className="tool-flow__draft-head">
              {record ? <LoopStatus record={record} /> : null}
            </span>
          }
          onEditSection={(section, text) => {
            toolboxActions.editSection(artifactId, section, text);
            if (kind === "positioning" && section === "statement") {
              setRefreshOffer(true);
              toolboxActions.setPreview(artifactId, text);
            }
            touch();
          }}
          onAnswer={(question, answer) => {
            toolboxActions.answer(artifactId, question, answer);
            touch();
          }}
        />
      </>
    ) : null;

  /** `onAsked` runs once she asks for a revision: Concept 1 closes its sheet. */
  const revision = (onAsked?: () => void): ReactNode =>
    draft ? (
      <RevisionControls
        onRevise={(choice, followUp) => {
          doRevise(choice, followUp);
          onAsked?.();
        }}
        revising={revising}
      />
    ) : null;

  const versions: ReactNode =
    draft && artifactId ? (
      <VersionHistory
        versions={draft.versions}
        showing={draft.showing}
        onView={(n) => toolboxActions.show(artifactId, n)}
        onRestore={(n) => {
          const v = draft.versions[n - 1];
          toolboxActions.addVersion(artifactId, { when: stamp(loop.today), what: VERSION_COPY.restoredWhat(n), sections: v.sections }, draft.edits[n]);
        }}
      />
    ) : null;

  const copy = () => {
    if (!draft || !version) return;
    try {
      void navigator.clipboard?.writeText(draftText(version.sections, edits, draft.answers));
    } catch {
      // The prototype says it copied either way; nothing depends on it.
    }
  };

  // A brief with a date: the follow-up lands the day after it, however early
  // she marks it used. Otherwise the kind's default.
  const briefDate = kind === "situation-brief" ? draft?.inputs.date : undefined;
  const checkBack = (on: string) => (briefDate && briefDate >= on ? daysBetween(on, briefDate) + 1 : undefined);

  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sentOn, setSentOn] = useState<string | null>(null);

  const sentForm: ReactNode =
    sending && record ? (
      <form
        className="tool-flow__sent"
        onSubmit={(event) => {
          event.preventDefault();
          const on = sentOn || loop.today;
          loopActions.markUsed(record.id, { channel: (sentTo ?? draft?.inputs.target ?? "").trim() || undefined }, on <= loop.today ? on : loop.today);
          setSending(false);
        }}
      >
        <h2 className="tool-flow__sent-heading">{TOOL_COPY.sent.heading}</h2>
        <Input label={`${TOOL_COPY.sent.to} (${INPUT_COPY.optional.toLowerCase()})`} value={sentTo ?? draft?.inputs.target ?? ""} onChange={(e) => setSentTo(e.target.value)} />
        <Input label={TOOL_COPY.sent.on} type="date" value={sentOn ?? loop.today} max={loop.today} onChange={(e) => setSentOn(e.target.value)} />
        <div className="tool-flow__sent-actions">
          <Button type="submit">{TOOL_COPY.sent.confirm}</Button>
          <Button variant="ghost" onClick={() => setSending(false)}>
            {TOOL_COPY.sent.cancel}
          </Button>
        </div>
      </form>
    ) : null;

  const useBar = (options: { noStatus?: boolean } = {}): ReactNode =>
    record ? (
      <>
        <DraftUseBar
          kind={record.kind}
          ready={record.state !== "drafted" && record.state !== "in-progress"}
          onCopy={copy}
          onExport={() => undefined}
          onMarkReady={() => loopActions.markReady(record.id, checkBack(loop.today) ? { checkBackDays: checkBack(loop.today) } : undefined)}
          onMarkUsed={
            record.state === "ready" && !sending
              ? () => (record.kind === "pitch" ? setSending(true) : loopActions.markUsed(record.id, checkBack(loop.today) ? { checkBackDays: checkBack(loop.today) } : undefined))
              : undefined
          }
          noStatus={options.noStatus}
          note={
            record.kind === "situation-brief"
              ? [TOOL_COPY.onePage, briefDate ? TOOL_COPY.askAfter(aheadPhrase(addDays(briefDate, 1), loop.today)) : ""].filter(Boolean).join(" ")
              : undefined
          }
        />
        {sentForm}
      </>
    ) : null;

  /** Reviewer's note for a tool designed later this sprint. */
  const laterNote: ReactNode = later ? (
    <div className="tool-flow tool-flow--later">
      {header}
      <ToolUseCase tool={tool} noStart headingLevel={1} headingId={TOOL_TITLE_ID} planStep={record?.recommendation} />
      {record ? <LoopStatus record={record} /> : null}
      {artifactId && LIBRARY_SEED[artifactId] ? <p className="tool-flow__preview">{LIBRARY_SEED[artifactId].preview}</p> : null}
      <p className="tool-flow__later">{C.laterTool}</p>
    </div>
  ) : null;

  /** Concept 3: the draft as it would be from what she has said so far, and
   *  whether she has said anything yet. */
  const answered = asked.some((i) => valueOf(i.id).trim() && !i.value);
  const livePreview = (): string =>
    draftText(buildDraft(kind, Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)])), loop.today, read?.id, passage).slice(0, kind === "situation-brief" ? 2 : 1))
      .replace(/^[A-Z][^\n]*\n/, "");

  return {
    concept,
    kind,
    answered,
    livePreview,
    loop,
    tool,
    read,
    step,
    moment,
    passage,
    inputs,
    asked,
    rest,
    valueOf,
    setValue,
    write,
    writing,
    draft,
    version,
    record,
    edits,
    revising,
    later,
    laterNote,
    header,
    source,
    useCase,
    inputPanel,
    draftEditor,
    revision,
    versions,
    useBar,
    copy,
  };
}
