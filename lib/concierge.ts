/**
 * The Concierge's brain — Navigation Concept 1. Scripted: this prototype
 * talks to no AI.
 *
 * Two steps, both pure:
 *
 * - `understand` turns what the reviewer typed into an action, by keywords.
 *   Anything it can't place becomes a `miss`, of one of five kinds, each with
 *   its own reply (see `classifyMiss`).
 * - `respond` turns an action into the advisor's next turn, plus the change
 *   to make, if any: going somewhere, or a real move on the Loop (answering
 *   a follow-up, marking something used, taking up the next step). The
 *   concept applies the change, so what he does shows up everywhere.
 *
 * Everything he says is in `mock/concierge.ts`.
 */

import {
  ARTIFACT_KINDS,
  FOLLOW_UP_POLICY,
  OUTCOME_OPTIONS,
  OUTCOME_READBACK,
} from "@/mock/loop";
import { CONCIERGE_COPY as C } from "@/mock/concierge";
import { CARD_QUESTIONS, STEP_ANSWERS, STEP_QUESTIONS, stepById, type StepQuestion } from "@/mock/plan";
import { signalById } from "@/mock/plan-stub";
import {
  addDays,
  aheadPhrase,
  followUpQuestion,
  outcomeSummary,
  statusLabel,
  whenPhrase,
  type LoopRecord,
  type OutcomeType,
} from "@/lib/loop";
import type { NavDestination } from "@/lib/manifest";
import type { Recommendation, Snapshot } from "@/mock/snapshots";

/** What the Concierge needs to know: the live Loop and where things are. */
export interface ConciergeContext {
  snapshot: Snapshot;
  followUp: LoopRecord | undefined;
  nextStep: Recommendation | undefined;
  destinations: NavDestination[];
  /** The next step offered once a record's outcome is logged. */
  nextStepAfter: (record: LoopRecord) => Recommendation;
}

export type ConciergeAction =
  | { kind: "go"; flow: string }
  | { kind: "ask-follow-up" }
  | { kind: "answer"; recordId: string; outcome: OutcomeType; detail?: string }
  | { kind: "which-used" }
  | { kind: "check-back"; recordId: string }
  | { kind: "mark-used"; recordId: string; days: number | null }
  | { kind: "take-next"; recordId: string }
  | { kind: "set-aside"; recordId: string }
  | { kind: "prep" }
  | { kind: "opening" }
  | { kind: "recall"; recordId?: string }
  | { kind: "next" }
  | { kind: "scope" }
  | { kind: "politics" }
  /** A question about one of her next steps, asked from the Plan. */
  | { kind: "step-question"; stepId: string; q: StepQuestion; mine?: { effort?: string; done?: string } }
  /** Input he can't act on. `again` is true when the one before it was a
   *  miss too, so he stops offering the same menu. */
  | { kind: "miss"; miss: MissKind; again: boolean };

/** The kinds of input he can't act on. */
export type MissKind = "unclear" | "off-topic" | "beyond" | "crisis" | "work";

export interface ConciergeReply {
  label: string;
  action: ConciergeAction;
}

/** One turn from the advisor. */
export interface AdvisorTurn {
  paragraphs: string[];
  list?: string[];
  after?: string[];
  card?: { title: string; body: string };
  replies?: ConciergeReply[];
  /** Set when this turn answered input he couldn't act on, so a second miss
   *  in a row is noticed. */
  miss?: MissKind;
  /** He has just asked what came of the follow-up, so the next free-text
   *  message is read as the answer. */
  asked?: "follow-up";
}

/** What to change when the turn is shown. */
export type ConciergeEffect =
  | { kind: "go"; href: string }
  | { kind: "answer"; recordId: string; outcome: OutcomeType; detail?: string }
  | { kind: "mark-used"; recordId: string; days: number | null }
  | { kind: "take-next"; recordId: string }
  | { kind: "set-aside"; recordId: string };

/* -----------------------------------------------------------------------------
   UNDERSTANDING
   -------------------------------------------------------------------------- */

const PLACES: Record<string, string> = {
  home: "homepage",
  homepage: "homepage",
  plan: "plan",
  signals: "signals",
  "signal picture": "signals",
  momentum: "signals",
  toolbox: "toolbox",
  briefing: "daily-briefing",
  "daily briefing": "daily-briefing",
  profile: "profile",
  account: "profile",
  settings: "profile",
};

const STOPWORDS = new Set(["your", "with", "from", "that", "this", "the", "for", "and", "what", "about", "lead"]);

const isOpen = (r: LoopRecord) => r.state === "drafted" || r.state === "in-progress" || r.state === "ready";

/** The words a record answers to: from its title and its in-sentence name. */
function wordsOf(record: LoopRecord): string[] {
  return `${record.title} ${record.name}`
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
}

function recordMentioned(text: string, records: LoopRecord[]): LoopRecord | undefined {
  return records.find((r) => wordsOf(r).some((w) => text.includes(w)));
}

function classify(t: string): OutcomeType | null {
  if (/nothing yet|not yet|haven.?t heard|no reply|no response|no news/.test(t)) return "no-response-yet";
  if (/no longer|not relevant|doesn.?t matter|dropped/.test(t)) return "no-longer-relevant";
  if (/not the way|didn.?t go|badly|poorly|went wrong|not well|disappoint|turned down|said no/.test(t)) return "negative";
  if (/in between|mixed|so-so|okay|\bok\b|fine|not sure/.test(t)) return "neutral";
  if (/well|good|great|asked me|offered|agreed|yes|positive|went ahead/.test(t)) return "positive";
  return null;
}

/**
 * Input he can't act on, sorted into five kinds. Someone in danger or trouble
 * is caught before anything else, so "my boss is harassing me" is never read
 * as a question about managers.
 */
const CRISIS = /\b(suicid\w*|kill myself|end it all|want to die|self.?harm|hurt(ing)? myself|hurt me|not safe|in danger|being abused|abuse[sd]?|panic attack|can.?t cope|can.?t go on|no reason to live)\b/;
const WORK_TROUBLE = /\b(harass\w*|discriminat\w*|bull(y|ied|ying)|retaliat\w*|hostile|assault\w*|sexist|racist|lawsuit|lawyer|attorney|sue (them|my|the)|wrongful\w*|hr complaint|whistleblow\w*)\b/;
const BEYOND = /\b(r[eé]sum[eé]|cv|cover letter|linkedin (post|profile|headline|summary|message)|salary|negotiat\w*|interview|job (search|offer|posting|board)|find me a job|apply (to|for)|recruiters?|referral|reference letter|book|schedule|calendar|send (an? )?(email|message)|email (him|her|them|my)|remind me)\b/;
const OFF_TOPIC = /\b(weather|joke|poem|recipe|sports?|scores?|news|stocks?|crypto|bitcoin|movies?|music|song|translate|calculate|capital of|who (is|was) (the )?(president|prime)|tell me about (yourself|you)|are you (an? )?(ai|robot|human|real)|your name)\b/;

export function classifyMiss(t: string, recentMisses: number): ConciergeAction {
  if (CRISIS.test(t)) return { kind: "miss", miss: "crisis", again: false };
  if (WORK_TROUBLE.test(t)) return { kind: "miss", miss: "work", again: false };
  // A muddle twice in a row, and he stops offering the same list. A request he
  // can name (off topic, or beyond him) always gets its own plain answer: the
  // person has been understood, so "I'm not catching it" would be wrong.
  if (BEYOND.test(t)) return { kind: "miss", miss: "beyond", again: false };
  if (OFF_TOPIC.test(t)) return { kind: "miss", miss: "off-topic", again: false };
  return { kind: "miss", miss: "unclear", again: recentMisses >= 1 };
}

export function understand(
  raw: string,
  ctx: ConciergeContext,
  asked?: "follow-up",
  /** How many of his last turns, in a row, were misses. */
  recentMisses = 0
): ConciergeAction {
  const t = raw.toLowerCase().trim().replace(/[.!?]+$/, "");
  const { records } = ctx.snapshot;

  // Someone in danger or in trouble at work is never read as anything else.
  if (CRISIS.test(t) || WORK_TROUBLE.test(t)) return classifyMiss(t, recentMisses);

  const place = t.match(/^(?:go(?: to)?|open|take me to|show me)?\s*(?:my\s+|the\s+)?(home(?:page)?|plan|signals|signal picture|momentum|toolbox|(?:daily )?briefing|profile|account|settings)$/);
  if (place) return { kind: "go", flow: PLACES[place[1]] };

  const followUp = ctx.followUp;
  if (followUp) {
    const aboutIt =
      asked === "follow-up" ||
      wordsOf(followUp).some((w) => t.includes(w)) ||
      /\b(it went|went well|nothing yet|not yet|asked me|offered me|they said|she said|he said)\b/.test(t);
    const outcome = aboutIt ? classify(t) : null;
    if (outcome) {
      // A chip's own words say nothing beyond the outcome; anything longer
      // is the user's account of what happened, kept in their words.
      const chip = OUTCOME_OPTIONS.some((o) => o.label.toLowerCase() === t);
      return { kind: "answer", recordId: followUp.id, outcome, detail: chip ? undefined : raw.trim() };
    }
  }

  if (/\b(used|sent|shared|gave|presented|published|posted|took)\b/.test(t)) {
    const open = records.filter(isOpen);
    const named = recordMentioned(t, open);
    if (named) return { kind: "check-back", recordId: named.id };
    if (open.length === 1) return { kind: "check-back", recordId: open[0].id };
    return { kind: "which-used" };
  }
  if (followUp && /\b(tell you|log|answer)\b/.test(t) && !classify(t)) return { kind: "ask-follow-up" };
  if (/\b(opening|what should i say|how do i start)\b/.test(t)) return { kind: "opening" };
  if (/\b(prep|prepare|get ready|ready for|finish|help me with)\b/.test(t)) return { kind: "prep" };
  if (/\b(what came|what happened|remind me|how did|what have i|so far)\b/.test(t)) {
    return { kind: "recall", recordId: recordMentioned(t, records)?.id };
  }
  if (/\b(what.?s next|next step|next on|what should i do|what now)\b/.test(t)) return { kind: "next" };
  if (/\b(scope|promot|bigger role|ask for more|raise|title|remit)/.test(t)) return { kind: "scope" };
  if (/\b(manager|boss|stakeholder|difficult|politic|influence|peers?)\b/.test(t)) return { kind: "politics" };
  // He asked how it went and could not tell: ask again, with the answers.
  if (asked === "follow-up" && followUp) return { kind: "ask-follow-up" };
  return classifyMiss(t, recentMisses);
}

/* -----------------------------------------------------------------------------
   RESPONDING
   -------------------------------------------------------------------------- */

const byId = (ctx: ConciergeContext, id: string) => ctx.snapshot.records.find((r) => r.id === id);

function hrefFor(ctx: ConciergeContext, flow: string): string | undefined {
  return ctx.destinations.find((d) => d.flowSlug === flow)?.href;
}

/** What he suggests when the panel opens, by what is going on. */
export function suggestions(ctx: ConciergeContext): ConciergeReply[] {
  const s: ConciergeReply[] = [];
  if (ctx.followUp) s.push({ label: C.suggest.followUp(ctx.followUp.name), action: { kind: "ask-follow-up" } });
  const open = ctx.snapshot.records.find((r) => r.state === "drafted" || r.state === "in-progress");
  if (open) s.push({ label: C.suggest.prep(open.name), action: { kind: "prep" } });
  s.push({ label: C.suggest.next, action: { kind: "next" } });
  s.push({ label: C.suggest.scope, action: { kind: "scope" } });
  s.push({ label: C.suggest.recall, action: { kind: "recall" } });
  return s.slice(0, 4);
}

export function respond(
  action: ConciergeAction,
  ctx: ConciergeContext
): { turn: AdvisorTurn; effect?: ConciergeEffect } {
  const { today, records } = ctx.snapshot;

  switch (action.kind) {
    case "go": {
      const href = hrefFor(ctx, action.flow);
      return {
        turn: { paragraphs: [C.going(C.places[action.flow] ?? action.flow)] },
        effect: href ? { kind: "go", href } : undefined,
      };
    }

    case "ask-follow-up": {
      const r = ctx.followUp;
      if (!r) {
        if (!ctx.nextStep) return { turn: { paragraphs: [C.nothingDue] } };
        const next = respond({ kind: "next" }, ctx).turn;
        return { turn: { ...next, paragraphs: [C.nothingDue, ...next.paragraphs] } };
      }
      return {
        turn: {
          paragraphs: [followUpQuestion(r, today), C.orOwnWords],
          replies: OUTCOME_OPTIONS.map((o) => ({
            label: o.label,
            action: { kind: "answer", recordId: r.id, outcome: o.type },
          })),
          asked: "follow-up",
        },
      };
    }

    case "answer": {
      const r = byId(ctx, action.recordId);
      if (!r) return respond({ kind: "miss", miss: "unclear", again: false }, ctx);
      const effect: ConciergeEffect = { kind: "answer", recordId: r.id, outcome: action.outcome, detail: action.detail };
      if (action.outcome === "no-response-yet") {
        const count = r.nothingYet + 1;
        const gaps = FOLLOW_UP_POLICY.rescheduleDays;
        const next = addDays(today, gaps[Math.min(count, gaps.length) - 1]);
        const later = count >= FOLLOW_UP_POLICY.maxNothingYet ? C.stopAsking : C.askAgain(aheadPhrase(next, today));
        return { turn: { paragraphs: [C.nothingYet, later] }, effect };
      }
      if (action.outcome === "no-longer-relevant") return { turn: { paragraphs: [C.noLongerRelevant] }, effect };
      const said = action.detail ? C.logged(action.detail) : C.loggedPlain(OUTCOME_READBACK[action.outcome]);
      if (action.outcome === "negative") {
        return {
          turn: {
            paragraphs: [said, C.notAVerdict],
            replies: [
              { label: C.talkItThrough, action: { kind: "politics" } },
              { label: C.whatsNext, action: { kind: "next" } },
            ],
          },
          effect,
        };
      }
      const step = ctx.nextStepAfter(r);
      return {
        turn: {
          paragraphs: [said],
          card: { title: C.nextStepCard(step.title), body: step.why },
          replies: [
            { label: C.takeIt, action: { kind: "take-next", recordId: r.id } },
            { label: C.notNow, action: { kind: "set-aside", recordId: r.id } },
          ],
        },
        effect,
      };
    }

    case "which-used": {
      const open = records.filter(isOpen);
      if (!open.length) return { turn: { paragraphs: [C.nothingToMark] } };
      return {
        turn: {
          paragraphs: [C.whichOne],
          replies: open.map((r) => ({ label: r.title, action: { kind: "check-back", recordId: r.id } })),
        },
      };
    }

    case "check-back": {
      const r = byId(ctx, action.recordId);
      if (!r) return respond({ kind: "miss", miss: "unclear", again: false }, ctx);
      const kind = ARTIFACT_KINDS[r.kind];
      const replies: ConciergeReply[] = [
        { label: C.inDays(kind.checkBackDays), action: { kind: "mark-used", recordId: r.id, days: kind.checkBackDays } },
      ];
      if (kind.checkBackDays !== 7) replies.push({ label: C.inAWeek, action: { kind: "mark-used", recordId: r.id, days: 7 } });
      replies.push({ label: C.dontCheck, action: { kind: "mark-used", recordId: r.id, days: null } });
      return { turn: { paragraphs: [C.checkBackAsk(kind.usedVerb, r.name)], replies } };
    }

    case "mark-used": {
      const r = byId(ctx, action.recordId);
      if (!r) return respond({ kind: "miss", miss: "unclear", again: false }, ctx);
      const label = ARTIFACT_KINDS[r.kind].usedLabel;
      const text =
        action.days === null
          ? C.markedNoCheck(label)
          : C.marked(label, aheadPhrase(addDays(today, action.days), today));
      return { turn: { paragraphs: [text] }, effect: { kind: "mark-used", recordId: r.id, days: action.days } };
    }

    case "take-next":
      return {
        turn: { paragraphs: [C.takenOn], replies: [{ label: C.goHome, action: { kind: "go", flow: "homepage" } }] },
        effect: { kind: "take-next", recordId: action.recordId },
      };

    case "set-aside":
      return { turn: { paragraphs: [C.setAside] }, effect: { kind: "set-aside", recordId: action.recordId } };

    case "prep": {
      const open = records.find((r) => r.state === "drafted" || r.state === "in-progress") ?? records.find(isOpen);
      if (!open) return respond({ kind: "next" }, ctx);
      return {
        turn: {
          paragraphs: [C.prep(open.name)],
          card: { title: open.title, body: statusLabel(open) },
          replies: [
            { label: C.openIt, action: { kind: "go", flow: "toolbox" } },
            // The written opening is for a conversation with a manager, so it
            // is offered only for the drafts that lead into one.
            ...(open.kind === "situation-brief" || open.kind === "pitch"
              ? [{ label: C.helpOpening, action: { kind: "opening" } as ConciergeAction }]
              : []),
          ],
        },
      };
    }

    case "opening":
      return {
        turn: {
          paragraphs: [...C.opening],
          replies: [{ label: C.openIt, action: { kind: "go", flow: "toolbox" } }],
        },
      };

    case "recall": {
      const target = action.recordId ? byId(ctx, action.recordId) : undefined;
      if (target) {
        const summary = outcomeSummary(target);
        if (summary) return { turn: { paragraphs: [summary] } };
        if (target.usedOn) {
          const verb = ARTIFACT_KINDS[target.kind].usedVerb;
          const sentence = `You ${verb} ${target.name} ${whenPhrase(target.usedOn, today)}.`;
          const canAnswer = ctx.followUp?.id === target.id;
          return {
            turn: {
              paragraphs: [C.recallWaiting(sentence)],
              replies: canAnswer ? [{ label: C.tellYouNow, action: { kind: "ask-follow-up" } }] : undefined,
            },
          };
        }
        return { turn: { paragraphs: [`${target.title}: ${statusLabel(target)}.`] } };
      }
      const used = records.filter((r) => r.usedOn);
      if (!used.length) return { turn: { paragraphs: [C.recallNone] } };
      const outcomes = used.filter((r) => r.outcome);
      const words = ["none", "one", "two", "three", "four", "five", "six", "seven", "eight"];
      const lines = outcomes.map((r) => outcomeSummary(r)).filter((x): x is string => Boolean(x));
      return {
        turn: {
          paragraphs: [
            C.recallAll(
              `${words[used.length] ?? used.length} thing${used.length === 1 ? "" : "s"}`,
              outcomes.length === 0 ? "none of them yet" : `${words[outcomes.length] ?? outcomes.length}`
            ),
          ],
          list: lines.length ? lines : undefined,
          replies: ctx.followUp ? [{ label: C.tellYouNow, action: { kind: "ask-follow-up" } }] : undefined,
        },
      };
    }

    case "next": {
      const step = ctx.nextStep;
      if (!step) return { turn: { paragraphs: [C.nothingDue] } };
      return {
        turn: {
          paragraphs: [C.next(step.title, step.why)],
          replies: [
            { label: C.openPlan, action: { kind: "go", flow: "plan" } },
            { label: C.goHome, action: { kind: "go", flow: "homepage" } },
          ],
        },
      };
    }

    case "scope":
      return {
        turn: {
          paragraphs: [C.scope.lead],
          list: [...C.scope.list],
          after: [C.scope.after],
          replies: [
            { label: C.talkItThrough, action: { kind: "politics" } },
            { label: C.whatsNext, action: { kind: "next" } },
          ],
        },
      };

    case "politics":
      return { turn: { paragraphs: [...C.politics] } };

    case "step-question": {
      const step = stepById(action.stepId);
      if (!step) return respond({ kind: "miss", miss: "unclear", again: false }, ctx);
      const card = CARD_QUESTIONS.some((q) => q.id === action.q);
      const effort = action.mine?.effort ?? step.effortText;
      const done = action.mine?.done ?? step.done;
      // Concept 1's card questions: one fact each, her own estimate and done where she set them.
      const cardAnswer: Partial<Record<StepQuestion, string>> = {
        this: step.whyThis,
        now: step.whyNow,
        me: step.whyYou,
        moves: STEP_ANSWERS.moves(signalById(step.area ?? "")?.name),
        long: STEP_ANSWERS.long(effort),
        done: STEP_ANSWERS.done(done),
      };
      const paragraphs = card
        ? [cardAnswer[action.q] ?? ""]
        : action.q === "why"
          ? STEP_ANSWERS.why(step, signalById(step.area ?? "")?.name)
          : action.q === "take"
            ? STEP_ANSWERS.take(step)
            : action.q === "stuck"
              ? [STEP_ANSWERS.stuck]
              : action.q === "big"
                ? [STEP_ANSWERS.big]
                : action.q === "begin"
                  ? [STEP_ANSWERS.begin(step.outcome)]
                  : [STEP_ANSWERS.else(step.title)];
      const stuck: ConciergeReply[] = [
        { label: "It feels too big", action: { kind: "step-question", stepId: action.stepId, q: "big" } },
        { label: "I don’t know where to start", action: { kind: "step-question", stepId: action.stepId, q: "begin" } },
        ...STEP_QUESTIONS.filter((q) => q.id === "why" || q.id === "take").map((q) => ({
          label: q.label,
          action: { kind: "step-question", stepId: action.stepId, q: q.id } as ConciergeAction,
        })),
      ];
      return {
        turn: {
          paragraphs,
          replies:
            action.q === "stuck"
              ? stuck
              : card
                ? [
                    // The other card questions, so she can keep asking.
                    ...CARD_QUESTIONS.filter((q) => q.id !== action.q).map((q) => ({
                      label: q.label,
                      action: { kind: "step-question", stepId: action.stepId, q: q.id, mine: action.mine } as ConciergeAction,
                    })),
                    { label: C.openPlan, action: { kind: "go", flow: "plan" } },
                  ]
                : [
            ...STEP_QUESTIONS.filter((q) => q.id !== action.q && q.id !== "else").map((q) => ({
              label: q.label,
              action: { kind: "step-question", stepId: action.stepId, q: q.id } as ConciergeAction,
            })),
            { label: C.openPlan, action: { kind: "go", flow: "plan" } },
          ],
        },
      };
    }

    case "miss": {
      const m = C.miss;
      const home: ConciergeReply = { label: C.goHome, action: { kind: "go", flow: "homepage" } };
      // Someone in danger or in trouble at work gets care, not a menu, and the
      // turn is not counted as a miss. Nothing here changes the Loop.
      if (action.miss === "crisis") return { turn: { paragraphs: [...m.crisis], replies: [home] } };
      if (action.miss === "work") return { turn: { paragraphs: [...m.work], replies: [home] } };
      // A second miss in a row: he stops offering the same list.
      if (action.again) {
        return {
          turn: {
            paragraphs: [m.again.lead, m.again.ask],
            replies: [{ label: C.suggest.next, action: { kind: "next" } }, home],
            miss: action.miss,
          },
        };
      }
      const copy = action.miss === "off-topic" ? m.offTopic : action.miss === "beyond" ? m.beyond : m.unclear;
      return {
        turn: { paragraphs: [copy.lead, copy.ask], replies: suggestions(ctx).slice(0, 3), miss: action.miss },
      };
    }

    default:
      return respond({ kind: "miss", miss: "unclear", again: false }, ctx);
  }
}
