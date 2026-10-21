/**
 * Every screen of a flow, for the playground's every-screen view (designer,
 * 2026-10-15): the page and each sheet, end state and variant it can show,
 * so a review sees all the pieces at once instead of only the first screen.
 *
 * Each screen is the real concept page opened with a query its flow reads
 * (`?screen=`). Adding a flow here means teaching its page those screens.
 */
export interface FlowScreen {
  id: string;
  label: string;
  /** What to know about it: where it opens from, what changes it. */
  note?: string;
  /** The flow's own query, without `frame` or `full`. */
  query?: string;
  /** Show the whole length of the page in one phone. */
  full?: boolean;
}

export interface FlowScreens {
  flow: string;
  concept: string;
  title: string;
  screens: readonly FlowScreen[];
}

export const FLOW_SCREENS: readonly FlowScreens[] = [
  {
    flow: "profile",
    concept: "concept-1",
    title: "Profile",
    screens: [
      {
        id: "page",
        label: "The page, top to bottom",
        note: "Your organization shows only for a member; the dock's homepage states change who she is.",
        full: true,
      },
      { id: "account", label: "Edit your account", note: "The edit icon on Your account.", query: "screen=account" },
      { id: "publishers", label: "Your publishers", note: "The Publishers row. Briefing opens the same sheet.", query: "screen=publishers" },
      { id: "organization", label: "Leave your organization", note: "Leave organization, for a member.", query: "screen=organization" },
      { id: "delete", label: "Delete your account", note: "The Delete account row.", query: "screen=delete" },
      { id: "signed-out", label: "Signed out", note: "Sign out, at the foot of the page.", query: "screen=signed-out" },
      { id: "deleted", label: "Account deleted", note: "Delete my account, in its sheet.", query: "screen=deleted" },
    ],
  },
  {
    flow: "signals",
    concept: "concept-2",
    title: "Signal Picture",
    screens: [
      {
        id: "page",
        label: "The page, top to bottom",
        note: "Momentum, what came of it, where she started. The dock's homepage states change what she has; the first one asks where she is starting from. Edit shows only on rows she added herself, none in the sample states; its form is in the component catalogue under SignalEntrySheet.",
        full: true,
      },
      { id: "add", label: "Add to your picture", note: "Add, on Where you started.", query: "screen=add" },
      { id: "report-added", label: "What came of it: something she added", note: "Nothing reported yet, on a row she added. Needs a dock state with rows: Follow-up due shows it.", query: "screen=report-added" },
      { id: "report-loop", label: "What came of it: something ExecHQ made", note: "Nothing reported yet, on a row from her work in ExecHQ: how it went, then her words. Follow-up due has one; in a state where every row is answered it opens on an answered one, without How did it go?", query: "screen=report-loop" },
    ],
  },
  {
    flow: "playbook",
    concept: "concept-2",
    title: "Playbook",
    screens: [
      {
        id: "page",
        label: "The page, top to bottom",
        note: "The four tools, Next on your plan, then the library's folders. The dock's homepage states change what is in them; the first has only her statement.",
        full: true,
      },
      { id: "folder", label: "A folder, opened", note: "A folder card. The Status menu shows once a folder holds two statuses or more (Follow-up due's Pitches).", query: "folder=positioning", full: true },
      { id: "folder-empty", label: "An empty folder", note: "A folder with nothing in it yet.", query: "folder=thought-leadership&screen=folder-empty", full: true },
      { id: "search", label: "Search, nothing typed", note: "The magnifying glass beside Library.", query: "screen=search" },
      { id: "search-match", label: "Search, with matches", note: "Matches update as she types, across every folder.", query: "screen=search-match" },
      { id: "search-none", label: "Search, no match", query: "screen=search-none" },
      { id: "empty", label: "Nothing in the library", note: "Only someone who left onboarding before saving: her first step.", query: "screen=empty", full: true },
    ],
  },
  {
    flow: "playbook-flow",
    concept: "concept-3",
    title: "Playbook flow",
    screens: [
      { id: "start", label: "A tool's start screen", note: "Start, on a tool. The Situation Brief here; every tool has the same shape.", query: "tool=situation-brief", full: true },
      { id: "start-step", label: "Start, from a plan step", note: "A plan step's button: On your plan, with its answer chosen.", query: "tool=pitch&step=pitch-podcast", full: true },
      { id: "start-briefing", label: "Start, from a Briefing read", note: "Write a post about this, on a read: Thought Leadership with the read as its source.", query: "source=briefing&read=planning-season", full: true },
      { id: "start-statement", label: "Positioning: her statement from onboarding", note: "Positioning opens on her statement, version 1, to build out.", query: "tool=positioning", full: true },
      { id: "q-many", label: "A question: pick all that apply", note: "Chips, several at once, with Other.", query: "tool=situation-brief&screen=q-audience" },
      { id: "q-one", label: "A question: pick one", query: "tool=pitch&screen=q-audience" },
      { id: "q-date", label: "A question: a date, with Skip", note: "Optional questions come last, each with Skip.", query: "tool=situation-brief&screen=q-date" },
      { id: "q-final", label: "The last question: in her own words", note: "Its button writes the first draft.", query: "tool=situation-brief&screen=q-final" },
      { id: "draft", label: "The draft, with Change the draft", note: "What opens once a draft is written. Needs a dock state with drafts: Follow-up due.", query: "artifact=check-in-brief", full: true },
      { id: "draft-open", label: "The draft, opened", note: "Tapping the draft: the whole draft, with the fixed bar on the phone. Needs Follow-up due.", query: "artifact=check-in-brief&screen=draft-open", full: true },
      { id: "how-it-went", label: "Sent: How did it go?", note: "A pitch she has sent and is waiting to hear about. Needs Follow-up due.", query: "artifact=pitch", full: true },
    ],
  },
  {
    flow: "plan",
    concept: "concept-3",
    title: "Plan",
    screens: [
      {
        id: "page",
        label: "The move, drawer open",
        note: "What opens when no stage check-in is due. The dock's homepage states change her moves and her stage; states 2 to 5 open on the stage check-in instead.",
        query: "screen=plan-move",
      },
      { id: "folded", label: "The move, drawer folded: the roadmap", note: "Folding the drawer shows her direction and the stage cards under the move.", query: "screen=plan-folded", full: true },
      { id: "when", label: "Change when", note: "Change when, in the drawer: the times to choose from.", query: "screen=plan-when" },
      { id: "plan", label: "Answered: I’ll do it", note: "ExecHQ’s reply, then Next.", query: "screen=plan-plan" },
      { id: "pass", label: "Not for me: asking why", note: "One optional tap before ExecHQ offers something else.", query: "screen=plan-pass" },
      { id: "passed", label: "Not for me: passed on", note: "After the reason. What was offered in its place shows here when there is one.", query: "screen=plan-passed" },
      { id: "last", label: "The last page: where the plan stands", note: "After the last move: what changed on her plan.", query: "screen=plan-last" },
      { id: "none", label: "Nothing to answer right now", note: "When she has no live moves.", query: "screen=plan-none" },
      { id: "add", label: "Add something of your own", note: "Add, on the last page.", query: "screen=plan-add" },
      { id: "detail", label: "See your plan", note: "Beside Your roadmap: her plan, its stages and her direction.", query: "screen=plan-detail" },
      {
        id: "checkin",
        label: "Stage check-in: what you did",
        note: "Opens in place of the moves when ExecHQ decides a stage is finished. Here it uses her last finished stage, or the one she is in.",
        query: "screen=plan-checkin",
        full: true,
      },
      { id: "checkin-folded", label: "Stage check-in: folded", note: "The drawer folded to a peek.", query: "screen=plan-checkin-folded" },
      { id: "checkin-item", label: "Stage check-in: what came of it?", note: "One page for each thing she has not reported yet. With none, it shows the next page.", query: "screen=plan-checkin-item" },
      { id: "checkin-milestone", label: "Stage check-in: did you get there?", note: "Whether she got what finishing the stage looks like.", query: "screen=plan-checkin-milestone" },
      { id: "checkin-feeling", label: "Stage check-in: how do you feel about your plan?", query: "screen=plan-checkin-feeling" },
      { id: "checkin-summary", label: "Stage check-in: the read-back", note: "In her words, with sample answers.", query: "screen=plan-checkin-summary" },
    ],
  },
];
