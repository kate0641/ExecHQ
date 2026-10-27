# Admin login — interaction spec

Concept: **Concept 1 — Work email** (status: approved, 2026-10-26). It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production". The route is still `/sponsor-login`; the page was renamed from Sponsor login on 2026-10-26.

It is built on the participant Login (Concept 1, approved; see the Login spec), and works the same way unless this spec says otherwise. Section 3 lists what is shared and section 4 what is different, so a developer builds the two from the same parts.

---

## 1. What it is

The Admin login is how the client's program admin gets back into the Admin Dashboard. It does two jobs: it gets them in with as little effort as possible, and it says what an admin can see before they are in.

There is no password. An admin signs in one of three ways, the same three as participants (decided 2026-10-23):

1. **An emailed code (the main way)** to their work email.
2. **Google.**
3. **Apple.**

Sign-in always lands on the **Admin Dashboard** (Concept 1b).

What it deliberately does not do:

- **Sign anyone up.** ExecHQ sets up an admin's account when the program is agreed, and the ExecHQ contact sends the invitation. There is no "Start here".
- **Reveal who has an account.** The code screen says the same thing whether or not an account exists, as on the participant Login.
- **Offer a password,** "forgot password", Microsoft, or any other sign-in.

### Where it appears

It uses the `minimal` chrome with no header, as the participant Login does. It is **web only**. It is where an admin lands when signed out, and where **Sign out** on the Admin profile goes.

---

## 2. The first screen

### 2.1 What is on it

The participant Login's web layout: a dark panel on the left (40%) and a white sheet on the right.

In the dark panel: the **ExecHQ wordmark followed by "Enterprise"**, and the line *"See how your leaders are putting their plans into practice."* in italic serif. On web the wordmark and line sit at the top left of the panel, as on the participant Login's web layout today.

In the sheet, centered, at most 28rem wide, top to bottom:

1. **Welcome back** (small label), then the heading **Log in to ExecHQ Enterprise**.
2. "Use the work email your ExecHQ contact set up for you."
3. **Email field:** a pill-shaped field labeled "Your work email".
4. **Keep me logged in on this computer:** a checkbox, ticked by default.
5. **Log in:** a full-width primary button.
6. **or**, with a thin line either side.
7. **Continue with Google** and **Continue with Apple:** two full-width buttons with their marks.
8. "Not set up yet? Your ExecHQ contact sends the invitation." This replaces the participant's "New to ExecHQ? Start here", and is not a link.
9. At the very foot: a lock icon, "Totals for your cohort. Never a participant.", and a **Learn more** link.

---

## 3. What works as on the participant Login

Build these from the same parts and rules, as written in the Login spec:

- **The email check** (Login spec 3.1): shape only; the same two error messages, "Enter your email address to get a login code." and "That doesn't look like an email address. Check it and try again."
- **Keep me logged in** (3.1): ticked lasts 30 days on that computer; unticked lasts until the browser closes.
- **The code screen** (3.2): "Enter your code", "If there's an account for {email}, we've sent a 6-digit code. It works for 10 minutes.", six boxes as one field, auto-submit, five wrong tries, **Send it again** after 30 seconds, **Use a different address**, and "Nothing arrived? Check your junk folder."
- **"That code has expired"** (3.3).
- **The email itself** (3.5): the subject "Your login code", the same neutral preview, no link.
- **Dialogs** (3.8) and **focus and announcements** (3.9), except that the announcement on sign-in is still "Logged in." and the page that follows is the dashboard.

---

## 4. What is different

### 4.1 The work email

The admin's account is tied to the **work email** ExecHQ set up for them, the opposite of participants, whose accounts are tied to a personal email. The field is labeled "Your work email" and the line above it says to use it.

### 4.2 Google and Apple

Pressing **Continue with Google** or **Continue with Apple** opens the provider's own window, which returns an address. ExecHQ compares it with the work email on the admin's account.

- **The address matches** (for example, the admin's work Google account): signed in, to the Admin Dashboard.
- **The address does not match** (a personal Google account, or Apple's Hide My Email relay): the sheet shows **That account isn't set up** / "No ExecHQ Enterprise account uses that address. Log in with the work email your ExecHQ contact set up.", with one button, **Log in with my work email**, back to the first screen. There is no "Start fresh": admins cannot sign up.

### 4.3 "Can't get into that inbox?"

On the code screen, the link opens a dialog: **Can't get into that inbox?** / "Write to your ExecHQ contact from any address. They can check the email on your account, and send a new invitation if it has changed." One button, **Close**.

### 4.4 "Learn more" (privacy)

The foot line is "Totals for your cohort. Never a participant." followed by **Learn more**. It opens **What you can see**, with the same four rules as the Admin profile:

- "Totals for the whole cohort. Never a participant, their plan or their work."
- "Every figure stays hidden until 10 or more participants are active in the dates you choose."
- "A channel participants post on shows only when 10 or more are behind it."
- "Exports carry the same totals, with no row for any person."

Then "What participants are told, in their own Profile:" and the quoted line. One button, **Got it**. The words come from the Admin profile's copy, so the two cannot drift apart.

---

## 5. The screens and how they connect

```
First screen ── Log in ──▶ Code screen ── right code ──▶ Admin Dashboard
     │                       │   ├─ Send it again ──▶ Code screen (new code)
     │                       │   ├─ Use a different address ──▶ First screen
     │                       │   └─ Can't get into that inbox? ──▶ Contact dialog
     │                       └─ code too old ──▶ "That code has expired" ──▶ Code screen
     ├─ Google / Apple ──▶ the provider's window ─┬─ work address matches ──▶ Admin Dashboard
     │                                            └─ no match ──▶ "That account isn't set up"
     └─ Learn more ──▶ "What you can see" dialog
```

Admin profile ── Sign out ──▶ First screen.

---

## 6. Specifications

Sizes, tokens and targets are the participant Login's web values (Login spec section 4): the dark panel 40% of the width, the sheet's column at most 28rem, the pill field about 61px tall, 60px buttons, 24px between items, six code boxes 52 × 56px, and every target at least 44 × 44px. The one addition is the wordmark's suffix, "Enterprise", set lighter after the wordmark.

All colors are tokens. No color is hard-coded.

---

## 7. Accessibility (WCAG 2.2 AA)

As the participant Login (Login spec section 5), with these notes:

- **Tab order:** email, keep me logged in, Log in, Google, Apple, Learn more. "Not set up yet?" is text, not a control.
- **The wordmark's suffix** is read with it: "ExecHQ Enterprise".
- **Focus** moves to the new screen's heading on each change, and not on first paint.

---

## 8. Components

| Component | Role |
| --- | --- |
| `SponsorLoginConcept1` (in `flows/sponsor-login/concept-1`) | The page: wires the screens, the dialogs and the sign-in together. |
| `WelcomeSplit` | The dark panel and the sheet, with `suffix` for "Enterprise". |
| `ProviderButtons`, `AccountPicker`, `CodeField`, `MailNotification`, `SignInEmail` | Shared with the participant Login. |
| `Input` (pill), `Checkbox`, `Button`, `Sheet`, `DetailPanel` | The shared pieces. |

Copy: `mock/sponsor-login.ts`, which takes the code, the code's rules and the drawn email from the participant Login's copy, and the privacy rules from the Admin profile's.

---

## 9. Prototype versus production

| Prototype | Production |
| --- | --- |
| Nothing is sent. The email arrives as a drawn notification. Only the code 482913 signs in. | A real email is sent to the work address. |
| The stand-in Google picker offers the admin's work account (matches) and a personal one (doesn't). Apple offers Share my email (matches) and Hide my email (doesn't). | The provider's own window returns an address, compared with the account's work email. |
| Sign-in goes to the dashboard for the cohort picked in the dock. | The admin's own cohort. |
| The contact dialog only explains. | The ExecHQ contact checks the account and re-sends an invitation. |

---

## 10. Decisions

These are settled. They are the specified behavior.

1. **The same three ways in as participants:** an emailed code, Google and Apple. No Microsoft, no password (2026-10-23).
2. **Work email.** The admin's account is tied to the work email ExecHQ set up.
3. **No sign-up.** The ExecHQ contact sends the invitation; the page says so.
4. **Providers match on the work address.** Personal accounts and Hide My Email fall to "That account isn't set up".
5. **The privacy line says what admins see,** before they are in.
6. **Sign-in lands on the Admin Dashboard;** Sign out on the Admin profile lands here.
7. **Desktop only.**

### Open

- **Company sign-in (SSO, for example Okta).** It needs the client's IT team, so it is left for later.
- **How the invitation works:** what the first email says, and how long it lasts.
