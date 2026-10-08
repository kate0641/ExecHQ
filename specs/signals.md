# Signal Picture — interaction spec

Approved concept: **Concept 2 — Momentum first**, as of 2026-10-08. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

Concepts 1 (How you've grown) and 3 were the other ideas tried for this page. They are kept on the `scratch` branch and are not specified here.

---

## 1. What it is

The Signal Picture is the person's private record of how visible they are becoming, beside how they are keeping up. It answers three questions, in this order of weight:

1. **Am I keeping up?** Momentum: this week, a circle a day, and the next move on their plan.
2. **What came of what I did?** Each thing they put out in the world, and what they said came of it, in their words.
3. **How far have I come?** Where they started, beside where they are now, typed by hand.

What it deliberately does not do:

- **Score or compare.** Nothing on the page is a percentage, a rank, a streak or a comparison with anyone. Momentum counts what happened; it never rates it.
- **Count work inside ExecHQ as a signal.** A signal is something they put out in the world: a talk, a post, a mention, something they used or sent. Drafting, working on or readying something in ExecHQ is never added to the Signal Picture. (It does count as Momentum.)
- **Work anything out for them.** What came of something is only ever what they said, kept as they wrote it.
- **Pull anything from outside.** There are no connections in V1. Every number is typed, and the only file is a LinkedIn export they choose to upload.

### Where it appears

The page uses the `app` chrome (header with the wordmark, and the navigation with Signals selected). There is no footer line. It is the "Signals" destination in the navigation (see the Navigation spec), and Home's Signal Picture card links here (see the Homepage spec).

A dot on Signals in the navigation says something new has been recorded on their picture since they last looked. Opening the page clears it.

---

## 2. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Column | One, at the reading width | One, at the reading width, centered | A band across the top, then two columns, at most 65rem, centered |
| Order | Title, Momentum, What came of it, Where you started (with Try this, then the LinkedIn export and what it says) | Same as phone | Title; Momentum as a band; then What came of it and what the LinkedIn export says (left, about 60%) beside Where you started, Try this and the LinkedIn upload (right, about 40%) |
| A day in the week | Fills the row, up to 3.5rem | Up to 3.5rem | Up to 4rem |

On web:

- **The band.** Momentum runs across the top, split where the columns under it split: the week on the left, **Your next move** on the right, level with "This week". A rule separates the band from the columns.
- **The columns.** What came of it is the wider. What the LinkedIn export says sits under it on web only, so the two columns run about the same length.
- **When the left column is empty,** the right one takes the full width, so nothing sits beside an empty space (4.4).

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. Momentum

### 3.1 What it counts

Momentum is **"Your week in motion: plan steps, drafts and outcomes, and the signals you add."** It counts four things, each a real event with a day:

| Counted | When |
| --- | --- |
| A completed action | A step on their plan is done: its draft was used, sent or published, or they said they did a step with no draft |
| An artifact created or used | They drafted something in ExecHQ, or used, sent or published it |
| An outcome updated | They said what came of something (not "It's no longer relevant") |
| A signal added | They added something to their Signal Picture themselves |

A step they turned down or put off is in none of these and is never counted against them.

### 3.2 This week

Under **This week**, seven circles, Sunday to Saturday, with the day's letter beneath each:

| Circle | Means |
| --- | --- |
| Filled, dark, with a tick | A day they did something |
| Thin solid outline | A past day with nothing in it |
| Dashed outline | A day still to come |
| A ring around it | Today, on top of any of the above |

Under the circles, when anything happened this week, one line counts it, kind by kind, with the empty kinds left out: "1 completed action · 2 artifacts created or used · 1 signal added". When nothing has happened this week there is no line: the circles say so, and the next move follows.

### 3.3 Your next move

A card: **Your next move** in small capitals, the next step on their plan that is taken on and not done, why now in one line, and **Start**, which opens it in the Toolbox. On web it sits beside the week (2).

---

## 4. What came of it

### 4.1 The rows

**What came of it**, then "What you told us came of the things you did, in your words. Nothing is worked out for you."

One row for each thing they did since their plan began, newest first: each thing they added themselves, and each thing made with ExecHQ that they used, sent or published. Each row is the thing on the left (its date, then what it was) pointing to what came of it on the right:

- **What they said came of it**, in a box with a strong edge. The left side of the row is dark.
- **"Nothing reported yet"**, in a dashed box, when they have said nothing. For anything they can still answer, the box is a button with **Tap to report** beneath, and opens the report drawer (4.2). Nothing reported is neutral, never a miss.

Five rows show; **Show {n} more** shows the rest, and **Show fewer** puts them away.

A row for something they added themselves carries **Edit** and **Delete**. Delete asks first, in place: "Delete this entry?" with **Delete** and **Keep it**.

With no rows: "Nothing reported yet. When you add what came of something you did, it shows here."

### 4.2 Reporting what came of it

A drawer, **What came of it?**, with the date and what they did beneath.

- For something made with ExecHQ: **How did it go?** as It went well, It was mixed, Not the way I hoped. Then **What came of it, in your words** ("Just enough for you to recognise it."). Both are needed: "Choose how it went." and "Write a line about what came of it." say what is missing.
- For something they added: their words only.
- "Only you see this. It is kept as you wrote it." **Save** and **Cancel**.

What they say is kept on the thing itself: the same record Home's "Stay on track" and the Plan's stage check-in keep.

The drawer sits beside the page rather than over it: it rises from the foot on phone and tablet (at the reading width on tablet), and floats at the bottom right on web, 30rem wide. The page behind it stays usable.

### 4.3 What ExecHQ puts on the picture

Only what they put out in the world goes on: something made with ExecHQ that they marked used, sent or published, and what they said came of it. Drafting, working on or readying something in ExecHQ never does. There are no notes on the page telling them what ExecHQ added.

### 4.4 The first visit

Until they have said where they started, What came of it is not shown, and the page asks for a starting point (5.3). On web the starting point then has the full width (2).

---

## 5. Where you started

### 5.1 The card

**Where you started**, with "Since {the day their plan began}" at its right.

1. **LinkedIn followers**, large, with "was {then} · up {n}" beneath, or "Same as when you started, {then}".
2. **Counts**: Podcast appearances, Press mentions, Speaking engagements, Writing you publish, each with **Start** and **Now**.
3. **Added since you started**: one line, such as "1 podcast appearance and 1 piece you published.", or "Nothing yet. What you add shows here, and the counts move."
4. **+ Add**, which opens the add drawer (5.2).

Under the card, **Try this**: one suggestion tied to what they have, its reason, and a button into the Toolbox ("Draft a pitch").

### 5.2 Adding what they did

A drawer, **Add what you did**, starting with one row ("Thing 1"):

- **What did you do?** Published, Spoke, Podcast appearance, Press mention, Something else, or My LinkedIn followers.
- **When was it?** Not in the future.
- **A link or a note** (optional, "Just enough for you to recognise it.").
- **What came of it?** (optional, "A reply, a comment, an invitation, or nothing yet. In your words.").
- For followers instead: **How many followers now?** and **As of when?**

**Add another thing** adds a row; a row can be removed or left out. The button says **Add**, or **Add {n} things**. If the same thing may already be on their picture, the row says so ("You already added this on {date}: “…”.") with **That's the one**. "Only you see this. Nothing is searched for or shared."

Followers are a number as of a day, not an event: saving them moves only the "now" figure.

### 5.3 The first visit: asking for a starting point

In place of the card: "Your Signal Picture is a private record of how your visibility changes. Tell us where you are now, so you can see your progress at the end of each stage. Mark your starting point yourself, or we will mark you at zero."

- **LinkedIn followers** ("Look at your profile and type the number", "e.g. 1,240").
- One stepper for each count: Podcast appearances, Press mentions, Talks you have given, Somewhere you publish, each with a line on what counts, starting at zero.
- **Save my starting point**, or **Start me at zero**.
- **Add more LinkedIn data** (5.4) under it.

On web this spans the page as two columns: the intro, followers and the LinkedIn export on the left; the counts and the buttons on the right. Once saved, the page has its usual layout.

### 5.4 The LinkedIn export

Optional, and the only file the page takes.

| State | Says |
| --- | --- |
| Not added | **Add more LinkedIn data**: "Optional. Your LinkedIn analytics export shows how your posts and audience are doing. Add it now, or any time later." **Upload my LinkedIn export** |
| Reading | **Your LinkedIn export**: "Reading it now. Carry on, and it will be ready when you need it." |
| Read | "Added from {file}. Upload a newer one whenever you like and it will replace this." **Upload a newer export** |
| Read, but empty | "Added from {file}. It had no posts in the last year. Upload a newer one…" |

Once read, **Your LinkedIn, from your export** shows what it says: followers by week (a chart they can step through with the arrow keys), impressions added up by month, and the three posts LinkedIn showed most, with their reactions and comments. On phone and tablet it sits under Where you started; on web, under What came of it (2).

---

## 6. The five moments

The page changes with where the person is. In the prototype the dock lists five moments, and every signed-in page follows them.

| Moment | What the page shows |
| --- | --- |
| **First return** | Momentum with Monday filled (their story drafted), and the starting-point form in place of What came of it and Where you started |
| **Follow-up due** | An empty week so far, no count line, and What came of it with their story and pitch "Nothing reported yet" |
| **Drafted, not used** | What came of it with their story's outcome in their words |
| **Nothing pending** | A signal they added on Sunday filling that day, "1 signal added", and outcomes for everything they used |
| **Just answered** | The outcome they just recorded, in their words, on their story's row in What came of it |

---

## 7. Accessibility

- The page has one level 1, "Your Signal Picture". Momentum, What came of it and Where you started are level 2; This week is a level 3.
- Each day circle has a name that says the day and what it was: "you did something", "nothing recorded" or "not yet". The three looks (filled, solid outline, dashed outline) differ by shape, not by tone alone.
- "Nothing reported yet" boxes that can be answered are buttons, named for their row. Ones that cannot are not.
- Drawers take focus when they open, close on Escape and on their handle (a real button, so nothing needs dragging), and give focus back to what opened them. They never trap the page behind them.
- Show more and Show fewer say whether the list is expanded. Delete asks before it acts.
- The followers chart is also a slider operated by the arrow keys, and every figure in it is said in words.
- Every control has a visible focus ring. Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour.

---

## 8. Prototype versus production

| In the prototype | In production |
| --- | --- |
| Maya is the only person, with five fixed moments picked from the dock | The page is built from the person's own account and work |
| Some things she added come with the sample data and cannot be edited or take new words | Everything they added can be edited, deleted and reported on |
| The LinkedIn export is never really read: choosing a file whose name looks like an export shows fixed sample data | The export is read and its numbers shown |
| Try this is one fixed suggestion | It is chosen from what they have and their plan |
| The Toolbox tools Start and Try this open are placeholders until Sprint 4 | They open the real tools |
| Nothing is saved but in the browser, and the dock's reset clears it | Their starting point, what they add and what they say are kept on the account |

---

## 9. Decisions to confirm

Written from the approved prototype. These are choices the prototype makes that nobody has yet confirmed:

1. **What counts as a signal.** Only what they put out in the world. Drafting counts toward Momentum but never goes on the Signal Picture.
2. **Signals count toward Momentum** wherever its figures are used, including the soft "building / steady" label elsewhere in the product, which still runs on a placeholder rule until D&T define it.
3. **The week runs Sunday to Saturday.** Whether it follows the person's locale is open.
4. **Followers are typed or uploaded,** never looked up. Which figure wins when the two disagree is open.
5. **What the LinkedIn export says** sits in a different column on web than on phone and tablet, to keep the columns even.
