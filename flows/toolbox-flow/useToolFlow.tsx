"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { StepNavItem } from "@/lib/step-nav";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { EnricherCard } from "@/components/toolbox/EnricherCard";
import { OutletCard } from "@/components/toolbox/OutletCard";
import { List, type ListItemData } from "@/components/layout/List";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import { respondHref } from "@/lib/briefing-store";
import { fullName } from "@/mock/account";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { CheckIn } from "@/components/loop/CheckIn";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Icon } from "@/components/primitives/Icon";
import { DraftEditor } from "@/components/toolbox/DraftEditor";
import { DraftUseBar } from "@/components/toolbox/DraftUseBar";
import { DropdownMenu } from "@/components/form/DropdownMenu";
import { Sheet } from "@/components/layout/Sheet";
import { recordedItems } from "@/lib/signal-picture";
import { InputPanel } from "@/components/toolbox/InputPanel";
import { RevisionControls, type RevisionChoice } from "@/components/toolbox/RevisionControls/RevisionControls";
import { ToolUseCase } from "@/components/toolbox/ToolUseCase";
import { VersionHistory } from "@/components/toolbox/VersionHistory";
import { addDays, aheadPhrase, createRecord, daysBetween, datePhrase, outcomeReadback, shortDate, type LoopRecord } from "@/lib/loop";
import { currentSnapshot, getLoopState, loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { briefDraft, draftText, firstDraft, pitchDraft, positioningDraft, revise, revisionLabel, statementOnly } from "@/lib/toolbox-draft";
import { toolboxActions, toolboxPageFor, useToolbox, type DraftState } from "@/lib/toolbox-store";
import { TODAYS_READS } from "@/mock/briefing";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, type ArtifactKind } from "@/mock/loop";
import { HOME_COPY } from "@/mock/homepage";
import { stepById } from "@/mock/plan";
import { OutcomeNext } from "@/components/loop/OutcomeNext";
import { stepServed, useNextAfter } from "@/lib/use-next-after";
import type { OutcomeType } from "@/lib/loop";
import {
  BRIEF_INPUTS,
  DRAFT_COPY,
  EMPHASIS_BY_KIND,
  EXAMPLE_ANSWERS,
  INPUT_COPY,
  FLOW_COPY as C,
  LIBRARY_COPY,
  LIBRARY_SEED,
  PITCH_INPUTS,
  POSITIONING_COPY,
  POSITIONING_INPUTS,
  SEED_INPUTS,
  WINS_INPUT,
  ENRICHERS,
  STEP_BAR_COPY,
  STEP_LABELS,
  STEP_PREFILLS,
  NEXT_STEP_COPY,
  TOOL_COPY,
  GOES_WITH,
  USE_CASE_COPY,
  REVISION_COPY,
  REVISION_OPTIONS,
  USE_COPY,
  TL_INPUTS_DIRECT,
  TL_INPUTS_FROM_BRIEFING,
  TOOLS,
  VERSION_COPY,
  outletFor,
  pitchTypeOf,
  type DraftSection,
  type DraftSegment,
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
function buildDraft(kind: ArtifactKind, v: Record<string, string>, today: string, readId?: string, passage?: string, name = "", nextStep?: string) {
  if (kind === "positioning") return positioningDraft(v, name, nextStep);
  if (kind === "pitch") return pitchDraft(v);
  if (kind === "situation-brief") return briefDraft(v, whenWords(v.date, today));
  return firstDraft(
    { format: v.format, topic: v.topic, pov: v.pov, example: v.example, audience: v.audience, cta: v.cta, evidence: v.evidence, voice: v.voice, length: v.length },
    readId,
    passage,
    nextStep
  );
}

/** A new artifact's id: its kind and when it was made. Only ever called from
 *  an event (writing the draft), never while rendering. */
function newArtifactId(kind: ArtifactKind): string {
  return `${kind === "thought-leadership" ? "post" : kind}-${Date.now().toString(36)}`;
}

/** Its title in the library. */
function titleFor(kind: ArtifactKind, v: Record<string, string>, about: string): { title: string; name: string } {
  if (kind === "pitch") return { title: TOOL_COPY.pitchTitle(v.target || v.angle || "a stage"), name: TOOL_COPY.pitchName };
  if (kind === "situation-brief") return { title: TOOL_COPY.briefTitle(v.type || "your next meeting"), name: TOOL_COPY.briefName };
  return { title: C.postTitle(about), name: C.postName };
}

/** Where a draft stands, for the step bar: the stage its Loop state is in. */
export type DraftStage = "draft" | "ready" | "used";

export function stageOf(record: LoopRecord | undefined): DraftStage {
  if (!record || record.state === "drafted" || record.state === "in-progress") return "draft";
  return record.state === "ready" ? "ready" : "used";
}

/** The step bar's steps for one of her questions. */
export function questionStep(kind: ArtifactKind, input: ToolInput): StepNavItem {
  return { id: `q-${input.id}`, label: STEP_LABELS[kind][input.id] ?? input.label };
}

/** The step bar's steps once there is a draft: the draft, changing it, its
 *  versions (where a concept shows them apart), and the Loop's next two
 *  stages, named as the kind names them ("Sent" for a pitch). */
export function draftSteps(kind: ArtifactKind, withVersions: boolean): StepNavItem[] {
  return [
    { id: "draft", label: STEP_BAR_COPY.draft },
    { id: "revise", label: STEP_BAR_COPY.revise },
    ...(withVersions ? [{ id: "versions", label: STEP_BAR_COPY.versions }] : []),
    { id: "ready", label: STEP_BAR_COPY.ready },
    { id: "used", label: ARTIFACT_KINDS[kind].usedLabel },
  ];
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
  /** Started from earlier work, from what came next after it (13 Oct): a
   *  brief from a pitch that went well. */
  const afterId = params.get("after") ?? undefined;
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
  /** Her statement as it stands: built out, or as onboarding left it. */
  const statementNow =
    (positioningRecord && (toolbox.drafts[positioningRecord.id]?.inputs.statement || LIBRARY_SEED[positioningRecord.id]?.preview)) || account.direction;
  const pitchInputs: readonly ToolInput[] = PITCH_INPUTS.map((input) => {
    const known: Record<string, string | undefined> = { role: account.jobTitle, statement: statementNow };
    return input.id in known ? (known[input.id] ? { ...input, value: known[input.id] } : { ...input, source: undefined, optional: true }) : input;
  });
  const briefInputs: readonly ToolInput[] = BRIEF_INPUTS.map((input) =>
    input.id === "statement" ? (statementNow ? { ...input, value: statementNow } : { ...input, source: undefined, optional: true }) : input
  );
  const baseInputs: readonly ToolInput[] =
    kind === "positioning" ? positioningInputs : kind === "pitch" ? pitchInputs : kind === "situation-brief" ? briefInputs : read ? TL_INPUTS_FROM_BRIEFING : TL_INPUTS_DIRECT;
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
  // Earlier work it starts from: a pitch's show or event becomes who a brief
  // prepares for; a post's topic becomes a pitch's angle.
  const earlier = afterId ? loop.records.find((r) => r.id === afterId) : undefined;
  const earlierInputs = afterId ? toolbox.drafts[afterId]?.inputs : undefined;
  const fromEarlier: Record<string, string> =
    earlier && earlierInputs
      ? kind === "situation-brief"
        ? { type: "Something else", ...(earlierInputs.target ? { audience: earlierInputs.target } : {}) }
        : kind === "pitch"
          ? { angle: earlierInputs.topic ?? "" }
          : {}
      : {};
  const inputs: readonly ToolInput[] = baseInputs.map((input) =>
    fromStep[input.id]
      ? { ...input, value: fromStep[input.id], source: input.kind === "choice" ? undefined : ("plan" as const) }
      : fromMoment[input.id]
        ? { ...input, value: fromMoment[input.id] }
        : fromEarlier[input.id]
          ? { ...input, value: fromEarlier[input.id] }
          : input
  );
  const [values, setValues] = useState<Record<string, string>>({});
  // A new start (another tool, plan step, read or earlier work) begins with
  // nothing typed: moving between builders keeps this hook, not her answers.
  const startKey = artifactId ? "" : `${kind}|${stepId ?? ""}|${readId ?? ""}|${afterId ?? ""}|${moment ?? ""}`;
  const [lastStart, setLastStart] = useState(startKey);
  if (startKey && startKey !== lastStart) {
    setLastStart(startKey);
    setValues({});
  }
  const valueOf = (id: string) => values[id] ?? inputs.find((i) => i.id === id)?.value ?? "";
  const setValue = (id: string, value: string) => setValues((v) => ({ ...v, [id]: value }));
  /** What only she can answer, one a screen in Concepts 1 and 3; what
   *  ExecHQ already knows, and anything optional, go on one last screen. */
  const asked = inputs.filter((i) => !(i.source && i.kind !== "choice") && !i.optional);
  const rest = inputs.filter((i) => !asked.includes(i));
  /** The tool's first question, which the use case screen asks beside its
   *  button (option C), so Concepts 1 and 2 do not ask it again. */
  const firstChoice = inputs.find((i) => i.kind === "choice");
  const notFirst = (list: readonly ToolInput[]) => list.filter((i) => i !== firstChoice);
  const [writing, setWriting] = useState(false);

  /** Her plan's next step, for a recommended next use: the step she came
   *  from, or the first on her plan. */
  const nextStepTitle = step?.title ?? loop.recommendations[0]?.title;
  /** The five revision options, with this builder's own emphasis choices. */
  const revisionOptions = REVISION_OPTIONS
    // The PRD names a pitch's revisions as tone, specificity and length (plus
    // its emphasis): no audience, and voice is called tone.
    .filter((option) => !(kind === "pitch" && option.id === "audience"))
    .map((option) =>
      option.id === "emphasis" ? { ...option, choices: EMPHASIS_BY_KIND[kind] } : kind === "pitch" && option.id === "voice" ? { ...option, label: "Tone" } : option
    );

  const currentValues = () => Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)]));

  /** Drafts this session wrote, so the step bar can take one back. */
  const written = useRef(new Set<string>());

  /** The first draft from these answers, at once. Returns its id. */
  function writeWith(v: Record<string, string>): string | undefined {
    // A post names only the step it came from; her statement can serve
    // whatever is next on her plan.
    const sections = buildDraft(kind, v, loop.today, read?.id, passage, fullName(account), kind === "thought-leadership" ? step?.title : nextStepTitle);
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
      return artifactId;
    }
    const id = newArtifactId(kind);
    const about = read ? read.title : v.topic || tool.name;
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
    written.current.add(id);
    router.replace(`${conceptHref("toolbox-flow", concept)}?artifact=${id}`);
    return id;
  }

  /** Her inputs changed after the draft (Concept 2's Built from, 13 Oct): a
   *  new version written from them, so nothing she had is lost. */
  function rewriteWith(v: Record<string, string>) {
    if (!artifactId || !draft) return;
    setRevising(true);
    window.setTimeout(() => {
      const sections = buildDraft(kind, v, loop.today, read?.id, passage, fullName(account), kind === "thought-leadership" ? step?.title : nextStepTitle);
      toolboxActions.addVersion(artifactId, { when: stamp(loop.today), what: C.inputsChanged, sections });
      for (const [id, value] of Object.entries(v)) if (draft.inputs[id] !== value) toolboxActions.setInput(artifactId, id, value);
      touch();
      setRevising(false);
      focusSoon(DRAFT_LABEL_ID);
    }, 900);
  }

  function write() {
    setWriting(true);
    window.setTimeout(() => {
      writeWith(currentValues());
      setWriting(false);
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

  const backHref = conceptHref("toolbox", toolboxPageFor(concept));
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

  const origin: ReactNode = read ? (
    <SourceLabel read={read} passage={passage} size={draft ? "compact" : "full"} />
  ) : earlier && !draft ? (
    <div className="tool-flow__carried">
      <span className="tool-flow__carried-label">{NEXT_STEP_COPY.startedFrom(earlier.name)}</span>
      <p className="tool-flow__carried-text">{earlier.title}</p>
    </div>
  ) : buildingOut ? (
    <div className="tool-flow__carried">
      <span className="tool-flow__carried-label">{POSITIONING_COPY.fromOnboarding}</span>
      <p className="tool-flow__carried-text">{valueOf("statement")}</p>
    </div>
  ) : null;
  // The plan step a draft serves stays on it, as it does in the library.
  const servesStep = draft ? (record?.recommendation ?? (draft.meta.planStepId ? stepById(draft.meta.planStepId)?.title : undefined)) : undefined;
  const source: ReactNode =
    origin || servesStep ? (
      <>
        {origin}
        {servesStep ? <p className="tool-flow__for">{LIBRARY_COPY.forStep(servesStep)}</p> : null}
      </>
    ) : null;

  /** What this work goes with: at most two pieces she already has, each with
   *  one action. Her statement nearly always, since every tool draws on it. */
  const goesWith = (): ReactNode => {
    const flowHref = conceptHref("toolbox-flow", concept);
    const rows: ListItemData[] = [];
    const statement = loop.records.find((r) => r.kind === "positioning");
    const recordRow = (r: LoopRecord, note: string, action: string, href: string): ListItemData => ({
      id: r.id,
      primary: r.title,
      secondary: (
        <>
          <LoopStatus record={r} detail={false} className="library__status" /> {note}
        </>
      ),
      leading: { type: "icon", name: TOOL_ICONS[r.kind] },
      trailing: {
        actions: (
          <Link href={href} className="btn btn--secondary btn--sm">
            {action}
            <span className="u-visually-hidden"> {r.title}</span>
          </Link>
        ),
      },
    });
    if (kind === "positioning") {
      loop.records
        .filter((r) => r.kind !== "positioning" && r.state !== "closed")
        .slice(0, 2)
        .forEach((r) => rows.push(recordRow(r, GOES_WITH.usesStatement, GOES_WITH.open, `${flowHref}?artifact=${r.id}`)));
    } else {
      if (statement) rows.push(recordRow(statement, GOES_WITH.drawsOn[kind], GOES_WITH.open, `${flowHref}?artifact=${statement.id}`));
      if (kind === "pitch") {
        const last = loop.records.find((r) => r.kind === "pitch");
        if (last) rows.push(recordRow(last, GOES_WITH.lastPitch, GOES_WITH.reuse, `${flowHref}?reuse=${last.id}`));
      } else if (kind === "situation-brief") {
        // Not the statement again: it is already the first row.
        const waiting = loop.records.find((r) => r.state === "waiting" && r.kind !== "situation-brief" && r.id !== statement?.id);
        if (waiting) rows.push(recordRow(waiting, GOES_WITH.waiting, GOES_WITH.open, `${flowHref}?artifact=${waiting.id}`));
      } else if (kind === "thought-leadership" && !read) {
        const lead = TODAYS_READS[0];
        rows.unshift({
          id: lead.id,
          primary: lead.title,
          secondary: `${GOES_WITH.todaysReadStatus} · ${GOES_WITH.todaysRead}`,
          leading: { type: "icon", name: "briefing" },
          trailing: {
            actions: (
              <Link href={respondHref(lead.id, undefined, concept)} className="btn btn--secondary btn--sm">
                {GOES_WITH.startFrom}
                <span className="u-visually-hidden"> {lead.title}</span>
              </Link>
            ),
          },
        });
      }
    }
    // One row per artifact, however the rules above overlap.
    const shown = rows.filter((row, i) => rows.findIndex((r) => r.id === row.id) === i).slice(0, 2);
    return shown.length ? <List items={shown} label={USE_CASE_COPY.goesWith} dividers="full" /> : null;
  };

  /** Whether her plan step chose the first answer, and it still stands. */
  const choiceFromPlan = Boolean(firstChoice && fromStep[firstChoice.id] && valueOf(firstChoice.id) === fromStep[firstChoice.id]);

  const useCase = (options: { onStart?: () => void; noStart?: boolean; choiceStarts?: boolean; noGoesWith?: boolean; noPicture?: boolean; brief?: boolean; noChoice?: boolean } = {}): ReactNode => (
    <ToolUseCase
      tool={tool}
      planStep={step?.title}
      source={source}
      choice={
        firstChoice && !options.noChoice
          ? {
              label: firstChoice.label,
              options: firstChoice.options ?? [],
              value: valueOf(firstChoice.id),
              onChange: (value) => setValue(firstChoice.id, value),
              note: choiceFromPlan ? USE_CASE_COPY.fromPlan : undefined,
              fromPlan: fromStep[firstChoice.id] ?? fromEarlier[firstChoice.id],
              fromLabel: !fromStep[firstChoice.id] && fromEarlier[firstChoice.id] && earlier ? NEXT_STEP_COPY.fromEarlier(earlier.name) : undefined,
            }
          : undefined
      }
      startLabel={firstChoice && valueOf(firstChoice.id) ? USE_CASE_COPY.startWith(kind, valueOf(firstChoice.id)) : undefined}
      onStart={options.onStart}
      noStart={options.noStart ?? !options.onStart}
      choiceStarts={options.choiceStarts}
      noPicture={options.noPicture}
      brief={options.brief}
      goesWith={options.noGoesWith ? undefined : goesWith()}
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

  const inputPanel = (
    subset?: readonly ToolInput[],
    options: {
      submitLabel?: string;
      hideNote?: boolean;
      onSubmit?: () => void;
      enricher?: ReactNode;
      collapseOptional?: boolean;
      compact?: boolean;
      builtWith?: boolean;
      footer?: ReactNode;
      actionsClassName?: string;
    } = {}
  ): ReactNode => (
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
      collapseOptional={options.collapseOptional}
      compact={options.compact}
      builtWith={options.builtWith}
      footer={options.footer}
      actionsClassName={options.actionsClassName}
      noHeading
    />
  );

  /** Each output used on its own: copied, and the bios exported. */
  const [sectionMessage, setSectionMessage] = useState("");
  /** Delete asks first, in a sheet (the library's menu moved here, 14 Oct). */
  const [deleting, setDeleting] = useState(false);
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
              toolboxActions.addVersion(artifactId, { when: stamp(loop.today), what: POSITIONING_COPY.refresh.what, sections: buildDraft("positioning", v, loop.today, undefined, undefined, fullName(account), nextStepTitle) });
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

  /** It is ready or further on: Copy and downloads belong from here (Concept 1). */
  const isReady = Boolean(record && record.state !== "drafted" && record.state !== "in-progress");
  // A post is copied to LinkedIn; an article also downloads (Sprint 4's PDF
  // and Word for long-form articles).
  const exportable = record
    ? record.kind === "thought-leadership"
      ? Boolean(draft?.inputs.format && draft.inputs.format !== "LinkedIn post")
      : USE_COPY.exportable[record.kind]
    : false;

  /** The draft in one of its looks: `clean` (Concept 1) and `page`
   *  (Concept 2) once she has marked it ready, with `onReopen` going back
   *  to the working draft. */
  const draftAs = (look: "draft" | "clean" | "page" = "draft", onReopen?: () => void): ReactNode =>
    draft && version && artifactId ? (
      <>
        {refresh}
        <output className="u-visually-hidden">{sectionMessage}</output>
        {/* A pitch is for one place (Kate, 14 Oct): where it goes, above
            what it says. */}
        {kind === "pitch" && draft.inputs.target?.trim() ? (
          <OutletCard name={draft.inputs.target} type={pitchTypeOf(draft.inputs.type)} outlet={outletFor(draft.inputs.target)} today={loop.today} />
        ) : null}
        <DraftEditor
          key={`${artifactId}-${version.n}`}
          id={DRAFT_LABEL_ID}
          label={look === "draft" ? DRAFT_COPY.label(version.n) : (record?.title ?? DRAFT_COPY.label(version.n))}
          look={look}
          onReopen={onReopen}
          hideOpen={Boolean(record && record.state !== "ready")}
          intro={version.n === 1 || (kind === "positioning" && version.n === 2 && draft.versions.length === 2) ? DRAFT_COPY.introFor[kind] : undefined}
          sectionActions={kind === "positioning" ? sectionActions : undefined}
          sections={version.sections}
          edits={edits}
          answers={draft.answers}
          revising={revising ? REVISION_COPY.revising : undefined}
          header={
            <span className="tool-flow__draft-head">
              {record ? <LoopStatus record={record} /> : null}
              {/* The draft's actions, in its corner, on every concept. Once it
                  is ready, Copy and the downloads lead, so the bar holds only
                  "I've used this". Then what the library's row menu held
                  (Kate, 14 Oct): start a new draft from this one, close it,
                  delete it. */}
              {record ? (
                <DropdownMenu
                  label={USE_COPY.actions}
                  align="end"
                  entries={[
                    ...(isReady
                      ? [
                          {
                            type: "item" as const,
                            id: "copy",
                            icon: "copy" as const,
                            label: USE_COPY.copyFor[kind],
                            onSelect: () => {
                              copy();
                              setSectionMessage(USE_COPY.copied);
                            },
                          },
                          ...(exportable
                            ? (["PDF", "Word"] as const).map((format) => ({
                                type: "item" as const,
                                id: format,
                                icon: "download" as const,
                                label: format === "PDF" ? USE_COPY.exportPdf : USE_COPY.exportWord,
                                onSelect: () => setSectionMessage(USE_COPY.exported(format)),
                              }))
                            : []),
                          { type: "separator" as const, id: "use-sep" },
                        ]
                      : []),
                    {
                      type: "item" as const,
                      id: "reuse",
                      icon: "draft" as const,
                      label: LIBRARY_COPY.actions.reuse,
                      onSelect: () => router.push(`${conceptHref("toolbox-flow", concept)}?reuse=${encodeURIComponent(record.id)}`),
                    },
                    ...(record.state !== "closed"
                      ? [
                          {
                            type: "item" as const,
                            id: "close",
                            icon: "minus" as const,
                            label: LIBRARY_COPY.actions.close,
                            onSelect: () => {
                              loopActions.close(record.id);
                              setSectionMessage(LIBRARY_COPY.closed(record.title));
                            },
                          },
                        ]
                      : []),
                    {
                      type: "item" as const,
                      id: "delete",
                      icon: "trash" as const,
                      label: LIBRARY_COPY.actions.delete,
                      onSelect: () => setDeleting(true),
                    },
                  ]}
                />
              ) : null}
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
        {record ? (
          <Sheet open={deleting} onClose={() => setDeleting(false)} label={LIBRARY_COPY.deleteConfirm.heading(record.title)} className="toolbox-sheet">
            <div className="artifact-actions artifact-actions--confirm">
              <h2 className="artifact-actions__heading">{LIBRARY_COPY.deleteConfirm.heading(record.title)}</h2>
              <p className="artifact-actions__body">{LIBRARY_COPY.deleteConfirm.body(recordedItems([record]).length)}</p>
              <div className="artifact-actions__buttons">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    loopActions.remove(record.id);
                    toolboxActions.remove(record.id);
                    setDeleting(false);
                    router.push(backHref);
                  }}
                >
                  {LIBRARY_COPY.deleteConfirm.confirm}
                </Button>
                <Button variant="secondary" fullWidth onClick={() => setDeleting(false)}>
                  {LIBRARY_COPY.deleteConfirm.keep}
                </Button>
              </div>
            </div>
          </Sheet>
        ) : null}
      </>
    ) : null;
  const draftEditor = draftAs();

  /** `onAsked` runs once she asks for a revision: Concept 1 closes its sheet. */
  const revision = (onAsked?: () => void): ReactNode =>
    draft ? (
      <RevisionControls
        onRevise={(choice, followUp) => {
          doRevise(choice, followUp);
          onAsked?.();
        }}
        revising={revising}
        options={revisionOptions}
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
      navigator.clipboard?.writeText(draftText(version.sections, edits, draft.answers)).catch(() => undefined);
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

  const useBar = (options: { noStatus?: boolean; exportInMenu?: boolean; noNotes?: boolean; copyInMenu?: boolean; className?: string } = {}): ReactNode =>
    record ? (
      <>
        <DraftUseBar
          kind={record.kind}
          ready={record.state !== "drafted" && record.state !== "in-progress"}
          onCopy={copy}
          onExport={() => undefined}
          exportable={exportable}
          onMarkReady={() => loopActions.markReady(record.id, checkBack(loop.today) ? { checkBackDays: checkBack(loop.today) } : undefined)}
          onMarkUsed={
            record.state === "ready" && !sending
              ? () => (record.kind === "pitch" ? setSending(true) : loopActions.markUsed(record.id, checkBack(loop.today) ? { checkBackDays: checkBack(loop.today) } : undefined))
              : undefined
          }
          noStatus={options.noStatus}
          exportInMenu={options.exportInMenu}
          noNotes={options.noNotes}
          copyInMenu={options.copyInMenu}
          className={options.className}
          note={
            record.kind === "situation-brief"
              ? [TOOL_COPY.onePage, briefDate ? TOOL_COPY.askAfter(aheadPhrase(addDays(briefDate, 1), loop.today)) : ""].filter(Boolean).join(" ")
              : undefined
          }
        />
        {sentForm}
      </>
    ) : null;

  /* --- The step bar ------------------------------------------------------
     Review scaffolding, as in onboarding: a reviewer jumps to any step. Every
     step before it is answered (hers, or an example); every step from it on
     starts again; a jump past the draft writes one. The product has no way
     to skip ahead. */

  const example = (id: string) => EXAMPLE_ANSWERS[kind]?.[id] ?? "";

  /** Her answers with `fill` answered and `clear` back to how it starts. */
  const valuesFor = (fill: readonly ToolInput[], clear: readonly ToolInput[]): Record<string, string> => {
    const next: Record<string, string> = { ...values };
    for (const input of fill) if (!valueOf(input.id).trim()) next[input.id] = example(input.id);
    for (const input of clear) delete next[input.id];
    return next;
  };

  /** Back before the draft: one written here is taken away; her statement
   *  goes back to the statement; one from her library stays, and a new
   *  draft of the same tool starts. */
  function undoDraft() {
    if (!artifactId) return;
    if (record?.kind === "positioning") {
      toolboxActions.remove(artifactId);
      return;
    }
    if (written.current.has(artifactId)) {
      loopActions.remove(artifactId);
      toolboxActions.remove(artifactId);
      written.current.delete(artifactId);
    }
    const keep = new URLSearchParams(params.toString());
    keep.delete("artifact");
    keep.set("tool", kind);
    router.replace(`${conceptHref("toolbox-flow", concept)}?${keep.toString()}`);
  }

  /** To a step before the draft. */
  function jumpBefore(fill: readonly ToolInput[], clear: readonly ToolInput[]) {
    setValues(valuesFor(fill, clear));
    undoDraft();
  }

  /** The Loop record at this stage: taken back to a draft if it is past it,
   *  then marked ready, then used, as the stage needs. */
  function restage(id: string, stage: DraftStage) {
    const r = currentSnapshot(getLoopState()).records.find((x) => x.id === id);
    if (!r) return;
    const rank: Record<DraftStage, number> = { draft: 0, ready: 1, used: 2 };
    const want = rank[stage];
    let now = rank[stageOf(r)];
    // Past "used" (an outcome logged, or closed) goes back too, so the Used
    // step opens on the question again.
    const pastUsed = stage === "used" && r.state !== "used" && r.state !== "waiting";
    if (now > want || pastUsed) {
      loopActions.remove(id);
      loopActions.create(createRecord({ id, kind: r.kind, title: r.title, name: r.name, on: r.createdOn, recommendation: r.recommendation }));
      now = 0;
    }
    const days = checkBack(loop.today);
    if (want >= 1 && now < 1) loopActions.markReady(id, days ? { checkBackDays: days } : undefined);
    if (want >= 2 && now < 2) {
      const channel = r.kind === "pitch" ? (draft?.inputs.target || example("target")) : undefined;
      loopActions.markUsed(id, { ...(channel ? { channel } : {}), ...(days ? { checkBackDays: days } : {}) });
    }
  }

  /** To the draft or past it: written from her answers and examples if
   *  there isn't one yet. */
  function jumpAfter(stage: DraftStage) {
    setAnsweredHere(false);
    setAfter(null);
    let id = artifactId && draft ? artifactId : undefined;
    if (!id) {
      // Every question with an example, optional ones too, so the draft and
      // its title read as a finished one would.
      const v = valuesFor(inputs, []);
      setValues(v);
      id = writeWith(Object.fromEntries(inputs.map((i) => [i.id, v[i.id] ?? i.value ?? ""])));
    }
    setSending(false);
    if (id) restage(id, stage);
  }

  /** What came of it, asked in the builder itself once she has used it, so
   *  she can answer before ExecHQ checks back (the PRD's "Mark used and
   *  report outcome"). The Loop's own check-in, as Home uses it. */
  const [answeredHere, setAnsweredHere] = useState(false);
  const outcomeHeading = "tool-outcome-heading";
  const outcomeSaid =
    record && answeredHere
      ? !record.outcome || record.outcome.type === "no-response-yet"
        ? HOME_COPY.askAgain(record.name, aheadPhrase(record.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]), loop.today))
        : record.outcome.detail
          ? HOME_COPY.loggedDetail(record.outcome.detail)
          : HOME_COPY.loggedPlain(outcomeReadback(record.outcome.type, record.kind))
      : undefined;
  /* After she says how it went (13 Oct): her one tap is all the feedback.
     ExecHQ asks nothing more and always gives the next step, by the rules
     Home and the advisor share (lib/next-after.ts). A note is hers to add. */
  const [after, setAfter] = useState<{ type: OutcomeType; folded?: boolean } | null>(null);
  const servedStepId = step?.id ?? stepServed(record);
  const next = useNextAfter(record && after ? { record, type: after.type } : undefined, { servedStepId, flowConcept: concept });
  const outcomeNext: ReactNode =
    record && after && next ? (
      <OutcomeNext
        readback={next.readback}
        offers={next.offers}
        note={next.note}
        onNote={after.type === "no-longer-relevant" && record.kind !== "positioning" ? undefined : (text) => loopActions.noteOutcome(record.id, text)}
        noted={record.outcome?.detail}
        onNotNow={() => setAfter({ ...after, folded: true })}
        folded={after.folded}
        headingId="outcome-next"
        className="tool-flow__outcome"
      />
    ) : null;

  const outcome: ReactNode = outcomeNext ? outcomeNext :
    record && (record.state === "used" || record.state === "waiting" || (answeredHere && record.state === "outcome")) ? (
      <CheckIn
        record={record}
        today={loop.today}
        about={record.recommendation}
        layout="question"
        answered={answeredHere}
        readback={outcomeSaid}
        headingId={outcomeHeading}
        onAnswer={(type) => {
          loopActions.answer(record.id, { type });
          setAnsweredHere(true);
          setAfter({ type });
          focusSoon("outcome-next");
        }}
        onNote={(detail) => loopActions.noteOutcome(record.id, detail)}
        className="tool-flow__outcome"
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

  /** Concept 3: the draft as it would be from what she has said so far, and
   *  whether she has said anything yet. */
  const answered = asked.some((i) => valueOf(i.id).trim() && !i.value);
  /** How many of her questions she has answered (Concept 3's card waits for two). */
  const answeredCount = asked.filter((i) => valueOf(i.id).trim() && !i.value).length;
  const liveSections = () => buildDraft(kind, Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)])), loop.today, read?.id, passage);
  /** Concept 3: the draft so far as plain text, her words and ExecHQ's, the
   *  questions still open left out, for the collapsed card. */
  const liveSoFar = (): string =>
    liveSections()
      .filter((section) => !section.list)
      .slice(0, kind === "situation-brief" ? 2 : 1)
      .map((section) => section.segments.map((seg) => ("question" in seg ? "" : seg.text)).join("").trim())
      .filter(Boolean)
      .join(" ");
  const livePreview = (): string =>
    draftText(buildDraft(kind, Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)])), loop.today, read?.id, passage).slice(0, kind === "situation-brief" ? 2 : 1))
      .replace(/^[A-Z][^\n]*\n/, "");

  /** Draft text with her words, ExecHQ's wording and the questions for her
   *  marked as the full draft marks them (a guardrail: user-provided evidence
   *  is never mistaken for generated framing). A section she rewrote is all
   *  hers. */
  const marked = (sections: readonly DraftSection[], sectionEdits: Record<string, string> = {}): ReactNode =>
    sections
      .filter((section) => !section.list)
      .slice(0, kind === "situation-brief" ? 2 : 1)
      .flatMap((section): DraftSegment[] => (sectionEdits[section.id] ? [{ text: sectionEdits[section.id], by: "you" }] : [...section.segments]))
      .map((seg, i) =>
        "question" in seg ? (
          <span key={i} className="draft-editor__question">
            <span className="u-visually-hidden">{DRAFT_COPY.questionLabel} </span>
            {seg.question}{" "}
          </span>
        ) : (
          <span key={i} className={seg.by === "you" ? "draft-editor__you" : "draft-editor__exechq"}>
            {seg.by === "exechq" ? <span className="u-visually-hidden">ExecHQ: </span> : null}
            {seg.text}
          </span>
        )
      );
  /** Concept 3: the draft as it fills in, marked. */
  const liveDraft = (): ReactNode => marked(buildDraft(kind, Object.fromEntries(inputs.map((i) => [i.id, valueOf(i.id)])), loop.today, read?.id, passage));
  /** Concept 3: the written draft's opening, marked, for its collapsed card. */
  const draftPreview = (): ReactNode => (version ? marked(version.sections, edits) : null);

  return {
    concept,
    kind,
    answered,
    answeredCount,
    liveSoFar,
    livePreview,
    liveDraft,
    draftPreview,
    loop,
    tool,
    read,
    step,
    moment,
    passage,
    inputs,
    asked,
    rest,
    firstChoice,
    notFirst,
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
    draftAs,
    rewriteWith,
    isReady,
    revision,
    versions,
    useBar,
    outcome,
    copy,
    stage: stageOf(record),
    jumpBefore,
    jumpAfter,
  };
}
