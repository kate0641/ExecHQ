# Login — interaction spec

Approved concept: **Concept 1 — Open page**, with the welcome from the start of onboarding as of 2026-10-01. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

---

## 1. What it is

Login is how a returning person gets back into their private account. It does two jobs: it gets them in with as little effort as possible, and it reminds them what ExecHQ is, in the same words and the same look as the first moment of onboarding, so a returning person and a new one see one product.

There is no password. A person signs in one of three ways:

1. **An emailed code (the main way).** They enter their email, ExecHQ sends a 6-digit code, and they type it in.
2. **Google.**
3. **Apple.**

Sign-in always lands on **Home** (Homepage Concept 1), in whatever state the person's account is in.

What it deliberately does not do:

- **Reveal who has an account.** The code screen says the same thing whether or not an account exists for the address.
- **Show any career detail.** The login email's subject and preview say nothing about the person's career, so nothing private shows on a lock screen.
- **Offer a password,** "forgot password", or any social sign-in beyond Google and Apple.

### Where it appears

Login uses the `minimal` chrome: no header, no navigation, no footer line. It is the page a person reaches when they are signed out, and the page "Sign back in" on the signed-out screen (see the Profile spec) leads to.

---

## 2. The first screen

### 2.1 What is on it

In the sheet, top to bottom:

1. **Welcome back** (small label), then the heading **Log in to ExecHQ**.
2. **The promise:** "A private career advisor that takes you from "I'd like to be" to "I'm going to be". It doesn't just show you the way. It works for you to get you there." These are the exact words from the start of onboarding. They come from one place in the copy, so the two cannot drift apart.
3. **Email field:** a pill-shaped field labeled "Your email".
4. **Keep me logged in on this device:** a checkbox, ticked by default.
5. **Log in:** a full-width primary button.
6. **or**, with a thin line either side.
7. **Continue with Google** and **Continue with Apple:** two full-width secondary buttons with their marks.
8. **New to ExecHQ? Start here.** "Start here" goes to the start of onboarding.
9. At the very foot: a lock icon, "Private to you.", and a **Learn more** link.

In the dark panel: the **ExecHQ wordmark** and the line **"Somewhere to work on what comes next."** in italic serif.

### 2.2 Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Arrangement | Dark panel on top, white sheet rising over it | Same as the phone | Dark panel on the left (40%), white sheet on the right |
| Dark panel | Fills what the sheet leaves. Wordmark at the top, the line below it | A fixed 18rem (288px) tall. Wordmark starts 80px (5rem) from the top, the line below it | Full height. Wordmark and the line sit together in the middle of the panel, across and down, centered |
| Sheet | As tall as its content, at the foot of the screen, with rounded top corners (`--radius-xl`) | Fills the rest of the screen, with rounded top corners | Fills the right side, square-cornered |
| Sheet content | One column, the width of the screen less 24px each side | One column, at most 28rem (448px), centered across the sheet and down it | One column, at most 28rem, centered across the sheet and down it |
| Privacy line | At the foot of the sheet | At the foot of the sheet | At the foot of the sheet |

The sign-in column is never wider than 28rem. On tablet and web the extra room is empty space, not wider fields.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above. On the phone, the dark panel runs under the status bar, so the status bar switches to its light tone while the dark panel is showing.

### 2.3 The compact panel

After the first screen (the code screen, "code expired", "different account"), on **phone and tablet**, the dark panel shrinks to a short band holding only the wordmark. The line is dropped, and the sheet fills the rest. This keeps the form within reach of the thumb. On **web** the full panel stays, because it is beside the sheet and costs no height.

---

## 3. The screens and how they connect

```
First screen ── Log in ──▶ Code screen ── right code ──▶ Home
     │                       │   ├─ Send it again ──▶ Code screen (new code)
     │                       │   ├─ Use a different address ──▶ First screen
     │                       │   └─ Can't get into that inbox? ──▶ Recovery dialog
     │                       └─ code too old ──▶ "That code has expired" ──▶ Code screen
     ├─ Google / Apple ──▶ the provider's window ─┬─ address matches ──▶ Home
     │                                            └─ no match ──▶ "That's a different account"
     ├─ Start here ──▶ Onboarding
     └─ Learn more ──▶ "Only you see this" dialog
```

### 3.1 Logging in with an email

1. The person types an email and presses **Log in** (or Enter).
2. The email is checked for shape only (something@something.something). An empty field shows "Enter your email address to get a login code." A malformed one shows "That doesn't look like an email address. Check it and try again." The error sits under the field and clears as soon as they type.
3. A valid address goes to the **code screen**. The same screen appears whether or not an account exists for it.

**Keep me logged in on this device** decides how long the sign-in lasts. Ticked, the person stays signed in on this device for 30 days. Unticked, the sign-in ends when the browser closes.

### 3.2 The code screen

The sheet shows:

- Heading: **Enter your code.**
- "If there's an account for {email}, we've sent a 6-digit code. It works for 10 minutes."
- A row of six boxes labeled "Type the code from the email." (the boxes are one field, so a pasted code fills all six).
- A line with **Send it again** and **Use a different address**.
- "Nothing arrived? Check your junk folder. **Can't get into that inbox?**"

How it behaves:

- **Auto-submit.** As soon as the sixth digit is in, the code is checked. There is no Continue button.
- **A right code** signs the person in and goes to Home.
- **A wrong code** shows "That code doesn't match. Check the latest email and try again." under the boxes, clears the boxes and puts focus back in the first one. After five wrong tries the code stops working and the person sees "That code has expired" (3.3).
- **The code** is six digits, works for 10 minutes and works once. Asking for a new code makes the old one stop working.
- **Send it again** is not available for the first 30 seconds, and shows "Send it again in {n}s" while it counts down. After that it is a link. Pressing it sends a new code, restarts the 30 seconds and announces "Sent again."
- **Use a different address** returns to the first screen.
- **Can't get into that inbox?** opens the recovery dialog (3.6).

**The email arrives.** About 1.6 seconds after the person asks for a code, a notification drops in at the top of the screen, as a phone would show it: "ExecHQ · Your login code · Here's the code you asked for." Screen readers hear "New email from ExecHQ: Your login code." In the prototype, tapping it opens the drawn email (3.5). In production the person opens their own mail app.

### 3.3 "That code has expired"

Reached when the code is too old or has had too many wrong tries. The sheet shows the heading **That code has expired**, the line "Login codes work for 10 minutes and only once. We can send a new one to {email}.", a **Send a new code** button (full width) and **Use a different address**.

### 3.4 Google and Apple

Pressing **Continue with Google** or **Continue with Apple** opens that provider's own window, where the person chooses an account. The window returns an email address, and ExecHQ compares it with the address on the person's ExecHQ account.

- **The address matches:** the person is signed in and goes to Home.
- **The address does not match:** the person sees **That's a different account** ("No ExecHQ account uses that address. Log in with the email you used when you joined, or start fresh."), with **Log in with my email** (back to the first screen) and **Start fresh** (to onboarding).

Two cases always fall into "different account", because ExecHQ's accounts are tied to a personal email:

- **A work Google account.** A provider cannot say whether an address is personal or a work one. ExecHQ does not try to guess: it only compares addresses. A person whose account was made with their personal address cannot get in with their work address.
- **Apple's Hide My Email.** Apple gives ExecHQ a made-up relay address, which cannot match the address on the account. The person is sent to log in by email instead. In V1 there is no way to link the two.

### 3.5 The drawn email (prototype only)

Tapping the notification opens the email as a tall sheet in a mail app. It shows: from "ExecHQ", to the person's address, the subject **Your login code**, the line "Here's the code you asked for.", "Type this code in ExecHQ to log in:", the code in large type split in two groups of three, and "This code works for 10 minutes and only once. If you didn't ask for it, you can ignore this email. No one can log in without it." There is no button or link in the email. The person types the code. The subject and preview say nothing about the person's career. A note on the sheet says so, for reviewers.

### 3.6 "Can't get into that inbox?"

The dialog explains: "Your account is tied to your personal email so it stays yours wherever you work. If you've lost access to it, write to us from any address and we'll check it's you before moving the account." There is one button, **Close**. In V1 recovery is handled by a person on the support team, who verifies the account's owner before changing its address. There is no self-service route.

### 3.7 "Learn more" (privacy)

The first screen's foot line is "Private to you." followed by **Learn more**. It opens a dialog titled **Only you see this** with three lines, each marked with a cross:

- **Your employer:** can't see that you have an account, or anything in it.
- **Your colleagues:** nothing is shared with the people you work with.
- **Your network:** nothing is posted, and no one is told you're here.

One button, **Got it**, closes it. This is the privacy statement a person sees at sign-in, and it must stay true to what the Enterprise Dashboard shows (see the Profile spec).

### 3.8 Dialogs, in general

Every dialog on Login (the drawn email, the recovery dialog, the privacy dialog, and the provider windows) works the same way:

- **Surface.** A sheet rising from the foot of the screen on phone and tablet, and a centered dialog on web. At most 85% of the screen's height (94% for the drawn email), and no wider than the reading width (68ch, `--content-measure`) on tablet and web.
- **Modal.** The page behind is made inert while it is open.
- **Focus.** On open, focus moves to the first control in the dialog. Tab and Shift+Tab stay inside it. On close, focus returns to the control that opened it.
- **Closing.** The × button, Escape, tapping outside, and the dialog's own button all close it.
- **Motion.** The sheet rises over 240ms. Under reduced motion it appears instantly.

### 3.9 Focus and announcements

- Each time the screen changes (first screen to code screen, and so on), focus moves to the new screen's heading. It does not move on the first paint. The heading shows a visible focus ring when it takes focus from the keyboard.
- A polite live region announces: "New email from ExecHQ: Your login code.", "Sent again.", and "Logged in."

---

## 4. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Sign-in column, tablet and web | At most 28rem (448px) | none (fixed) |
| Dark panel, web | 40% of the width | none (fixed) |
| Dark panel, tablet | 18rem (288px) tall; wordmark 5rem (80px) from the top | none (fixed) |
| Sheet corner radius, phone and tablet (top) | 20px | `--radius-xl` |
| Email field height | About 61px | none (fixed) |
| Log in and provider buttons | 60px tall, fully rounded | `--radius-pill` |
| Gap between items in the column | 24px | `--space-lg` |
| Code boxes | Six boxes, each 52px wide and 56px tall | none (fixed) |
| Dialog maximum height | 85% of the screen (94% for the drawn email) | none |
| Dialog maximum width, tablet and web | 68ch | `--content-measure` |
| Sheet rise | 240ms | none |
| Email arrives after | 1.6 seconds (prototype) | none |
| Send it again unlocks after | 30 seconds | none |
| Code lifetime | 10 minutes, one use | none |
| Wrong tries before the code stops | 5 | none |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |

All colors are tokens. No color is hard-coded.

### Touch targets

Every interactive control is at least **44 × 44px** (`--button-target`) on every viewport, tablet and web included. WCAG 2.2 AA requires only 24px (SC 2.5.8). 44px is the ExecHQ standard because this is a mobile-first product used one-handed.

| Control | Size |
| --- | --- |
| Email field | About 61px tall, full column width |
| Keep me logged in | The whole row is tappable and 44px tall; the label toggles the box |
| Log in, Continue with Google, Continue with Apple | 60px tall, full column width |
| Code boxes | 52px wide, 56px tall |
| Text links (Start here, Learn more, Send it again, Use a different address, Can't get into that inbox?) | Drawn as text; each has an invisible tappable area 44px tall, centered on the line |
| Send a new code, Log in with my email, Start fresh, dialog buttons | At least 44px tall, full width |
| Dialog close (×) | Drawn small; its tappable area is 44 × 44px |

Two links never sit within 44px of each other vertically, so no two tappable areas overlap. Where a control is drawn smaller than 44px, an invisible tappable area makes up the difference.

---

## 5. Accessibility (WCAG 2.2 AA)

- **Headings.** One level-1 heading per screen (the screen's title), in a sensible order. The "Welcome back" label above it is not a heading.
- **Labels.** Every field has a visible label. The code boxes have one group label ("Type the code from the email.") and a name ("Six-digit code from the email").
- **Errors** sit directly under their field, are linked to it, mark it invalid and are announced. They do not rely on color alone.
- **Keyboard.** Everything works with a keyboard alone. Tab order follows reading order: email, keep me logged in, Log in, Google, Apple, Start here, Learn more. Enter submits the email. Escape closes any dialog.
- **Focus** is visible on every control, against the dark panel and the sheet. The heading takes focus when the screen changes.
- **Contrast.** Text 4.5:1, non-text 3:1, on both the dark panel (the wordmark and the line) and the white sheet. The compact band and the full panel use the same colors.
- **Privacy on the lock screen.** The email's subject and preview say nothing about the person's career. A screen reader hears the code digit by digit, not as one number.
- **Provider buttons** carry their provider's name and mark; the mark is decorative.
- **Dialogs** are modal and behave as in 3.8.
- **Motion.** The sheet and the screen changes respect `prefers-reduced-motion`.

---

## 6. Components

| Component | Role |
| --- | --- |
| `LoginConcept1` (in `flows/login/concept-1`) | The page: wires the screens, the dialogs and the sign-in together. |
| `WelcomeSplit` | The dark panel and the sheet. It is the same component as onboarding's welcome. Login uses it without a single action, with a footer, with a compact option, stacked on tablet and centered. |
| `ProviderButtons` | Continue with Google and Continue with Apple. |
| `AccountPicker` | Stand-in for a provider's own window (prototype). |
| `CodeField` | The six code boxes as one field. |
| `MailNotification` | The notification that drops in when the email arrives (prototype). |
| `SignInEmail` | The drawn email (prototype). |
| `Input` (pill variant), `Checkbox`, `Button`, `Sheet`, `Notice`, `DetailPanel` | The shared pieces. |

---

## 7. Prototype versus production

| Prototype | Production |
| --- | --- |
| Nothing is sent. The email arrives as a drawn notification 1.6 seconds later. | A real email is sent. The person opens their own mail app. |
| Any six digits are accepted. | The code is checked: right, wrong (5 tries), or expired (10 minutes). |
| A stand-in window plays Google's and Apple's pickers, offering a matching and a non-matching account each. | The provider's own window opens and returns an address. |
| Sign-in goes to Home in whatever state the dock picked. | Sign-in goes to Home with the person's real account. |
| Nothing is stored. Sign-in lasts only while the page is open. | "Keep me logged in" sets how long the sign-in lasts (30 days, or until the browser closes). |
| The recovery dialog only explains. | Recovery is a support process, handled by a person. |

---

## 8. Decisions

These are settled. They are the specified behavior.

1. **Three ways in:** an emailed code, Google and Apple. No password.
2. **One welcome.** Login opens with the same dark panel, line and promise as the start of onboarding, so returning and new people see the same first moment.
3. **The code, not a link.** The email carries a 6-digit code and no button. It works for 10 minutes and once, and a new code replaces the old one. After five wrong tries it stops.
4. **The same message whether or not an account exists.** The code screen never reveals who has an account.
5. **Providers match on address.** A Google or Apple account signs in only if its address is the one on the ExecHQ account. Work Google accounts and Apple's Hide My Email fall to "different account", and V1 has no linking.
6. **Keep me logged in** is on by default and lasts 30 days on that device. Off, it lasts until the browser closes.
7. **Lost inbox goes to a person.** The person writes to support from any address, and support verifies them before changing the account's email. V1 has no self-service recovery.
8. **Privacy is stated at sign-in.** "Private to you. Learn more" sits at the foot of the first screen and opens the three-line statement.
9. **The email says nothing about the person's career.** Neutral subject, neutral preview, no link.
10. **Sign-in lands on Home.**
