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
