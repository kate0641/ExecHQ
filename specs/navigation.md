# Navigation patterns — interaction spec

Approved concept: **Concept 1 — Concierge** (approved 2026-10-01).
Concepts 2 (Tab bar) and 3 (Drawer) were retired to the `scratch` branch and are not part of this spec.

This document describes how the signed-in navigation looks, behaves and works, on phone, tablet and web, so a developer can build it without the prototype open. Where the prototype fakes something, the production behavior is stated separately under "Prototype versus production".

---

## 1. What it is

There is no navigation bar, tab bar, menu or sidebar. Every signed-in page carries one control: a floating pill that reads **"Ask or go"**. The pill opens the advisor, the same ExecHQ advisor who ran onboarding (same mark, same name, same voice). The advisor is the navigation:

- **Go:** he takes you to any destination.
- **Log:** he records what happened with something you used.
- **Get ready:** he helps you finish a draft.
- **Talk it through:** he answers questions about your career.

The reasoning: ExecHQ users are senior and time-poor. One box that does all four removes the need to learn a menu, and the advisor is already the product's personality.

### Destinations

Five, in this order. They come from the manifest's `appNav` and must not be hard-coded in the component.

1. Home (`homepage`)
2. Plan (`plan`)
3. Toolbox (`toolbox`)
4. Briefing (`daily-briefing`)
5. Profile (`profile`)

Toolbox flow (the artifact builder) is a sub-flow of Toolbox and is not a destination.

### Where it appears

On every page whose flow uses the `app` chrome: Homepage, Profile, Plan, Toolbox, Toolbox flow and Daily Briefing. It does **not** appear on Onboarding or Login (`minimal` chrome) or on the Enterprise Dashboard (`enterprise` chrome, its own navigation).

---

## 2. The pill (closed state)

### Contents, left to right

1. **"Where you are" chip.** A dark, pill-shaped chip with the current destination's icon and name ("Home", "Plan"…). It is the only wayfinding on the page, so it must always be correct. Visually hidden text reads "You're on" before the name.
2. **Prompt.** The text "Ask or go", in muted text color, truncating with an ellipsis if it ever runs out of room.
3. **Follow-up dot** (only when a follow-up is due, see section 7). A small accent-coloured dot. Never a number. Visually hidden text reads "A follow-up is waiting".
4. **Advisor mark.** The ExecHQ advisor mark, 20px, at the far right.

### Size and position

| | Phone | Tablet and web |
| --- | --- | --- |
| Width | Full width minus 16px gutters (`--space-md`) each side | 480px, centered. Never wider than the screen minus 2 × `--space-xl`. |
| Height | 58px | 58px |
| Distance from the bottom of the screen | `--space-lg` (24px) | `--space-lg` (24px) |
| Shape | Fully rounded (pill) | Fully rounded (pill) |
| Surface | Surface color with the large shadow (`--shadow-lg`), no border | Same |

The pill is **fixed to the screen, not the page**: it stays in place while the page scrolls underneath it. It sits above page content.

The page reserves room for it. The page's main area has bottom padding of `--space-4xl` on every viewport so the last piece of content can scroll clear of the pill.

### States

| State | Behavior |
| --- | --- |
| Default | As above. |
| Hover | Shadow deepens to `--shadow-panel`. No color change. |
| Focus (keyboard) | The standard focus ring (`--focus-ring`, with `--focus-ring-offset`). Must be visible against both the page and the shadow. |
| Pressed | Scales to 98%. |
| Open | The pill fades out (opacity 0, no longer clickable, no longer focusable) while the panel is showing. See section 3. |

`aria-expanded` reflects whether the panel is open, and `aria-controls` points at the panel's id.

---

## 3. Opening and closing

The same control opens a different surface depending on viewport. The conversation, content and behavior inside are identical; only the container and its motion change.

### Phone: a sheet that rises

- On tap, a sheet rises from the bottom of the screen over the page. The pill fades and drops 16px as it goes.
- The sheet starts at 7% from the top of the screen (so a strip of the page stays visible above it) and runs to the bottom edge. Corners are rounded at the top only (`--radius-xl`), with the large shadow.
- **Once a conversation has started** (any message sent), the sheet grows to cover the whole screen, stopping below the status bar (`--device-statusbar-height`, 44px).
- A grab handle (a 40 × 5px bar) sits at the top of the sheet.
- A dim scrim (`--color-overlay`) covers the page behind it.
- Motion: 340ms, ease `cubic-bezier(0.2, 0.8, 0.2, 1)`.

How to close it on the phone:

- Tap the scrim (the visible strip above the sheet).
- Drag the sheet down more than 80px and release (it follows the finger while dragging; under 80px it springs back).
- The Close (×) button. Before anything has been asked, the top bar is not shown, so the Close button is out of sight and appears only when it receives keyboard focus. Screen readers and keyboard users can always reach it.
- Escape on a keyboard.
- Going to a page (section 5).

### Tablet and web: the pill grows into a card

This is the behavior decided on 2026-10-01 (option "A · Rise"). It is a single continuous movement rather than a panel arriving from somewhere else.

Closed to open, over 420ms, ease `cubic-bezier(0.2, 0.8, 0.2, 1)`:

1. The card begins exactly where the pill is: same position, same 480 × 58 size, same fully rounded shape.
2. It then widens to **600px**, rises to a height of **680px** (or the screen height minus 5rem, whichever is smaller), and its corners round off from the pill shape to `--radius-xl`. It stays centered and keeps its bottom edge at `--space-lg` from the bottom of the screen, so it grows upward.
3. At the same time the pill fades out underneath it (120ms) and the card's contents fade in (200ms, starting 160ms into the movement, so content never shows in a card that is still pill-shaped).
4. A dim scrim (`--color-overlay`) fades in over the page behind the card (200ms).

The card never goes narrower than the screen allows: its width is the smaller of 600px and the screen width minus 2 × `--space-xl`.

Closing runs the same movement in reverse: the card shrinks back into the pill while its contents fade out (120ms), the pill fades back in, and the scrim fades away.

**The page does not move, resize or reflow.** This is deliberate. Earlier the panel docked beside the page and squeezed it; the card replaced that.

How to close it on tablet and web:

- Click the scrim anywhere outside the card.
- The Close (×) button at the top right of the card.
- Escape.
- Going to a page (section 5).

### Shared rules for both surfaces

- **Modal while open.** The page behind is made inert (not clickable, not focusable, hidden from assistive technology). The panel has `role="dialog"` and `aria-modal="true"`, and an accessible name ("ExecHQ, your advisor").
- **Focus.** On open, focus moves to the message field. On close by any route that is not navigating to another page, focus returns to the pill. On navigating to another page, focus is not forced back (the new page takes it).
- **Closed means gone.** When closed, the panel is inert and invisible; its contents cannot be tabbed to.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` all of the movement above is replaced by an instant change (no sliding, growing or fading).
- **The conversation survives.** Closing the panel does not clear the conversation. It stays until the user chooses New chat (section 4) or the browser tab is closed, and it carries across navigation between pages.

---

## 4. Inside the panel

Layout, top to bottom, identical on the sheet and the card:

1. **Top bar.** Holds, right to left: Close (×, 44 × 44px), and "New chat" (text button, only once a conversation exists, which clears it). Once a conversation has started, the advisor's mark, name ("ExecHQ") and role ("Your advisor") also show at the left of the bar. Before then the top bar carries only Close, because the start screen introduces the advisor itself. On the card (tablet and web) the top bar has no rule beneath it; on the phone sheet it keeps a thin rule.
2. **Body.** Scrolls. It always scrolls to the newest message.
3. **Foot.** Pinned. Holds quick replies (when there are any), the "Go to" button (when typing a destination), and the message field.

### Start screen (nothing asked yet)

Three sections:

1. **Go to.** A row of the five destinations, each an icon above its name, as equal-width buttons. The current destination is shown filled (dark). Home shows the quiet accent dot when a follow-up is due. Selecting one goes there and closes the panel.
2. **Pick up where you left off.** Shown only if there is a draft or in-progress artifact. It is one card: the artifact's title, and "Drafted 5 Oct" or "Edited 5 Oct" (the most recent record of those two kinds, by latest history entry). Selecting it opens the Toolbox flow and closes the panel. If nothing is open, the section is absent entirely (no empty state).
3. **Ask me.** The advisor's mark, name and role, then up to four suggested questions as full-width buttons. Which four depends on the user's situation (section 7).

### Conversation (after the first message)

- A compact row of the five destinations stays at the top of the thread as small pills (current one filled), so a destination is always one tap away without ending the conversation. The row scrolls sideways if it overflows.
- Messages: the user's on the right, the advisor's on the left. The advisor's first message in a run shows his mark. Consecutive advisor messages group.
- While the advisor is "typing", a typing indicator shows in place of his message. In the prototype this is 650ms; it is instant under reduced motion. In production it should show for as long as the real response takes.
- An advisor turn can contain: paragraphs, a numbered list, closing paragraphs, and a card (title plus body, used for "Next on your plan: …").
- **Quick replies.** After some advisor turns a set of tappable answers appears just above the message field ("Take it on" / "Not now", the follow-up outcomes, "Open it"). They disappear when the user sends anything or while the advisor is typing. Tapping one behaves exactly as if the user had typed that label.

### The message field

- Placeholder: "Ask or go…". Enter or the send button sends. The field is disabled while the advisor is typing.
- **Typing a destination offers to go there.** If what has been typed is a prefix of a destination name (at least two characters, ignoring a leading "go to" or "open"), a "Go to {destination}" button appears above the field with an Enter hint. Pressing Enter goes there rather than asking a question.

### Intent: going somewhere

Typing any of these goes to the destination, with or without "go to", "open", "take me to", "show me", "my" or "the": home, homepage, plan, toolbox, briefing, daily briefing, profile, account, settings. ("Account" and "settings" go to Profile.) The advisor replies with a short line first ("Here's your plan."), waits 350ms, then navigates, and the panel closes.

---

## 5. Navigating

Going to a page, by any route (a destination button, the compact row, the "Go to" button, the resume card, a quick reply such as "Open it", or typing a place name), does the same three things:

1. The panel closes. It does not stay open beside the new page, on any viewport.
2. The page changes to the destination.
3. The pill's "where you are" chip updates to the new destination.

The conversation is kept, so reopening the panel shows what was said before.

The destination's own page sets its own heading and content (specified in each flow's own spec). Navigation does not add a page header, a back button or breadcrumbs. Browser back and forward work as normal because navigation is real routing.

---

## 6. What he can do

Each of these changes real data (the Loop, section 7), so the effect shows up on Home, in statuses and in the follow-up dot, not only in the chat.

| The user says (examples) | He does |
| --- | --- |
| Names a destination | Goes there (section 4). |
| "Tell you what came of …", or answers about a follow-up ("it went well", "nothing yet") | Logs the outcome against the waiting item. See "Logging an outcome" below. |
| "I used / sent / shared / presented …" | Marks the named artifact as used, today, and asks when to check back (in the usual number of days for that kind of artifact, in a week, or never). If the user names no artifact and exactly one is open, he assumes it. If several are open he asks which. |
| "Help me finish …", "get ready for …" | Describes what is worth doing first, shows the draft as a card with its status, and offers "Open it". For a briefing to a manager or a pitch he also offers "Help me with the opening". |
| "What should I say" / "how do I start" | Offers a suggested opening line to adapt, with a one-line reason it works. |
| "What have I done so far?" / "What came of …" | Summarises what has been used and what came of each. Offers "Tell you now" if a follow-up is waiting. |
| "What's next?" | States the next step on the plan and why, and offers "Open your plan" and "Go to Home". |
| "How do I ask for more scope?" | Gives general advice (three points) and offers to talk it through. |
| Anything about managers, stakeholders, influence, politics | Gives two practical points and asks who they are thinking of. |
| Anything he cannot act on | Answers in one of five ways, by what the person typed. See "When he cannot act on what was typed" below. |

### When he cannot act on what was typed

Some input matches nothing he can do. There are five kinds, and each gets its own reply, because a joke, a résumé request, a muddle and someone in trouble should not all get the same menu. His voice stays calm and short, he never says it is a prototype, and he never pretends to have understood.

| Kind | What it is (examples) | What he does |
| --- | --- | --- |
| **Unclear** | Too short, or a muddle ("hmm", "asdf"). Anything he cannot place that is none of the kinds below | "I want to get this right, and I'm not sure what you're asking." then "Is it one of these?" and three tappable suggestions. |
| **Off topic** | Not about the person's career or plan (the weather, a joke, general questions, "are you an AI?") | "That's outside what I'm here for. I stay with your career and your plan." then "Here's what I can do instead." and three suggestions. |
| **Beyond him** | A career request he does not do (writing or editing a résumé or profile, finding jobs, negotiating salary, scheduling, sending an email for them) | "I can't do that yet. I don't write or edit résumés or profiles, search for jobs, or send anything for you." then "I can help with something close to it:" and three suggestions. |
| **Danger or distress** | Self-harm, being unsafe or abused, panic ("I want to die", "I can't cope") | He does not coach it. "I'm sorry you're carrying this. It's more than I can help with, and you deserve someone who can." Then: "If you might be in danger, call 911. If you're thinking about hurting yourself, call or text 988, the Suicide & Crisis Lifeline, any time." Then: "Nothing you've said here is saved to your plan." One button, **Go to Home.** |
| **Trouble at work** | Harassment, discrimination, bullying, retaliation, legal trouble | He does not advise. "I'm sorry that's happening. It's more than I can advise on, and it's worth talking to someone who can." Then: "For harassment or discrimination, an employment lawyer or the U.S. Equal Employment Opportunity Commission can tell you where you stand. If your employer has an employee assistance program, it's usually confidential." Then: "Nothing you've said here is saved to your plan or seen by anyone else." One button, **Go to Home.** |

Rules:

- **Care comes first.** Danger, distress and trouble at work are recognized before anything else, so "my boss is harassing me" is never read as a question about managers and answered with tips on influence.
- **A muddle twice in a row stops the menu.** A second unclear message in a row gets "I'm still not catching it, and I don't want to guess." with two choices only: **What's next on my plan?** and **Go to Home.** He does not offer the same three suggestions again.
- **A request he can name is always answered plainly.** Off topic and beyond-him requests are never met with "I'm not catching it," because he has understood them. He says what he cannot do, every time.
- **A follow-up he cannot read is asked again,** with the outcome choices. If he has just asked what came of a follow-up and the answer does not read as an outcome, he asks again with the choices, so it is never treated as a miss.
- **Nothing is logged.** Input he cannot act on never changes the Loop, never marks anything used and never creates a record. The reply stays in the conversation only, which follows the persistence rule in Decisions.
- **The two care replies do not count as misses,** so a later muddle is not treated as a repeat.
- **Tappable suggestions** are the first three of the usual suggestions (Suggested questions, in order, section 7).

### Logging an outcome

The outcome is one of: positive, neutral, negative, nothing yet, no longer relevant. The user either taps one or says it in their own words; the words are matched to an outcome.

- Anything longer than the outcome label is stored as the user's own words ("Logged, in your words: …"). A tapped label stores only the outcome.
- **Positive or neutral:** logged, then a card with the next step on the plan, and "Take it on" / "Not now". "Take it on" makes it the user's next step and says it is on Home. "Not now" logs and closes it.
- **Negative:** logged, and the advisor says it is useful to know, not a verdict, and offers "Talk it through" and "What's next?".
- **Nothing yet:** the advisor says that is a normal answer and reschedules. He asks again after 3, then 7, then 14 days. After three "nothing yet" answers he stops asking and says so.
- **No longer relevant:** logged, and he does not ask again.

### Tone

Calm, short sentences, no filler. "Nothing yet" is a normal answer. Outcomes are recorded without claiming the artifact caused them. All copy lives in `mock/concierge.ts`; no copy is written in components.

---

## 7. Data it reads and changes (the Loop)

The advisor and the rest of the app share one record of the user's work, the Loop. Each record is an artifact (a leadership story, a pitch…) with a state (drafted, in progress, ready, used, waiting, closed), a date it was used, a check-back date, an outcome, and a history. The panel reads this live, so it is never out of step with Home.

### Follow-up is due when

The record is in the waiting state, has a check-back date that has arrived, and has been answered "nothing yet" fewer than three times. When several are due, the one waiting longest comes first and only that one is put in front of the user. Others wait their turn rather than stacking.

### What a due follow-up changes

- The pill shows the follow-up dot, and so does Home on the panel's destination list.
- The first suggested question becomes "Tell you what came of {artifact}".

### Suggested questions, in order, up to four

1. "Tell you what came of {artifact}": only if a follow-up is due.
2. "Help me finish {artifact}": only if there is a draft or in-progress item.
3. "What's next on my plan?"
4. "How do I ask for more scope?"
5. "What have I done so far?"

The first four that apply are shown.

### What he changes

Answering a follow-up, marking something used, taking on a next step, and setting one aside all write to the Loop. Home, the statuses on each artifact, the follow-up dot and the plan all update straight away.

---

## 8. Accessibility (WCAG 2.2 AA)

- The pill is a real button with an accessible name made of "You're on {page}", "Ask or go" and, when due, "A follow-up is waiting".
- The panel is a modal dialog with an accessible name. Focus moves in on open and back to the pill on close. Tab order inside is: close, new, the content, the message field. Escape always closes.
- Everything is reachable and operable by keyboard. Dragging the sheet down is never the only way to close it (Close, Escape and the scrim all work), which satisfies WCAG 2.2 SC 2.5.7.
- The page behind is inert while the panel is open.
- The conversation is an ARIA log, so new advisor messages are announced.
- Visible focus indicators on every interactive element; the current page is marked with `aria-current="page"` on the destination buttons.
- Text 4.5:1 and non-text 3:1 contrast. The follow-up dot is never the only cue: the visually hidden text and the first suggestion both say a follow-up is waiting.
- Touch targets: see "Touch targets" in section 9. Every control is at least 44 × 44px on every viewport.
- All motion respects `prefers-reduced-motion`.

---

## 9. Specifications

### Breakpoints

| Viewport | Production breakpoint | Prototype frame | Concierge surface |
| --- | --- | --- | --- |
| Phone | Below 768px | 393px wide | Floating full-width pill, rising sheet |
| Tablet | 768px to 1199px | 820px wide | Floating 480px pill, card |
| Web | 1200px and up | Fills the window | Floating 480px pill, card |

The only differences between viewports are the pill's width and which surface opens (sheet or card). Everything inside the panel behaves identically. In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production, use the real breakpoints above.

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Pill height | 58px | none (fixed) |
| Pill width, phone | Screen width minus 2 × 16px | `--space-md` gutters |
| Pill width, tablet and web | 480px, at most the screen width minus 64px | `--space-xl` each side |
| Pill distance from screen bottom | 24px | `--space-lg` |
| Pill and card shape (closed) | Fully rounded | `--radius-pill` |
| Card width | 600px, at most the screen width minus 64px | `--space-xl` each side |
| Card height | 680px, at most the screen height minus 5rem | none |
| Card corner radius (open) | 20px | `--radius-xl` |
| Sheet corner radius (top corners) | 20px | `--radius-xl` |
| Sheet top edge | 7% of the screen height; below the status bar (44px) once chatting | `--device-statusbar-height` |
| Page bottom padding, to clear the pill | 96px | `--space-4xl` |
| Pill and card shadow | Large | `--shadow-lg` (pill hover: `--shadow-panel`) |
| Scrim | 48% dark | `--color-overlay` |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |
| Fast, base, slow durations | 120ms, 200ms, 320ms | `--duration-fast`, `--duration-base`, `--duration-slow` |
| Sheet motion | 340ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` | none |
| Card motion (grow and shrink) | 420ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` | none |
| Sheet drag to close | More than 80px down | none |
| Typing indicator | 650ms in the prototype (instant under reduced motion) | none |
| Pause between "Here's your plan." and navigating | 350ms | none |

All colors are tokens (`--color-surface`, `--color-text-muted`, `--color-surface-inverse` for the chip, `--color-accent` for the dot). No hard-coded colors.

### Touch targets

Every interactive control in the pill and the panel is at least **44 × 44px** (`--button-target`) on every viewport, tablet and web included. WCAG 2.2 AA requires only 24px (SC 2.5.8); 44px is the ExecHQ standard because this is a mobile-first product used one-handed.

| Control | Size |
| --- | --- |
| Pill | 58px tall; full width on the phone, 480px on tablet and web |
| Close (×) | 44 × 44px |
| New chat | At least 44px tall |
| Destination buttons (start screen) | About 83 × 67px |
| Compact destination row (in a conversation) | At least 44px tall |
| Resume card and suggested questions | At least 48px tall, full width |
| Quick replies | At least 44px tall |
| "Go to {destination}" button | At least 44px tall |
| Send button | Drawn 32px; its tappable area is 44 × 44px, centered on it |

Where a control is drawn smaller than 44px (only the send button), an invisible tappable area makes up the difference. It must not overlap another control's tappable area.

---

## 10. Components

| Component | Role |
| --- | --- |
| `ConciergePill` | The floating control: where-you-are chip, prompt, follow-up dot, advisor mark. |
| `ConciergePanel` | The frame of the sheet or card: top bar, scrolling body, pinned foot. |
| `ConciergeConcept` (in `flows/navigation/concept-1`) | Wires the pill and panel to the page, the conversation and the Loop. |
| `lib/concierge.ts` | What he understands and how he responds. Pure functions. |
| `mock/concierge.ts` | Everything he says. |

---

## 11. Prototype versus production

The prototype has no backend and no AI. These parts are faked and need real implementations:

| Prototype | Production |
| --- | --- |
| He understands by keyword matching (`understand` in `lib/concierge.ts`). | A language model with the user's account as context. The intents in section 6 are the minimum he must handle well, and "Go" must stay deterministic: a typed destination name must always navigate, never be interpreted. |
| He replies from written answers (`mock/concierge.ts`). | Generated, in the voice described under Tone. Open advice stays within the scope in Decisions. |
| He sorts input he cannot act on by keywords into five kinds. | A trained classifier, never keywords alone. Danger, distress and trouble at work must be caught reliably, and the wording of those two replies and the resources they name must be reviewed by a person before launch. The resources named are for the United States (911, 988 and the EEOC), which suits the pilot; other countries need their own. |
| The typing indicator is a fixed 650ms. | Shown while the real response is pending, with a timeout and a plain failure message. |
| The Loop is a local store. | A real record per user, with the dates and counts in section 7 computed on the server. |
| The conversation lasts for the browser tab. | The signed-in session, cleared by New chat or sign-out (see Decisions). |
| "Today" is a fixed date. | The user's real date and time zone. |

### Decisions

These are settled. They are the specified behavior.

1. **Scope of advice.** The advisor gives open career advice, as well as acting on the user's record. It is limited to the topics in the table in section 6 (asking for more scope, working with managers and stakeholders, preparing a draft, and what has been done so far). Anything else gets one of the five replies in "When he cannot act on what was typed" (section 6). Widening the scope later is a product change, not a bug fix.
2. **Persistence.** A conversation lasts for the signed-in session. It survives closing the panel and moving between pages, and it is cleared by New chat or by signing out. It does not carry to the next session.
3. **The dot.** Only a due follow-up raises it (section 7). Nothing else, such as new briefings or plan changes, ever does.
4. **He never guesses at what he cannot act on.** Five kinds of miss, each with its own reply; danger, distress and trouble at work get care and resources, not coaching; nothing he cannot act on is logged. (2026-10-02)
5. **Navigation never changes shape.** One pill and one panel on every viewport, with the surfaces above. There is no secondary navigation anywhere in the signed-in app.
