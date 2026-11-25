/**
 * Dev handoff notes.
 *
 * Notes for the developers building ExecEngine: how a design decision becomes a
 * build rule, and what each screen does. Reference pages like the plan and
 * builder briefs, not product screens. One markdown file per note in
 * `/handoff`, read at build time on the server and drawn by the spec renderer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface HandoffNoteEntry {
  slug: string;
  title: string;
  description: string;
}

/** Newest first. */
export const HANDOFF_NOTES: readonly HandoffNoteEntry[] = [
  {
    slug: "home-no-why-you-2026-11-25",
    title: "Home: no Why you on the next-step card",
    description:
      "The next-step card shows Why this and Why now only, on Home's next step and under every ring; the step's why-you line stays for the advisor (25 Nov).",
  },
  {
    slug: "onboarding-first-move-why-2026-11-23",
    title: "Onboarding: why the story comes first",
    description:
      "Your plan's first move becomes Say what you lead today, and its line names her goal, says why it comes first and what she comes away with; the story question says why it asks about her role now, with LinkedIn's fact in place of Gallup's (23 Nov).",
  },
  {
    slug: "onboarding-no-boss-job-2026-11-23",
    title: "Onboarding: no \"My boss's job\"",
    description:
      "\"My boss's job\" is removed from Which role are you going for? as too confrontational, with its read-back, story and goal lines; A bigger role in another part of the business moves up from More in its place (23 Nov).",
  },
  {
    slug: "no-full-stops-in-headings-2026-11-23",
    title: "No full stops in headings",
    description:
      "Headings never end in a full stop: the Welcome, What ExecEngine is, Home's ring notes, Plan's guided end, the Briefing's end of the set, the Playbook's statement notice and Enterprise Concept 3's headlines (23 Nov).",
  },
  {
    slug: "onboarding-welcome-copy-2026-11-23",
    title: "Welcome and Login: new words",
    description:
      "The Welcome's heading, line and serif line all change: \"The private, personalized career growth platform for executives.\", \"Built exclusively around your goals, your ambitions and your path forward.\" and \"Part executive coach, part advisor, part confidant.\"; Login's dark panel and promise take the same serif line and line (23 Nov).",
  },
  {
    slug: "ux-review-2026-11-18",
    title: "UX review, 18 November: everything to build",
    description:
      "One page for the build: every change from the 18 Nov UX review, each with its spec and dated brief, and what is still open.",
  },
  {
    slug: "no-boards",
    title: "No boards",
    description:
      "Board meetings and board presentations are gone: the Situation Brief's A board meeting, Make the Move's signs, What's coming up?, Whose view matters? and Who decides it?, and the sample data (18 Nov).",
  },
  {
    slug: "briefing-spark-signals",
    title: "Briefing: Spark Signals",
    description:
      "Up to three opportunities a week after the Briefing's reads, on the page like them, in a carousel of light cards: a show, event or publication picked for her, with Start a pitch (Pitch Builder, outlet chosen) and an × for Not for me (18 Nov).",
  },
  {
    slug: "add-to-your-plan-cut",
    title: "Plan: Add to your plan is cut",
    description:
      "The floating + and Add to your plan, their sheet, and items marked Yours on the roadmap are gone from V1; ExecEngine's own offer of a move after a draft stays (18 Nov).",
  },
  {
    slug: "draft-saved-to-library",
    title: "Draft saved to your library",
    description:
      "In every builder, as a first draft opens: a card with a drawn check, Draft saved to your library, and Open your library; gone in about five seconds, paused while held (18 Nov).",
  },
  {
    slug: "positioning-builder-moments-first",
    title: "Positioning Builder: the moment first",
    description:
      "No statement from onboarding on the start screen or the check; Which moments is this one for? opens the interview; one statement for each moment, said on the start screen; the bio field is twice as tall (18 Nov).",
  },
  {
    slug: "advisor-without-the-logo",
    title: "Ask your advisor, without the logo",
    description:
      "The Ask or go panel's start screen loses the ExecEngine logo; Your advisor and Ask me become one heading, Ask your advisor. The Enterprise Dashboard's advisor is unchanged (18 Nov).",
  },
  {
    slug: "inside-the-company-only",
    title: "Inside the company only",
    description:
      "Recruiters, boards and a way out are gone from the product: Positioning Builder's audience, the bio's audience and why, A board seat, Explore what else is out there, and the unused Get out of where I am (18 Nov).",
  },
  {
    slug: "plan-items-are-moves",
    title: "Every plan item is a move",
    description:
      "Everything on a person's plan is a move on every page they see: Start your first move, Your next move, 3 moves; step stays for progress through a flow; the Enterprise Dashboard's planned actions is unchanged (18 Nov).",
  },
  {
    slug: "onboarding-plan-horizons-grouped",
    title: "Onboarding: Your plan groups each horizon",
    description:
      "Each horizon on Your plan is one group with its count of steps; the short-term stays open under Start here and Then, this week; the medium-term and long-term fold until opened (18 Nov).",
  },
  {
    slug: "onboarding-how-it-works-line",
    title: "Onboarding: What ExecEngine is says how it works",
    description:
      "A line under What ExecEngine is's heading: ExecEngine gathers insight from you to create a customized path forward. The page grows to 52 words (17 Nov).",
  },
  {
    slug: "home-stage-line",
    title: "Home: the stage she is in, and every stage counted",
    description:
      "Home's What you're working on now says Stage 1 of 4 · Say what you lead, as the plan page does; onboarding now counts the stage each plan's roadmap adds, so every page says 1 of 4 (17 Nov).",
  },
  {
    slug: "onboarding-plan-named-in-heading",
    title: "Onboarding: Your plan is named in the heading",
    description:
      "Your plan's heading is the plan's name, with no label; the stage line moves under What you're working on now; no stage bar or progress line; Home's Your Progress Tracker becomes What you're working on now (17 Nov).",
  },
  {
    slug: "onboarding-internal-interview",
    title: "Onboarding: an internal interview",
    description:
      "What's coming up? says An internal interview (was An interview for a role here); Choose your plan takes the label Your first step (16 Nov).",
  },
  {
    slug: "onboarding-plan-is-the-last-page",
    title: "Onboarding: Your plan is the last page",
    description:
      "Done folds into Your plan, which shows stage 1 as Home's short-term, medium-term and long-term, with Start your first step on the first; the stages ahead fold away; home is a text link (16 Nov).",
  },
  {
    slug: "onboarding-pick-a-first-step",
    title: "Onboarding: pick a first step",
    description:
      "Where do you want to start? is labelled Your first step, and its line says the plan she picks is where she begins and can be changed at any time (16 Nov).",
  },
  {
    slug: "onboarding-done-starts-the-step",
    title: "Onboarding: Done starts the step",
    description:
      "Her plan saved comes first; the first step's card carries its own button, Start your first step; Go to my homepage stays at the foot; more room between the parts (13 Nov).",
  },
  {
    slug: "onboarding-no-tick-boxes",
    title: "Onboarding: no tick boxes on Where are you today?",
    description:
      "The tick boxes go; picked answers turn white, as on every question. Several answers and Other's field are unchanged (13 Nov).",
  },
  {
    slug: "onboarding-plans-open-first",
    title: "Onboarding: a plan opens before it's chosen",
    description:
      "Pressing a plan opens it in place: Pick this if, three signs, what she comes away with, and Use this plan, which moves straight on. I can't decide is a link at the foot of the list (13 Nov).",
  },
  {
    slug: "welcome-login-and-codes",
    title: "Welcome offers Log in; any code works",
    description:
      "A first visit opens Welcome, which now offers \"Already have an account? Log in\". In the prototype any six digits confirm an email code; 000000 shows the error (13 Nov).",
  },
  {
    slug: "onboarding-pick-plan-first",
    title: "Onboarding: she picks her plan first",
    description:
      "Straight after Account, the five plans: she picks one and its own questions make it hers, or presses I can't decide and goes the long way to ExecEngine's pick (13 Nov).",
  },
  {
    slug: "onboarding-ends-at-done",
    title: "Onboarding: it ends at Done",
    description:
      "Done comes right after the plan, with this week's step and two ways on: Get started with your plan or Go to my homepage. The story and first draft become optional (12 Nov).",
  },
  {
    slug: "onboarding-first-visit-tour",
    title: "Onboarding: a short tour of Home",
    description:
      "After onboarding, Home opens with a three-stop tour: the Ask or go pill, Go to, and chatting with ExecEngine; skippable, once (12 Nov).",
  },
  {
    slug: "onboarding-plan-as-a-path",
    title: "Onboarding: the plan, as a path",
    description:
      "The plan's two pages become one path to her goal, with this week's step as the Plan page's move card; every stage's \"done when\" becomes a sign it's working, on the Plan page too (12 Nov).",
  },
  {
    slug: "onboarding-meatier-questions-all-paths",
    title: "Onboarding: meatier questions on every path",
    description:
      "Step Up, Make Your Mark, Make the Move and Find your next direction ask about a real role, person, moment or decision; some take one answer; two routing answers renamed (12 Nov).",
  },
  {
    slug: "onboarding-meatier-influence-questions",
    title: "Onboarding: meatier influence questions, and nothing that assumes leaving",
    description:
      "The influence path asks which decision she wants a say in and who decides it; answers that assumed leaving the company are swapped for ones inside it (12 Nov).",
  },
  {
    slug: "onboarding-drop-holding-you-back",
    title: "Onboarding: \"What's holding you back?\" is dropped",
    description:
      "The question before the plan on the influence path is removed, with its routing; those directions go from narrowing straight to Choose your plan (12 Nov).",
  },
  {
    slug: "onboarding-choose-your-plan",
    title: "Onboarding: she chooses her plan",
    description:
      "The Recommendation becomes Choose your plan: all five plans on one page, ExecEngine's pick first, marked and chosen to start with; See other plans is removed. About 110 words to 13 (12 Nov).",
  },
  {
    slug: "plan-names-from-briefs",
    title: "The plans take the plan briefs' names",
    description:
      "Step Up, Make Your Mark, Make the Move and Lead Where You Are, everywhere a plan is named; Find your next direction keeps its name until its brief is rewritten. Stages unchanged (12 Nov).",
  },
  {
    slug: "onboarding-direction-within-company",
    title: "Onboarding: a move within the company, not out of it",
    description:
      "\"Find my next move\" becomes \"Make a move within my company\" (another function, or another part of the business), \"Get out of where I am\" is removed, and the presentation answer drops \"board\" (12 Nov).",
  },
  {
    slug: "onboarding-where-are-you-today",
    title: "Onboarding: Where are you today?",
    description:
      "A new question before Direction, with tick boxes and Other opening a field for her own words; Direction shows \"I'm not sure yet\" with the first five; the answer opens the Recommendation's reason and the plan page's read-back (12 Nov).",
  },
  {
    slug: "onboarding-linkedin-to-signals",
    title: "Onboarding: LinkedIn moves to Signals",
    description:
      "The Signals step and the LinkedIn upload page leave onboarding; Account goes straight to Direction and Done no longer mentions LinkedIn. The Signals page's own upload is unchanged (12 Nov).",
  },
  {
    slug: "onboarding-account-personal-email",
    title: "Onboarding: a personal email, and everyone has a code",
    description:
      "Account asks for \"Your personal email\" with the reason under it, then \"Your invite code\" as a required field; \"I don't have a code\" is gone, and the page drops from 55 words to 29 (12 Nov).",
  },
  {
    slug: "onboarding-what-execengine-is",
    title: "Onboarding: What ExecEngine is, in a glance",
    description:
      "Three statements, the four Playbook tools by name and privacy in a line, built in one idea at a time over about five seconds; 40 words, down from about 120 (12 Nov).",
  },
  {
    slug: "onboarding-welcome-line",
    title: "Onboarding: the Welcome's new line",
    description:
      "The Welcome's line becomes \"Part coach, part advisor, part confidant. Private to you, and built around where you want to go.\" on phone, tablet and web; heading and serif line unchanged (12 Nov).",
  },
  {
    slug: "onboarding-progress-and-word-budget",
    title: "Onboarding: a progress line, and forty words a screen",
    description:
      "A thin line with no words at the top of every onboarding page after the Welcome, filled to how far she is; and the rule that every screen says what it needs in 40 words or fewer (12 Nov).",
  },
  {
    slug: "renamed-execengine",
    title: "Renamed: ExecHQ is now ExecEngine",
    description:
      "Every on-screen mention, the address bar and the Profile download say ExecEngine; the logo sets \"Engine\" in type until the artwork arrives. Storage keys and code names keep exechq (12 Nov).",
  },
  {
    slug: "date-format",
    title: "Dates: short day and month",
    description:
      "Every full date is now written short, \"Thu, Nov 12, 2026\", replacing the spelled-out style of 2 Nov (12 Nov). Ranges, times and relative words like \"last Tuesday\" explained.",
  },
  {
    slug: "plan-fold-to-card",
    title: "Plan: folding leaves no bar",
    description:
      "On phone and tablet, folding the answer drawer takes it off the screen; the move card gains a \"Where are you with this?\" button that opens and folds it, filled while open (11 Nov).",
  },
  {
    slug: "plan-direction-card",
    title: "Plan: See your plan is gone",
    description:
      "The plan sheet and its See your plan link are removed (9 Nov). Why this plan and Change your direction, the two things only the sheet had, move onto the Your direction card above the roadmap.",
  },
  {
    slug: "plan-timing",
    title: "Plan: when a move falls",
    description:
      "The exact rules for each move's suggested day and its words (\"This week\", \"Next month\"), Change when's choices and stage periods, with a worked example and four choices still open (9 Nov).",
  },
  {
    slug: "stay-on-track-web",
    title: "Home on web: Stay on track's cards",
    description:
      "A web-only change to Homepage 4b (9 Nov): Stay on track's cards keep the Signal Picture column's width and sit side by side, with the dots left out when every card is in view.",
  },
  {
    slug: "homepage-weekly-check-in",
    title: "Homepage: the weekly check-in",
    description:
      "Homepage 4b replaces 4 (26 Oct). The one change: a weekly check-in card in Stay on track, a new slider, the direction in its question, what each answer changes in the plan, and the totals it feeds to the Admin Dashboard.",
  },
  {
    slug: "mobile-browser",
    title: "Mobile browser",
    description:
      "ExecEngine runs in the phone's browser, not as an app (19 Oct). How to size screens to the room Safari leaves, the four layout patterns, and what each screen pins and flexes.",
  },
];

export interface HandoffNote extends HandoffNoteEntry {
  /** Path shown on the page so the file is easy to find and open. */
  path: string;
  /** File contents, or null when the note isn't written yet. */
  content: string | null;
}

const HANDOFF_DIR = join(process.cwd(), "handoff");

export function getHandoffNote(slug: string): HandoffNote | undefined {
  const entry = HANDOFF_NOTES.find((note) => note.slug === slug);
  if (!entry) return undefined;
  const path = `handoff/${slug}.md`;
  try {
    return { ...entry, path, content: readFileSync(join(HANDOFF_DIR, `${slug}.md`), "utf8").trim() };
  } catch {
    return { ...entry, path, content: null };
  }
}
