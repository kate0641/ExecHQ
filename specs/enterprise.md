# Admin Dashboard — interaction spec

Approved concept: **Concept 1b — With readiness**, approved 2026-10-26. It is the cohort's story in four measures, with a readiness pulse. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production". Concept 3 (the weekly letter) is saved for V2 and is not part of this spec. Concepts 1 and 2 are on the `scratch` branch.

---

## 1. What it is

The Admin Dashboard is what the client's program admin sees: the person at the client company who runs the ExecHQ program for a group of their leaders (a **cohort**). It does two jobs. It shows the admin, in totals only, whether the program is working, so they can defend it to their own leadership. It gives them the one thing they manage: the cohort's code.

It tells the cohort's story in the order it happened, and sets the measure that matters most (follow-through) as the hero.

What it deliberately does not do:

- **Show any one participant.** Every figure is a total for the whole cohort. Nothing names, lists or can point to a person (section 5).
- **Claim results.** It reports what participants did, never what ExecHQ caused. The readiness pulse is what participants say they feel.
- **Show recorded outcomes.** Promotions, new roles and other outcomes participants record stay internal to ExecHQ (decided 2026-10-20).

### Where it appears

It uses the `enterprise` chrome: a header with the ExecHQ wordmark followed by "Enterprise", and at the right the admin's initials, which open the Admin profile. There is no other navigation. It is **web only**: there is no phone or tablet layout, and the prototype locks the viewport to web.

The admin arrives here from the Admin login. An admin with no cohort yet sees the setup (4.1) instead.

---

## 2. The page, top to bottom

1. **The header band.** On the left, the cohort's name (level-1 heading), then a line: "Started 14 Sep 2026 · 2 weeks in · 38 people", then "Figures cover {dates in words} ({dates}). As of {weekday day month}." On the right, the **date picker** (section 3) and an **Export** menu (section 6).
2. **Notices**, only when they apply: the late-update notice (4.4) and the "still filling" notice (4.3).
3. **The opening.** One paragraph in the order things happened, with the figures that carry it in bold (2.1).
4. **Ready for what's next.** The readiness card (2.2).
5. **Putting it into practice.** The hero card, across the full width (2.3).
6. **Three cards side by side:** Staying with it, Showing up in the world, Getting started (2.4 to 2.6).
7. **The closing card:** who is still to join, and the cohort's code (2.7).
8. **The footer paragraph** (2.8).
9. **The assistant bar**, floating at the foot of the window (section 7).

### 2.1 The opening

Up to four sentences, each built from the figures:

1. "{Two weeks in}, **{38} of the {50} leaders** you expected have joined and {33} have finished setting up." The week count is spelled out up to ten ("One week in", "Two weeks in"). After ten it reads "After 12 weeks". In the first week it reads "In the first week".
2. "**{20} were active** {this week}{, more than a week ago}, and {7} put something out in the world." The clause about a week ago appears only under the direction rule (5.4).
3. "They've completed **{5} of the {18} planned actions** they took on {this week}." Then one of the following. "The other {13} are still within their 30 days, so this will rise." when every open action was taken on within the last 30 days (that is, the dates chosen started within the last 30 days). Otherwise "Some are still within their 30 days, so this will rise." Nothing, if none are open.
4. Once the readiness pulse shows (2.2): "**{16} of the {24} who answered** say they feel more ready for the move they're working toward than when they started."

The opening is hidden while the cohort is below the minimum (5.1). The "still filling" notice says why.

### 2.2 Ready for what's next (the readiness pulse)

Participants answer one question when they start and every 7 days after, on their Home (see the Homepage spec, Concept 4b): "How ready do you feel to {their own direction}?", on a slider with three answers: **Not yet**, **Getting there**, **Ready**, counted 1 to 3.

The card is laid out as the hero is, words on the left and figures on the right:

- Heading **Ready for what's next**, then "{16} of the {24} who answered feel more ready for the move they're working toward than when they started."
- **Readiness, on average:** "{1.8} → {2.3}", out of 3, then "{24} of {33} answered". A screen reader hears "1.8 to 2.3".
- Under it, its definition: "Asked when someone starts and every 7 days after: "How ready do you feel to …?", with the move each person is working toward, on a slider with three answers: Not yet, Getting there and Ready, counted 1 to 3. The same people at the start and now, whichever dates you choose."
- **Two bars**, "At the start" and "Now", each split into the three answers from lightest (Not yet) to darkest (Ready), with a legend naming them. Each bar's counts are said in words to a screen reader ("At the start: 9 Not yet, 11 Getting there, 4 Ready").

Rules:

- It counts **the same people** at their first answer and their latest. "Answered" is how many have answered at least twice.
- It **does not follow the date picker.** It is always start against latest.
- It is **hidden until 10 or more have answered twice.** Until then the card shows its heading and, with a lock, "Shown once 10 or more have answered twice."
- "Moved up" is how many of those people gave a higher answer now than at the start.

### 2.3 Putting it into practice (the hero)

Full width, on the feature tint. On the left, the heading and "They made {14} pieces of work {this week} and used {5} of them outside ExecHQ." On the right:

- **Followed through**, large, with a bar under it: "{28}%  {5} of {18} accepted actions". Definition: "Of the planned actions taken on, how many are done, each within 30 days. Recent ones still have time; declined ones don't count."
- Three tiles below it:
  - **Chose a plan:** "{79}%  {26} of {33} set up · since launch". It may carry a direction ("More with a plan than a week ago"). Definition: "Of those set up, how many accepted a development plan."
  - **Work made:** "{14} pieces of work". Definition: "Drafts, briefs and statements made in ExecHQ in the dates chosen."
  - **Work used:** "{36}%  {5} of {14} pieces". Definition: "Of the work made, how much was marked as used outside ExecHQ."

### 2.4 Staying with it

- Heading, then "{15} of the {20} active read the Daily Briefing at least once a week."
- **Active:** "{61}%  {20} of {33} set up". Definition: "Of those set up, how many did at least one thing in the dates chosen."
- **Read the Briefing weekly:** "{75}%  {15} of {20} active". Definition: "Of those active, how many opened the Daily Briefing at least weekly."
- **Active each week**, the weekly trend (section 3.5).

### 2.5 Showing up in the world

- Heading, then "What participants put out where others can see it, {this week}."
- A ring, "{35}%", beside "put something out, on any channel". Definition: "Of those active, how many posted, published, spoke or were quoted in the dates chosen."
- The channels: LinkedIn, Published writing, Speaking, Podcasts, Press, each "{n} of {active}", in order of size. Any channel with fewer than 10 people is held back (5.2).
- At the foot: "Recorded in ExecHQ or added by the participant. Someone on two channels counts in both."

### 2.6 Getting started

- Heading, then "{33} of the {38} who joined have finished setting up." Below the minimum this reads "{38} of the {50} leaders you expected have joined so far."
- **Joined**, in a ring: "{38}  of {50} expected · since launch". Definition: "Accounts made with your cohort's code, against the size you expected."
- **Set up**, with a bar: "{87}%  {33} of {38} who joined · since launch". Definition: "Of those who joined, how many finished setting up."

### 2.7 The closing card: still to join

One line, then the cohort's code.

- The line is "{12} of the leaders you expected haven't joined, and {5} haven't finished setting up." When everyone expected has joined, it reads "Everyone you expected has joined". The set-up part is left out while setting up is hidden (below the minimum) or when everyone has set up.
- **Your cohort's code** (section 4.2).

### 2.8 The footer

One paragraph with a shield icon: "Totals for the whole cohort. Northgate never sees a participant, their plan or their work. Figures show once 10 or more are active in the dates you choose, and update daily. {Arrows show a change since a week ago, only when at least 10 participants are behind it.} Sources: codes redeemed, and setup, sign-ins, plans, planned actions, work and what participants put out in the world, recorded in ExecHQ. Prepared by ExecHQ." The sentence in braces appears only when the dates chosen end today.

### 2.9 Every figure

- **The number** is set in the figure face. Shares are a whole percentage, with "{n} of {m}" beside them.
- **"· since launch"** follows the detail of the three figures that ignore the date picker: Joined, Set up and Chose a plan.
- **The definition** sits under every figure, always visible, set small with a rule on its left. There is no info icon and nothing to open (decided 2026-10-22).
- **A direction**, when the rule allows (5.4), sits under the figure: an arrow and words, never a number ("More active than a week ago").

---

## 3. Dates

The figures cover the dates in the picker. Figures update daily.

### 3.1 The picker

A field showing the range's name and its dates ("This week  28 Sep – 1 Oct 2026"), with ‹ and › beside it for the dates before and after. Pressing the field opens a panel with two parts.

- **Ranges, in three groups** with a rule between: This week, Last week, This month, Last month | Last 30 days, Last 90 days | Since launch. A range applies at once and closes the panel. A range with no figures at all (Last month, for a program that started this month) is shown but cannot be chosen.
- **Two months of calendar**, weeks starting Monday, the latest month on the right, with ‹ and › to move by a month. The first press sets the first day and the second sets the last. While choosing, the band follows the pointer or the keys. Days before the program started and after today cannot be chosen. Days of the neighbouring months are greyed and skipped.

Nothing is written under the calendar (decided 2026-10-22). Picking is announced to screen readers ("Choose the first day, or a range on the left."). Only a cohort set up on this visit, with no figures yet, shows a line on screen: "The first figures arrive on {date}. Dates open then."

**The default is This week** (decided 2026-10-21). Today is the day of the latest update.

### 3.2 Stepping with the arrows

- A day steps a day.
- A calendar week, month or year (whole, or so far) steps to the whole one beside it.
- Any other range steps by its own length.
- Nothing after today, and nothing wholly before the program started: the arrow is unavailable then.

### 3.3 The band on the calendar

The chosen days are a filled band. The band is closed (rounded) at its first and last day and wherever it breaks: at the edge of a week and at the edge of a month. A range running on from the month before never shows half a band beside the next month's greyed days.

### 3.4 What follows the dates

Everything follows the dates except:

- Joined, Set up and Chose a plan, which count since launch and say so.
- The readiness pulse (2.2).
- The weekly trend (3.5), which always shows every week and shades the chosen ones.

### 3.5 Active each week (the trend)

Bars, one per Monday-to-Sunday week, from the week the program started. There are no weekly updates, so it shows from the first week (decided 2026-10-22).

- **This week** is still going. It is hatched and outlined, and labelled "{20} so far this week".
- **The weeks the chosen dates touch** sit on a light band and are drawn in the chart's ink. The rest are grey. It always shows every week since launch. It follows the picker by shading, not by redrawing.
- **Values** sit over the bars while there are 10 weeks or fewer. Beyond that, hovering a bar shows its week and figure.
- **A week below the minimum** is a short dashed stub on the base, never a small number. The note "A gap is a week with fewer than 10 active, left out to protect privacy." appears when there is one.
- The heading reads "Active each week", with "Since the program started. Your dates are shaded." The definition reads "People who did at least one thing in each week, Monday to Sunday, since the program started. This week so far is hatched."
- For screen readers, there is a sentence of the shape ("People active each week over 3 weeks: 21 in the first week, 26 at the most, 20 so far this week.") and a table of every week, with "in your dates" on the shaded ones.

---

## 4. Setting up, the code and other states

### 4.1 No cohort yet: the setup

An admin with no cohort sees only **Set up your cohort**: "Give it a name, how many people you plan to invite, and when the program starts. You will get one code to share." The form has three fields:

- **Cohort name.** Hint: "What your participants will call it, e.g. Leadership Program 2027." Missing: "Give the cohort a name."
- **Expected size.** Hint: "How many people you plan to invite. Figures stay hidden until 10 or more are active." Missing: "Enter how many people you plan to invite."
- **Program starts**, a date. Missing: "Enter the date the program starts."

**Create cohort** makes it. The page becomes **Your cohort is ready**: "Share the code through your own channels. Figures start to appear once 10 or more participants are active.", then the code (4.2) and **See your dashboard**. Focus moves to the heading at each step. There is no end date: a cohort stops growing when its code is closed (decided 2026-10-20).

### 4.2 The cohort's code

Heading **Your cohort's code**, then the code (for example EXEC-4821), and "Share this code with your cohort. Each person creates an account with a personal email. You will see how many joined, not who."

- **Copy code** copies it. The button reads "Copied" for a moment.
- **Make a new code** asks first: "Make a new code?" / "The old code stops working. Everyone who has already joined stays in the cohort." / **Make a new code** · **Cancel**. Afterwards: "New code made. The old one no longer works."
- **Close to new joiners** asks first: "Close the cohort to new joiners?" / "The code stops working. Everyone who has already joined stays, and the figures carry on." / **Close cohort** (danger) · **Cancel**. Afterwards the code is replaced by "Closed to new joiners. The code no longer works." Closing cannot be undone from the dashboard.

### 4.3 Below the minimum

While fewer than 10 participants are active in the dates chosen, a notice heads the page: **Your cohort is still filling** / "Until 10 or more participants are active, you see only how many joined. Every other figure stays hidden, so none can point to one person." The opening is hidden. Every figure except Joined shows **Hidden** with a lock and "Hidden until 10 or more participants are active. This protects individual privacy.", with its definition still under it. The trend, the channels and the readiness card are hidden too.

### 4.4 A late update

If today's daily update has not arrived, the page shows yesterday's figures and a notice: "Today's update is late. The figures here are from {date}. ExecHQ is looking into it, and changes since a week ago return with the next update." Directions are not shown while the update is late.

---

## 5. Privacy rules

These are the promise the participant is given ("{Organization} sees totals for the whole group. It never sees you, your plan or your work.") and they hold everywhere on the page, in the export and in the assistant.

1. **The minimum is 10.** Below 10 active in the dates chosen, only Joined shows (4.3).
2. **Channels below 10 are held back.** In Showing up in the world, a channel with fewer than 10 people is not shown with its count. The held-back channels are named together, in a fixed order (never by size), with "Fewer than 10" and a lock.
3. **Weeks below 10 are gaps** in the trend.
4. **Directions need 10 behind them.** A change since a week ago is shown only for people figures (joined, set up, active, read the Briefing, chose a plan). Only when the dates chosen end today. Only when at least 10 participants are behind the change. Only as a direction, never a count. Counts of actions or work are never compared.
5. **Readiness needs 10 who answered twice** (2.2). It is self-reported, and the dashboard says so.
6. **No rows per person.** The CSV holds totals only.
7. **Recorded outcomes are never shown.**

---

## 6. Export

The **Export** menu has two items, as wide as its button.

- **PDF** prints the page. In print, the date picker, the export menu, the assistant bar and the code are left out. The dates are said in words in the header. The page is scaled to fit and the cards are kept whole. The export holds the figures, never the means of joining.
- **CSV** downloads the figures on the page as a spreadsheet, one row per figure. Columns: Figure, Value, Out of, Since a week ago, Covers, As of, What it counts, Note. It includes the signals, with held-back channels as "Fewer than 10". The file name carries the dates. Hint: "Downloads the figures on this page as a spreadsheet. Totals for the whole cohort, never a row per participant."

---

## 7. The assistant

A floating bar at the foot of the window, the same as the app's navigation bar: "**Your cohort** · Ask about your cohort". Pressing it grows a card over a soft scrim.

- It opens on **What would you like to know?**, with suggested questions: "What should I tell my leadership about follow-through?", "Draft a two-line update for my CHRO", "What can I do to get more people set up?".
- It answers from the cohort's totals for the dates chosen, in the same words the page uses. It never answers about one person. A "who" question gets: "I can't tell you about any one person. That promise is why leaders use ExecHQ honestly." followed by a total it can give. Below the minimum it says only how many joined.
- Its rule is stated in the card: "I answer from your cohort's totals only, never about one person, and only once 10 or more are active."
- **New chat** clears the conversation. Escape, the scrim or the close button shut the card and return focus to the bar. While open, the page behind is inert.

---

## 8. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Page width | Fills the window, at most 1440px, with 24px sides | `--viewport-web-max`, `--space-lg` |
| Gap between blocks on the page | 48px | `--space-2xl` |
| Cohort name | 36px | `--type-title-size` |
| Opening paragraph | 18px, relaxed leading, at most 60ch; bold figures in the primary ink | `--text-lg`, `--leading-relaxed` |
| Cards | 32px padding, 20px corners | `--space-xl`, `--radius-xl` |
| Gap between cards | 24px | `--space-lg` |
| Hero and readiness cards | Two columns: at least 14rem for the words, twice that for the figures | none (fixed) |
| Card headings | 28px | `--type-heading-size` |
| Lead figure / other figures | 36px / 22px | `--type-figure-size-lg` / `--type-figure-size` |
| Definitions | Caption size, 12px left padding, 1px rule | `--type-caption-size`, `--border-width-thin` |
| Readiness bars | 24px tall, 6px corners | `--radius-sm` |
| Trend | 120px tall | none (fixed) |
| Notices | At most 68ch wide, sunken surface, 16px corners | `--content-measure`, `--color-surface-sunken`, `--radius-card` |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |

All colors are tokens. No color is hard-coded. The prototype opens in greyscale; with the brand palette on, the chart's ink is the primary navy.

### Targets

The dashboard is web only, used with a mouse and keyboard, but every control still has a target of at least 44 × 44px (`--button-target`): the date field and its arrows, the export menu, the code's buttons, the calendar days, the profile initials and the assistant bar.

---

## 9. Accessibility (WCAG 2.2 AA)

- **Headings.** The cohort's name is the level-1 heading. Each card's heading is level 2. The code's heading is level 3.
- **Figures** are read as text, never only drawn. Rings, bars and the trend are decorative for screen readers, which hear the figure, a sentence or a table instead.
- **Nothing rests on color.** Directions have an arrow and words. Hidden figures have a lock and words. The trend's chosen weeks are shaded, drawn darker and listed "in your dates". This week is hatched as well as labelled.
- **Keyboard.** Everything works with a keyboard alone. In the calendar, the arrow keys move a day or a week, Home and End go to the week's ends, Page Up and Page Down move a month, Enter picks and Escape closes. The code's confirmations take focus when they open and give it back when they close.
- **Focus** is visible on every control. When the setup changes screen, focus moves to the new heading.
- **Announcements.** Picking dates, copying the code, making a new code and closing the cohort are announced politely.
- **Contrast.** Text 4.5:1 and non-text 3:1, including the grey bars outside the chosen dates and the lightest readiness shade against its track.
- **Motion.** The assistant card and the picker respect `prefers-reduced-motion`.

---

## 10. Components

| Component | Role |
| --- | --- |
| `EnterpriseConcept1b` (in `flows/enterprise/concept-1b`) | The page: header, opening, cards, closing card, footer, setup. |
| `CohortConcierge` (same folder) | The assistant bar and card. |
| `CohortFigure` | One figure: label, number, detail, meter, direction, definition, hidden state. |
| `Meter` | The ring or bar drawn beside a share. |
| `ReadinessBars` | The readiness card's start and now bars. |
| `WeeklyTrend` | Active each week, with the chosen dates shaded. |
| `DateRangePicker` | The dates field, its arrows and its panel. |
| `InviteCode` | The cohort's code and what can be done with it. |
| `CohortForm` | The setup form. |
| `ProfileLink` | The initials in the header, to the Admin profile. |
| `DropdownMenu`, `Button`, `Icon` | The shared pieces. |

---

## 11. Prototype versus production

| Prototype | Production |
| --- | --- |
| The cohort comes from the dock: no cohort, 6 participants, the pilot of 50, or 1,000 at day 90. | The admin's own cohort. |
| Figures for any dates are worked out from stored totals. Today is a fixed demo day (a Thursday). | Figures come from daily updates, for exactly the dates chosen. |
| Readiness answers are invented. | They come from participants' weekly check-ins on Home. |
| The dock's "Update late" switch shows the late state. | Shown when the daily update has not arrived. |
| The assistant answers its suggested questions from the totals and refuses "who" questions. Anything else gets a stand-in reply. | It answers any question from the totals, under the same rules. |
| PDF uses the browser's print. CSV is built in the page. | The same, or a server-made file with the same content. |
| Making a new code or closing the cohort lasts until the dock's cohort changes. | Stored. |

---

## 12. Decisions

These are settled. They are the specified behavior.

1. **Totals only, minimum 10,** with the rules in section 5.
2. **The story in order** (2026-10-22, Bookends): opening, readiness, the hero, three cards, still to join.
3. **Follow-through is the hero** (2026-10-20). It reads low early in a week, because recent actions still have 30 days. The definition says so, and it stays as it is (2026-10-22).
4. **Definitions always show**, under every figure, with no info icons (2026-10-22).
5. **Dates.** The default is This week. The ranges are in three groups. There is no text under the calendar. Figures update daily, and there are no weekly updates (2026-10-21 and 2026-10-22).
6. **The trend** is bars since launch, from week 1, with this week hatched and the chosen dates shaded (2026-10-22).
7. **The readiness pulse** (2026-10-23 to 26): one question every 7 days, three answers on a slider, shown once 10 have answered twice.
8. **The code lives in the closing card,** under who is still to join (2026-10-22).
9. **Outcomes stay internal.**
10. **Desktop only.**

### Open

- **Disclosure to participants.** Nothing on the participant's check-in card says the answer counts in the organization's totals. The privacy policy (Eric) has to cover it.
- **The readiness line on Home promises the plan adapts** ("Your answer helps ExecHQ shape what comes next in your plan."). The product must make that true.
- **Small counts above the minimum** (for example 7 recorded outcomes, if outcomes are ever shown) are still to be decided.
