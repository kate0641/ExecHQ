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
      { id: "report-added", label: "What came of it: something she added", note: "Nothing reported yet, on a row she added.", query: "screen=report-added" },
      { id: "report-loop", label: "What came of it: something ExecHQ made", note: "Nothing reported yet, on a row from her work in ExecHQ: how it went, then her words.", query: "screen=report-loop" },
    ],
  },
];
