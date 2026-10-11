"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Icon } from "@/components/primitives/Icon";
import { DraftEditor } from "@/components/toolbox/DraftEditor";
import { DraftUseBar } from "@/components/toolbox/DraftUseBar";
import { InputPanel } from "@/components/toolbox/InputPanel";
import { RevisionControls, type RevisionChoice } from "@/components/toolbox/RevisionControls/RevisionControls";
import { ToolUseCase } from "@/components/toolbox/ToolUseCase";
import { VersionHistory } from "@/components/toolbox/VersionHistory";
import { createRecord, shortDate } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { draftText, firstDraft, revise, revisionLabel } from "@/lib/toolbox-draft";
import { toolboxActions, useToolbox, type DraftState } from "@/lib/toolbox-store";
import { TODAYS_READS } from "@/mock/briefing";
import type { ArtifactKind } from "@/mock/loop";
import { stepById } from "@/mock/plan";
import {
  DRAFT_COPY,
  FLOW_COPY as C,
  LIBRARY_SEED,
  REVISION_COPY,
  TL_INPUTS_DIRECT,
  TL_INPUTS_FROM_BRIEFING,
  TL_TOPIC_FROM_STEP,
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

/**
 * Everything the three Toolbox flows share for Thought Leadership Builder:
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

  /** A tool other than Thought Leadership Builder, or one of her artifacts
   *  made before the Toolbox existed: designed once a concept is chosen. */
  const later = kind !== "thought-leadership" || (artifactId !== undefined && !draft) || (reuseId !== undefined && !toolbox.drafts[reuseId]);

  const inputs: readonly ToolInput[] = (read ? TL_INPUTS_FROM_BRIEFING : TL_INPUTS_DIRECT).map((input) =>
    input.id === "topic" && (step || moment)
      ? { ...input, value: step ? (TL_TOPIC_FROM_STEP[step.id] ?? step.title) : moment, source: step ? "plan" : undefined }
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
      const id = `post-${Date.now().toString(36)}`;
      const sections = firstDraft(
        { format: valueOf("format"), topic: valueOf("topic"), pov: valueOf("pov"), example: valueOf("example"), audience: valueOf("audience"), cta: valueOf("cta") },
        read?.id,
        passage
      );
      const about = read ? read.title : valueOf("topic") || tool.name;
      loopActions.create(createRecord({ id, kind, title: C.postTitle(about), name: C.postName, on: loop.today, recommendation: step?.title }));
      toolboxActions.saveDraft(id, {
        meta: {
          area: step?.area ?? "seen-as-leader",
          planStepId: step?.id,
          readId: read?.id,
          versions: 1,
          preview: draftText(sections.slice(0, 1)).split("\n")[0],
        },
        versions: [{ n: 1, when: stamp(loop.today), what: DRAFT_COPY.label(1), sections }],
        showing: 1,
        edits: {},
        answers: {},
        inputs: Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)])),
        passage,
      });
      setWriting(false);
      router.replace(`${conceptHref("toolbox-flow", concept)}?artifact=${id}`);
      focusSoon(DRAFT_LABEL_ID);
    }, 900);
  }

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

  const source: ReactNode = read ? <SourceLabel read={read} passage={passage} size={draft ? "compact" : "full"} /> : null;

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
      enricher={options.enricher}
      noHeading
    />
  );

  const draftEditor: ReactNode =
    draft && version && artifactId ? (
      <DraftEditor
        key={`${artifactId}-${version.n}`}
        id={DRAFT_LABEL_ID}
        label={DRAFT_COPY.label(version.n)}
        intro={version.n === 1 ? DRAFT_COPY.intro : undefined}
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
          touch();
        }}
        onAnswer={(question, answer) => {
          toolboxActions.answer(artifactId, question, answer);
          touch();
        }}
      />
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

  const useBar = (options: { noStatus?: boolean } = {}): ReactNode =>
    record ? (
      <DraftUseBar
        kind={record.kind}
        ready={record.state !== "drafted" && record.state !== "in-progress"}
        onCopy={copy}
        onMarkReady={() => loopActions.markReady(record.id)}
        onMarkUsed={record.state === "ready" ? () => loopActions.markUsed(record.id) : undefined}
        noStatus={options.noStatus}
      />
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

  return {
    concept,
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
