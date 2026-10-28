/**
 * The Playbook's words: the four tools, what each asks for, and Maya's drafts.
 *
 * Source: the Sprint 4 experience brief, "Shared Toolbox workflow" and each
 * tool's section, as amended on 11 October 2026. Rules this file keeps:
 *
 * - One shared workflow, four tools: use case, inputs, first draft, revise,
 *   copy or export, mark ready or used. The tools differ in content only.
 * - A use case is one sentence on what the tool makes and one on when to use
 *   it. No feature tours.
 * - Inputs ask only for what this artifact needs. Anything ExecHQ already
 *   knows arrives pre-filled and editable, with where it came from, and is
 *   never asked again.
 * - Enrichers are offered, never required: the draft never waits for one.
 * - Every output is a draft until she marks it ready. ExecHQ's wording is told
 *   apart from her own, and anything only she knows is a question, never an
 *   invented number or name.
 * - Nothing says ExecHQ posts or sends: "Copy to post on LinkedIn", never
 *   "Post to LinkedIn".
 */

import type { OutcomeType } from "@/lib/loop";
import { ARTIFACT_KINDS, type ArtifactKind } from "@/mock/loop";

/* -----------------------------------------------------------------------------
   THE FOUR TOOLS
   -------------------------------------------------------------------------- */

export interface ToolUseCase {
  kind: ArtifactKind;
  name: string;
  /** One sentence: what it makes. */
  makes: string;
  /** A few words, for a tile: "Bios and your narrative". */
  short: string;
  /** The name in two words, under an icon where four share one row: each
   *  two words, so no one name runs much longer than the others (Kate, 13 Oct). */
  label: string;
  /** One sentence: when to use it. */
  when: string;
  /** What she will need, short. Things ExecHQ already has are said so. */
  needs: readonly string[];
  /** The action step it serves on Maya's plan, by id in `mock/plan.ts`. */
  planStepId?: string;
  /** The button that starts it. */
  start: string;
}

export const TOOLS: Record<ArtifactKind, ToolUseCase> = {
  positioning: {
    kind: "positioning",
    label: "Positioning statement",
    name: "Positioning Builder",
    makes: "Your positioning statement, a bio in three lengths and a leadership narrative, in your words.",
    short: "Your statement, bios and narrative",
    when: "Use it before anything that introduces you: a promotion conversation, a new boss, a conference program.",
    needs: ["Your statement from onboarding (ExecHQ has it)", "A few recent accomplishments, if you want them in"],
    planStepId: "bio",
    // Like the other three: she can start a new one for each use (Kate,
    // 28 Oct), so it starts one rather than building out the one.
    start: "Start a positioning statement",
  },
  pitch: {
    kind: "pitch",
    label: "Pitch builder",
    name: "Pitch Builder",
    makes: "A pitch to a conference, a podcast or an editor, with subject lines and the follow-up already drafted.",
    short: "Pitches for stages, shows and press",
    when: "Use it when there is a stage or a show the people above you pay attention to.",
    needs: ["Who you are pitching (ExecHQ can suggest some)", "One or two things you can prove"],
    planStepId: "pitch-podcast",
    start: "Start a pitch",
  },
  "situation-brief": {
    kind: "situation-brief",
    label: "Situation brief",
    name: "Situation Brief",
    makes: "A one-page brief for a moment that matters: what you want from it, what you will say, what they will ask.",
    short: "One page before a moment that matters",
    when: "Use it a day or two before a review, a board meeting, a negotiation or a hard conversation.",
    needs: ["What the moment is, and when", "What you want to come out of it"],
    planStepId: "brief-manager",
    start: "Start a brief",
  },
  "thought-leadership": {
    kind: "thought-leadership",
    label: "Thought leadership",
    name: "Thought Leadership Builder",
    makes: "A LinkedIn post or an article in your voice, from your own idea, a step on your plan or something you read.",
    short: "A post or article in your voice",
    when: "Use it when you have a view worth putting your name to.",
    needs: ["Your point of view, in a line", "One example from your own work"],
    planStepId: "linkedin-post",
    start: "Start a post",
  },
};

export const TOOL_ORDER: readonly ArtifactKind[] = ["positioning", "pitch", "situation-brief", "thought-leadership"];

/* -----------------------------------------------------------------------------
   INPUTS
   -------------------------------------------------------------------------- */

/** Where a pre-filled answer came from. Plain and the same everywhere. */
export type InputSource = "direction" | "plan" | "onboarding" | "briefing" | "profile" | "positioning";

export const SOURCE_LABELS: Record<InputSource, string> = {
  direction: "From your direction",
  plan: "From your plan",
  onboarding: "From onboarding",
  briefing: "From today’s Briefing",
  profile: "From your Profile",
  positioning: "From Positioning Builder",
};

export interface ToolInput {
  id: string;
  label: string;
  /** A line under the label, when the label alone is not enough. */
  hint?: string;
  kind: "text" | "long" | "choice" | "date";
  options?: readonly string[];
  /** A choice where she can pick several. The value holds them one a line. */
  many?: boolean;
  /** What ExecHQ already knows. Shown filled in and editable. */
  value?: string;
  /** Where `value` came from. */
  source?: InputSource;
  /** Not needed for a first draft. */
  optional?: boolean;
  placeholder?: string;
}

export interface Enricher {
  id: string;
  /** "Add three recent accomplishments". */
  title: string;
  /** Why it would help this draft, in one line. */
  why: string;
  /** The action step it is, when it is one (`add-wins`). */
  planStepId?: string;
  add: string;
  skip: string;
}

/** Thought Leadership Builder, opened from today's Briefing (the Maya
 *  journey's hand-off): the read arrives as the source, her direction and
 *  plan are known, and only her point of view and an example are asked. */
export const TL_INPUTS_FROM_BRIEFING: readonly ToolInput[] = [
  {
    id: "format",
    label: "What are you writing?",
    kind: "choice",
    options: ["LinkedIn post", "Short article", "Long-form article"],
    value: "LinkedIn post",
  },
  {
    id: "audience",
    label: "Who is it for?",
    kind: "text",
    value: "Marketing and commercial leaders, and the people who decide on scope",
    source: "direction",
  },
  {
    id: "pov",
    label: "What is your point of view?",
    hint: "One line is enough. Agree with the article, push back, or add what it leaves out.",
    kind: "long",
    placeholder: "The plan is where scope gets decided, so…",
  },
  {
    id: "example",
    label: "One example from your own work",
    hint: "Leave out names and numbers you can’t share.",
    kind: "long",
    value: "I’m leading our planning workstream this year, across marketing, sales and product.",
    source: "plan",
  },
  {
    id: "cta",
    label: "What should a reader do at the end?",
    kind: "text",
    optional: true,
    placeholder: "Ask a question, invite a reply, or nothing",
  },
  // The PRD's evidence, voice and length, each changing the draft (Kate, 13 Oct).
  {
    id: "evidence",
    label: "Any result or evidence to point to?",
    hint: "What changed because of it. Leave out numbers you can’t share.",
    kind: "long",
    optional: true,
  },
  { id: "voice", label: "How should it sound?", kind: "choice", optional: true, options: ["Plainer", "Warmer", "More direct"] },
  { id: "length", label: "How long?", kind: "choice", optional: true, options: ["Short", "Standard", "Long"] },
];

/** Thought Leadership Builder opened from the Playbook or a plan step: no
 *  read to respond to, so what it is about is asked, unless the step says. */
export const TL_INPUTS_DIRECT: readonly ToolInput[] = [
  TL_INPUTS_FROM_BRIEFING[0],
  {
    id: "topic",
    label: "What is it about?",
    hint: "A few words. ExecHQ shapes the rest with you.",
    kind: "text",
    placeholder: "What planning season taught me about scope",
  },
  TL_INPUTS_FROM_BRIEFING[2],
  TL_INPUTS_FROM_BRIEFING[3],
  TL_INPUTS_FROM_BRIEFING[1],
  TL_INPUTS_FROM_BRIEFING[4],
  TL_INPUTS_FROM_BRIEFING[5],
  TL_INPUTS_FROM_BRIEFING[6],
  TL_INPUTS_FROM_BRIEFING[7],
];

/** The plan step's own words, when Thought Leadership Builder opens from it. */
export const TL_TOPIC_FROM_STEP: Record<string, string> = {
  "linkedin-post": "What I lead, and where it is going",
};

/** A read's own opening for the post: why the article's point matters, in
 *  ExecHQ's framing. Read ids from `mock/briefing.ts`. */
export const READ_OPENINGS: Record<string, string> = {
  "planning-season": "Most new remits are handed out before anyone posts a role. They are decided in the plan.",
  "widen-a-remit": "When a marketing remit grows, the question changes from whether the work worked to whether people would follow you again.",
  "passed-over": "Being reliable can keep you exactly where you are.",
};

/** What Maya types in the hand-off, for a catalogue variant that is filled. */
export const TL_MAYA_ANSWERS: Record<string, string> = {
  pov: "The plan is where scope gets decided, so I would rather help write it than wait to see what it says.",
};

export const ENRICHERS: Record<string, Enricher> = {
  wins: {
    id: "wins",
    title: "Add three recent accomplishments",
    why: "Your post can point to something you delivered, instead of leaving a gap for it.",
    planStepId: "add-wins",
    add: "Add them",
    skip: "Not now",
  },
};

export const INPUT_COPY = {
  heading: "What this draft needs",
  known: "ExecHQ already has these. Change anything that isn’t right.",
  /** Concept 2's start: what ExecHQ has, as one line above the button. */
  builtWith: "Built with your",
  and: "and",
  /** What each thing ExecHQ already has is called in "Built with your …". */
  names: { audience: "audience", example: "example", role: "role", statement: "positioning statement", toward: "direction", bio: "short bio" } as Record<string, string>,
  /** Closes the fields Edit opened under "Built with". */
  doneEditing: "Done",
  asked: "Only you can answer these.",
  /** When everything left to ask is optional. */
  askedOptional: "Add this if you want to.",
  optional: "Optional",
  edit: "Edit",
  keep: "Keep this",
  missing: "Answer this to write the draft.",
  write: "Write my first draft",
  writing: "Writing your first draft…",
  /** Under the button, so the enricher never reads as a gate. */
  notNeeded: "You don’t need anything else to start.",
  /** Optional questions folded away until she asks for them (Concept 2). */
  moreDetail: (n: number) => `Add more detail (${n} optional)`,
  lessDetail: "Hide the optional questions",
} as const;

/* -----------------------------------------------------------------------------
   THE DRAFT
   A draft is sections; each section is segments. A segment is her words,
   ExecHQ's wording, or a question only she can answer. The editor shows the
   difference, so generated framing is never mistaken for what she said.
   -------------------------------------------------------------------------- */

/** `part` names the sentence a segment belongs to, where a revision can
 *  move whole sentences (a pitch's emphasis). */
export type DraftSegment =
  | { text: string; by: "you"; part?: string }
  | { text: string; by: "exechq"; part?: string }
  | { question: string; part?: string };

export interface DraftSection {
  id: string;
  /** "Post", "Other openings". Left out where the draft is one piece. */
  heading?: string;
  /** Alternatives rather than running text (other openings, subject lines):
   *  each segment is one item. */
  list?: boolean;
  segments: readonly DraftSegment[];
}

export interface DraftVersion {
  n: number;
  /** "Mon 12 Oct, 9:14". */
  when: string;
  /** What made it: "First draft", "Shorter, more direct", "Your edits". */
  what: string;
  sections: readonly DraftSection[];
}

const you = (text: string): DraftSegment => ({ text, by: "you" });
const ex = (text: string): DraftSegment => ({ text, by: "exechq" });
const ask = (question: string): DraftSegment => ({ question });

/** The Maya journey's post, started from today's first read. */
const POST_V1: DraftSection[] = [
  {
    id: "post",
    segments: [
      ex("Most new remits are handed out before anyone posts a role. They are decided in the plan. "),
      you("The plan is where scope gets decided, so I would rather help write it than wait to see what it says. "),
      you("I’m leading our planning workstream this year, across marketing, sales and product. "),
      ex("What I have seen so far: "),
      ask("What has the workstream changed for those teams?"),
      ex(" If you lead a team, ask to sit in on planning before the plan is final. That is where next year’s work is assigned. "),
      ex("How does planning work where you are?"),
    ],
  },
  {
    id: "hooks",
    heading: "Other openings",
    list: true,
    segments: [
      ex("New scope is rarely advertised. It is written into the plan."),
      ex("I used to think planning season was admin."),
      ex("The most useful meeting of my year has no agenda item with my name on it."),
    ],
  },
];

const POST_V2: DraftSection[] = [
  {
    id: "post",
    segments: [
      ex("New scope is rarely advertised. It is written into the plan. "),
      you("The plan is where scope gets decided, so I would rather help write it than wait to see what it says. "),
      you("I’m leading our planning workstream this year, across marketing, sales and product. "),
      ask("What has the workstream changed for those teams?"),
      ex(" If you lead a team, get into planning before the plan is final."),
    ],
  },
  POST_V1[1],
];

export const TL_VERSIONS: readonly DraftVersion[] = [
  { n: 1, when: "Mon 5 Oct, 9:14", what: "First draft", sections: POST_V1 },
  { n: 2, when: "Mon 5 Oct, 9:20", what: "Shorter, more direct", sections: POST_V2 },
];

export const FLOW_COPY = {
  back: "Playbook",
  backLabel: "Back to the Playbook",
  /** Every change is kept as she goes. */
  saved: "Saved in your library",
  step: (n: number, of: number) => `Step ${n} of ${of}`,
  /** Concept 2's bar at the foot of a draft, and its Inputs sheet. */
  draftTools: "Your draft",
  builtFrom: "Built from",
  /** Changing what a draft was built from. */
  editInputs: "Edit",
  rewrite: "Rewrite with these",
  cancelEdit: "Cancel",
  rewriteNote: "ExecHQ writes a new version from these. The one you have now stays in Versions.",
  /** A version written from changed inputs, in Versions. */
  /** Concept 1: back to the clean read after changing a ready draft. */
  doneChanging: "Done",
  /** Concept 2: back to the page after changing a ready draft. */
  backToPage: "Done: show it as a page",
  /** Names Concept 1's stepper for screen readers. */
  progress: "Your progress",
  next: "Next",
  previous: "Back",
  write: "Write my first draft",
  /** Concept 1: the step that shows what ExecHQ already has. */
  knownStep: "Check what ExecHQ has",
  /** Concept 3, under the open draft on a phone: back to the changes. */
  changeDraft: "Change the draft",
  /** The same last step when ExecHQ has nothing to show: only optional
   *  questions are left. */
  lastStep: "Anything else?",
  revise: "Revise",
  versions: "Versions",
  inputs: "Inputs",
  /** Concept 2's peek bar. */
  peek: "Inputs, changes and versions",
  showPanel: "Open",
  hidePanel: "Close",
  /** Concept 3: the pinned card before and after the first draft. */
  /** Concept 3: the card before there is a written draft. */
  soFar: "Your draft so far",
  /** Web (option B, 19 Oct): under the page's label before it is written. */
  pageNote: "Fills in as you answer. The shaded part is where this answer goes.",
  /** For screen readers, on the shaded section. */
  pageLit: "where this answer goes",
  /** Concept 3's pinned draft, which fills in as she answers. */
  pinnedEmpty: "Your draft builds here as you answer.",
  /** Concept 2 on web, where the draft appears once it is written. */
  workspaceEmpty: "Your draft appears here once you write it.",
  showDraft: "Show draft",
  hideDraft: "Hide draft",
  /** Concept 3's opening line, with what she said was coming up. */
  momentLine: (moment: string) => `You said: “${moment}”`,
  /** A tool other than Thought Leadership Builder, until the chosen concept
   *  is built out for all four (Sprint 4 stage 5). A reviewer's note. */
  laterTool: "This tool’s steps are designed once a Playbook concept is chosen. Thought Leadership Builder shows how they will work.",
  reusedFrom: (title: string) => `Started from ${title}`,
  /** A version she kept before the Playbook existed. */
  yourEdits: "Your edits",
  newTitle: (title: string) => `${title}, new version`,
  postTitle: (about: string) => `Post: ${about}`,
  postName: "your post",
} as const;

export const DRAFT_COPY = {
  /** Never "your post": it is a draft until she marks it ready. */
  label: (n: number) => (n === 1 ? "First draft" : `Draft, version ${n}`),
  intro: "Here is a first draft of your post. Change anything; it is yours.",
  /** By tool: never "your bio", always a first draft until she marks it ready. */
  introFor: {
    positioning: "Here is a first draft of your bios and narrative, built on your statement. Change anything; it is yours.",
    pitch: "Here is a first draft of your pitch, with its follow-up. Change anything; it is yours.",
    "situation-brief": "Here is a first draft of your brief. Change anything; it is yours.",
    "thought-leadership": "Here is a first draft of your post. Change anything; it is yours.",
  } as Record<ArtifactKind, string>,
  legendYou: "Your words",
  legendExechq: "ExecHQ’s wording",
  legendQuestion: "A question only you can answer",
  questionLabel: "To answer:",
  answer: "Answer",
  edit: "Edit",
  editSection: (name: string) => `Edit ${name}`,
  save: "Save",
  cancel: "Cancel",
  /** Once she edits a passage, all of it is hers. */
  edited: "Edited by you",
  empty: "This part is empty. Write something, or cancel to keep the draft.",
  gapsHeading: "Questions for you",
  /** Once it is ready (Concept 1's clean read): the open questions, folded. */
  openLabel: "Questions still open",
  openCount: (n: number) => `${n} question${n === 1 ? "" : "s"} left open.`,
  openWhy: "It works without them; the answers make it yours.",
  openShow: "Answer them",
  openHide: "Hide them",
  changeSomething: "Change something",
  /** Concept 2's page: unanswered questions are blank lines. */
  blanks: (n: number) => `${n} blank line${n === 1 ? " is a question" : "s are questions"} only you can answer.`,
  fillIn: "Fill them in",
  gapsLead: "ExecHQ left these for you rather than guess.",
} as const;

/* -----------------------------------------------------------------------------
   REVISING
   -------------------------------------------------------------------------- */

export interface RevisionOption {
  id: "voice" | "specificity" | "length" | "audience" | "emphasis";
  label: string;
  choices: readonly string[];
}

export const REVISION_OPTIONS: readonly RevisionOption[] = [
  { id: "voice", label: "Voice", choices: ["Plainer", "Warmer", "More direct"] },
  { id: "specificity", label: "Specificity", choices: ["Broader", "More specific"] },
  { id: "length", label: "Length", choices: ["Shorter", "Longer"] },
  { id: "audience", label: "Audience", choices: ["Peers", "Senior leaders", "My team"] },
  { id: "emphasis", label: "Emphasis", choices: ["My example", "The article’s point", "The question at the end"] },
];

/** Each builder's own emphasis choices: what it can lead with. */
export const EMPHASIS_BY_KIND: Record<ArtifactKind, readonly string[]> = {
  positioning: ["What I lead", "What I’m known for", "Where I’m headed"],
  pitch: ["The angle", "The proof", "Why now"],
  "situation-brief": ["The ask", "The evidence", "The risks"],
  "thought-leadership": ["My example", "The article’s point", "The question at the end"],
};

export const REVISION_COPY = {
  heading: "Change the draft",
  followUpLabel: "Or say what to change",
  followUpPlaceholder: "Lead with the planning workstream",
  revise: "Revise",
  revising: "Revising your draft…",
  /** Nothing chosen or typed yet. */
  nothing: "Choose a change, or say one.",
  saved: (n: number) => `Saved as version ${n}. The earlier one is still there.`,
} as const;

/* -----------------------------------------------------------------------------
   VERSIONS
   -------------------------------------------------------------------------- */

export const VERSION_COPY = {
  heading: "Versions",
  lead: "Every change is saved. Bring back any earlier version.",
  current: "Showing",
  view: "View",
  restore: "Bring this back",
  restored: (n: number) => `Version ${n} is back, saved as a new version. Nothing was lost.`,
  /** What a version brought back says it is, in the list. */
  restoredWhat: (n: number) => `Version ${n}, brought back`,
  count: (n: number) => (n === 1 ? "1 version" : `${n} versions`),
} as const;

/* -----------------------------------------------------------------------------
   USING IT
   -------------------------------------------------------------------------- */

export const USE_COPY = {
  copy: "Copy",
  /** By kind: what she does with it herself. ExecHQ never posts or sends. */
  copyFor: {
    positioning: "Copy",
    pitch: "Copy to send",
    "situation-brief": "Copy",
    "thought-leadership": "Copy to post on LinkedIn",
  } as Record<ArtifactKind, string>,
  copied: "Copied. Paste it wherever you need it.",
  export: "Export",
  /** The menu that holds the downloads where the bar has room for three (Concept 1). */
  more: "More",
  exportPdf: "Download as PDF",
  exportWord: "Download as Word",
  /** On one output, where space is short. */
  pdfShort: "PDF",
  wordShort: "Word",
  exported: (format: string) => `Downloading as ${format}.`,
  /** A pitch's file starts with where it goes and the four steps, so it works on its own (Kate, 14 Oct). */
  exportedPitch: (format: string) => `Downloading as ${format}, starting with where it goes and the four steps.`,
  markReady: "Mark ready",
  /** "Mark published", "Mark sent", "Mark used". */
  markUsed: (kind: ArtifactKind) => `Mark ${ARTIFACT_KINDS[kind].usedLabel.toLowerCase()}`,
  used: (kind: ArtifactKind) => `Marked ${ARTIFACT_KINDS[kind].usedLabel.toLowerCase()}. ExecHQ will ask what came of it.`,
  ready: "Marked ready. ExecHQ will ask what came of it once you use it.",
  /** Where she can export, by kind: copy for every output, PDF and Word for
   *  the Situation Brief, bios and long-form articles (brief's proposed answer). */
  exportable: {
    positioning: true,
    // Kate, 13 Oct: the pitch exports too.
    pitch: true,
    "situation-brief": true,
    "thought-leadership": false,
  } as Record<ArtifactKind, boolean>,
  /** Concept 1: the menu in the draft's corner, once it is ready: Copy and
   *  the downloads. */
  actions: "Actions",
  /** Concept 1's one button once it is ready. */
  iveUsed: (kind: ArtifactKind) => `I’ve ${ARTIFACT_KINDS[kind].usedLabel.toLowerCase()} this`,
  /** The Playbook never publishes. */
  neverPosts: "ExecHQ never posts or sends anything for you.",
} as const;

/* -----------------------------------------------------------------------------
   USE CASE SCREEN
   -------------------------------------------------------------------------- */

export const USE_CASE_COPY = {
  needsHeading: "You’ll need",
  planHeading: "On your plan",
  /** Under the first choice, when her plan step chose it (option C). */
  fromPlan: "Chosen from your plan step. Change it if it’s not right.",
  /** In the answer row her plan step chose, where each answer starts the tool. */
  fromPlanShort: "From your plan",
  /** In the row she chose, when she comes back to the start. */
  yourAnswer: "Your answer",
  goesWith: "Goes with this",
  /** The button, once the first choice says what it makes. */
  startWith: (kind: ArtifactKind, choice: string): string => {
    const c = choice.toLowerCase();
    if (kind === "pitch") return `Start a ${c} pitch`;
    if (kind === "thought-leadership") return c === "linkedin post" ? "Start a post" : `Start a ${c}`;
    return TOOLS[kind].start;
  },
  /** When she came from a read: the source arrives with her. */
  fromBriefing: "Started from today’s Briefing",
} as const;

/* -----------------------------------------------------------------------------
   THE LIBRARY
   Every artifact she has made, whichever tool or entry point made it. It reads
   her Loop records, so the library, the Plan and the homepage always show the
   same status. What the Loop does not hold (the plan area, the step it serves,
   how many versions, a first line to search) is here, by record id.
   -------------------------------------------------------------------------- */

export interface ArtifactMeta {
  /** Plan area: an id from `SIGNALS` in `mock/plan-stub.ts`. */
  area?: string;
  /** The action step it serves. */
  planStepId?: string;
  /** The Briefing read it started from (`mock/briefing.ts`). */
  readId?: string;
  versions: number;
  /** Its first line, for the row and for search. */
  preview: string;
  /** Made in onboarding: the positioning statement, first in the library. */
  fromOnboarding?: boolean;
  /** The artifact it was made from, when she reused one. */
  reusedFrom?: string;
}

/** The artifacts the homepage's five states already hold. */
export const LIBRARY_SEED: Record<string, ArtifactMeta> = {
  story: {
    area: "seen-as-leader",
    planStepId: "use-story",
    versions: 2,
    preview: "I want to move from running campaigns to leading a broader marketing organization.",
    fromOnboarding: true,
  },
  "check-in-brief": {
    area: "decider-access",
    planStepId: "brief-manager",
    versions: 3,
    preview: "Objective: leave Thursday’s check-in with the planning workstream agreed as mine.",
  },
  pitch: {
    area: "broader-remit",
    planStepId: "q1-review",
    versions: 2,
    preview: "I’d like to put myself forward to lead marketing’s part of the Q1 planning review.",
  },
  "post-planning": {
    area: "seen-as-leader",
    versions: 2,
    preview: "Running campaigns in three regions taught me that the plan is where scope gets decided.",
  },
  "podcast-pitch": {
    area: "broader-remit",
    versions: 1,
    preview: "A pitch to talk about turning regional campaigns into one marketing plan.",
  },
};

export const LIBRARY_COPY = {
  heading: "Library",
  lead: "Everything you’ve made, wherever you started it.",
  search: "Search your library",
  /** The sheet the magnifying glass opens (Concept 2, 14 Oct). */
  searchSheet: {
    field: "Search your library",
    recent: "Recent",
    matches: (n: number) => (n === 1 ? "1 match" : `${n} matches`),
    noMatch: (q: string) => `Nothing in your library mentions “${q}”.`,
  },
  /** When she last touched it, on each row: up to two weeks, how long ago;
   *  after that, the date (Kate, 14 Oct). */
  touched: {
    today: "Today",
    days: (n: number) => (n === 1 ? "1 day ago" : `${n} days ago`),
    weeks: (n: number) => (n === 1 ? "1 week ago" : `${n} weeks ago`),
  },
  /** "Last changed today", "Last changed on Tuesday". */
  edited: (when: string) => `Last changed ${when}`,
  versions: (n: number) => (n === 1 ? "1 version" : `${n} versions`),
  /** The link back to where it came from, on the row. */
  forStep: (title: string) => `For: ${title}`,
  statementAction: "Build it out",
  otherArea: "Not tied to your plan",
  /** Only someone who left onboarding before saving sees this. It points to
   *  her first action step, never to a blank state. */
  empty: {
    heading: "Nothing here yet",
    body: "Your first draft starts from the first step on your plan.",
  },
  actions: {
    open: "Open",
    reuse: "Use as a starting point",
    reuseHint: "Makes a new draft from this one. This one stays as it is.",
    export: "Export",
    close: "Close",
    closeHint: "No further action needed. It stays in your library.",
    delete: "Delete",
    more: (title: string) => `More for ${title}`,
  },
  /** Concept 2's folders: one per tool, filed by ExecHQ. */
  folders: {
    names: {
      positioning: "Positioning",
      pitch: "Pitches",
      "situation-brief": "Briefs",
      "thought-leadership": "Posts",
    } as Record<ArtifactKind, string>,
    lastChange: (date: string) => `Last change ${date}`,
    empty: "Nothing here yet",
    emptyBody: (tool: string) => `Anything you make in ${tool} is filed here.`,
    back: "Library",
    /** The folder's own page (phone): back to the Playbook. */
    backToPlaybook: "Playbook",
    /** Web (option A, 15 Oct): the folders as tabs, All first. */
    tabs: "Folders",
    /** Under the search field on web, once she types. */
    acrossFolders: (n: number) => (n === 1 ? "1 match across every folder" : `${n} matches across every folder`),
    /** The Status menu over a folder's list, each status with how many. */
    filter: "Status",
    all: "All",
    /** How many a folder holds, over its list. */
    items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
    /** The menu's button once a status is chosen: "Status: Draft". */
    chosen: (filter: string, choice: string) => `${filter}: ${choice}`,
    noneInStatus: (status: string) => `Nothing here is ${status.toLowerCase()}.`,
    /** Under a positioning statement in its folder, as tags: each moment
     *  she picked, without its "A" or "An" (designer, 28 Oct). */
    moment: (picked: string) => {
      const bare = picked.replace(/^(a|an) /i, "");
      return bare.charAt(0).toUpperCase() + bare.slice(1);
    },
    madeInOnboarding: "From onboarding",
    open: (name: string) => `Open ${name}`,
    /** One part of a folder's counts, by status filter id, in the Loop's words. */
    count: (status: string, n: number): string =>
      ({
        draft: `${n} draft${n === 1 ? "" : "s"}`,
        ready: `${n} ready to use`,
        used: `${n} used, sent or published`,
        waiting: `${n} waiting to hear`,
        outcome: `${n} with an outcome logged`,
        closed: `${n} closed`,
      })[status] ?? `${n}`,
  },
  closed: (title: string) => `${title} is closed. It stays in your library.`,
  deleteConfirm: {
    heading: (title: string) => `Delete ${title}?`,
    /** States exactly what else goes, once. */
    body: (signalItems: number) =>
      signalItems === 0
        ? "This deletes the draft and its record in ExecHQ. It can’t be undone."
        : `This deletes the draft, its record in ExecHQ, and ${signalItems === 1 ? "1 item" : `${signalItems} items`} on your Signal Picture. It can’t be undone.`,
    confirm: "Delete",
    keep: "Keep it",
    done: (title: string) => `${title} is deleted.`,
  },
} as const;

/* -----------------------------------------------------------------------------
   THE PLAYBOOK PAGE
   The four tools always lead, for new and returning users alike, with the
   library below. On a phone the tools stay compact enough that the library is
   reachable without a long scroll.
   -------------------------------------------------------------------------- */

export const PLAYBOOK_PAGE = {
  title: "Playbook",
  lead: "Four ways to make your next draft.",
  /** Over the tool her next plan step needs. */
  nextOnPlan: "Next on your plan",
  toolsLabel: "Tools",
} as const;

/** The rules for picking a tool from what she says (the advisor answering
 *  "Which tool do I need?" on the Playbook). The
 *  pilot's matching is rules-based, so it only places a few kinds of moment,
 *  and anything else asks rather than guesses. First match wins, so the
 *  things she names outright (a pitch, a post) come before the moments. */
export const MOMENT_RULES: readonly { kind: ArtifactKind; words: RegExp }[] = [
  { kind: "pitch", words: /\b(pitch\w*|podcast|conference|panel|speak\w*|(a|give a) talk|keynote|press|editor|journalist|call for (proposals|papers))\b/i },
  { kind: "thought-leadership", words: /\b(post|linkedin|article|blog|newsletter|essay|op-?ed|write|read)\b/i },
  { kind: "situation-brief", words: /\b(review|board|meeting|negotiat\w*|check-?in|1:1|one-to-one|conversation|interview|offsite|presentation|manager|boss|talk (about|with|to)|scope)\b/i },
  { kind: "positioning", words: /\b(bio|introduc\w*|promotion|positioning|new (boss|manager|role)|about me|profile)\b/i },
];

export function matchMoment(text: string): ArtifactKind | undefined {
  return MOMENT_RULES.find((rule) => rule.words.test(text))?.kind;
}

/** Statuses, in the Loop's order, with the Sprint 2 names. */
export const STATUS_FILTERS: readonly { id: string; label: string; states: readonly string[] }[] = [
  { id: "draft", label: "Draft", states: ["drafted", "in-progress"] },
  { id: "ready", label: "Ready to use", states: ["ready"] },
  { id: "used", label: "Used, sent or published", states: ["used"] },
  { id: "waiting", label: "Waiting to hear", states: ["waiting"] },
  { id: "outcome", label: "Outcome logged", states: ["outcome"] },
  { id: "closed", label: "Closed", states: ["closed"] },
];

/** In the Positioning folder only, a statement's life is shorter: one she
 *  uses again and again is never "used" or "waiting to hear", so it is a
 *  draft, then ready, then archived when she puts it away (designer, 28
 *  Oct). Every other screen keeps the Loop's words. The last is always
 *  shown, as Closed is in the other folders. */
export const POSITIONING_FILTERS: readonly { id: string; label: string; states: readonly string[] }[] = [
  { id: "draft", label: "Draft", states: ["drafted", "in-progress"] },
  { id: "ready", label: "Ready", states: ["ready", "used", "waiting", "outcome"] },
  { id: "archived", label: "Archived", states: ["closed"] },
];

/** Concept 2's groups: when she last touched it, newest first. */
export const TOUCHED_GROUPS = {
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "Earlier this week",
  lastWeek: "Last week",
  earlier: "Earlier",
} as const;

/* -----------------------------------------------------------------------------
   PITCH BUILDER AND SITUATION BRIEF (stage 5)
   The same shared workflow, with each tool's own questions. What a plan step
   already says arrives filled in, marked "From your plan".
   -------------------------------------------------------------------------- */

export const PITCH_INPUTS: readonly ToolInput[] = [
  { id: "type", label: "What are you pitching for?", kind: "choice", options: ["Speaking", "Podcast", "Press"] },
  // Asked, not taken from her direction: an outlet's audience can differ
  // from hers (CEO, 19 Oct). Her direction's audience leads the chips. Asked
  // before Who, so "Not sure yet" can suggest outlets that reach it.
  {
    id: "audience",
    label: "Who do you want to reach?",
    hint: "The people who read, listen or attend. They can be different from your own audience.",
    kind: "text",
    placeholder: "Marketing and commercial leaders",
  },
  {
    id: "target",
    label: "Who are you pitching?",
    // Required (Kate, 14 Oct): a pitch is for one place. "Not sure yet"
    // offers up to three that fit.
    hint: "The event, show or publication.",
    kind: "text",
    placeholder: "The Growth Summit",
  },
  {
    id: "angle",
    label: "What would you talk about?",
    hint: "The topic, in a line, as you’d say it to the person deciding.",
    kind: "text",
    placeholder: "How planning season decides who gets new work",
  },
  {
    id: "proof",
    label: "One or two things you can prove",
    hint: "Something you led or delivered. Leave out what you can’t share.",
    kind: "long",
    placeholder: "I lead our planning workstream across marketing, sales and product.",
  },
  { id: "links", label: "Links or earlier talks", kind: "text", optional: true, placeholder: "A post, a recording, a past talk" },
  // Who she is, for the pitch's introduction and "Why me" (the PRD's career
  // direction and plan context). Known, shown to check, never asked.
  { id: "role", label: "Your role, as you’d say it", kind: "text", source: "plan" },
  { id: "statement", label: "Your positioning statement", kind: "long", source: "onboarding" },
  // Her short bio, once Positioning Builder has built it: About me uses it
  // in place of the statement (CEO, 19 Oct). Left out until it exists.
  { id: "bio", label: "Your short bio", kind: "long", source: "positioning" },
];

export const BRIEF_INPUTS: readonly ToolInput[] = [
  { id: "type", label: "What is the moment?", kind: "choice", options: ["A review", "A board meeting", "A negotiation", "An executive conversation", "Something else"] },
  // Asked only after Something else, so the brief names it (CEO, 19 Oct).
  { id: "named", label: "What is it?", hint: "A skip-level, an offsite, a dinner. Say as much as you like.", kind: "text", placeholder: "A skip-level with my manager’s manager" },
  { id: "date", label: "When is it?", hint: "If you know. ExecHQ asks how it went after it.", kind: "date", optional: true },
  {
    id: "objective",
    label: "What do you want to come out of it?",
    hint: "The decision or next step you’d count as a good result.",
    kind: "long",
    placeholder: "Agreement that I lead the planning workstream",
  },
  { id: "audience", label: "Who will be there?", kind: "text", placeholder: "My manager" },
  // The PRD's stakeholder context and risks, each used in the draft (Kate, 13 Oct).
  {
    id: "stakes",
    label: "What do they care about?",
    hint: "What’s at stake for them, in a line.",
    kind: "text",
    optional: true,
    placeholder: "Hitting the Q1 numbers without adding headcount",
  },
  {
    id: "evidence",
    label: "Anything to draw on",
    hint: "Evidence, notes or source material you already have. Paste them in.",
    kind: "long",
    optional: true,
  },
  {
    id: "risks",
    label: "Any risks or concerns?",
    hint: "One a line. Each becomes a question to prepare for.",
    kind: "long",
    optional: true,
    placeholder: "It takes time from the campaign calendar",
  },
  // Context she can add, as much as she likes, kept with the brief (CEO, 19
  // Oct). It fills Context and the first key message.
  {
    id: "background",
    label: "Anything they should know first?",
    hint: "What has happened so far. Add as much as you like: it’s kept with the brief to look back on.",
    kind: "long",
    optional: true,
    placeholder: "The planning workstream has no owner since the reorg in September.",
  },
  // What it already knows, shown to check: her statement, which the opening
  // statement draws on (the use case screen's "Goes with this" promise).
  { id: "statement", label: "Your positioning statement", kind: "long", source: "onboarding" },
];

/** What a plan step already says, by step id: those inputs arrive filled in. */
export const STEP_PREFILLS: Record<string, Record<string, string>> = {
  "brief-manager": { type: "An executive conversation", audience: "My manager" },
  "pitch-podcast": { type: "Podcast" },
  "speaking-proposal": { type: "Speaking", target: "The leadership forum" },
  "q1-review": { type: "Speaking", target: "The Q1 planning review" },
  "linkedin-post": { topic: "What I lead, and where it is going" },
  bio: {},
};

/** Maya's artifacts made before the Playbook existed (the homepage states):
 *  what she gave each, so opening one goes straight to its draft. */
export const SEED_INPUTS: Record<string, Record<string, string>> = {
  "check-in-brief": {
    type: "An executive conversation",
    objective: "Leave Thursday’s check-in with the planning workstream agreed as mine.",
    audience: "My manager",
  },
  "post-planning": {
    format: "LinkedIn post",
    topic: "What three regions taught me about planning",
    pov: "The plan is where scope gets decided, so marketing has to be in the room when it’s written.",
    example: "I’m leading our planning workstream this year, across marketing, sales and product.",
    audience: "Marketing and commercial leaders, and the people who decide on scope",
  },
  "podcast-pitch": {
    type: "Podcast",
    target: "The Marketing Leaders podcast",
    angle: "Turning regional campaigns into one marketing plan",
    proof: "I run campaigns across three regions, and I’m leading our planning workstream.",
  },
  pitch: {
    type: "Speaking",
    target: "The Q1 planning review",
    angle: "Leading marketing’s part of the Q1 planning review",
    proof: "I run campaigns across three regions, and I’m leading our planning workstream.",
  },
};

/* -----------------------------------------------------------------------------
   THE STEP BAR (review scaffolding)
   What the prototype's step bar calls each step, and the example answers a
   jump fills in for any step she hasn't answered. Not product copy.
   -------------------------------------------------------------------------- */

export const STEP_BAR_COPY = {
  start: "Start",
  /** The last step before the draft, with what ExecHQ already has. */
  check: "Check",
  /** The same step with only optional questions left. */
  anythingElse: "Anything else",
  draft: "Draft",
  revise: "Revise",
  versions: "Versions",
  ready: "Ready",
} as const;

/** Each question's short name in the bar, by tool and input id. */
export const STEP_LABELS: Record<ArtifactKind, Record<string, string>> = {
  positioning: { knownFor: "Known for", context: "Introductions", audience: "Audience", format: "Format", source: "Source text" },
  pitch: { type: "Pitching for", target: "Who", angle: "Angle", proof: "Proof", audience: "Audience" },
  "situation-brief": { type: "Moment", named: "What it is", objective: "Outcome", audience: "Who’s there", stakes: "Their stakes", risks: "Risks", background: "Background" },
  "thought-leadership": { format: "Format", topic: "Topic", pov: "Point of view", evidence: "Evidence", voice: "Voice", length: "Length" },
};

/** What a jump fills in for a question she hasn't answered. */
export const EXAMPLE_ANSWERS: Record<ArtifactKind, Record<string, string>> = {
  positioning: {
    knownFor: "Turning regional campaigns into one plan the business can back",
    audience: "Senior leaders where I work",
    format: "LinkedIn About section",
    source: "Before this role I ran field marketing for the EMEA region for four years. I started in agency account management.",
  },
  pitch: {
    type: "Podcast",
    target: "the Marketing Leaders podcast",
    angle: "Turning regional campaigns into one marketing plan",
    proof: "I run campaigns across three regions, and I’m leading our planning workstream.",
    audience: "Marketing and commercial leaders",
  },
  "situation-brief": {
    type: "A board meeting",
    date: "2026-10-29",
    objective: "Agreement that I lead the Q1 planning workstream",
    audience: "The CEO, the CFO and my manager",
    stakes: "Hitting the Q1 numbers without adding headcount",
    risks: "It takes time from the campaign calendar",
  },
  "thought-leadership": {
    format: "LinkedIn post",
    topic: "What three regions taught me about planning",
    pov: "The plan is where scope gets decided, so marketing has to be in the room when it’s written.",
    cta: "Ask how other teams decide who owns the plan",
    evidence: "Two regions now plan together, and the third joins in Q1.",
  },
};

export const TOOL_COPY = {
  briefTitle: (type: string) => `Brief for ${type.replace(/^(a|an) /i, "your ").toLowerCase()}`,
  briefName: "your brief",
  pitchTitle: (target: string) => `Pitch for ${target}`,
  pitchName: "your pitch",
  onePage: "Exports as one page.",
  /** Pitch Builder: marking it sent, with an optional target and date. */
  sent: {
    heading: "Mark it sent",
    to: "Sent to",
    /** Who received it: the person the outlet names, else its address or form. */
    contact: "Contact",
    on: "When",
    confirm: "Mark sent",
    cancel: "Not yet",
  },
  /** Situation Brief: when a date is known, the follow-up lands after it. */
  askAfter: (when: string) => `ExecHQ will ask how it went ${when}.`,
} as const;

/* -----------------------------------------------------------------------------
   PITCH BUILDER: WHERE IT GOES (Kate, 14 Oct)
   A pitch is for one place. Above the draft, the outlet, what it asks for,
   who receives it and how to send it, each from the outlet's own published
   page, linked and dated. A contact the outlet doesn't publish is a question
   to her, never a guess. Every outlet here is made up, and every address
   uses the reserved `.example` domain, so nothing points at a real outlet
   or a real person.
   -------------------------------------------------------------------------- */

export type PitchType = "Speaking" | "Podcast" | "Press";

/** A draft section a send route asks for, by its id in `pitchDraft`. */
export type PitchPart = "subjects" | "pitch" | "short" | "expanded" | "follow-up";

/** What the outlet asks for, as its page says it. Anything left out is
 *  missing from the page, and the card says so rather than filling it. */
export interface OutletAsk {
  /** The topics they want now. */
  topics: string;
  /** "A 40-minute conversation"; "A 300-word abstract for a 30-minute talk". */
  format: string;
  /** The words they allow, and which part of the draft it applies to. */
  limit?: { words: number; part: PitchPart };
  /** What to send with it. */
  include: readonly string[];
  /** A closing date, ISO. */
  deadline?: string;
  /** How often they read pitches, when there is no deadline. */
  cycle?: string;
}

/** The route the outlet publishes. A named person only when the outlet
 *  names them on its own page. */
export type OutletContact =
  | { route: "form"; url: string; label: string; fields: readonly { field: string; part: PitchPart }[]; person?: string }
  | { route: "email"; address: string; person?: string };

/** The audiences "Not sure yet" matches on: her direction's, then others an
 *  outlet's audience can be (CEO, 19 Oct). */
export type OutletAudience = "Marketing and commercial leaders" | "Senior executives" | "Operators and practitioners" | "Founders and investors";

export interface Outlet {
  id: string;
  name: string;
  type: PitchType;
  /** The part of it she is pitching: a track, a column, a segment. */
  part?: string;
  /** Inside her company: no public page, so the card asks her. */
  internal?: boolean;
  ask?: OutletAsk;
  contact?: OutletContact;
  /** The page it all came from, and the day ExecHQ checked it (ISO). */
  source?: { url: string; checked: string };
  /** Why it fits her angle and audience, in a line, for "Not sure yet". */
  fits?: string;
  /** Who it reaches, and the plan areas it serves: the list ExecHQ keeps
   *  for "Not sure yet" is filed by both (CEO, 19 Oct). */
  audiences?: readonly OutletAudience[];
  areas?: readonly string[];
}

export const OUTLETS: readonly Outlet[] = [
  {
    id: "marketing-leaders-podcast",
    name: "The Marketing Leaders podcast",
    type: "Podcast",
    part: "Guest episodes",
    ask: {
      topics: "How marketing leaders run planning, budgets and teams",
      format: "A 40-minute recorded conversation",
      limit: { words: 150, part: "pitch" },
      include: ["A short bio", "A link to a talk or interview, if you have one"],
      cycle: "Books guests about six weeks ahead",
    },
    contact: {
      route: "form",
      url: "marketingleaders.example/guests",
      label: "Guest form",
      fields: [
        { field: "Episode idea", part: "short" },
        { field: "Tell us more", part: "pitch" },
      ],
      // Named on the guest page, so shown by name (CEO, 19 Oct).
      person: "Priya Shah, guest producer",
    },
    source: { url: "marketingleaders.example/guests", checked: "2026-10-01" },
    fits: "Its listeners are the marketing leaders your direction names.",
    audiences: ["Marketing and commercial leaders"],
    areas: ["seen-as-leader"],
  },
  {
    id: "scope-and-scale",
    name: "Scope & Scale",
    type: "Podcast",
    contact: { route: "email", address: "bookings@scopeandscale.example" },
    source: { url: "scopeandscale.example/about", checked: "2026-10-09" },
    fits: "Weekly interviews with operators about how work gets divided up.",
    audiences: ["Operators and practitioners"],
    areas: ["broader-remit"],
  },
  {
    id: "commercial-strategy-summit",
    name: "The Commercial Strategy Summit",
    type: "Speaking",
    part: "Planning and operations track",
    ask: {
      topics: "Planning across regions, budgets under pressure, running cross-team programmes",
      format: "A 300-word abstract for a 30-minute talk",
      limit: { words: 300, part: "expanded" },
      include: ["A speaker bio, under 100 words", "A headshot", "A video of a past talk, if you have one"],
      deadline: "2026-11-13",
    },
    contact: {
      route: "form",
      url: "commercialstrategysummit.example/speak",
      label: "Call for proposals",
      fields: [
        { field: "Session title", part: "subjects" },
        { field: "Abstract", part: "expanded" },
        { field: "One-line description", part: "short" },
      ],
    },
    source: { url: "commercialstrategysummit.example/speak", checked: "2026-09-02" },
    fits: "Its planning track is the topic you lead at work.",
    audiences: ["Marketing and commercial leaders", "Senior executives"],
    areas: ["decider-access", "seen-as-leader"],
  },
  {
    id: "planning-leaders-conference",
    name: "The Planning Leaders Conference",
    type: "Speaking",
    part: "Practitioner talks",
    ask: {
      topics: "First-hand stories of planning that changed how a business runs",
      format: "A 20-minute talk",
      include: ["A speaker bio", "Three points you would cover"],
      cycle: "Reviews proposals each quarter",
    },
    contact: { route: "email", address: "speakers@planningleaders.example" },
    source: { url: "planningleaders.example/speak", checked: "2026-10-06" },
    fits: "It wants people doing the planning, not consultants.",
    audiences: ["Operators and practitioners", "Senior executives"],
    areas: ["broader-remit"],
  },
  {
    id: "commercial-leader-quarterly",
    name: "Commercial Leader Quarterly",
    type: "Press",
    part: "Opinion column",
    ask: {
      topics: "First-person lessons on running commercial teams",
      format: "A pitch for a 700-word opinion piece",
      limit: { words: 200, part: "pitch" },
      include: ["Your bio in two lines", "Two or three recent articles or posts, if you have them"],
      cycle: "Reads pitches every Monday",
    },
    contact: { route: "email", address: "opinion@commercialleader.example", person: "Dana Okafor, opinion editor" },
    source: { url: "commercialleader.example/contribute", checked: "2026-10-12" },
    fits: "Read by the commercial leaders two levels above you.",
    audiences: ["Senior executives", "Marketing and commercial leaders"],
    areas: ["decider-access"],
  },
  {
    id: "field-notes",
    name: "Field Notes",
    type: "Press",
    part: "Guest essays",
    ask: {
      topics: "What senior marketers learned the hard way",
      format: "An 800-word guest essay",
      include: ["A two-line bio"],
    },
    source: { url: "fieldnotes.example/write-for-us", checked: "2026-10-10" },
    fits: "A newsletter marketing directors forward to their teams.",
    audiences: ["Marketing and commercial leaders", "Operators and practitioners"],
    areas: ["seen-as-leader"],
  },
  { id: "q1-planning-review", name: "The Q1 planning review", type: "Speaking", internal: true },
  { id: "leadership-forum", name: "The leadership forum", type: "Speaking", internal: true },
];

/** The outlet she named, matched loosely ("the Marketing Leaders podcast"). */
export function outletFor(name: string | undefined): Outlet | undefined {
  const key = (s: string) => s.trim().toLowerCase().replace(/^the\s+/, "");
  if (!name?.trim()) return undefined;
  return OUTLETS.find((o) => key(o.name) === key(name));
}

/** Who receives it, as "Sent to" keeps it: the person the outlet names, else
 *  its address, else its form (Kate, 14 Oct). */
export function contactLine(outlet: Outlet | undefined): string {
  const c = outlet?.contact;
  if (!c) return "";
  return c.route === "email" ? (c.person ? `${c.person}, ${c.address}` : c.address) : c.person ? `${c.person}, ${c.label}` : `${c.label}, ${c.url}`;
}

/** Her "What are you pitching for?" answer, when it is one of the three. */
export function pitchTypeOf(answer: string | undefined): PitchType | undefined {
  return answer === "Speaking" || answer === "Podcast" || answer === "Press" ? answer : undefined;
}

/** "Not sure yet": up to three that fit, of the kind she is pitching for. */
export function suggestedOutlets(type: string | undefined, fit: { audience?: string; area?: string } = {}): Outlet[] {
  // From the list ExecHQ keeps, filed by audience and plan area (CEO, 19
  // Oct): the kind she is pitching for, then those that reach her audience,
  // then those that serve the plan area of her step.
  const score = (o: Outlet) =>
    (fit.audience && o.audiences?.some((a) => a.toLowerCase() === fit.audience!.trim().toLowerCase()) ? 2 : 0) + (fit.area && o.areas?.includes(fit.area) ? 1 : 0);
  return OUTLETS.filter((o) => !o.internal && (!type || o.type === type))
    .map((o, i) => ({ o, i, s: score(o) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.o)
    .slice(0, 3);
}

/** A page checked longer ago than this may have changed. */
export const OUTLET_STALE_DAYS = 30;

export const OUTLET_COPY = {
  heading: "Where it goes",
  ask: "What they’re asking for",
  topics: "Topics",
  format: "Format",
  length: "Length",
  limit: (words: number, part: string) => `Your ${part.toLowerCase()}, up to ${words} words`,
  include: "Send with it",
  when: "When",
  deadline: (date: string) => `Closes ${date}`,
  contact: "Contact",
  how: "How to send it",
  source: "Source",
  checked: (date: string) => `Checked ${date}`,
  /** The page publishes nothing about what they want. */
  noAsk: (watch: string) => `They don’t publish what they want. Read three recent ${watch} and pitch the gap.`,
  watchFor: { Speaking: "talks", Podcast: "episodes", Press: "articles" } as Record<PitchType, string>,
  /** She named somewhere ExecHQ has no page for. */
  notFound: (watch: string) => `ExecHQ couldn’t find their page. Check the name, or read three recent ${watch} and pitch the gap.`,
  /** The page names no contact: a question, never a guess. */
  noContact: {
    Speaking: "Who reviews talks? Look for a programme lead on the event’s page, or ask someone who has spoken there.",
    Podcast: "Who handles guests? Look for a producer on the show’s page, or ask someone who has been on it.",
    Press: "Who edits this section? Look for a name on recent pieces, or ask someone who has written for them.",
  } as Record<PitchType, string>,
  /** Inside her company there is no page to read. */
  internal: {
    note: "This is inside your company, so there is no page to check. Two things only you can answer:",
    questions: ["Who decides the agenda?", "How do people usually get on it?"],
  },
  /** A page checked long ago, or a deadline passed. */
  stale: "This may have changed. Check before you send.",
  closed: "This has closed. Check for the next one before you send.",
  howForm: (label: string) => `Fill in their ${label.toLowerCase()}.`,
  howEmail: "Email it: your chosen subject line in the subject, the pitch as the body.",
  /** Where each draft part goes, on a form. */
  fieldGets: (field: string, part: string) => `${field}: your ${part.toLowerCase()}`,
  partNames: {
    subjects: "Subject line",
    pitch: "Pitch",
    short: "Short version",
    expanded: "Expanded version",
    "follow-up": "Follow-up",
  } as Record<PitchPart, string>,
  /** No route published: send it the plainest way. */
  howDefault: "Email it once you have a contact: the first subject line, the pitch as the body.",
  /** The pitch doesn't fit their limit: a question in the draft. */
  overLimit: (words: number, now: number) => `They ask for ${words} words. This is ${now}. What can go?`,
} as const;

/** Send it in four steps (Kate, 14 Oct): under the draft, filled in from
 *  Where it goes. Ticking a step is hers alone; nothing is sent. */
export const SUGGEST_COPY = {
  open: (n: number) => `Not sure yet? See ${["one", "two", "three"][n - 1] ?? n} that fit`,
  close: "Hide the suggestions",
  /** Who comes before the angle, so they fit what she is pitching for and
   *  who her direction says it is for, nothing more. */
  lead: (type?: string) =>
    `${type === "Podcast" ? "Shows" : type === "Press" ? "Publications" : type === "Speaking" ? "Events" : "Places"} the people in your direction pay attention to. Pick one; you can change it.`,
  chosen: "Chosen",
} as const;

export const SEND_STEPS_COPY = {
  heading: "Send it in four steps",
  note: "Ticks are only for you. ExecHQ never sends anything for you.",
  check: {
    title: "Check it against what they asked for",
    wants: (name: string, format: string, topics: string) => `${name} wants ${format[0].toLowerCase()}${format.slice(1)}, on ${topics[0].toLowerCase()}${topics.slice(1)}.`,
    words: (part: string, words: number, limit: number) =>
      words > limit ? `Your ${part.toLowerCase()} is ${words} words; they allow ${limit}.` : `Your ${part.toLowerCase()} is ${words} words, inside their ${limit}.`,
    noAsk: (watch: string) => `They don’t say what they want, so check it against three recent ${watch}.`,
    internal: "Check it says what the agenda needs from you, in a line.",
    open: (n: number) => (n === 1 ? "One question is still open in the draft." : `${n} questions are still open in the draft.`),
  },
  extras: {
    title: "Get the extras ready",
    none: "Nothing to attach.",
    unknown: "They don’t list anything. A short bio and a link to a past talk or post cover most asks.",
    makeBio: "Make it in Positioning Builder",
  },
  send: {
    title: "Send it their way",
    form: (label: string, url: string) => `Fill in their ${label.toLowerCase()} at ${url}:`,
    email: (to: string) => `Email ${to}: the subject line you chose in the subject, the pitch as the body.`,
    emailTo: (person: string, address: string) => `${person} at ${address}`,
    noContact: "Find who receives it first (the question above), then email it: a subject line in the subject, the pitch as the body.",
    internal: "Send it to whoever decides the agenda, the way people usually get on it.",
    before: (date: string) => `Before ${date}.`,
    copy: "Copy",
    address: "Address",
    field: (field: string, part: string) => `${field}: your ${part.toLowerCase()}`,
  },
  sent: {
    title: "Mark it sent, and put the follow-up in your diary",
    done: "(done)",
    before: (days: number) =>
      `Mark sent records where and when. ExecHQ asks what came of it ${days} days later, and the follow-up in the draft is for a week after you send it.`,
    after: (on: string, to: string, followUp: string, ask: string) => `Sent ${on}${to ? ` to ${to}` : ""}. Send the follow-up ${followUp} if you’ve heard nothing; ExecHQ asks what came of it ${ask}.`,
  },
  /** What a copy says it copied. */
  copied: (what: string) => `${what} copied.`,
} as const;

/* -----------------------------------------------------------------------------
   POSITIONING BUILDER (stage 5b)
   The full builder around the onboarding statement. Her statement opens here
   as the same artifact, with its history: never a copy. Every other output
   draws on it. Changing the statement offers, never forces, a refresh of the
   bios and narrative.
   -------------------------------------------------------------------------- */

/** What Positioning Builder asks. The statement, her role and where she is
 *  headed are known; only what she is known for is asked. The values that
 *  depend on her account are filled in by the flow. */
export const POSITIONING_INPUTS: readonly ToolInput[] = [
  { id: "statement", label: "Your positioning statement", kind: "long", source: "onboarding" },
  { id: "role", label: "Your role, as you’d say it", kind: "text", source: "plan" },
  { id: "toward", label: "Where you’re headed", kind: "text", source: "direction" },
  {
    id: "knownFor",
    label: "What are you known for?",
    hint: "What colleagues would say you’re the person for. A line is enough.",
    kind: "long",
    placeholder: "Getting teams that don’t report to me to plan as one",
  },
  { id: "strengths", label: "Strengths you’d want named", kind: "text", optional: true, placeholder: "Calm in a hard room; turning data into a decision" },
  // The three for now, and she can make more than one (CEO, 19 Oct).
  {
    id: "context",
    label: "Introductions for particular moments",
    hint: "Pick any, or none.",
    kind: "choice",
    many: true,
    optional: true,
    options: ["A promotion conversation", "An executive introduction", "A conference program"],
  },
  // The PRD's optional audience and desired format, asked apart (Kate, 13 Oct).
  {
    id: "audience",
    label: "Who is it mainly for?",
    kind: "choice",
    optional: true,
    options: ["Senior leaders where I work", "An external audience", "Recruiters and boards"],
  },
  {
    id: "format",
    label: "Where will you use it first?",
    kind: "choice",
    optional: true,
    options: ["LinkedIn About section", "A speaker bio", "An internal profile", "An email introduction"],
  },
  // The PRD's user-provided source text: it fills the gap the bios would
  // otherwise leave as a question.
  {
    id: "source",
    label: "Paste a bio you already have",
    hint: "An old bio or profile. ExecHQ uses it to fill what it would otherwise ask.",
    kind: "long",
    optional: true,
  },
];

/** The enricher, once she adds it: one more input on the same screen. */
export const WINS_INPUT: ToolInput = {
  id: "wins",
  label: "Three recent accomplishments",
  hint: "One a line. Leave out names and numbers you can’t share.",
  kind: "long",
  optional: true,
};

export const POSITIONING_COPY = {
  fromOnboarding: "Your statement from onboarding",
  onboardingVersion: "Your statement, from onboarding",
  builtOut: "Built out in Positioning Builder",
  /** Each build continues the artifact (CEO, 19 Oct). */
  builtAgain: "Built out again",
  buildAgain: "Build it out again",
  /** Built out already, the start button opens it. */
  openIt: "Open your positioning",
  /** A closed statement, built out again (CEO, 19 Oct): it reopens, and
   *  says she had covered it before. */
  closedBefore: (date: string) => `You closed this statement on ${date}.`,
  reopened: (date: string) => `You closed this statement on ${date}, then built it out again.`,
  intro: "Here is a first draft of your bios and narrative, built on your statement. Change anything; it is yours.",
  copySection: (name: string) => `Copy ${name.toLowerCase()}`,
  copied: (name: string) => `${name} copied.`,
  /** Offered when she changes her statement. Never automatic. */
  refresh: {
    heading: "Your statement changed.",
    body: "Your bios and narrative still say the old one. Refresh them to match?",
    yes: "Refresh them",
    no: "Keep them as they are",
    done: "Refreshed, as a new version. The earlier one is still there.",
    what: "Bios and narrative refreshed from your statement",
  },
  nextUse: "Use the short bio wherever you are introduced, and the narrative to open your next conversation about scope.",
} as const;

/* -----------------------------------------------------------------------------
   GOES WITH THIS (the use case screen, option C)
   At most two pieces of work this draws on or leads to, each with one small
   action. Her positioning statement nearly always appears: every tool draws
   on it. Descriptions say what each is for, never what it will achieve.
   -------------------------------------------------------------------------- */

export const GOES_WITH = {
  /** Her statement, as other tools draw on it, by the tool being opened. */
  drawsOn: {
    pitch: "Your pitch draws on it for who you are.",
    "situation-brief": "Your opening statement draws on it.",
    // The promise is taken off (CEO, 19 Oct): the post doesn't draw on it.
    "thought-leadership": "",
    positioning: "",
  } as Record<ArtifactKind, string>,
  /** The work that uses her statement, from Positioning Builder. */
  usesStatement: "Uses your statement. Refresh it when your statement changes.",
  lastPitch: "Your last pitch. Start from it instead of a blank page.",
  waiting: "Still waiting to hear. Worth raising in the conversation.",
  todaysRead: "Write about today’s read, with it as your source.",
  todaysReadStatus: "Today’s Briefing",
  open: "Open",
  reuse: "Use as a start",
  startFrom: "Start from it",
} as const;

/* -----------------------------------------------------------------------------
   AFTER SHE SAYS HOW IT WENT (13 October)
   Her one-tap answer is the whole of the feedback: ExecHQ asks nothing more
   and always comes back with the next step, built by rules from her answer,
   the work itself and her Plan (no model in the pilot). One leads, and at
   most one more. A step only goes on her Plan when she says so. Written up
   per builder in builders/*.md ("After she answers").
   -------------------------------------------------------------------------- */

/** What ExecHQ can offer once she has answered. The first one leads. */
export type NextOffer =
  /** A Plan step to add. Without `stepId`, the one the brief's own goal
   *  points to (`HANDOFF_RULES`), or what's next on her Plan. */
  | { type: "plan-step"; stepId?: string; because?: string }
  /** Part of the work itself, to copy and use (the follow-up, a bio). */
  | { type: "copy"; sections: readonly string[]; title: string; body?: string; action: string; copied: string }
  /** A new one starting from this one, linked back (`reuse`). */
  | { type: "again"; title: string; body: string; action: string }
  /** Another tool, starting from this work (`after`). */
  | { type: "start"; tool: ArtifactKind; title: string; body: string; action: string }
  /** Today's Briefing, to write from. */
  | { type: "briefing"; title: string; body: string; action: string }
  /** A revision made at once, as a new version ("More specific"). */
  | { type: "sharpen"; choice: Readonly<Record<string, string>>; title: string; body: string; action: string; done: string }
  /** The next step already on her Plan. */
  | { type: "next-on-plan" };

export interface AfterAnswer {
  /** Says back what she answered. */
  readback: string;
  offers: readonly NextOffer[];
}

const NEXT_ON_PLAN: NextOffer = { type: "next-on-plan" };
const FROM_BRIEFING: NextOffer = { type: "briefing", title: "Write from today’s Briefing", body: "Three reads picked for you, each a way into your next post.", action: "Open today’s Briefing" };

export const AFTER_ANSWER: Record<ArtifactKind, Record<OutcomeType, AfterAnswer>> = {
  "situation-brief": {
    positive: {
      readback: "It went well.",
      offers: [
        { type: "plan-step" },
        { type: "copy", sections: ["email"], title: "Send the follow-up email", body: "It’s in the brief. Add what you agreed and when you’ll come back to them.", action: "Copy the follow-up email", copied: "Copied the follow-up email." },
      ],
    },
    neutral: {
      readback: "It was mixed.",
      offers: [
        { type: "copy", sections: ["email"], title: "Send the follow-up email", body: "It’s in the brief. Sending it keeps things moving.", action: "Copy the follow-up email", copied: "Copied the follow-up email." },
        { type: "plan-step" },
      ],
    },
    negative: {
      readback: "It didn’t go the way you hoped.",
      offers: [{ type: "again", title: "Prepare the next conversation", body: "A new brief for what comes next, starting from this one.", action: "Start a new brief" }, NEXT_ON_PLAN],
    },
    "no-response-yet": { readback: "It hasn’t happened yet.", offers: [NEXT_ON_PLAN] },
    "no-longer-relevant": { readback: "It’s no longer relevant, so it’s closed.", offers: [NEXT_ON_PLAN] },
  },
  pitch: {
    // In the words of "Did you hear back?" (Kate, 19 Oct).
    positive: {
      readback: "It’s on.",
      offers: [
        { type: "start", tool: "situation-brief", title: "Prepare for it", body: "A brief for the talk or the episode, starting from your pitch.", action: "Start a brief" },
        { type: "plan-step", stepId: "share-result-up", because: "A booking is a result worth sharing." },
      ],
    },
    neutral: {
      readback: "They want changes.",
      offers: [
        { type: "sharpen", choice: { specificity: "More specific" }, title: "Make the changes", body: "A new version of your pitch, more specific, for what they asked. The one you sent stays.", action: "Start a new version", done: "A new version, more specific. Change it to what they asked for." },
        NEXT_ON_PLAN,
      ],
    },
    negative: {
      readback: "They said not now.",
      offers: [
        { type: "again", title: "Try another stage", body: "A new pitch starting from this one. Try a different angle.", action: "Start a new pitch" },
        { type: "plan-step", stepId: "speaking-proposal", because: "Another way onto a stage the people above you watch." },
      ],
    },
    "no-response-yet": {
      readback: "Not yet.",
      offers: [{ type: "copy", sections: ["follow-up"], title: "Send the follow-up", body: "It’s in the pitch, written for when you hear nothing.", action: "Copy the follow-up", copied: "Copied the follow-up." }],
    },
    "no-longer-relevant": {
      readback: "You’ll try somewhere else, so this one is closed.",
      offers: [{ type: "again", title: "Pitch somewhere else", body: "A new pitch for another show or event, starting from this one.", action: "Start a new pitch" }, NEXT_ON_PLAN],
    },
  },
  "thought-leadership": {
    positive: {
      readback: "It landed well.",
      offers: [
        { type: "plan-step", stepId: "pitch-podcast", because: "Your post is the proof." },
        { type: "plan-step", stepId: "share-result-up", because: "A post that landed is a result worth sharing." },
      ],
    },
    neutral: { readback: "It was mixed.", offers: [FROM_BRIEFING, NEXT_ON_PLAN] },
    negative: {
      readback: "There wasn’t much response.",
      offers: [{ type: "again", title: "Try a different opening", body: "A new post starting from this one. Lead with another hook.", action: "Start a new post" }, FROM_BRIEFING],
    },
    "no-response-yet": { readback: "Nothing yet.", offers: [NEXT_ON_PLAN] },
    "no-longer-relevant": { readback: "It’s no longer relevant, so it’s closed.", offers: [NEXT_ON_PLAN] },
  },
  positioning: {
    positive: {
      readback: "It went well.",
      offers: [
        { type: "plan-step", stepId: "linkedin-post", because: "Say what you lead where more people will see it." },
        { type: "copy", sections: ["bio-long"], title: "Use the long bio on LinkedIn", body: "For your About section.", action: "Copy the long bio", copied: "Copied the long bio." },
      ],
    },
    neutral: {
      readback: "It was mixed.",
      offers: [
        { type: "sharpen", choice: { specificity: "More specific" }, title: "Sharpen it", body: "A new version of your bios and narrative, more specific. Your statement stays as it is.", action: "Make it more specific", done: "Sharpened: a new version, more specific." },
        NEXT_ON_PLAN,
      ],
    },
    negative: {
      readback: "It didn’t go the way you hoped.",
      offers: [
        { type: "plan-step", stepId: "ask-manager-scope", because: "So your story fits what they look for." },
        { type: "sharpen", choice: { specificity: "More specific" }, title: "Sharpen it", body: "A new version of your bios and narrative, more specific. Your statement stays as it is.", action: "Make it more specific", done: "Sharpened: a new version, more specific." },
      ],
    },
    "no-response-yet": {
      readback: "Nothing yet.",
      offers: [{ type: "copy", sections: ["bio-short"], title: "Use it where you’re next introduced", body: "The short bio fits a speaker list, an invite or an intro email.", action: "Copy the short bio", copied: "Copied the short bio." }],
    },
    // Her statement is what every tool draws on, so it never closes: ExecHQ
    // only stops asking about this use of it (13 Oct).
    "no-longer-relevant": { readback: "It’s no longer relevant. ExecHQ won’t ask about it again.", offers: [NEXT_ON_PLAN] },
  },
};

export const NEXT_STEP_COPY = {
  heading: "Your next step",
  notNow: "Not now",
  /** A note is hers to add, never asked for: every feedback card has it. */
  addNote: "Add a note",
  noteLabel: "Anything to add? Optional. Only you see it.",
  saveNote: "Save note",
  skipNote: "Skip",
  yourNote: "Your note:",
  /** A step to add to her Plan. */
  planStep: {
    label: "Add to your plan",
    add: "Add it to your plan",
    added: "Added to your plan.",
    open: "Open your plan",
    /** The brief's own goal, when the step comes from it. */
    because: (goal: string) => `For what you wanted from it: “${goal}”`,
    heard: (goal: string) => `From your brief: “${goal}”`,
    /** Why a fixed step, on her Plan card. */
    from: (title: string) => `After “${title}”`,
  },
  /** The next step already on her Plan. */
  nextOnPlan: { label: "Next on your plan", action: "Open your plan" },
  /** After "Nothing yet": when ExecHQ asks again, in the kind's own words. */
  askAgain: (kind: ArtifactKind, when: string) =>
    kind === "situation-brief" ? `ExecHQ will ask how it went ${when}.` : kind === "thought-leadership" ? `ExecHQ will ask how it landed ${when}.` : `ExecHQ will ask again ${when}.`,
  /** Once she has set it aside. */
  logged: (readback: string) => `Logged: ${readback.charAt(0).toLowerCase()}${readback.slice(1)}`,
  /** A tool started from earlier work: says what it started from. */
  startedFrom: (name: string) => `Started from ${name}`,
  /** On the answer it chose for her: "From your pitch". */
  fromEarlier: (name: string) => `From ${name}`,
} as const;

/* -----------------------------------------------------------------------------
   PLAYBOOK FLOW CONCEPT 3 — ANSWERS AS TAPS (13 October)
   Every question in the Interview is answered with chips: check all that
   apply, or pick one where there is only one answer, plus Other for her own
   words. Where ExecHQ knows something only she would say (her example
   answers here, from her plan and direction), it leads the chips, so a tap
   still says something specific; the guardrail holds: nothing is invented
   for her. A date or a pasted bio stays a field.
   -------------------------------------------------------------------------- */

export interface InterviewPick {
  mode: "one" | "many";
  options: readonly string[];
  /** Her own answer, from what ExecHQ knows, leads the options. */
  fromHer?: boolean;
}

export const INTERVIEW_PICKS: Record<ArtifactKind, Record<string, InterviewPick>> = {
  "situation-brief": {
    objective: { mode: "many", fromHer: true, options: ["A decision on scope", "Their support for what’s next", "A date for the next conversation"] },
    audience: { mode: "many", options: ["My manager", "My manager’s manager", "The CEO", "The CFO", "Peers from other teams", "HR"] },
    stakes: { mode: "many", options: ["Hitting the numbers", "Headcount and cost", "Risk", "Speed", "Customer impact", "Team capacity"] },
    evidence: { mode: "many", options: ["A result I delivered", "Feedback from a stakeholder", "Numbers from my team", "A plan I’ve already drafted"] },
    risks: { mode: "many", options: ["It takes time from current work", "Timing", "Budget", "Someone else wants it", "Not enough proof yet"] },
  },
  pitch: {
    // Who: the outlets that fit what she is pitching for (`suggestedOutlets`),
    // filled in by the Interview itself; these are the fallback.
    target: { mode: "one", options: ["The Marketing Leaders podcast", "The Commercial Strategy Summit", "Commercial Leader Quarterly"] },
    angle: { mode: "many", fromHer: true, options: ["How I run work across teams", "What planning teaches about scope", "A result from my region"] },
    proof: { mode: "many", fromHer: true, options: ["A result with a number I can share", "A talk or article I’ve done", "Feedback from a senior leader"] },
    audience: { mode: "one", fromHer: true, options: ["Senior executives", "Operators and practitioners", "Founders and investors"] },
    links: { mode: "many", options: ["A LinkedIn post", "A recording of a talk", "An article", "Nothing yet"] },
  },
  "thought-leadership": {
    topic: { mode: "one", fromHer: true, options: ["What planning taught me about scope", "How I run work across teams", "A lesson from this quarter"] },
    format: { mode: "one", options: ["LinkedIn post", "Short article", "Long-form article"] },
    pov: { mode: "one", fromHer: true, options: ["Leading across teams is the job now", "Delivery alone won’t get you the next role"] },
    cta: { mode: "one", fromHer: true, options: ["Share how their team does it", "Ask me a question", "Nothing: let it stand"] },
    evidence: { mode: "many", fromHer: true, options: ["A result from my team", "Numbers I can share", "A before and after", "Feedback I received"] },
    voice: { mode: "one", options: ["Plainer", "Warmer", "More direct"] },
    length: { mode: "one", options: ["Short", "Standard", "Long"] },
  },
  positioning: {
    knownFor: { mode: "many", fromHer: true, options: ["Bringing teams together", "Calm in a hard room", "Building teams others want to join"] },
    strengths: { mode: "many", options: ["Calm in a hard room", "Turning data into a decision", "Cross-team leadership", "Coaching people up"] },
    context: { mode: "many", options: ["A promotion conversation", "An executive introduction", "A conference program"] },
    audience: { mode: "one", options: ["Senior leaders where I work", "An external audience", "Recruiters and boards"] },
    format: { mode: "one", options: ["LinkedIn About section", "A speaker bio", "An internal profile", "An email introduction"] },
  },
};

export const PICK_COPY = {
  other: "Other",
  otherLabel: "Other",
  otherPlaceholder: "Write your own",
  many: "Pick all that apply.",
  and: "and",
  missing: "Pick at least one, or write your own.",
  skip: "Skip",
  /** On the drawer's fold: what it holds. */
  peek: "Tap to answer",
} as const;
