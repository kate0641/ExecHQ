/**
 * The Toolbox's words: the four tools, what each asks for, and Maya's drafts.
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
    start: "Build out your positioning",
  },
  pitch: {
    kind: "pitch",
    label: "Pitch builder",
    name: "Pitch Builder",
    makes: "A pitch to a conference, a podcast or an editor, with subject lines and the follow-up already drafted.",
    short: "Pitches for stages, shows and press",
    when: "Use it when there is a stage or a show the people above you pay attention to.",
    needs: ["Who you are pitching, if you know", "One or two things you can prove"],
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
export type InputSource = "direction" | "plan" | "onboarding" | "briefing" | "profile";

export const SOURCE_LABELS: Record<InputSource, string> = {
  direction: "From your direction",
  plan: "From your plan",
  onboarding: "From onboarding",
  briefing: "From today’s Briefing",
  profile: "From your Profile",
};

export interface ToolInput {
  id: string;
  label: string;
  /** A line under the label, when the label alone is not enough. */
  hint?: string;
  kind: "text" | "long" | "choice" | "date";
  options?: readonly string[];
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

/** Thought Leadership Builder opened from the Toolbox or a plan step: no
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
  names: { audience: "audience", example: "example", role: "role", statement: "positioning statement", toward: "direction" } as Record<string, string>,
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
  back: "Toolbox",
  backLabel: "Back to the Toolbox",
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
  inputsChanged: "Inputs changed",
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
  /** Concept 3: the card before there is a written draft, and where an
   *  answer lands, under the question. */
  soFar: "Your draft so far",
  landsIn: "In your draft",
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
  laterTool: "This tool’s steps are designed once a Toolbox concept is chosen. Thought Leadership Builder shows how they will work.",
  reusedFrom: (title: string) => `Started from ${title}`,
  /** A version she kept before the Toolbox existed. */
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
  /** The Toolbox never publishes. */
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
  searchHint: "Searches titles and what they say.",
  noMatch: (q: string) => `Nothing in your library mentions “${q}”.`,
  clearSearch: "Clear search",
  filters: {
    all: "All",
    tool: "Tool",
    status: "Status",
    area: "Plan area",
    /** Concept 1's three menus, as a group. */
    button: "Filter your library",
    /** A menu's button once something is chosen: "Tool: Pitch Builder". */
    chosen: (filter: string, choice: string) => `${filter}: ${choice}`,
    showClosed: "Show closed",
    clear: "Clear filters",
    closedHidden: "closed hidden",
    noneMatch: "Nothing in your library matches these filters.",
  },
  /** "Last changed today", "Last changed on Tuesday". */
  edited: (when: string) => `Last changed ${when}`,
  versions: (n: number) => (n === 1 ? "1 version" : `${n} versions`),
  /** The link back to where it came from, on the row. */
  forStep: (title: string) => `For: ${title}`,
  fromRead: "Started from today’s Briefing",
  /** The one-sentence statement from onboarding, first in her library. */
  statementInvite: "Build it out in Positioning Builder: a bio in three lengths and your leadership narrative.",
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
  closeSuggest: "You’ve said what came of it. Close it?",
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
    /** The folder's own page (phone): back to the Toolbox. */
    backToToolbox: "Toolbox",
    /** The status chips over a folder's list, each with how many it holds. */
    filter: "Show",
    all: "All",
    chip: (label: string, n: number) => `${label} ${n}`,
    /** The third line of a row in a folder: what comes next for it. */
    next: {
      draft: "Finish the draft",
      ready: (kind: ArtifactKind) =>
        ({ pitch: "Send it when you’re ready", "thought-leadership": "Publish it when you’re ready" })[kind as string] ?? "Use it when you’re ready",
      checksBack: (when: string) => `ExecHQ checks back ${when}`,
      sayHow: "Say how it went",
      close: "Close it when you’re done",
      closed: "Nothing more to do",
    },
    noneInStatus: (status: string) => `Nothing here is ${status.toLowerCase()}.`,
    open: (name: string) => `Open ${name}`,
    results: (n: number, q: string) => (n === 1 ? `1 match for “${q}”` : `${n} matches for “${q}”`),
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
   THE TOOLBOX PAGE
   The four tools always lead, for new and returning users alike, with the
   library below. On a phone the tools stay compact enough that the library is
   reachable without a long scroll.
   -------------------------------------------------------------------------- */

export const TOOLBOX_PAGE = {
  title: "Toolbox",
  lead: "Four ways to make your next draft.",
  /** Over the tool her next plan step needs (Concept 1). */
  nextOnPlan: "Next on your plan",
  toolsLabel: "Tools",
  /** Concept 1: the draft she touched last, and the others from 30 days. */
  pickUp: {
    heading: "Pick up where you left off",
    more: (n: number) => `${n} more from the last 30 days`,
    fewer: "Show fewer",
    detail: (status: string, date: string) => `${status} · ${date}`,
    /** How far back "more" reaches, in days. */
    days: 30,
  },
  /** Concept 1, under the tools: what she says opens the advisor, who
   *  suggests the tool. */
  mind: {
    label: "What’s on your mind?",
    /** The field's placeholder. It has to fit beside the send arrow on a
     *  phone, so it is shorter than the hint it replaced. */
    hint: "ExecHQ will suggest a tool",
    /** The send arrow's name. */
    go: "Find the right tool",
  },

} as const;

/** The rules for picking a tool from what she says (the advisor answering
 *  Toolbox Concept 1's "What's on your mind?"). The
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

/** Status filters (Concept 1), in the Loop's order, with the Sprint 2 names. */
export const STATUS_FILTERS: readonly { id: string; label: string; states: readonly string[] }[] = [
  { id: "draft", label: "Draft", states: ["drafted", "in-progress"] },
  { id: "ready", label: "Ready to use", states: ["ready"] },
  { id: "used", label: "Used, sent or published", states: ["used"] },
  { id: "waiting", label: "Waiting to hear", states: ["waiting"] },
  { id: "outcome", label: "Outcome logged", states: ["outcome"] },
  { id: "closed", label: "Closed", states: ["closed"] },
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
  {
    id: "target",
    label: "Who are you pitching?",
    hint: "The event, show or outlet, if you know it.",
    kind: "text",
    optional: true,
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
  {
    id: "audience",
    label: "Who is it for?",
    kind: "text",
    value: "Marketing and commercial leaders",
    source: "direction",
  },
  { id: "links", label: "Links or earlier talks", kind: "text", optional: true, placeholder: "A post, a recording, a past talk" },
  // Who she is, for the pitch's introduction and "Why me" (the PRD's career
  // direction and plan context). Known, shown to check, never asked.
  { id: "role", label: "Your role, as you’d say it", kind: "text", source: "plan" },
  { id: "statement", label: "Your positioning statement", kind: "long", source: "onboarding" },
];

export const BRIEF_INPUTS: readonly ToolInput[] = [
  { id: "type", label: "What is the moment?", kind: "choice", options: ["A review", "A board meeting", "A negotiation", "An executive conversation", "Something else"] },
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

/** Maya's artifacts made before the Toolbox existed (the homepage states):
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
  positioning: { knownFor: "Known for", context: "Introduction", audience: "Audience", format: "Format", source: "Source text" },
  pitch: { type: "Pitching for", angle: "Angle", proof: "Proof" },
  "situation-brief": { type: "Moment", objective: "Outcome", audience: "Who’s there", stakes: "Their stakes", risks: "Risks" },
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
    on: "When",
    confirm: "Mark sent",
    cancel: "Not yet",
  },
  /** Situation Brief: when a date is known, the follow-up lands after it. */
  askAfter: (when: string) => `ExecHQ will ask how it went ${when}.`,
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
  {
    id: "context",
    label: "An introduction for a particular moment",
    kind: "choice",
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
    "thought-leadership": "Your post draws on it for what you lead.",
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
    positive: {
      readback: "It went well.",
      offers: [
        { type: "start", tool: "situation-brief", title: "Prepare for it", body: "A brief for the talk or the episode, starting from your pitch.", action: "Start a brief" },
        { type: "plan-step", stepId: "share-result-up", because: "A booking is a result worth sharing." },
      ],
    },
    neutral: {
      readback: "It was mixed.",
      offers: [{ type: "again", title: "Pitch the next one", body: "A new pitch for another show or event, starting from this one.", action: "Start a new pitch" }, NEXT_ON_PLAN],
    },
    negative: {
      readback: "It didn’t go the way you hoped.",
      offers: [
        { type: "again", title: "Try another stage", body: "A new pitch starting from this one. Try a different angle.", action: "Start a new pitch" },
        { type: "plan-step", stepId: "speaking-proposal", because: "Another way onto a stage the people above you watch." },
      ],
    },
    "no-response-yet": {
      readback: "Nothing yet.",
      offers: [{ type: "copy", sections: ["follow-up"], title: "Send the follow-up", body: "It’s in the pitch, written for when you hear nothing.", action: "Copy the follow-up", copied: "Copied the follow-up." }],
    },
    "no-longer-relevant": { readback: "It’s no longer relevant, so it’s closed.", offers: [NEXT_ON_PLAN] },
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
   TOOLBOX FLOW CONCEPT 3 — ANSWERS AS TAPS (13 October)
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
    target: { mode: "one", fromHer: true, options: ["An industry conference", "A trade publication", "An internal leadership forum"] },
    angle: { mode: "many", fromHer: true, options: ["How I run work across teams", "What planning teaches about scope", "A result from my region"] },
    proof: { mode: "many", fromHer: true, options: ["A result with a number I can share", "A talk or article I’ve done", "Feedback from a senior leader"] },
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
    context: { mode: "one", options: ["A promotion conversation", "An executive introduction", "A conference program"] },
    audience: { mode: "one", options: ["Senior leaders where I work", "An external audience", "Recruiters and boards"] },
    format: { mode: "one", options: ["LinkedIn About section", "A speaker bio", "An internal profile", "An email introduction"] },
  },
};

export const PICK_COPY = {
  other: "Other",
  otherLabel: "In your own words",
  otherPlaceholder: "Write your own",
  many: "Pick all that apply.",
  and: "and",
  missing: "Pick at least one, or write your own.",
  skip: "Skip",
} as const;
