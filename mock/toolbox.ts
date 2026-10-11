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

import type { ArtifactKind } from "@/mock/loop";

/* -----------------------------------------------------------------------------
   THE FOUR TOOLS
   -------------------------------------------------------------------------- */

export interface ToolUseCase {
  kind: ArtifactKind;
  name: string;
  /** One sentence: what it makes. */
  makes: string;
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
    name: "Positioning Builder",
    makes: "Your positioning statement, a bio in three lengths and a leadership narrative, in your words.",
    when: "Use it before anything that introduces you: a promotion conversation, a new boss, a conference program.",
    needs: ["Your statement from onboarding (ExecHQ has it)", "A few recent accomplishments, if you want them in"],
    planStepId: "bio",
    start: "Build out your positioning",
  },
  pitch: {
    kind: "pitch",
    name: "Pitch Builder",
    makes: "A pitch to a conference, a podcast or an editor, with subject lines and the follow-up already drafted.",
    when: "Use it when there is a stage or a show the people above you pay attention to.",
    needs: ["Who you are pitching, if you know", "One or two things you can prove"],
    planStepId: "pitch-podcast",
    start: "Start a pitch",
  },
  "situation-brief": {
    kind: "situation-brief",
    name: "Situation Brief",
    makes: "A one-page brief for a moment that matters: what you want from it, what you will say, what they will ask.",
    when: "Use it a day or two before a review, a board meeting, a negotiation or a hard conversation.",
    needs: ["What the moment is, and when", "What you want to come out of it"],
    planStepId: "brief-manager",
    start: "Start a brief",
  },
  "thought-leadership": {
    kind: "thought-leadership",
    name: "Thought Leadership Builder",
    makes: "A LinkedIn post or an article in your voice, from your own idea, a step on your plan or something you read.",
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
  kind: "text" | "long" | "choice";
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
];

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
  asked: "Only you can answer these.",
  optional: "Optional",
  edit: "Edit",
  keep: "Keep this",
  missing: "Answer this to write the draft.",
  write: "Write my first draft",
  writing: "Writing your first draft…",
  /** Under the button, so the enricher never reads as a gate. */
  notNeeded: "You don’t need anything else to start.",
} as const;

/* -----------------------------------------------------------------------------
   THE DRAFT
   A draft is sections; each section is segments. A segment is her words,
   ExecHQ's wording, or a question only she can answer. The editor shows the
   difference, so generated framing is never mistaken for what she said.
   -------------------------------------------------------------------------- */

export type DraftSegment =
  | { text: string; by: "you" }
  | { text: string; by: "exechq" }
  | { question: string };

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

export const DRAFT_COPY = {
  /** Never "your post": it is a draft until she marks it ready. */
  label: (n: number) => (n === 1 ? "First draft" : `Draft, version ${n}`),
  intro: "Here is a first draft of your post. Change anything; it is yours.",
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
  exportPdf: "Download as PDF",
  exportWord: "Download as Word",
  exported: (format: string) => `Downloading as ${format}.`,
  markReady: "Mark ready",
  ready: "Marked ready. ExecHQ will ask what came of it once you use it.",
  /** Where she can export, by kind: copy for every output, PDF and Word for
   *  the Situation Brief, bios and long-form articles (brief's proposed answer). */
  exportable: {
    positioning: true,
    pitch: false,
    "situation-brief": true,
    "thought-leadership": false,
  } as Record<ArtifactKind, boolean>,
  /** The Toolbox never publishes. */
  neverPosts: "ExecHQ never posts or sends anything for you.",
} as const;

/* -----------------------------------------------------------------------------
   USE CASE SCREEN
   -------------------------------------------------------------------------- */

export const USE_CASE_COPY = {
  needsHeading: "You’ll need",
  planHeading: "On your plan",
  /** When she came from a read: the source arrives with her. */
  fromBriefing: "Started from today’s Briefing",
} as const;
