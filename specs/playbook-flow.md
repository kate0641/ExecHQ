# Playbook flow — interaction spec

Approved concept: **Concept 3 — Interview**, as of 2026-10-19, with the web layout "the page leads" chosen the same day. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

This was the "Toolbox artifact flow" until 2026-10-19. Concepts 1 (Guided steps) and 2 (Document workspace) were the other ideas tried. They are kept on the `scratch` branch and are not specified here. What each of the four tools asks, what its draft says and what comes after its outcome are in the builder pages (`/builders/…`); this spec covers how every tool works.

---

## 1. What it is

Making one artifact, end to end, with any of the four tools: decide on the tool, answer a few questions one at a time, get an editable first draft at once, change it, mark it ready, use it, and say how it went. The first draft creates the artifact's record in the Loop, so leaving at any point finds it in the library exactly where they left it.

What it deliberately does not do:

- **Ask what ExecHQ already knows.** What their plan, their direction or their onboarding already says arrives filled in and is shown, not asked (4.4).
- **Put generic words in their mouth.** The answers offered lead with what only they would say, from their plan and direction. ExecHQ's own wording is always marked apart from theirs (5.1).
- **Make a fact up.** Where the draft needs something only they know, it leaves a question in place rather than guess.
- **Send or post anything.** "ExecHQ never posts or sends anything for you." They copy or download it, and say when they used it.

### Where it appears

The page uses the `app` chrome, with the navigation showing the Playbook as current. It is reached from the Playbook (a tool or a library row), from the Plan, Home, the Signal Picture and the advisor, and from the Briefing's "Write a post about this" (see the Playbook spec, 5.2). The Ask or go pill is hidden inside a tool on every screen size.

At the top of every screen: **Playbook** with a back chevron, back to the Playbook, and, once there is a draft, "Saved in your library" with a tick.

---

## 2. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Start screen | One column | The phone's layout | The draft as a page on the left, the start screen in the rail on the right |
| A question | The question on the page, its answers in a drawer rising from the foot | The phone's layout, the drawer at the reading width | The page on the left, the question and its answers in the rail |
| The draft | A card pinned at the top, collapsed to its opening; opened, full screen with a fixed bar | The phone's layout | The draft on the left, Change the draft and what to do with it in the rail |
| Width | The reading width | The reading width | At most 76rem: the page, then a 25rem rail |

### 2.1 Web: the page leads

The draft is the page, there from the first screen with every section named (5.1), and the interview is a rail beside it.

- **Before it is written:** "Your draft so far", "Fills in as you answer. The shaded part is where this answer goes.", then the draft as it stands, in the same card and sections as the written draft. The sections the current question fills are shaded; on the start screen, the sections the first choice fills.
- **Once written,** the written draft takes the page's place, in the same position, so writing it changes what the page says, not where it is.
- **The rail** stays in view as the page scrolls. It comes first in the reading order, because the question is what they are doing.

### 2.2 Phone and tablet

There is no live draft while they answer: the question pages show only the question. Once written, the draft is a card pinned at the top, collapsed to its opening with her words and ExecHQ's marked; tapping it opens it full screen, with a fixed bar at the foot (5.6). Tablet is the phone's layout at its width.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. The start screen

The tool's name (level 1, large), what it makes, when to use it, and **You'll need:** with what it needs. If a plan step opened it, **On your plan** and the step.

Then the tool's first question, as one button per answer ("What is the moment?": A review, A board meeting, A negotiation, An executive conversation, Something else). Pressing an answer starts the interview. An answer their plan step already gives is chosen for them and marked ("Chosen from your plan step. Change it if it's not right.").

Where they came from is said above it, and stays with the draft:

- From the Briefing: **Started from today's Briefing**, with the read's title and publisher (and the passage, if they started from one).
- From earlier work: **Started from {its name}**, with its title (a brief from a pitch that went well, say).
- From the advisor: "You said: “{what they told him}”".
- Positioning Builder, building out their statement: **Your statement from onboarding**, and the statement.

There is no drawing and no "Goes with this" on this start screen.

---

## 4. The interview

### 4.1 One question a screen

Each question is its own screen: "{Tool} · Step {n} of {total}", the question (level 1), and, for a field, its hint. What they must answer comes first, then the optional questions.

### 4.2 Answering with taps

Most questions are answered with chips, one per line: **Pick all that apply** where several fit, or pick one where only one does, plus **Other**, an always-visible field for their own words. Where ExecHQ knows what only they would say (from their plan or direction), that answer leads the chips. A date or a pasted bio stays a field.

### 4.3 Moving on

- **Next** is always enabled. Pressed with nothing answered on a required question, it says "Pick at least one, or write your own." (or "Answer this to write the draft.") and stays.
- An optional question still empty shows **Skip** in Next's place.
- **Back** goes to the question before, keeping every answer; from the first question, to the start screen.
- On the last question the button is **Write my first draft**.

### 4.4 What ExecHQ already has

What ExecHQ knows (their role, direction, positioning statement) is never asked. On the last question, one **Built with your {role}, {direction} and {positioning statement}** line sits above Write my first draft, with **Edit** to change any of it. If anything must be checked, a last screen, **Check what ExecHQ has**, lists it as compact rows, with Write my first draft and Back.

### 4.5 Writing the draft

"Writing your first draft…" for a moment, then the draft (5). The artifact is created in the Loop as a draft, filed in its tool's folder, and the address moves to the artifact, so a reload or the library comes straight back here.

---

## 5. The draft

### 5.1 How it reads

**First draft** (later **Draft, version {n}**), its status in the Loop's words, and **Actions** at its corner. The first time: "Here is a first draft of your {brief}. Change anything; it is yours." Then a legend:

| Mark | Means |
| --- | --- |
| Primary ink | Their words, as they gave them |
| Secondary ink with a dotted underline | ExecHQ's wording |
| A dashed box | A question only they can answer |

Each section has its heading and **Edit**. Editing a section makes it all theirs ("Edited by you"); emptying it asks them to write something or cancel. Questions left open are counted ("6 questions left open. It works without them; the answers make it yours.") with **Answer them**, which opens each in place.

### 5.2 Actions

The draft's corner menu holds what a library row would:

- Once it is ready: **Copy** (or **Copy to send**, **Copy to post on LinkedIn**) and, where the tool exports, **Download as PDF** and **Download as Word**. These lead the menu.
- **Use as a starting point:** a new draft from the latest version, linked back to this one, which stays as it is.
- **Close:** "No further action needed. It stays in your library." Closing something waiting to hear stops its follow-ups.
- **Delete:** asks first, in a sheet: "Delete {title}?", saying exactly what else goes (its record, and any items on their Signal Picture), with **Delete** and **Keep it**. Deleting returns them to the Playbook.

### 5.3 Change the draft

**Change the draft**, with choices in groups: Voice (Plainer, Warmer, More direct), Specificity (Broader, More specific), Length (Shorter, Longer), Audience (Peers, Senior leaders, My team) and Emphasis (the tool's own: for a brief, The ask, The evidence, The risks). A pitch has no Audience, and calls Voice "Tone". Then **Or say what to change** and **Revise**. With nothing chosen or said: "Choose a change, or say one." Revising shows "Revising your draft…" and saves a new version: "Saved as version {n}. The earlier one is still there."

Revisions never add a fact. Shorter drops ExecHQ's framing but keeps their words and the questions; Longer adds a question for them.

### 5.4 Versions

Under Change the draft: **Versions**, "Every change is saved. Bring back any earlier version." Each version with when and what changed, **View**, and **Bring this back**, which saves it as a new version ("Version {n} is back, saved as a new version. Nothing was lost.").

### 5.5 Ready, used, and how it went

- **Mark ready** (with Change the draft beside it on phone). "Marked ready. ExecHQ will ask what came of it once you use it." The draft then reads clean, with **Change something** to return to the working draft.
- Ready, the one button is **I've used this** (**I've sent this** for a pitch, **I've published this** for a post). A pitch first asks **Mark it sent**: Sent to, Contact and When (none required), then **Mark sent** or **Not yet**.
- Once used, **How did it go?** asks in place, with It went well, It was mixed, Not the way I hoped, and Nothing yet. Their one tap is all the feedback: ExecHQ says it back and gives the next step, whatever they answered, by the rules each builder page sets out, with **Add a note** offered. A plan step goes on their Plan only when they tap Add. Nothing yet asks again later.
- A Situation Brief with a date asks the day after the meeting, however early they mark it used; other tools ask after their own interval.

### 5.6 The fixed bar (phone and tablet)

With the draft open: **Change the draft** and **Mark ready**. Ready: **I've used this** alone, with Copy and the downloads in Actions. Changing a ready draft: **Change the draft** and **Done**. Change the draft folds the card and shows the controls (5.3, 5.4) under it.

---

## 6. Tool by tool

What each tool asks, what its draft holds and what comes next after its outcome are in the builder pages. The flow itself differs only here:

- **Positioning Builder** is one artifact: their statement from onboarding, opened as version 1, never copied. Once built out, opening the tool shows the start screen first, and starting opens the statement; **Build it out again** asks the questions again, filled with their last answers, and adds the next version, never replacing the last. Building out a statement they closed reopens it as a draft, saying "You closed this statement on {date}." with the statement. They can pick more than one introduction, a pasted bio is read whole, and where they will use it first adds a version made for it (see the Positioning Builder page). It offers to add their accomplishments, never waiting on it. Each part (statement, each bio, the narrative) has its own Copy, and the bios PDF and Word. Changing the statement offers, never forces, a refresh of the rest.
- **Pitch Builder** names where it goes, above what it says, and ends with **Send it in four steps** ("Ticks are only for you. ExecHQ never sends anything for you."). Under who they're pitching, "Not sure yet? See three that fit" offers up to three outlets of the kind they chose. The follow-up draft lives on the same artifact.
- **Situation Brief** takes a date, and its follow-up lands the day after it.
- **Thought Leadership Builder** started from a read carries the read as its source for the life of the draft.

---

## 7. Accessibility

- One level 1 per screen: the tool's name, the question, or the draft's title. On web the page's "Your draft so far" is level 2 and its sections level 3; a shaded section says "where this answer goes" to screen readers.
- Changing screen moves focus to the new heading. On web the rail comes before the page in the reading order.
- Chips are toggle buttons in a labelled group; Other is a labelled field. Errors are tied to the question and announced.
- Her words, ExecHQ's wording and open questions differ by ink, underline and border, not by colour alone, and screen readers hear "ExecHQ:" before ExecHQ's wording and "To answer:" before a question.
- The phone's drawer and the delete sheet take focus, close on Escape, and give focus back. The drawer's handle is a real button, so nothing needs dragging.
- Messages (copied, saved as version {n}, marked ready) are announced in a live region.
- Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour.

---

## 8. Components

| Component | Where |
| --- | --- |
| `ToolUseCase` | The start screen |
| `GuidePage`, `AnswerDrawer` | A question on phone and tablet |
| `StepHeader` | A question, and the draft's title, in the web rail |
| `PickAnswer` | Chip answers, with Other |
| `InputPanel` | Built with, and Check what ExecHQ has |
| `PinnedDraft` | The draft card on phone and tablet |
| `DraftEditor` | The draft, working and clean |
| `RevisionControls` | Change the draft |
| `VersionHistory` | Versions |
| `DraftUseBar` | Mark ready, I've used this |
| `CheckIn`, `OutcomeNext` | How did it go, and the next step |
| `EnricherCard` | Positioning Builder's accomplishments offer |
| `OutletCard`, `OutletSuggestions`, `SendSteps` | Pitch Builder |
| `SourceLabel` | Started from today's Briefing |
| `DropdownMenu` | Actions |
| `Sheet` | Delete, asked first |

---

## 9. Prototype versus production

| In the prototype | In production |
| --- | --- |
| Drafts are written by fixed rules from the answers, without a model | Written by the model, within the same guardrails: her words kept and marked, no facts added, questions left for her |
| Revisions are rule-based rewrites | Model revisions, with the same choices |
| The answers offered (`INTERVIEW_PICKS`) are drafts for review | Reviewed answer sets |
| Copy says it copied; PDF and Word say they are downloading | Real copy and downloads |
| A step bar along the top lets a reviewer jump to any screen | Review scaffolding only; the product has no way to skip ahead |
| Everything is kept in the browser, and the dock's reset clears it | Kept on the account |

---

## 10. Decisions to confirm

Written from the approved prototype. These are choices it makes that nobody has yet confirmed:

1. **Telling ExecHQ's wording from hers** stays on screen only: Copy takes plain text, with no marks.
2. **Any artifact can be closed at any time,** and closing one waiting to hear stops its follow-ups.
3. **Use as a starting point** makes a new, linked artifact; nothing is edited in place.
4. **PDF and Word** for the Situation Brief, the bios and the pitch; a post is copied.
5. **No "delete after use"** on the Situation Brief.
6. **On web the draft is a page from the first screen,** with every section named and questions in place, before anything is answered.
