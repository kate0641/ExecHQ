# Sprint 4 — Toolbox and Daily Briefing: review notes

_Written 11 October 2026 from the built prototype. Everything below is on `main`; nothing is pushed yet. Toolbox notes will be added when the Toolbox concepts are built._

## 1. Say this at kickoff

**The brief was amended on 11 October.** Three changes govern over the PDF:

1. The library is never empty for someone who finished onboarding. Their one-sentence positioning statement is their first artifact, with an invitation to build it out in Positioning Builder. Only someone who left onboarding before saving sees an empty state, which points to their first action step.
2. Each feature gets three concepts: two safe and one wild card. Every Toolbox concept leads with the tools and puts the library below them. Concepts vary in how the tools are presented, how creating works (guided steps, a document workspace, or starting from the situation) and how the library is organised.
3. The Toolbox always opens with the four tools at the top and the library below, for new and returning users alike. Any artifact shown in the Plan, an action step or a Loop follow-up opens that artifact directly, without going through the Toolbox page.

**"Active Landscape" is "action steps"** in the prototype, as in Sprint 3.

**Every publisher in the prototype is invented.** So are the three reads' headlines, summaries and highlighted passages. They are written for Maya and are not real articles. Real publisher names were dropped so that nothing invented is attributed to a real publication on a public site.

## 2. The Briefing concepts

All three share the same first visit, reads, reason lines and actions, so the comparison is about layout and how a read is met.

| Concept | Route | Kind | In one line |
| --- | --- | --- | --- |
| 1 — Front page | `/daily-briefing/concept-1` | Safe | Today's three as a stack of cards (option B, chosen 11 October): one open in full, the other two as strips tucked against it that open in their place, each saying "1 of 3". The same on every screen. Tapping the open card (its headline is underlined) opens the article at its publisher in a new tab; there is no Read button (13 October). In the prototype that tab is a plain stand-in page, `/source/<read>`, because every publisher is invented. Publishers are changed on the page. |
| 2 — News app | `/daily-briefing/concept-2` | Safe | Option A, chosen 11 Oct (replaces One at a time). A front page like a news app: the lead story with a big picture, the other two as rows with a small one, each with why it is here, then "That's today's three". A story opens a reader screen: "1 of 3", the picture, the whole article read in ExecHQ (13 October: she never leaves for the publisher), with ExecHQ's notes on highlighted, numbered passages all the way through (under the paragraph on phone and tablet, in the margin on web), a credit to the publisher, then where she finishes reading: Save, "Was this worth your time?", the "Write a post about this" card (Thought Leadership Builder with the article as its source) and Next. "Today's three" at the top, beside "1 of 3", goes back to the front page. No bar at the foot, and no Ask or go pill while she reads (14 October; the five-button bar was dropped). On web the lead takes the left of the front page. Pictures are tinted stand-ins naming the publisher until image rights are settled. No topic tabs, counts or times, and no Read tag on the front page (13 October). Showing whole articles needs a licence from each publisher; the article text and notes are invented. |
| 3 — Annotated | `/daily-briefing/concept-3` | Wild card, **scratched 13 October** and moved to the `scratch` branch; no longer on `main` (its notes on passages live on in Concept 2) | Each read has one highlighted passage with ExecHQ's note on it. Tapping the passage opens a sheet with "Respond to this". On web the note moves into the margin and she can select her own passage. |

**Review the riskiest states first, as the brief asks.**

- **First visit.** Any concept, after the dock's reset. Publishers are chosen before the first set loads; the suggested set is one press.
- **The hand-off.** "Write a post about this" (Concepts 1 and 2) or "Respond to this" (Concept 3). It lands on Thought Leadership Builder, which is still the Sprint 4 stub until the Toolbox concepts are built. The link already carries the read, and the passage when there is one, so the builder can show its source the moment it exists. The `SourceLabel` component ("Started from today's Briefing") is in the catalogue now.

**Choosing publishers.** The choice is shared across all three concepts. The dock's reset puts the first visit back.

## 3. The shared Toolbox pieces (stage 3)

Built once, in the catalogue (`/showroom/components`), for all four tools and all three Toolbox concepts:

- **ToolUseCase.** One sentence on what the tool makes, one on when to use it, what she'll need, and the step on her plan it serves.
- **InputPanel.** What ExecHQ already knows arrives filled in, says where it came from ("From your plan", "From your direction") and can be edited. Only what only she can answer is asked.
- **EnricherCard.** Offered inside the flow, and never a gate. "Not now" is as easy as adding it.
- **DraftEditor.** Always called a draft. Her words are in full ink; ExecHQ's wording is quieter, with a dotted underline, and there's a key. What only she knows is a dashed question in the text, gathered under the draft to answer, never invented. Any part can be rewritten, and is then hers.
- **RevisionControls.** Voice, specificity, length, audience and emphasis, one tap each, plus a line in her own words.
- **VersionHistory.** Every change is saved. Bringing a version back saves it as a new version, so nothing is lost.
- **DraftUseBar.** Copy, worded for what she'll do ("Copy to post on LinkedIn"); PDF and Word only where they are in scope; Mark ready.
- **The Loop status for a closed artifact now reads "Closed", not "Done"**, everywhere it appears.

## 3a. The Toolbox concepts (stage 4)

Every concept leads with the four tools and puts the library below, per the 11 October amendment. Each pairs a Toolbox page (`/toolbox/concept-N`) with a tool flow (`/toolbox-flow/concept-N`). Thought Leadership Builder runs end to end in all three; the other three tools show their use case and a note until a concept is chosen.

| Concept | Tools | Library | Making a draft |
| --- | --- | --- | --- |
| 1 — Tool cards (safe; **scratched 14 October**, its page moved to the `scratch` branch. Its "Next on your plan" went into Concept 2, under the tool row, and "What's on your mind?" became the advisor's "Which tool do I need?" prompt on the Toolbox. Its tool flow, Guided steps, stays on `main`) | The next plan step's tool leads with its detailed drawing: a bento on tablet and web, one row plus three icons on a phone (option C, chosen 11 October). Drawings are placeholders for design | Two menus side by side (Tool, and Status with Show closed), each a plain list with counts; Clear filters under them | One question per screen ("Step 2 of 3"), then the draft full screen with Revise, Copy and Mark ready in a fixed bar |
| 2 — Starter row (safe) | One row of four icons, each over a short name; nothing scrolls. Under it, the next plan step's tool as one row (14 October) | Four folders, one per tool, filed by ExecHQ (option A, chosen 11 October; plain cards with the tool's icon in a tinted disc, look D, 14 October): each shows how many, where they stand and its last change, and opens to its list, newest first. On tablet and web the folders sit beside the open one's list. Search lists matches across all folders | The draft full screen; inputs, revisions and versions in a panel pulled up from a peek bar (side panel on desktop) |
| 3 — Start from the moment (wild card; **scratched 13 October**, its page moved to the `scratch` branch. Its "What's on your mind?" and "Pick up where you left off" ideas went into Concept 1. Its tool flow, the Interview, stays on `main` for comparison and goes back to the Toolbox page) | "What's coming up?" picks the tool, with the tools as shortcut chips | A timeline by week | An interview, one question per screen, with the draft pinned above as a card that fills in as she answers (side by side on desktop) |

**14 October: Toolbox Concept 2 takes in Concept 1.**
- **Next on your plan** is one row under the four tool icons. **"Which tool do I need?"** is the advisor's first prompt on any Toolbox page: he asks what's on her mind, and her answer gets a tool with Start.
- **The folders are plain cards** (look D): the tool's icon in a tinted disc, the name, what's inside and the date.
- **Search is a magnifying glass** beside Library. It opens a sheet whose matches update as she types, across every folder, with what she typed in bold.
- **Library rows are a plain list**, no card and no menu: the title, then the status (or the tool, in search) and when she last touched it as a tag ("Today", "3 days ago", "2 weeks ago", then the date). Tapping a row opens it.
- **What the row menu held is on the draft page**, in the Actions menu at the draft's corner, in every builder concept: Use as a starting point, Close and Delete (which asks first). Once it's ready, Copy and the downloads lead the same menu.
- **A folder's page** (option A) opens with the tool's card (what it makes and Start), then how many with a Status menu (only when the folder holds two statuses or more), then the list, each row with a line of what it says.

**How the pieces connect.**
- **The Briefing hand-off** lands in Concept 2's tool flow, the one Toolbox page left (14 October).
- **The first draft creates the Loop record**, and the address moves to the artifact, so leaving at any point finds the draft in the library where she left it.
- **Opening an artifact goes straight to its draft** in every concept.
- **Inside a tool, the "Ask or go" pill steps aside on phone and tablet**, and the navigation says Toolbox.

**The first screen of every tool (option C, chosen 11 October).** The tool's detailed drawing, then the decision: its name set large, what it makes, when to use it, what she'll need, the plan step, and the tool's first question beside one button that says what it will make ("Start a podcast pitch"). What her plan step already says is chosen for her and marked. Concepts 1 and 2 then don't ask that question again; Concept 3 keeps its own interview opening. Under the button, "Goes with this": at most two pieces of her work, each with one action (her statement, which every tool draws on; her last pitch to start from; a pitch still waiting to hear; today's read).

## 4. Decisions made while building (working, not settled)

- **Concept 3 matches a few kinds of moment** (a review or meeting, a pitch or talk, a post or article, an introduction or bio) and says which tool it picked before starting. Anything else asks "Which of these fits?".
- **Any artifact can be closed at any time**, and closing something that is waiting to hear stops its follow-ups.
- **Use as a starting point** makes a new draft from the latest version, labelled with what it started from.
- **Revisions are made without a model.** "Shorter" drops ExecHQ's framing but keeps her words and the questions; "Longer" adds a question for her, never a fact.

- **At least three publishers.** The brief gives no minimum; three matches three reads a day.
- **The suggested set** leans towards leadership titles because of Maya's direction, with one marketing title.
- **Opening a read counts as reading it.** In Concept 2, Next also counts the read as seen, so "Read today's Briefing" on the Plan can complete on the first one (wired later this sprint).
- **Concept 2's article has "Today's three" beside the count** (14 October), back to the front page, so Next is never the only way through.
- **Concept 2's article hides the "Ask or go" pill** (14 October), as a tool does. The article ends in its own actions and Next.
- **Concept 1's close is there from the start**, because all three reads are in view at once. It changes to "You've read today's three." once all three are opened.
- **Concept 3 keeps two notes on each read.** The reason line says why the read is here; the passage note says why that sentence. Its responses come from the passage, so it has no separate "Write a post about this" block.
- **Saved reads** are kept after the day and reached from **Saved, at the top right of the Briefing**, every day, with a count once she has saved something (14 October; it was a small link under the set, which only showed once something was saved and sat out of sight). Saving says where to find it. They are never listed with the day's three, so the page never looks like a feed. Saved is its own page (option B, 14 October, `?view=saved` on either concept): back to Today's Briefing, how many, then each read with its picture, publisher, headline, why it was in her Briefing and when she saved it. Tapping one opens it in the reader sheet; the filled bookmark removes it, with Undo. Four invented reads saved on earlier days (`EARLIER_SAVED` in `mock/briefing.ts`) show what the page is for; they stay saved until removed, and the dock's reset brings them back.
- **Relevance feedback** is acknowledged in a few words, with Undo.
- **The Briefing email is now off by default** (Profile → Notifications), as the brief says. It sends at 8 am, local time.
- **Profile has a new "Daily Briefing" group with a Publishers row.** Concepts 2 and 3 link to it. Profile is approved, so this is a change to an approved page.

## 4a. Stage 5: all four tools, and the links in

- **All four tools work in all three Toolbox concepts**, through one shared engine, so choosing a concept doesn't mean rebuilding them.
- **Situation Brief:** with a date, the follow-up "How did it go?" lands the day after the meeting, and whatever she answers, ExecHQ gives the next step (13 October).
- **Pitch Builder:** the follow-up draft lives on the same artifact. "Mark sent" takes an optional target and date.
- **Positioning Builder:** her onboarding statement opens as the same artifact (version 1); it is never copied. Changing the statement offers a refresh of the bios and narrative; it never forces one.
- **Direct paths.** Every link into the Toolbox from the Plan, the homepage, the Concierge and the Signal Picture goes through one helper (`lib/toolbox-links.ts`). A step that already has a draft opens it, and the Plan's button then says "Open your draft". A step that makes something opens its tool with the step's facts filled in.
- **"Read today's Briefing" is live.** It opens the Briefing marked as coming from the Plan, and is done once she reads one item or starts a post from one. Opened any other way, the Plan doesn't change.
- **After she says how something went (13 October), the next step, everywhere.** In every builder, on Home's Stay on track and with the advisor, her one-tap answer is all the feedback: ExecHQ says it back and gives the next step, whatever she answered, by one set of rules per builder (`AFTER_ANSWER`; tables in each builder page). A Plan step goes on her Plan only when she taps Add. Every feedback card offers "Add a note". The brief's question is now "How did it go?". Home is approved: its check-in card's answered state changed (the next step in place of the readback), its layout did not.
- **Toolbox flow Concept 3 is answered with taps (13 October).** Every question is its own screen, answered with chips: check all that apply, or pick one where there is only one answer, plus Other for her own words. Optional questions come last, each with Skip. Where ExecHQ knows something only she would say (from her plan and direction), it leads the chips, so nothing generic is put in her mouth. A date or a pasted bio stays a field. The options are drafts (`INTERVIEW_PICKS` in `mock/toolbox.ts`) for review.
- **Approved pages changed in behaviour, not layout:** the homepage's next step, Plan Concept 3's step buttons, and the Concierge's "Pick up where you left off".

## 5. Open questions for the client

1. **Briefing Concept 2 shows the whole article inside ExecHQ, and so needs a licence from each publisher.** Briefing Concept 1 doesn't: it sends her to the publisher's site.
2. **Who chooses Concept 2's highlighted passages, and who writes the notes on them?** In the pilot's rules-based curation that is either an editor or a model reading the article. Both carry a cost the brief does not price.
3. **Should the homepage card change with the chosen concept?** It stays as approved for now and opens whichever concept is chosen.
5. **The homepage's "Start in the Toolbox" button** now opens the existing draft when there is one, but keeps its approved wording. Should it say "Open your draft" in that case, as the Plan's button does?
6. **Building out a closed artifact.** Positioning Builder lets her build out her story even when it is Closed (dock state 3). Should that reopen it as a draft, or be blocked?
4. **Telling ExecHQ's wording from hers.** The brief requires that generated framing can be told apart from what she supplied. The draft does this with ink and a dotted underline. Should the mark stay on the copied text? Copy currently takes plain text, with no marks.

## 6. Working decisions from the brief's open questions

Taken as working answers on 11 October. Confirm with the client:

- The library is called "Library".
- The user can close any artifact at any time; after an outcome is recorded, ExecHQ suggests closing it.
- Positioning Builder keeps the one-sentence statement as its first output.
- Copy for every output; PDF and Word for the Situation Brief, bios and long-form articles.
- No "delete after use" on the Situation Brief.
- "Read today's Briefing" completes when one read is read, or a Thought Leadership draft is started from one.
- Reusing an artifact creates a new one, linked to the original.
- The Briefing is daily reads only.
