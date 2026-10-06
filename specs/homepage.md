# Homepage — interaction spec

Approved concept: **Concept 4 — Combined**, as of 2026-10-06. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

Concepts 1, 2 and 3 were the three ideas Concept 4 was built from. They are not specified here.

---

## 1. What it is

Home is the first screen a signed-in person sees. It answers four questions, in this order of weight:

1. **Where am I, and what is next?** A map of three rings (short-term, medium-term, long-term), one segment per action on their plan, with the next step in a card under the rings.
2. **What is waiting on my word?** "Stay on track": drafts they have not used yet, follow-ups that are due, and actions they can say they have done.
3. **What should I read today?** One card for today's Briefing.
4. **Is anything moving?** "Your Signal Picture": where they started beside where they are now, entered by hand.

What it deliberately does not do:

- **Score or grade.** Nothing on Home is a percentage, a streak, a rank or a target. A ring is "2 of 3 done", never "67%".
- **Send someone straight to a tool.** An action they have not started only opens to be read about and started. The next step's button is the way into the Toolbox, and it is the person's choice to press it.
- **Pull anything from outside.** There are no connections in V1. Every number in the Signal Picture is typed by the person.
- **Say their work caused a result.** The one note of movement says what changed and stops.

### Where it appears

Home uses the `app` chrome (header with the wordmark, and the navigation with Home selected). There is no footer line. It is where signing in lands (see the Login spec), and the "Home" destination in the navigation (see the Navigation spec).

---

## 2. The page, top to bottom

On phone and tablet the page is one column, in this order. Web rearranges it (2.2).

1. **Greeting and date.** "Good morning, {first name}", then the long date ("Monday 5 October") beneath, smaller.
2. **Your Progress Tracker** (section heading, a small uppercase label).
   - The **key**: three small shapes with their names: solid "Done", outlined "In progress", dashed "Not started".
   - **The three rings**, side by side.
   - **The card** under the rings (section 3).
   - A text link, **See your Plan**, under the card, to the Plan page.
3. **Stay on track** (section 4). Left out entirely on the first return.
4. **Today's Briefing** (section 5).
5. **Your Signal Picture** (section 6).

The page has a visually hidden heading, "Home", as its level 1. Every section heading above is a level 2.

### 2.1 The name of the section

The section is called **Your Progress Tracker**, as of 2026-10-06 (the client chose it from several alternatives). The heading and the other lines that name it (an empty ring, an added action, a skipped one, a ring's spoken name) all say "your Progress Tracker", and all come from one place in the copy. In this spec, "the map" is shorthand for the same section.

### 2.2 Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Column | One, at most 40rem | One, at most 46rem, centered | Two columns below a full-width top, at most 76rem, centered |
| Ring size | Up to 5.5rem (88px) | Up to 8.5rem (136px) | Up to 9.5rem (152px) |
| Order | Greeting, map, Stay on track, Briefing, Signal Picture | Same as phone | Greeting, then the Briefing across the full width, then the map (about 70%) beside the Signal Picture (about 30%), then Stay on track across the full width |

On web:

- The **Briefing** sits directly under the greeting and runs the whole width of the page.
- The **map** takes the left column, about 70% of the width, and the **Signal Picture** the right, about 30%, starting level with the map. The gap between them is 2.5rem.
- **Stay on track** runs across the full width under both, in its own row. Its cards are not held to a column.
- On the first return Stay on track is not there, and nothing moves up to fill a gap that is not left.

On tablet the Briefing deliberately stays where it is on phone, below the map and Stay on track, so the two touch layouts read the same.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. The map

### 3.1 The rings

There are always three rings, in this order: **Short-term, Medium-term, Long-term**. Each is a button. Under each ring: its name, then a count line.

Each ring is drawn as one segment per action on the map:

- **One segment** is a full circle. **Two or more** are arcs of equal length, with a gap between them.
- Segments run clockwise from the top in this order: done, in progress, not started. The ring reads as where the person is.
- The three states differ in **shape**, not only in tone, so they do not rely on color:
  - **Done:** solid.
  - **In progress:** outlined, with a pale centre.
  - **Not started:** dashed.
- A ring with nothing on it yet is drawn as one dashed circle, and its count line reads "Nothing yet".
- A ring with every action done carries a small check badge at its top right, and its count line reads "All done".

The count line is "{done} of {total} done" otherwise ("0 of 3 done").

An action is on the map, and in which state, by these rules:

| State | When |
| --- | --- |
| Done | The action's work is confirmed in the Loop (the person has logged what came of it), or, for an action that has no draft, the person has said it is done |
| In progress | The person has pressed Start on it, or there is already work on it (a draft, or a task they have begun). Having accepted it into the plan is not enough |
| Not started | ExecHQ has suggested it or the person accepted it, and they have not touched it |
| Off the map | The person turned it down or retired it, or said they are not doing it |

A finished action stays on its ring until the person asks for a new one. New actions come with the plan's next stage.

### 3.2 Choosing a ring

- Exactly one ring is selected at all times. It is shown pressed (a darker panel behind it), and the card below belongs to it.
- Pressing a ring selects it and replaces the card. Pressing the selected ring again changes nothing. There is no way to leave all three unselected.
- The **starting selection** is the ring of the person's next step. If there is none, the ring of the step they have just finished. If there is none, the first ring that still has something to do, then the first ring that has anything at all, then Short-term.
- A choice is remembered only for the moment it was made in. When the page moves to a different moment (for example the person logs an outcome), the selection goes back to the starting one, so what changed is what they see.
- When the selection changes, a polite announcement reads "Showing the next step in {horizon}."

### 3.3 The card

The card sits directly under the rings, joined to them by a small notch that points up at the selected ring and slides to the next one when the selection changes (the slide is skipped when the person has asked for reduced motion). The card is the ring's **tray**: the ring buttons say they control it.

What the card shows is decided by the first of these that is true:

| # | When | The card |
| --- | --- | --- |
| 1 | The person has just logged an outcome for an action in this ring | A plain note: **"Done: {action}"**. "Nice work. Your Plan shows where this leaves you, and new actions come once everything in this stage is done." A full-width secondary button, **See your Plan** |
| 2 | This ring holds their next step (the one action they are on that has not yet reached the Loop) | The **next-step card** with its eyebrow **"Next in {horizon}"** |
| 3 | The ring has an action in progress, else one not started | The same next-step card for that action. Eyebrow **"Next in {horizon}"** for one in progress, **"Suggested in {horizon}"** for one not started |
| 4 | Every action in the ring is done | A note: **"Every {horizon} action is done."**, then "New actions come with your plan's next stage." and a **See your Plan** button |
| 5 | The ring has no actions | A note: **"Nothing in this part of your Progress Tracker yet."** |

**The next-step card** has, top to bottom: the eyebrow; the action's title as a heading; three labeled rows, **Why this**, **Why now**, **Why you** (any that has no text is left out); a full-width primary button **Start in the Toolbox**; and, for an action that is in progress and has no draft, a full-width secondary button **I've done this**.

- **Start in the Toolbox** opens the action's flow in the Toolbox. For an action that was not started, pressing it also marks it **in progress**, so on return its segment is outlined.
- **I've done this** marks the action done on the person's word. The card moves to the "Done" note (row 1), and focus moves to the check-in question in Stay on track, which now asks what came of it (4.3). The ring's segment becomes solid.
- The card never offers to skip or set aside an action. Turning an action down is not a Home job.

### 3.4 See your Plan

A text link under the card, **See your Plan**, takes the person to the Plan page, where the whole plan, its stages and every action are shown. It is always there, whatever the card shows.

---

## 4. Stay on track

Everything waiting on the person's word, as a row of cards they step through.

### 4.1 What is in it, and in what order

| # | Card | Shown when |
| --- | --- | --- |
| 1 | **Have you done this yet?** An action with no draft that they said they would do | The action is not dropped, and has either no outcome yet or one logged today |
| 2 | **What they just answered** | They have just logged an outcome |
| 3 | **What came of it?** A follow-up that is due | A used item's check-back date is today or earlier |
| 4 | **{Draft} is ready. Have you used it?** | A draft is ready and not yet used |
| 5 | A quiet row: **"I'll ask what came of it {when}."** or **"Used. No check-back set."** | An item has been used and its check-back is not yet due |

Cards 1 to 4 are questions she answers. Row 5 is information only, so it is smaller and has no buttons.

Each question card says what it is for ("For your short-term action", with the action's title).

### 4.2 Stepping through

- The cards sit in a row the person swipes or steps through. The next card **peeks in** at the edge, so it is clear there is more.
- **Previous card** and **Next card** buttons, with a position ("2 of 3"), are there for anyone who cannot swipe. They are also the keyboard route along the row.
- With **one card** there is nothing to step through: the controls are left out and the card takes the full width.
- When a new card arrives in front, such as the one just answered, the row goes back to it, so the person sees what changed.

### 4.3 Answering a card

**Ready: "{Draft} is ready. Have you used it?"**
- "Tell me once it's been used, and I'll ask what came of it."
- **Yes, I've {used / sent / published} it** marks it used. The verb matches the kind of draft. A check-back is set (two days for a situation brief, five for a pitch, seven for a story or a published piece). Focus returns to the "Stay on track" heading.
- **Not yet** keeps it ready. "No problem. I'll check in again in a couple of days."

**Due: "What came of it?"**
Five answers: **It went well**, **It was mixed**, **Not the way I hoped**, **Nothing yet**, **It's no longer relevant**. Pressing one logs it.
- After a real answer the card reads back **"Logged. {what that means}"**. Focus moves to the card's heading.
- **Nothing yet** reads back **"No problem. I'll ask about {name} again {when}."** The check-back moves out.
- **Add a note** is offered after an answer: "Anything to add? Optional. Only you see it." The person saves it with **Save note**, or presses **Skip**. A saved note reads back as **"Logged. You told me: "{note}""**.
- Logging an outcome is what makes a ring segment done, and what brings the "Done: {action}" note (3.3, row 1).

**Have you done this yet?** (no draft)
- "Say when it's done, and what came of it."
- **Yes, it's done** records the day, and the card becomes **"You finished this {when}. What came of it?"** with the same five answers.
- **I'm not doing it** takes the action off the map.

### 4.4 When there is nothing

- The person has never used anything yet: "When you use something you've made, it shows here, so you can tell ExecHQ what came of it."
- Everything used has its outcome logged: "Nothing waiting on you. Everything you've used has its outcome logged."
- **First return:** the whole Stay on track section is left out, because nothing can be waiting yet.

---

## 5. Today's Briefing

One card, and the whole card is the link to the Briefing page.

It shows, top to bottom: the label **Today's Briefing** and, at the right, the date and number of reads ("Mon 5 Oct · 3 reads"); the **lead read's headline**, set in the serif (the one editorial face in the product); and, in the foot, a small tag saying why it matters to this person ("For your Q1 planning review"), with a chevron at the right.

- The **tag** is there only when one of the reads touches an action on the plan. Otherwise the foot holds only the chevron.
- The card is **dark** so that it reads as something to read, not something to do, and stays visibly apart from the plan's recommendations. It never appears inside the ring card.
- It shows one headline. It never lists the other reads.
- The Briefing's contents and page are designed in Sprint 4. Until then the card is real and the page it opens is a placeholder.

---

## 6. Your Signal Picture

A short, private record of how the person's visibility has changed, entirely typed in by them. It is a record, never a score.

### 6.1 With a starting point

Top to bottom:

1. The heading **Your Signal Picture** and, at the right, a small chip **"Since {date}"**: the day the plan began.
2. **One note of movement,** if something has moved in the last week (6.3).
3. **The counts.** One row per thing, with column captions **Start** and **Now**, and an arrow between them. Rows, in order:
   - **LinkedIn followers,** only if the person typed a number (6.2).
   - **Podcast appearances.**
   - **Press mentions.**
   - **Speaking engagements.**
   - **Writing you publish.**
   A number that has not moved shows the same value twice, never a dash. The "Now" figure is larger and set in the serif. Screen readers hear "Start: 0" and "Now: 2".
4. A text link, **See your full Signal Picture**, to the Signals page.
5. **A next step** (a small label), then one bold line, a sentence on why, and a secondary button **Start in the Toolbox**, which opens the step.

Updating where the person is now is not done here. **Update where you are now** is on the Signals page. Home only reads the record.

### 6.2 The first time: asking for a starting point

On the first return nobody has entered anything, so the section holds a form in place of the rows (and shows no "Since" chip). It says:

"Your Signal Picture is a private record of how your visibility changes. Tell us where you are now, so you can see your progress at the end of each stage. A rough guess, even zero, is fine."

The fields:
- **LinkedIn followers:** a number field, optional. "Look at your profile and type the number." Commas are allowed and ignored.
- A stepper for each of **Podcast appearances** ("Shows you have been a guest on"), **Press mentions** ("Quoted or featured"), **Talks you have given** ("Panels, keynotes, events") and **Somewhere you publish** ("A newsletter, blog or articles, and how many pieces"). Each starts at 0, and 0 is a fine answer.

The buttons:
- **Save my starting point** saves the numbers as the Start column and shows the picture. The page announces "Saved where you are starting from."
- **Skip for now** replaces the form with one line, "Add where you are starting from whenever you like, and this shows how far you have come.", and a secondary button **Add my starting point**, which brings the form back. Skipping saves nothing.

Nothing is validated as an error: every combination of numbers is allowed.

The LinkedIn row appears only if a number was typed. Nothing is looked up from LinkedIn.

### 6.3 The note of movement

- It shows one note: the most recent thing the person added in the last 7 days, in a warm sentence that names the thing and stops ("Great job! You're on The Modern CMO, your second podcast appearance.").
- A mark and a small source label (Podcast, Press, Speaking, Writing) sit beside it.
- It never says the person's work caused a result, and there are no streaks.
- A **Dismiss** button, named for the note it dismisses, removes it for good. Nothing else changes when it goes.
- With nothing to note, there is no note and no gap.

---

## 7. The five moments

Home changes with where the person is. In the prototype the dock lists five moments, and every signed-in page follows them.

| Moment | What Home shows |
| --- | --- |
| **First return** | The greeting, the map with the card under its ring, the Briefing, and the starting-point form in the Signal Picture. Stay on track is not there |
| **Follow-up due** | The next step under the rings, and a "What came of it?" card leads Stay on track |
| **Drafted, not used** | A "{Draft} is ready. Have you used it?" card leads Stay on track |
| **Nothing pending** | The next step under the rings, and Stay on track shows its empty line |
| **Just answered** | The "Done: {action}" note under the ring, and the answered card, with its read-back, leads Stay on track |

Changing the moment sets the ring selection back to its starting one (3.2).

---

## 8. Accessibility

- Home has one level 1 (hidden), and level 2 headings for the map, Stay on track, the Briefing and the Signal Picture, in that order on every viewport.
- Each ring is a **toggle button**. Its name is the ring's text equivalent, read in place of the drawing: "Short-term: 1 done, 1 in progress, 1 not started." (A state with none is left out of the sentence, and "Short-term: nothing in your Progress Tracker yet." for an empty ring.) It is shown pressed when selected and says which panel it controls.
- The three states are told apart by shape and by text, never by tone alone. The key shows the shapes.
- Focus moves on purpose: to the question after "I've done this", to the heading of a card after an answer, to the Stay on track heading after "used". Every card heading can take focus.
- Selecting a ring and saving the starting point are announced politely.
- The card carousel works by keyboard (Previous and Next) as well as by swipe.
- The Briefing card is one link, with a name that reads its heading, date and headline.
- Every control has a visible focus ring. Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour.
- The only motion is the notch sliding between rings, and it is skipped when the person has asked for reduced motion.

---

## 9. Prototype versus production

| In the prototype | In production |
| --- | --- |
| Maya is the only person, with five fixed moments picked from the dock | Home is built from the person's own account and plan |
| "Good morning" is always the greeting | The greeting follows the time of day |
| The Toolbox flows the buttons open are placeholders until Sprint 4 | They open the real flows |
| The Briefing page is a placeholder, and the card always shows the same three reads | The card shows the day's real lead and its tag |
| The one "A next step" under the Signal Picture is a single stand-in, whatever the person entered | It is chosen from what they have entered and where they are on their plan |
| The ring card's reasons (why this, why now, why you) are written for Maya | They are written for the person from their direction and plan |
| Nothing is saved but in the browser | Account data, check-in answers, the starting point and dismissed notes are kept on the account |

---

## 10. Decisions to confirm

Written from the approved prototype. These are choices the prototype makes that nobody has yet confirmed:

1. **The section name.** "Your Progress Tracker" was chosen by the client on 2026-10-06 (2.1). The spec still calls the section "the map" where it describes how it works.
2. **One note of movement,** not two. The prototype's rules allow two, and Home shows one.
3. **"I'm not doing it"** takes an action off the map. Turning down an action from the Plan page is described by the Plan spec when it is written.
4. **Check-back days** by kind of draft (2, 5, 7 days) are proposed, not agreed.
5. **The greeting** says "Good morning" at any hour in the prototype.
