/**
 * What the Concierge says — Navigation Concept 1.
 *
 * He is the onboarding advisor (same mark, same name, same voice), now on
 * every signed-in page. Everything he says in the prototype is written here
 * ahead of time: there is no AI in this repo. What he *does* is real, through
 * the Loop: see `lib/concierge.ts`.
 *
 * Voice, from the brand document and the Sprint 2 brief: calm authority,
 * short sentences, no filler. "Nothing yet" is a normal answer. Outcomes are
 * recorded without claiming the artifact caused them.
 *
 * By decision on 2026-09-28 he gives open advice as well as acting on the
 * record. The PRD says the pilot is "not an always-on coaching product", so
 * that is a scope decision to raise with the client.
 */

export const CONCIERGE_COPY = {
  name: "ExecHQ",
  role: "Your advisor",
  pillAsk: "Ask or go",
  placeholder: "Ask or go…",
  newConversation: "New chat",
  close: "Close the advisor",
  goHint: (label: string) => `Go to ${label}`,

  /** The empty panel's sections. */
  goTo: "Go to",
  resumeEyebrow: "Pick up where you left off",
  askMe: "Ask me",

  /** Suggested questions, by what is going on. */
  suggest: {
    followUp: (name: string) => `Tell you what came of ${name}`,
    prep: (name: string) => `Help me finish ${name}`,
    next: "What’s next on my plan?",
    scope: "How do I ask for more scope?",
    recall: "What have I done so far?",
  },

  going: (place: string) => `Here’s ${place}.`,
  places: {
    homepage: "Home",
    plan: "your plan",
    toolbox: "the Toolbox",
    "daily-briefing": "today’s Briefing",
    profile: "your profile",
  } as Record<string, string>,

  orOwnWords: "Tap an answer, or tell me in your own words.",
  nothingDue: "Nothing is waiting on you right now.",

  logged: (detail: string) => `Logged, in your words: “${detail}”`,
  loggedPlain: (readback: string) => `Logged. ${readback}`,
  nothingYet: "No problem. “Nothing yet” is a normal answer.",
  askAgain: (when: string) => `I’ll ask again ${when}.`,
  stopAsking: "I won’t ask again. Tell me whenever there’s news.",
  noLongerRelevant: "Logged, and I won’t ask about it again.",
  notAVerdict: "That’s useful to know, not a verdict. Do you want to talk it through?",
  nextStepCard: (title: string) => `Next on your plan: ${title}`,
  takeIt: "Take it on",
  notNow: "Not now",
  talkItThrough: "Talk it through",
  whatsNext: "What’s next?",
  takenOn: "It’s your next step now. You’ll find it on Home.",
  goHome: "Go to Home",
  setAside: "Understood. It’s logged and closed.",

  whichOne: "Which one did you use?",
  checkBackAsk: (verb: string, name: string) => `Marking ${name} as ${verb}, today. When should I check back?`,
  inDays: (days: number) => (days === 7 ? "In a week" : `In ${days} days`),
  inAWeek: "In a week",
  dontCheck: "Don’t check back",
  markedNoCheck: (label: string) => `Marked as ${label.toLowerCase()}. I won’t ask about it; tell me what came of it any time.`,
  marked: (label: string, when: string) => `Marked as ${label.toLowerCase()}, today. I’ll ask how it went ${when}.`,
  nothingToMark: "There’s nothing open to mark as used. Everything you’ve made is already used or done.",

  prep: (name: string) =>
    `${name.charAt(0).toUpperCase()}${name.slice(1)} is still a draft. The part worth doing first is the opening: it\u2019s what people hear or read before anything else.`,
  openIt: "Open it",
  helpOpening: "Help me with the opening",
  opening: [
    "Try this, then make it yours:",
    "“I’d like ten minutes on scope. Over the last quarter I’ve taken on more than my role describes, and I want to talk about what that should look like formally.”",
    "It names the topic, points at evidence you already have, and asks for a conversation rather than a decision.",
  ],

  recallWaiting: (sentence: string) => `${sentence} You haven’t told me what came of it yet.`,
  tellYouNow: "Tell you now",
  recallNone: "You haven’t used anything yet. Your first draft is waiting on Home.",
  recallAll: (count: string, outcomes: string) => `You’ve used ${count} so far, and told me what came of ${outcomes}.`,

  next: (title: string, why: string) => `Next on your plan: ${title}. ${why}`,
  openPlan: "Open my plan",

  scope: {
    lead: "Here’s how I’d approach it, from what you’ve told me.",
    list: [
      "Ask for a piece of work before a title. A cross-functional project is the cleanest first step toward a broader organization, and much easier to say yes to.",
      "Bring the proof in writing. Your recent wins are your strongest case. Senior people decide on paper, even after a good conversation.",
      "Find out who else decides. Your manager may not decide alone. Ask who weighs in, and what they’d need to see.",
    ],
    after: "Your next conversation with your manager is the place to start.",
  },
  politics: [
    "Two things usually help.",
    "First, ask the people who’ll weigh in what they need to see before they’d back you. Senior people respect the question, and it tells you what to prove.",
    "Second, make the work visible to them before the decision, not at it. A two-line note after each win does more than a big presentation later.",
    "Who are you thinking of? It stays between us.",
  ],
  fallback: [
    "I don’t have a written answer for that in this prototype. The real advisor answers from everything in your account.",
    "Here I can take you anywhere, log what happened, mark something used, help you finish a draft, remind you what you’ve done, and talk through asking for more scope.",
  ],
} as const;
