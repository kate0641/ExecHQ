# Plan — interaction spec

Approved concept: **Concept 3 — Guided check-in**, as of 2026-10-08. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

Concepts 1 (Steps forward), 2 (Road forward) and 4 were the other ideas tried for the Plan. They are kept on the `scratch` branch and are not specified here.

---

## 1. What it is

The Plan is where the person works through their plan with ExecHQ, one thing at a time, the way onboarding asked one question at a time. It answers three questions, in this order of weight:

1. **What should I do next, and where am I with it?** One move at a time: what it is, why it matters, and a set of answers that say where they are with it. Answering changes their plan for real.
2. **Where is this all going?** Their direction, in their own words, and the roadmap: the stages of their plan, with the steps in each.
3. **How did that stage go?** When ExecHQ sees they have finished a stage, it asks before it builds on it: what came of what they did, whether they got what finishing looks like, and how they feel about their plan.

What it deliberately does not do:

- **Score or grade.** Nothing on the Plan is a percentage, a streak or a deadline. A stage has a suggested pace in words ("Next month"), never a due date, and running past it is never a failing.
- **Let the person mark a stage finished.** ExecHQ decides a stage is finished, from their work (9.1). The person can say they did not get there, and the stage stays open (9.4).
- **Offer anything they have turned down twice.** A step passed on twice is never offered again, by any route (4.4).
- **Say their work caused a result.** Replies say what happened and what moved, never why.

### Where it appears

The Plan uses the `app` chrome (header with the wordmark, and the navigation with Plan selected). There is no footer line. It is the "Plan" destination in the navigation (see the Navigation spec), and Home's "See your Plan" link lands here (see the Homepage spec).

---

## 2. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| The move | One column | One column, at most the reading width (68 characters), centered | The left column, top to bottom |
| The answers | A drawer pinned to the foot of the screen (5) | The same drawer, reaching up to the end of the move (5.2) | In the page, under their question, no drawer (5.3) |
| Your direction and the roadmap | Under the move, covered by the open drawer | The same, and out of the way while the drawer is open | The right column, 26rem wide, sticky, the same on every page |
| Page width | Full width of the screen | Full width of the frame | At most 72rem, centered, with a 4rem gap between the columns |

On web the two columns never move from one page to the next: the move, its reply, the next move, the last page and every page of the stage check-in keep the same left column, and the right column keeps their direction and the roadmap.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. A page, top to bottom

Every page of the Plan has the same parts, in this order:

1. **Where they are.** The plan's name in small capitals, then "Stage {n} of {total} · {stage name}", and under it one segment per stage, filled up to the one they are in.
2. **The kicker.** "Move {n} of {total} · {when}", where {when} is the move's time in words ("This week").
3. **The move,** as the page's level 1 heading.
4. **One line on why now,** tied to what the person said or what is coming up ("Your 1:1 is on Tuesday, and…").
5. **Why this matters,** a margin note with a rule down its left.
6. **The answers** (4.2), as a drawer on phone and tablet, in the page on web.
7. **Your direction** (6) and **the roadmap** (7).

When a move was brought onto their plan by something they said at a stage check-in, a short line on a soft fill says why it is there, between the move and the answers (4.5).

---

## 4. The moves

### 4.1 Which moves, and in what order

The moves are the steps live on their plan when they arrive, not done, in the plan's order. There are never more than five live: three short-term, one medium-term and one long-term.

Once they answer the first move, the order is frozen for the visit: a step that leaves their plan keeps its page, and anything offered in its place comes after the rest. Coming back to the Plan starts a new visit.

After a stage check-in where they said they feel stuck or less sure, the moves show **one at a time** ("Move 1 of 1") for as long as the stage after it runs (9.4).

### 4.2 The answers

Under the question **"Where are you with this?"**:

| Answer | What it does | ExecHQ's reply |
| --- | --- | --- |
| **The start button** | Opens the step's tool in the Toolbox, and puts it on their plan as taken on. It says "Start in {tool}", or "Get started" for a step with no tool, and **"Keep working on it"** once a draft for it is under way. A step with no tool is started by putting it on their plan for its time | None: the tool opens |
| **I'll do it {when}** | Puts the step on their plan for its suggested time, which the label says ("I'll do it this week") | "Good. It is on your plan for {when}, and ExecHQ will ask you how it went." |
| **Change when** | Shows the time words instead, from now on (This week, Next week, This month, Next month, This quarter, Next quarter, Later). Choosing one puts the step on their plan for then | The same reply, with the time they chose |
| **Talk it through** | Opens the chat on the step, asking "What's getting in the way? Pick one, or tell me in your own words." Nothing about their plan changes | In the chat |
| **Not for me** | Asks why, one optional tap (4.3), then takes the step off their plan and offers another in its place | "Say why, if you like. One tap, and it shapes what ExecHQ offers next." Then "That is fine. ExecHQ will not offer this one again." and, when one is offered, "Now offered: {step}." |

There is no "I've done it" here on purpose. Saying a step is done, and what came of it, belongs to Home's "Stay on track" (see the Homepage spec).

After an answer the reply replaces the answers, in the serif voice, signed "ExecHQ", and a **Next move** button goes on. On the last move the button says **See the road**.

### 4.3 Why not

"Not for me" offers six reasons as chips, and **Skip, no reason**:

| Reason | What it changes |
| --- | --- |
| Not relevant | The step offered in its place is about something else |
| Wrong timing | The step comes back once, 14 days later |
| Too much effort | The step offered in its place is lighter, and the reply says so only when it is |
| Uncomfortable channel | That channel is never offered again |
| Already done | ExecHQ offers to add it to their record as theirs |
| Other | Nothing more than the pass |

A step offered in its place is never the same suggestion reworded: it never shares the same kind, area and channel. Replacements are capped at one per horizon per visit; after that the place stays empty and says so.

### 4.4 Passing on a step twice

Every pass is counted. **A step passed on twice is never offered again**, by any route: not as a replacement, not when it was put off, and not at a stage check-in. A step turned down before passes were counted starts at one.

### 4.5 Why a move is here

A step brought onto their plan by a stage check-in carries one line saying why, on the move and on the step everywhere else it appears:

| Brought in because | The line |
| --- | --- |
| They partly got what finishing looks like | "You said you partly got what finishing looks like. This picks up what's still missing." |
| They said not yet | "You said not yet, so the stage stays open. This is aimed at what's missing." |
| Something didn't go the way they hoped | "“{step}” didn't go the way you hoped. This is a different way at it." |
| An important step they passed on, offered once more | "You passed on this before. Worth another look?" |

### 4.6 The last page, and when there is nothing

After the last move: kicker "The road ahead", heading "That's this stretch of the plan.", the line "Here is where your plan stands.", what changed on their plan most recently (up to six notes), and the reply "Then ExecHQ builds the next stage, from what worked and what didn't." Buttons: **Go through them again** and **Add to your plan**.

With no moves at all: "Nothing to answer right now." and "Your plan offers the next move when one fits.", with **Add to your plan**.

---

## 5. The answer drawer (phone and tablet)

### 5.1 Open and folded

The answers sit in a drawer pinned to the foot of the screen. The page scrolls above it, so the question and its reason are read together and the drawer holds only the answer.

- The drawer's **handle** is a button that folds it to a **peek bar**: "Where are you with this?" with "Tap to answer". The bar is a button that opens it again. Nothing needs dragging.
- **While the drawer is open**, the navigation's "Ask or go" pill and the roadmap's add button step aside. Folded to the peek bar, or once they have answered, both come back, and the add button rises clear of the bar.
- Folding the drawer is how they see the roadmap under the move on a phone.

### 5.2 Tablet

The same drawer, with its contents at the reading width. While it is open it reaches up to the move's last line, Why this matters, and the roadmap is out of the way; folding it brings the roadmap back with the peek bar.

### 5.3 Web

There is no drawer. The answers sit in the page, under the question as a heading ("Where are you with this?"), with no card around them. The "Ask or go" pill stays on screen throughout. The add button is a plain **Add to your plan** button at the foot of the roadmap, not a floating one.

---

## 6. Your direction

Above the roadmap, a soft row: **"Your direction"** in small capitals, the first line of their direction in their own words, in the serif, cut off with an ellipsis, and a chevron.

- The whole row is one button. Pressing it opens the row to their direction in full and turns the chevron up; pressing again closes it.
- It starts closed. Opening it is remembered on the device until they close it again.
- Changing their direction is not done here: it is in the plan sheet (8).

---

## 7. Your roadmap

### 7.1 The heading

**Your roadmap**, with **See your plan →** at its right, which opens the plan sheet (8).

### 7.2 The stages

One card per stage of their plan, stacked so each overlaps the foot of the one before. Each card's head is a button that opens or closes it, and only one stage is open at a time. A head shows "Stage {n} of {total}", the stage's name, and at its right either **Done** or when the stage is suggested to run to, in words ("Next month").

The stage they are in opens on arrival. When their saved plan says they are somewhere else (a stage finished since), the roadmap follows them there once it loads.

| Stage | Looks like |
| --- | --- |
| Done | Quieter, with "Done", and their check-in on it (9.5) |
| The one they are in | Open, darker |
| Recommended next | As a later stage, until they start it |
| Later | Closed, lighter |

An open stage shows **Finishing looks like** {the stage's milestone}, then what is in it, or "Nothing in this stage yet." ("Nothing left to do in this stage." for a finished one).

### 7.3 What is in a stage

Each line has its time in words on a pill, then its title.

- **A step** is a button that opens it, one at a time: the start button (as 4.2; "I've done this" for a step with no tool that is already on their plan), then **Ask ExecHQ** with three rows, "Why this step?", "What will it take?" and "Ask something else", each opening the chat on its answer. On the roadmap under a move, the stage opens with every step closed, because the move above already offers the way to start it.
- **Something they added** shows its title and "· Yours", and does not open.

A step goes in the stage its day falls in. A step still to do always goes in the stage they are in or the one they are about to start, never in one they have finished.

### 7.4 Adding to their plan

The floating **+** (phone and tablet) or **Add to your plan** (web) opens a sheet: **What is it?** (placeholder "A talk, a meeting, a deadline"), **When** as the time words, then **Add to my plan** and **Cancel**. Adding puts it on their plan in the stage its time falls in, opens that stage, and says "Added to {stage}, {when}."

---

## 8. Your plan sheet

**See your plan** opens a sheet, the same one the Plan has always used for this. It rises from the foot on phone and tablet and sits centered on web, over a scrim.

1. The plan's name, and its formal name beneath ("Step up", "Increase leadership scope").
2. **Why this plan**: why they have it, tied to what they said in onboarding.
3. **The stages**, numbered, with **You are here** on theirs.
4. **Your direction**, in their words, in the serif, with "Edited by you." when they have changed it since onboarding.
5. "Changing your direction takes you through the questions again. At the end you choose your plan, and you can keep this one. Everything you have done stays."
6. **Change my direction**, which starts the onboarding questions again, filled in, ending back on the Plan, and **Close**.

---

## 9. The stage check-in

### 9.1 When it opens

ExecHQ decides a stage is finished, from their work: every step they took on in it is done. When the most recent finished stage has no check-in yet, the Plan opens on the check-in instead of the moves. Older finished stages are history and are not asked about, and a stage is never asked about while they have checked in on a later one.

### 9.2 The pages

The check-in uses the same page and answers as the moves, with "Stage check-in · {stage}" where the plan's name was, and a segment for each of its pages.

1. **What you did.** Kicker "Stage {n} of {total} · Finished", heading "You finished {stage}", and "Here's what you did. Before ExecHQ builds on it, tell it how it went." Then one card per thing from the stage:
   - its source: **Your steps**, **In ExecHQ** (something made with ExecHQ) or **Yours** (something they added),
   - its title, and what happened when ("Used 13 Oct", "Done 9 Oct", "Added 17 Oct"),
   - what they have said came of it ("It went well." and their words in the serif), or a **Not reported yet** tag,
   - steps they passed on, listed with "You passed on it" and never asked about.

   The answers: "Check in on this stage?" with "{n} things to hear about, then how the stage went. About two minutes. You can skip any of it." **Start the check-in** and **Later**.
2. **What came of it?** One page for each thing not yet reported, fixed when the check-in opens. The answers are "How did it go?" as It went well, It was mixed, Not the way I hoped and Nothing yet, then "What came of it, in your words" (optional). Something they added takes only their words. **Next** waits for an answer; **Skip this one** is always there. What they say is kept on the thing itself, the same record "What came of it?" keeps everywhere else.
3. **Did you get what finishing looks like?** The stage's milestone as the margin note. "Where did you land?": **Yes**, **Partly**, **Not yet**. **Next**, or **Skip**.
4. **How are you feeling about your plan now?** "However it went is useful. ExecHQ shapes what comes next around it." "Right now I'm feeling…": **More sure of it**, **About the same**, **Less sure**, **Stuck**, then "Anything ExecHQ should know?" (optional), "Only you see this. It is kept as you wrote it." **See your stage**, or **Skip**.
5. **Your stage, in your words.** A reply that says what their answers changed (9.4), then **What you did** (the cards again, with what they said now) and **How the stage went** (where they landed, how they feel, their words), with "Not answered" for anything skipped. **On to {next stage}** (or **Back to your plan** after "Not yet", or when it was opened from the roadmap) and **Change an answer**, which goes back to the milestone with their answers chosen.

### 9.3 Later

**Later** puts the whole check-in off: the Plan opens on the moves, and the finished stage in the roadmap carries "Tell ExecHQ how this stage went, and it builds on what worked." with **Check in on this stage**, which opens the check-in at its start. Nothing else nags.

### 9.4 What the answers change

Their answers are kept as they gave them, and they change the plan:

| They say | What happens | The reply says |
| --- | --- | --- |
| Yes | The next stage as planned | "{Next stage} is next, and it builds on what went well here." |
| Partly | The step aimed at what's missing is offered first | "{Next stage} is next. Its first step picks up what's still missing here." |
| Not yet | The same step first, and the stage stays open until it is done. Changing the answer later changes this back | "Then this stage stays open, with a step aimed at what's missing." |
| Stuck or Less sure | The moves show one at a time while the next stage runs | "From here it's one step at a time, and you can talk any of it through first." |
| Not the way I hoped, on a step | A different way at the same thing is offered. Never the same step | "Where something didn't go the way you hoped, there's a different way at it on your plan." |
| — (an important step they passed on once, from this stage or earlier) | It is offered once more | "And one thing you passed on is back for another look." |

The reply opens "Thanks." ("Thanks for saying so." when they are stuck or less sure). Each step brought in carries its line (4.5). A step brought in never goes past the live limits: it takes the place of one they have not taken on yet, and when every place is taken by something they have, it is not brought in.

### 9.5 Afterwards, on the roadmap

The finished stage carries **Your check-in**: "Where you landed" and "How you're feeling" side by side, their words in the serif, and **See your check-in**, which opens the read-back (9.2, page 5), where they can change an answer.

---

## 10. The five moments

The Plan changes with where the person is. In the prototype the dock lists five moments, and every signed-in page follows them.

| Moment | What the Plan shows |
| --- | --- |
| **First return** | Stage 1, Say what you lead. The moves, starting with "Use your leadership story in your next 1:1" |
| **Follow-up due** | Stage 1 is finished, so the stage check-in opens, with their leadership story not yet reported |
| **Drafted, not used** | Stage 1 is finished, and the check-in opens with everything already reported: straight to how the stage went |
| **Nothing pending** | Stages 1 to 3 are finished. The check-in on stage 3 opens, and an important step they passed on comes back for another look |
| **Just answered** | Stage 1 is finished and the check-in opens, with the outcome they just recorded already in it |

---

## 11. Accessibility

- Each page has one level 1, the move or the check-in page's heading. Your roadmap is a level 2, each stage head a level 3; Your direction is a level 2.
- Focus moves to the new page's heading after an answer or Next, never on first arrival. Opened from the roadmap, the check-in's heading takes focus at once.
- The drawer's handle and peek bar are real buttons, so nothing needs dragging (WCAG 2.2 SC 2.5.7). While the drawer is open, the pill and the add button leave the tab order, not only the screen.
- The answers are buttons and chips with visible labels; the chips report their pressed state. Where an answer area has no visible question on web, its question is its heading.
- Your direction's row and each stage head are toggle buttons that say whether they are open. Your direction is read as "Your direction: {their words}".
- Stage status is said in words ("Done", "You are here"), never by tone alone. "Not reported yet" is a word, not only a dashed outline.
- Sheets and drawers take focus when they open, close on Escape, and give focus back to what opened them.
- Every control has a visible focus ring. Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour. The drawer's rise is skipped when the person has asked for reduced motion.

---

## 12. Prototype versus production

| In the prototype | In production |
| --- | --- |
| Maya is the only person, with five fixed moments picked from the dock | The Plan is built from the person's own account, plan and work |
| Steps, their order and their reasons are a fixed queue written for "Step up" | They are chosen and ranked for the person by the model; another plan has none in the prototype |
| Which steps are "important", the step aimed at each stage's gap, and the different way at each step are fixed lists in the mock | ExecHQ chooses them from the plan and what the person has said |
| "Talk it through" offers fixed replies in the chat, and "It feels too big" changes nothing | The advisor answers, and what they say can change the plan |
| A stage is finished when every step taken on in it is confirmed in the Loop, against fixed sample work | The same rule, against their real work |
| Things they added that came with the sample data cannot take new words | Everything they added can |
| The Toolbox tools the start buttons open are placeholders until Sprint 4 | They open the real tools |
| Nothing is saved but in the browser, and the dock's reset clears it | Answers, check-ins, passes and the open state of Your direction are kept on the account |

---

## 13. Decisions to confirm

Written from the approved prototype. These are choices the prototype makes that nobody has yet confirmed:

1. **Which steps count as important,** the step aimed at each stage's gap, and the different way at each step (12). The prototype's lists are stand-ins.
2. **Any important step passed on up to this stage** comes back at the check-in, not only that stage's own.
3. **One at a time** lasts for the whole of the stage after a stuck or less-sure check-in. It could instead end after the first move is answered.
4. **"Not yet" keeps the stage open** only until the one step aimed at the gap is done; ExecHQ does not ask again when it closes.
5. **Things passed on** are listed in the check-in but never asked about.
6. **The open drawer on tablet** leaves room under its answers on a tall screen (5.2). Whether the answers sit at the top or nearer the thumb is open.
7. **Steps for another plan.** Only "Step up" has steps in the prototype; switching plans starts with none.
