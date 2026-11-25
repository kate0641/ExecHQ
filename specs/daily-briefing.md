# Daily Briefing — interaction spec

Approved concept: **Concept 2 — News app**, as of 2026-10-19, with the web reading pane chosen the same day, and **On Your Radar** added after the reads on 2026-11-18 (3.4a). It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

Concepts 1 (Front page) and 3 (Annotated) were the other ideas tried for this page. They are kept on the `scratch` branch and are not specified here.

---

## 1. What it is

The Daily Briefing is a short daily read: three articles a day from publishers the person chose, each with one line on why it is there for them. It is read whole inside ExecEngine, with ExecEngine's notes on the passages that matter to them, and any read can start a post in Thought Leadership Builder.

After the reads, **On Your Radar** offers up to three opportunities a week to be seen, picked for where they are going: a show to pitch, an event to speak at, a publication to write for, each a tap from starting the pitch in Pitch Builder (3.4a, from the 18 November UX review).

What it deliberately does not do:

- **Feel like a feed.** There are only ever three reads a day. No topic tabs, no counts of unread items, no reading times, no "Load more". The day's set ends with "That's today's three". On Your Radar cards are not reads: up to three a week, in their own section, and they never add to the day's three.
- **Pick by category.** Every "Why it's here" line grounds in their direction or their plan, never in a topic label.
- **Make reading a task.** Nothing on a read is done or not done. Reading counts once it is opened, and only toward the Plan's "Read today's Briefing" step, when they came from it (5.3).
- **Mix in what was saved.** Saved reads live on their own page (4), never among the day's three.

### Where it appears

The page uses the `app` chrome. It is the "Briefing" destination in the navigation (see the Navigation spec), and Home's approved Briefing card opens it (see the Homepage spec). The Plan's "Read today's Briefing" step opens it marked as coming from the Plan (5.3).

---

## 2. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Shape | Two screens: the front page, then one read at a time | The phone's layout, at the reading width | One screen, the reading pane: the day's three down the left, the open read beside them |
| Width | The reading width | The reading width, centered | At most 76rem, centered: a 22rem list, then the read |
| Notes on passages | Under the paragraph | Under the paragraph | In the margin beside the paragraph |
| The read's picture | 16:9 | 16:9 | A 3:1 band, so the headline stays near the top |

On web:

- **There is no front page.** The pane opens on the first read, which counts as opening it (5.1).
- **The list stays in view** (sticky) while the read scrolls. Under the three reads come On Your Radar (3.4a), then "That's today's three" and the Profile link (3.4).
- **The open read is marked** in the list with a raised card and a stronger edge; each read already opened says **Read** beside its publisher.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. The page

### 3.1 The header

**Today's Briefing** (level 1), then the date and "Three reads" ("Tuesday 20 October · Three reads"). At the top right, every day: **Saved**, with a bookmark, and a count once anything is saved. It opens the Saved page (4). Screen readers hear the count in words ("Saved, 4 reads", or "nothing saved yet").

### 3.2 The front page (phone and tablet)

1. **The lead story:** the first read, with a large picture, its publisher in small capitals, its headline in the editorial serif, and **Why it's here:** with its reason.
2. **Two rows:** the other two reads, each with its publisher, headline and reason on the left and a small square picture on the right.
3. **On Your Radar** (3.4a).
4. **The close** (3.4).

The headline is the button, and it covers its whole story, so the picture opens it too. A story opens its read (3.3).

### 3.3 A read

From top to bottom:

1. **The place in the set:** "1 of 3". On phone and tablet, **Today's three** at its left goes back to the front page. On web there is nothing to go back to, so it is the count alone.
2. **The picture,** the publisher, the headline (level 2, takes focus when the read opens), **Why it's here**, and the publisher's standfirst set larger, in secondary ink.
3. **The whole article.** Each passage ExecEngine has a note on is highlighted and numbered, and its note follows: "1 · ExecEngine's note" and why that sentence matters to them. Notes are for reading; they are not controls.
4. **The credit:** "Published by {publisher}. Highlights and notes by ExecEngine."
5. **The read's actions** (3.5).
6. **Next: {the next read's publisher}**, a full-width button. On phone and tablet, after the third read it says **That's today's three** and goes back to the front page. On web there is no Next on the third read.

Opening a read scrolls to the top of the page and moves focus to its headline. On phone and tablet the Ask or go pill is not there at all while a read is open, so the article ends in its own actions and Next. On web the pane is always a read, so the pill is never shown on this page.

### 3.4 The close

**That's today's three** (level 2), then "Tomorrow's arrive in the morning." Once all three are opened it says **You've read today's three**. Under it, **Change publishers in Profile**, which opens Profile.

### 3.4a On Your Radar (2026-11-18; called Spark Signals until 2026-11-25)

From the 18 November UX review: alongside the news, the Briefing offers a few **opportunities to be seen**, picked for where the person is going: a show to pitch, an event to speak at, a publication to write for. It sits after the three reads and before the close, so the news reads straight through first; on web, in the list column under the three reads.

- **On the page like the reads** (cleaned up the same day, option 2): a hairline, then **On Your Radar** in the serif with "Picked for you this week" at the right. No coloured box.
- **One light card at a time, in a carousel** (as Home's In progress): the next card peeks in, cards snap as she swipes, and dots under them jump to each card. No arrow buttons; the dots and the track work by keyboard, and the position is said to assistive technology.
- **Each card:** its kind in small capitals (**Podcast**, **Event** or **Publication**), its name in the serif, why it fits her plan, then one line of what they want and when ("A 300-word abstract for a 30-minute talk · **Due Fri, Nov 13, 2026**", the date in bold) or how often it reads pitches. How to reach it is not on the card: Pitch Builder shows it once she starts.
- **Start a pitch** (**Start a proposal** for an event), a navy button, opens Pitch Builder with that outlet chosen: its kind as What are you pitching for? and its name as Who are you pitching?.
- **An × in the card's corner is Not for me** (named "Not for me: {name}"). It takes the card off, says "Got it. You'll see fewer like this.", moves focus to the On Your Radar heading, and the card does not come back. With none left: "That's this week's. New ones come on Monday."
- **Under the cards, always:** "Picked by ExecEngine from your plan. Check before you reach out." ExecEngine finds them; it does not vouch for them.
- **Up to three a week, refreshed on Monday.** Big events, shows and publications in her field, not local meetups. **Inside her company's world only:** her field, never a way out (no job boards, recruiters or board seats elsewhere).
- They are not part of "only ever three": the three are reads; these are opportunities, in their own section.

### 3.5 The read's actions

- **Save** (a toggle, with a bookmark; **Saved** when on). Saving says "Saved. Find it in Saved, at the top of your Briefing."; un-saving says "Removed from your saved reads."
- **Was this worth your time?** with **Relevant** and **Not relevant**. Answering replaces the question with a tick and "Noted. You'll see more like this." (or "less"), and **Undo**, which brings the question back. Focus follows to whichever is now there.
- **Write a post about this:** "Opens Thought Leadership Builder with this read as your source." A link, never a gate: the read is done whether or not they write. It opens the Playbook flow with the read as its source, and the draft carries "Started from today's Briefing" for its whole life (see the Playbook flow spec).

---

## 4. Saved

Reached from **Saved** at the top right, at `?view=saved`, in the Briefing's place.

1. **Today's Briefing** with a back chevron, back to the day's three.
2. **Saved** (level 1) and "{n} reads, newest first. They stay until you remove them."
3. Each saved read: its picture as a thumbnail, publisher, headline, why it was in their Briefing, and **Saved** with when ("Today", "3 days ago", then the date). Tapping one opens it in a sheet (the read as in 3.3, with **Mark as read** among its actions). The filled bookmark at its right removes it: "Removed from Saved." with **Undo**, which puts it back and returns focus to it.
4. With nothing saved: **Nothing saved yet** and "Tap Save on any read to keep it here after the day it arrives."

Reads saved on a day stay saved after it, until removed. Only what they saved is listed, never suggestions.

---

## 5. Interactions

### 5.1 Opening a read counts as reading it

A read is marked read when it opens: by its story on the front page, by Next, by its row in the web list, or, on web, by the pane showing the lead when the page opens. Nothing else marks it, and nothing marks it unread except **Mark as not read** in the Saved sheet.

### 5.2 The first visit: choosing publishers

Until they have chosen publishers, the page is the header and **Where should your reads come from?**: "Choose the publishers you trust. Each morning ExecEngine picks three reads from them and says why each one is there."

- **Suggested for you**, "Chosen for leading a team. Change any of them.", with the suggested publishers listed, then **Start with these** (one press, and the day's three load).
- **Choose my own** opens every publisher, in three cards: Leadership and management, Business news, Marketing. Each row is a toggle with a check on the right. "{n} chosen", and "Choose at least 3." until there are three. **Show today's three** finishes.
- "You can change these at any time."

Saved is not shown until publishers are chosen. Focus moves to the page heading once the three load.

### 5.3 From the Plan

Opened from the Plan's "Read today's Briefing", opening one of today's three, or starting a post from one, completes that step, and the page says "Done on your plan: Read today's Briefing." Opened any other way, or opening a read from Saved, the Plan does not change.

### 5.4 Changing publishers

In Profile, under **Daily Briefing**, the **Publishers** row opens the same list in Profile's sheet, with **Save** and **Cancel** ("Saved. Tomorrow's reads come from these."). The page itself has no publisher settings. The Briefing email is in Profile's Notifications, on by default, sent at 8 am in their time zone.

---

## 6. Accessibility

- One level 1 per screen: "Today's Briefing", or "Saved" on the Saved page. The open read's headline and the close are level 2.
- Each story's headline is a real button; the whole story is its target, with a visible focus ring around the story.
- On web the list is a navigation landmark named "Today's three", and the open read's button carries `aria-current`.
- A highlighted passage tells screen readers that ExecEngine's note follows ("ExecEngine's note 1 follows"); each note is a labelled region. The numbers are hidden from screen readers so they are not read twice.
- Save is a toggle button (`aria-pressed`). The relevance question is a fieldset; its acknowledgement is announced. Every action names its read for screen readers ("Save: How planning season decides who gets new work").
- Messages (saved, removed, step done, On Your Radar card passed on) are announced in a live region.
- **On Your Radar** is a section labelled by its heading (level 2); each card is an article labelled by its name (level 3). The carousel is announced as a carousel, each card as a slide with its place ("1 of 3"), and the dots are buttons named by place ("2 of 3"), the current one marked as current. Start a pitch is a link; the × is a button named "Not for me: {name}" with a 44px target, and after it, focus moves to the section's heading. Why it fits is read with "Why you:" before it, which is hidden on screen.
- Opening a read or going back moves focus to the new heading, or back to the story it came from.
- Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour. The picture tints are never the only cue: each names its publisher.

---

## 7. Components

| Component | Where |
| --- | --- |
| `BriefingFront` | The front page (phone and tablet), and the web list (`layout="list"`) |
| `BriefingPicture` | Every picture: lead, reader band, thumbnail |
| `BriefingReader` | The open read, in the page and in the Saved sheet |
| `BriefingArticle` | The whole article with its notes (`placement` inline or margin) |
| `ReadCounter` | "1 of 3", with Today's three on phone and tablet |
| `ReadActions` | Save, relevance and, at the end, `RespondLink` |
| `RespondLink` | Write a post about this |
| `BriefingEnd` | That's today's three |
| `PublisherPicker` | The first visit, and Profile's Publishers sheet |
| `SparkSignals` | The opportunities after the reads (3.4a), in a `CardCarousel` |
| `Sheet` | A saved read, opened from Saved |

---

## 8. Prototype versus production

| In the prototype | In production |
| --- | --- |
| The same three invented reads every day, with invented publishers, articles and notes | Three reads chosen each morning from their publishers, grounded in their direction and plan |
| The pictures are tinted stand-ins naming the publisher | The publisher's own images, once image rights are settled |
| The whole article is shown | Showing the whole article needs a licence from each publisher (9) |
| Relevance is acknowledged and kept, but changes nothing | It feeds which reads are picked |
| Four reads are saved on earlier days, so the Saved page has something to show; the dock's reset brings them back | Saved holds only what they saved |
| Everything is kept in the browser, and the dock's reset clears it | Publishers, saved reads, read state and relevance are kept on the account |
| The same three On Your Radar cards, drawn from Pitch Builder's invented outlets; Not for me is kept in the browser and changes nothing else | Up to three found each week by ExecEngine (AI) from her plan, direction and field, checked for a live page and a date; Not for me teaches it what to leave out |

---

## 9. Decisions to confirm

Written from the approved prototype. These are choices it makes that nobody has yet confirmed:

1. **Licensing.** Reading the whole article in ExecEngine needs a licence from each publisher.
2. **Who chooses the highlighted passages, and who writes the notes.** An editor or a model reading the article; both carry a cost the brief does not price.
3. **At least three publishers,** to match three reads a day. The brief gives no minimum.
4. **The suggested set** leans toward leadership titles, from Maya's direction, with one marketing title.
5. **On web the lead counts as read when the page opens,** because the pane always shows a read.
6. **"Read today's Briefing" completes** on one read opened, or a post started from one.
7. **The Briefing's email is on by default,** at 8 am. The brief had it off; Kate turned it on on 2026-10-28. It carries the day's reads; whether it also carries On Your Radar is not decided.
8. **Where On Your Radar cards come from, and how good they must be.** Found by ExecEngine (AI) from her plan, direction and field, framed as suggestions she checks (Erik). Dan's concern stands: a poor pick reflects on the brand. The prototype checks nothing; production should at least confirm a live page and a date before one is shown.
9. **Up to three a week, refreshed on Monday,** in the Briefing after the reads, chosen in the 18 November review over a place on the Plan page. Whether Not for me should also ask why (wrong field, wrong size, wrong timing) is open.
