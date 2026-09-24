"use client";

import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { AdvisorFile, type AdvisorFileItem } from "@/components/onboarding/AdvisorFile";
import { DirectionField } from "@/components/onboarding/DirectionField";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { Notice } from "@/components/onboarding/Notice";
import { PointList } from "@/components/onboarding/PointList";
import { RecommendationCard } from "@/components/onboarding/RecommendationCard";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import { SignalSources } from "@/components/onboarding/SignalSources";
import { Button } from "@/components/primitives/Button";
import {
  useDictation,
  useOnboardingFlow,
  type OnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  DIRECTION_PROMPTS_C1,
  GUIDE_C3,
  SIGNALS_C1,
  checkEmail,
  earlyReasonFor,
  isValidInviteCode,
  recommendPlan,
} from "@/mock/onboarding";

/**
 * Concept 3 — the guided onboarding.
 *
 * Rebuilt on 2026-09-24 from the living canvas. It keeps Concepts 1 and 2's
 * steps and logic, and explains as it goes: what ExecHQ is and how it is
 * built, why each thing is asked, what a plan is and how each part helps. It
 * is paged, like Concept 1, and differs from it on purpose:
 *
 *  - It recommends as soon as it hears where the user wants to go, then tests
 *    that recommendation with every question after, rather than asking first
 *    and recommending at the end.
 *  - It carries a file of what it has learned on every page, so "it
 *    remembers" is shown rather than claimed.
 *  - It reads like an advisor's briefing: progress in words, a margin note on
 *    every page saying why it is there, and reflections set as pull quotes.
 *  - It stops to make the user reflect, with questions that are not needed
 *    for the plan but are worth sitting with.
 *
 * Signals come early, straight after the privacy promise, by decision on
 * 2026-09-24: connecting LinkedIn or a website first means the first draft
 * already sounds like the user. The promise comes first because it is the
 * first time the user is asked for their data.
 *
 * Pages are this concept's own; each maps to the shared step it belongs to,
 * so a step-bar jump fills in everything before it the same way it does in
 * the other two concepts.
 */
type PageId =
  | "welcome"
  | "about"
  | "account"
  | "privacy"
  | "signals"
  | "direction"
  | "rec"
  | "reflect-time"
  | "stage-end";

interface Page {
  id: PageId;
  /** The step bar's name for it. */
  label: string;
  /** Which of the four parts it sits in. Omitted: outside them (the cover). */
  part?: number;
  /** The shared step it belongs to, for jumps and for the flow's own state. */
  step: OnboardingStep;
}

const PAGES: Page[] = [
  { id: "welcome", label: "Welcome", step: "account" },
  { id: "about", label: "What ExecHQ is", part: 0, step: "account" },
  { id: "account", label: "Account", part: 0, step: "account" },
  { id: "privacy", label: "Privacy", part: 0, step: "privacy" },
  { id: "signals", label: "Signals", part: 0, step: "direction" },
  { id: "direction", label: "Direction", part: 1, step: "direction" },
  { id: "rec", label: "Recommendation", part: 1, step: "refinement" },
  { id: "reflect-time", label: "Reflection", part: 1, step: "refinement" },
  { id: "stage-end", label: "Next", step: "refinement" },
];
/** Where a page sits, handed to every page. */
type Frame = Pick<
  ComponentProps<typeof GuidePage>,
  "part" | "position" | "partIndex" | "partCount" | "file" | "headingId"
>;

const STEP_NAV = PAGES.map((page) => ({ id: page.id, label: page.label }));
const pageIndex = (id: PageId) => PAGES.findIndex((page) => page.id === id);

/** Pages whose answers live only in this concept, cleared when a jump lands
 *  on or before them. */
const REFLECTION_PAGES: Partial<Record<PageId, string>> = { "reflect-time": "time" };

export function OnboardingConcept3() {
  const flow = useOnboardingFlow();
  const { state, dispatch } = flow;
  const a = state.answers;
  const headingId = useId();

  const [pageId, setPageId] = useState<PageId>("welcome");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [fileOpen, setFileOpen] = useState(false);
  const at = pageIndex(pageId);
  const page = PAGES[at];

  /** Moves on, keeping the shared flow's step in step with the page. */
  function goTo(id: PageId) {
    const next = PAGES[pageIndex(id)];
    if (next.step !== state.step) dispatch({ type: "go-to", step: next.step });
    setPageId(id);
    setFileOpen(false);
  }
  const next = () => goTo(PAGES[Math.min(at + 1, PAGES.length - 1)].id);

  useStepNav(STEP_NAV, pageId, (id) => {
    const target = PAGES[pageIndex(id as PageId)];
    flow.jumpTo(target.step);
    // What only this concept asks is cleared from the target onward.
    setReflections((all) =>
      Object.fromEntries(
        Object.entries(all).filter(([key]) => {
          const owner = (Object.keys(REFLECTION_PAGES) as PageId[]).find((p) => REFLECTION_PAGES[p] === key);
          return owner ? pageIndex(owner) < pageIndex(target.id) : true;
        })
      )
    );
    setPageId(target.id);
    setFileOpen(false);
  });

  // Focus moves to the new page's heading, never on first paint.
  const previous = useRef(pageId);
  useEffect(() => {
    if (previous.current === pageId) return;
    previous.current = pageId;
    document.getElementById(headingId)?.focus();
  }, [pageId, headingId]);

  /* ---- The file: what ExecHQ knows so far. Each line appears once the
     answer behind it exists, in the order it was learned. */
  const direction = a.direction ?? "";
  const plan = direction ? recommendPlan(direction) : null;
  const connected = SIGNALS_C1.sources
    .filter((source) => a.connections[source.id] === "connected" || a.signalLinks[source.id])
    .map((source) => source.title);
  const items: AdvisorFileItem[] = [];
  if (connected.length) items.push({ label: "Signals", value: connected.join(", ") });
  if (direction) items.push({ label: "Where you’re going", value: direction });
  if (plan && at > pageIndex("rec")) items.push({ label: "Starting point", value: plan.name });
  if (reflections.time) items.push({ label: GUIDE_C3.reflect.time.label, value: reflections.time });
  const file = (
    <AdvisorFile
      label={GUIDE_C3.file.label}
      items={items}
      newest={items[items.length - 1]?.label}
      newestLabel={GUIDE_C3.file.added}
      open={fileOpen}
      onToggle={() => setFileOpen((open) => !open)}
    />
  );

  /** Where the page sits, in words. */
  function frame(): Frame {
    if (page.part === undefined) return { headingId };
    const inPart = PAGES.filter((p) => p.part === page.part);
    return {
      part: GUIDE_C3.parts[page.part],
      position: `${inPart.indexOf(page) + 1} of ${inPart.length}`,
      partIndex: page.part,
      partCount: GUIDE_C3.parts.length,
      file,
      headingId,
    };
  }

  switch (pageId) {
    case "welcome":
      return (
        <GuidePage
          cover
          headingId={headingId}
          title={GUIDE_C3.welcome.title}
          lede={GUIDE_C3.welcome.lede}
          primaryLabel={GUIDE_C3.welcome.cta}
          onPrimary={next}
        >
          <p className="guide__quote">{GUIDE_C3.welcome.quote}</p>
        </GuidePage>
      );

    case "about": {
      const c = GUIDE_C3.about;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <PointList items={c.points} numbered />
          <PointList items={c.built} label={c.builtLabel} />
        </GuidePage>
      );
    }

    case "account":
      return <AccountPage flow={flow} frame={frame()} onDone={next} />;

    case "privacy": {
      const c = GUIDE_C3.privacy;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <PointList items={c.points} />
        </GuidePage>
      );
    }

    case "signals": {
      const c = GUIDE_C3.signals;
      const anyOn = connected.length > 0;
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={c.title}
          lede={c.lede}
          why={c.why}
          primaryLabel={anyOn ? c.done : c.skip}
          onPrimary={next}
        >
          <SignalSources
            connections={a.connections}
            signalLinks={a.signalLinks}
            onConnect={(id) => dispatch({ type: "set-connection", id, state: "connected" })}
            onAddLink={(id, link) => {
              dispatch({ type: "set-signal-link", id, link });
              dispatch({ type: "set-connection", id, state: "connected" });
            }}
            onDisconnect={(id) => {
              dispatch({ type: "set-signal-link", id, link: null });
              dispatch({ type: "set-connection", id, state: "declined" });
            }}
          />
        </GuidePage>
      );
    }

    case "direction":
      return <DirectionPage flow={flow} frame={frame()} onDone={next} />;

    case "rec": {
      const c = GUIDE_C3.rec;
      if (!plan) return null;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <RecommendationCard
            lead={c.lead}
            name={plan.name}
            formalName={plan.formalName}
            reason={earlyReasonFor(direction, plan)}
          />
          <p className="guide__next">{c.next}</p>
        </GuidePage>
      );
    }

    case "reflect-time": {
      const c = GUIDE_C3.reflect.time;
      const picked = reflections.time;
      const index = c.options.findIndex((option) => option === picked);
      return (
        <GuidePage
          {...frame()}
          kicker={GUIDE_C3.reflect.kicker}
          title={c.title}
          lede={c.lede}
          why={c.why}
          primaryLabel={GUIDE_C3.reflect.cta}
          primaryDisabled={!picked}
          onPrimary={next}
        >
          <ChipGroup
            label={GUIDE_C3.reflect.answerLabel}
            options={c.options}
            value={picked ? [picked] : []}
            onChange={(value) => setReflections((all) => ({ ...all, time: value[0] ?? "" }))}
          />
          {/* The reply lands where the answer was given, and is announced. */}
          <div aria-live="polite">
            {picked ? (
              <ReflectionReply
                from={GUIDE_C3.from}
                text={c.replies[index]}
                fact={{ ...c.fact, placeholder: true }}
              />
            ) : null}
          </div>
        </GuidePage>
      );
    }

    case "stage-end":
      return (
        <GuidePage headingId={headingId} title={GUIDE_C3.stageEnd.title} lede={GUIDE_C3.stageEnd.lede}>
          <div className="guide__file-end">{file}</div>
        </GuidePage>
      );
  }
}

/**
 * The account: email, and an invite code for those who have one. Same rules
 * as Concept 1: any address, and a code only changes who pays.
 */
interface PageProps {
  flow: OnboardingFlow;
  frame: Frame;
  onDone: () => void;
}

function AccountPage({ flow, frame, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.account;
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  const [showCode, setShowCode] = useState(Boolean(state.answers.inviteCode));
  const [codeError, setCodeError] = useState(false);
  const [verdict, setVerdict] = useState<ReturnType<typeof checkEmail> | null>(null);
  const codeId = useId();

  function submit() {
    const codeOk = !showCode || !code.trim() || isValidInviteCode(code);
    const check = checkEmail(email);
    setCodeError(!codeOk);
    setVerdict(check === "ok" ? null : check);
    if (!codeOk || check !== "ok") return;
    dispatch({ type: "set-invite-code", code: showCode ? code.trim() || null : null });
    dispatch({ type: "set-email", email: email.trim() });
    onDone();
  }

  return (
    <GuidePage {...frame} kicker={c.kicker} title={c.title} lede={c.lede} why={c.why} primaryLabel={c.cta} onPrimary={submit}>
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={email}
        error={
          verdict === "empty"
            ? "We need an email address to create the account."
            : verdict === "malformed"
              ? "That does not look like an email address."
              : undefined
        }
        onChange={(event) => {
          setEmail(event.target.value);
          setVerdict(null);
        }}
      />
      <div className="guide__invite">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={showCode}
          aria-controls={codeId}
          onClick={() => {
            setShowCode((open) => !open);
            setCodeError(false);
          }}
        >
          {showCode ? c.inviteHide : c.inviteShow}
        </Button>
      </div>
      <div id={codeId} hidden={!showCode}>
        <Input
          label="Invite code"
          autoComplete="off"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setCodeError(false);
          }}
        />
      </div>
      {codeError ? (
        <Notice tone="explain" title="We do not recognise that code" live>
          Check it against the invitation you were sent. You can also continue without one — a code
          only changes who pays, never what you get.
        </Notice>
      ) : null}
    </GuidePage>
  );
}

/** Where the user wants to go: typed, spoken, or started from a prompt. */
function DirectionPage({ flow, frame, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.direction;
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(
    DIRECTION_PROMPTS_C1.find((p) => p.text === state.answers.direction)?.id ?? null
  );
  const [error, setError] = useState<string | undefined>();
  const dictation = useDictation(value, (text) => {
    setValue(text);
    setSelected(null);
    setError(undefined);
  });

  function submit() {
    dictation.stop();
    if (!value.trim()) {
      setError("Tell me roughly where you want to go. A few words is enough.");
      return;
    }
    dispatch({ type: "set-direction", direction: value.trim(), source: selected ? "prompted" : "free" });
    onDone();
  }

  return (
    <GuidePage {...frame} kicker={c.kicker} title={c.title} lede={c.lede} why={c.why} primaryLabel={c.cta} onPrimary={submit}>
      <DirectionField
        label={c.title}
        labelHidden
        value={value}
        onChange={(text) => {
          dictation.stop();
          setValue(text);
          setSelected(null);
          if (text.trim()) setError(undefined);
        }}
        prompted={DIRECTION_PROMPTS_C1}
        promptedLabel={c.promptedLabel}
        selectedPromptId={selected}
        onSelectPrompt={(prompt) => {
          dictation.stop();
          setValue(prompt.text);
          setSelected(prompt.id);
          setError(undefined);
        }}
        focusOnSelect
        voice={{ listening: dictation.listening, onToggle: dictation.toggle }}
        error={error}
      />
    </GuidePage>
  );
}

export default OnboardingConcept3;
