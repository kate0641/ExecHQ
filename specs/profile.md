# Profile — interaction spec

Approved concept: **Concept 1 — Grouped**. This is the spec for the page as reviewed on 2026-10-01. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

---

## 1. What it is

Profile is the one page where a signed-in person sees and controls their account. It is short and everything on it is visible: nothing is tucked behind a menu or a row that opens a detail. The only things that open over the page are the two that need care, editing the account and deleting it, and leaving an organization.

What it holds, in order:

1. **Your account:** name and email, with an Edit button.
2. **Notifications:** two email switches, with a line saying email is the only way ExecHQ reaches a person.
3. **Your organization:** only if the person belongs to one.
4. **Your data:** download everything as a PDF, and delete the account.
5. **Sign out.**

What it deliberately does not hold:

- **Current title or role.** It lives on the Plan page, beside the person's direction.
- **Connections** (LinkedIn, website). V1 has no connections. Everything is entered by hand.
- **Direction and plan.** They live on the Plan page.
- **Password.** Sign-in is by an emailed link, so there is no password to manage.
- **In-app or push notifications.** ExecHQ is a website, so email is the only way it reaches a person.

### Where it appears

Profile is the fifth destination in the signed-in navigation (see the Navigation spec). It uses the `app` chrome. Typing "profile", "account" or "settings" into the Concierge goes here.

---

## 2. Layout by viewport

The page is a title, then two columns of sections. On phone and tablet the two columns stack into one, in this order. On web they sit side by side.

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Page width | One column, at most 36rem (576px), centered | Same | At most 64rem (1024px), centered |
| Columns | 1 | 1 | 2, equal, with a 48px gap (`--space-2xl`) |
| Left column | Account, Notifications | (stacked above the right) | Account, Notifications |
| Right column | Organization (members only), Your data, Sign out | (stacked below the left) | Organization (members only), Your data, Sign out |
| Gap between sections | 24px (`--space-lg`) | 24px | 24px within a column |

On web the columns are top-aligned. They are not forced to the same height. If the person is not in an organization the right column is shorter, and that is fine.

The page content is always visible and scrolls with the page. Nothing is sticky. The floating Concierge pill (see Navigation) sits over the foot of the screen, and the page keeps 96px (`--space-4xl`) of bottom padding so the last control scrolls clear of it.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. The sections

Every section starts with the same heading style (a level-2 heading) so the page reads as a set of equal parts. The page title "Profile" is the one level-1 heading.

### 3.1 Your account

Shows, as plain text, in this order:

1. **Name:** the first and last name ("Maya Chen"). If there is no name yet it reads "Add your name".
2. **Email:** the address the person signs in with.

An **Edit** button (small, secondary) sits at the right of the heading. It opens the edit dialog (section 4.1). There is no Save button on the page itself.

### 3.2 Notifications

Two switches on one card. Each takes effect the moment it is switched, with no Save.

**Notifications are email only,** and the page says so. Under the heading, a line reads **"ExecHQ sends these by email. There are no app or push notifications."** It is always shown, so nobody looks for a setting that does not exist. The account holds one on/off value per email, and there is no channel setting.

| Switch | Label | Hint | Covers |
| --- | --- | --- | --- |
| 1 | Plan and follow-ups | A question after you use something, and a nudge when a step is due. | Loop follow-up emails and plan reminder emails |
| 2 | Daily Briefing | Three reads, once a day. | The Daily Briefing email |

Both are on by default. Switching one off stops that email entirely. A switch reads as on while anything it covers is still emailed.

Switching announces the result to screen readers: "Plan and follow-ups emails: off." / "…: on."

There is no switch for product news, and no email is ever sent for it in V1. There are no in-app or push settings, no frequency setting and no quiet hours. Those were cut because ExecHQ is a website and these settings were more than people need.

Every email's subject line never says what it is about. That is a rule for the emails themselves (a lock screen must not reveal a career topic), not something shown on this page.

### 3.3 Your organization

Shown **only** if the person's account came through an organization. Someone who is not a member sees no section, no empty state and no placeholder.

For a member it shows:

- **Lead:** "{Organization name} sees a summary of everyone in the group, as a whole. Your own details stay yours."
- **What stays private:** "Your name, email and role. Your direction, drafts, progress record and plan." Two short sentences, in this order.
- **Leave organization** (full-width secondary button), which opens the leave dialog (section 4.2).

The rule behind it: an organization sees one summary of everyone in the group together, on the Enterprise Dashboard. It never sees any individual's data. There is no minimum group size: the summary is shown however many members there are. The copy on this page must match what the Enterprise Dashboard actually shows. If one changes, the other changes in the same release.

### 3.4 Your data

Two actions, kept clearly apart: Download, then a gap of 24px, then Delete in its own card.

- **Download your data:** a row with a download icon and the value "PDF" at the end. It has no arrow, because it does something at once and opens nothing. See 4.3.
- **Delete account:** a row in the danger color with an arrow. It opens the delete dialog (section 4.4).

### 3.5 Sign out

A full-width secondary button with a sign-out icon, as the last item in the right column. One tap signs the person out (section 4.5).

---

## 4. Interactions

### 4.1 Edit account

**Edit** opens a dialog titled "Edit your account": a sheet rising from the foot of the screen on phone and tablet, and a centered dialog on web. It contains:

| Field | Label | Rules |
| --- | --- | --- |
| First name | First name | Required. Error: "Add your first name." |
| Last name | Last name | Required. Error: "Add your last name." |
| Email | Email | Required, and must look like an address (something@something.something). Errors: "Add your email." and "Check your email. It should look like name@example.com." |

Buttons: **Save** (primary, full width) and **Cancel** (secondary, full width), and a close (×) button at the top right.

- All three fields start filled with the current values.
- Save checks all three at once. If any fails, the dialog stays open, each error shows under its own field, and an error clears as soon as the person edits that field. Focus is not moved.
- A valid Save updates the account, closes the dialog, updates the page at once and announces "Saved."
- Cancel, ×, Escape, and tapping outside the dialog all close it and discard changes.

**Changing the email in production.** The email is how the person signs in, so a change takes effect only after it is confirmed. On Save, the new address is shown as pending, a link is sent to the new address, and sign-in keeps working with the old address until the link is used. A notice goes to the old address. The prototype skips this and saves at once.

### 4.2 Leave organization

**Leave organization** opens a small dialog titled "Leave {Organization name}?" with the text "You keep your account and everything in it. You drop out of the group's summary." Buttons: **Leave** (danger, full width) and **Stay a member** (secondary, full width).

- Leave removes the person from the organization immediately, closes the dialog, announces "You left {Organization name}." and the Organization section disappears from the page.
- Stay a member, ×, Escape and tapping outside all close the dialog and change nothing.
- Joining an organization is not part of Profile in V1. Only leaving is.

### 4.3 Download your data

One tap on **Download your data** starts the download of a single PDF. No dialog opens and no format choice is offered.

- While the file is being prepared, the value at the end of the row changes from "PDF" to "Downloading…" and the row reports itself as busy to assistive technology. Screen readers hear "Your data is downloading as a PDF."
- When the file is ready the browser's normal download starts and the row returns to "PDF". The row can be used again straight away.
- If preparing the file fails, the value reads "Couldn't download. Try again." and the row returns to normal on the next tap.

**What the PDF contains,** in plain readable form, for the person to read or print:

- Their name and email.
- Their direction and their onboarding answers.
- Every draft they have made.
- Their whole Loop record: every status and outcome, with dates.

The file is named `exechq-{first}-{last}.pdf`. It contains only that person's own data and is never emailed: it downloads to the device they are using.

### 4.4 Delete account

**Delete account** opens a dialog titled "Delete your account" with: "This removes everything below, straight away. It can't be undone." Then a list, each item marked with a cross:

- Your account and {email address}
- Your direction and onboarding answers
- Your draft / Your {n} drafts (only if there are drafts)
- Your Loop record

Then the line "Want a copy first? **Download your data**". The link starts the same download as 4.3. While it works the link reads "Downloading…". The dialog stays open.

Buttons: **Delete my account** (danger, full width) and **Keep my account** (secondary, full width), plus the × button.

- Deletion is immediate and cannot be undone. There is no grace period.
- Delete my account removes everything on the list, removes the person from any organization, ends the session and sends a short confirmation to the address on the account. The person then sees "Your account is deleted. Everything on the list is gone. If you come back, you'll start fresh."
- Keep my account, ×, Escape and tapping outside close the dialog and change nothing.

### 4.5 Sign out

One tap on **Sign out** signs the person out immediately. There is no confirmation, because signing out is easy to undo. The person lands on the signed-out screen: "You're signed out. We'll email you a link when you want to sign back in." with a **Sign back in** button, which goes to Login.

### 4.6 Dialogs, in general

Every dialog on this page (edit, leave, delete) works the same way:

- **Surface.** A sheet that rises from the foot of the screen on phone and tablet, and a centered dialog on web. It is at most 85% of the screen's height, scrolls inside if it is longer, and on tablet and web is no wider than the reading width (68ch, `--content-measure`). Its top corners are rounded (`--radius-xl`), and on web all four are.
- **Modal.** The page behind is made inert while it is open and cannot be reached by tap, click or keyboard.
- **Focus.** On open, focus moves to the first control in the dialog (the × button). Tab and Shift+Tab stay inside it. On close, focus returns to the control that opened it. When that control no longer exists (after Leave, the whole section is gone), focus returns to the page's title.
- **Closing.** × button, Escape, tapping outside, and the dialog's own Cancel or Keep button all close it without changing anything.
- **Name.** Each has an accessible name matching its heading.
- **Motion.** The sheet rises over 240ms. Under reduced motion it appears instantly.

---

## 5. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Page width, phone and tablet | At most 36rem (576px) | none (fixed) |
| Page width, web | At most 64rem (1024px) | none (fixed) |
| Gap between the two columns, web | 48px | `--space-2xl` |
| Gap between sections | 24px | `--space-lg` |
| Gap before Delete account | 24px | `--space-lg` |
| Bottom padding, to clear the Concierge pill | 96px | `--space-4xl` |
| Settings row minimum height | 3.25rem (52px) | none (fixed) |
| Switch | 52px wide, 32px tall | none (fixed) |
| Dialog maximum height | 85% of the screen | none |
| Dialog maximum width, tablet and web | 68ch | `--content-measure` |
| Dialog corner radius | 20px | `--radius-xl` |
| Sheet rise | 240ms | none |
| Dialog close and tap-area size | 44px | `--button-target` |
| Row and card surface | Raised surface | `--color-surface-raised` |
| Danger text on Delete account | Danger | the danger color token |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |
| Fast and base durations | 120ms and 200ms | `--duration-fast`, `--duration-base` |
| "Downloading…" shows for | 2 seconds in the prototype; as long as the real download takes in production | none |

All colors are tokens. No color is hard-coded.

### Touch targets

Every interactive control on the page is at least **44 × 44px** (`--button-target`) on every viewport, tablet and web included. WCAG 2.2 AA requires only 24px (SC 2.5.8). 44px is the ExecHQ standard because this is a mobile-first product used one-handed.

| Control | Size |
| --- | --- |
| Edit | Drawn small; its tappable area is 44px tall |
| Notification switches | Drawn 52 × 32px; their tappable area is 52 × 44px, centered on the switch |
| Download your data and Delete account rows | At least 52px tall, full width |
| Sign out | At least 44px tall, full width |
| Dialog buttons (Save, Cancel, Leave, Stay a member, Delete my account, Keep my account) | At least 44px tall, full width |
| Dialog close (×) | Drawn small; its tappable area is 44 × 44px |
| Form fields | At least 44px tall |
| "Download your data" link in the delete dialog | At least 44px tall |
| Leave organization | At least 44px tall, full width |

Where a control is drawn smaller than 44px, an invisible tappable area makes up the difference. It must not overlap another control's tappable area.

---

## 6. Accessibility (WCAG 2.2 AA)

- **Headings.** One level-1 heading ("Profile"), then one level-2 heading per section, in reading order. The hidden group labels inside Notifications and Your data keep the page's outline correct for screen readers without repeating the heading on screen.
- **Switches** have a name (their label) and a description (their hint), and announce on or off. Keyboard: Space or Enter toggles.
- **Messages.** A polite live region announces saves and results ("Saved.", "Plan and follow-ups emails: off.", "You left Northgate.", "Your data is downloading as a PDF.").
- **Form errors** sit directly under their field, are linked to it, mark it invalid and are announced. They do not rely on color alone.
- **Edit button name.** "Edit your account", with the extra words visually hidden.
- **Delete account** is the danger color and also carries a trash icon and its own label, so color is never the only cue.
- **Dialogs** are modal and behave as in 4.6. The page behind is inert.
- **Keyboard.** Everything works with a keyboard alone. Tab order follows reading order: Edit, the two switches, then (on web) across to the right column: Leave organization, Download, Delete account, Sign out. Escape closes any dialog.
- **Focus** is visible on every control, against every background.
- **Contrast.** Text 4.5:1, non-text 3:1. The "PDF" and "Downloading…" values meet 4.5:1.
- **Motion.** Everything that moves respects `prefers-reduced-motion`.

---

## 7. Components

| Component | Role |
| --- | --- |
| `ProfileConcept1` (in `flows/profile/concept-1`) | The page: wires sections, dialogs and the account together. |
| `DetailPanel` | The frame every section and dialog sits in: a heading, an optional close, then the content. |
| `NotificationsDetail` | The two email switches. |
| `OrganizationDetail` | The organization section and the leave dialog. |
| `DeletionDetail` | The delete dialog. |
| `SettingsGroup`, `SettingsRow` | Cards of rows. `SettingsRow` has kinds: open (with an arrow), action (does something at once), switch, read-only and later. |
| `Sheet` | The dialog surface over the screen. |

Components built earlier and no longer on this page (`ConnectionDetail`, `UsesDetail`, `ExportDetail`, `ProfileHeader`) remain in the component catalogue. They are not part of V1 Profile.

---

## 8. Prototype versus production

| Prototype | Production |
| --- | --- |
| The account is a local record and every change is kept in the browser. | A real account, saved on the server. |
| Saving an email change takes effect at once. | A link is sent to the new address and the change takes effect when it is used (4.1). |
| Download shows "Downloading…" for two seconds and produces no file. | Generates and downloads the PDF described in 4.3. |
| Delete and sign out end the page in place, with a button to reset. | Delete removes the data and sends the confirmation (4.4). Sign out ends the session and goes to Login. |
| Leaving an organization only changes the local record. | Removes the person from the group's summary on the Enterprise Dashboard straight away. |
| Notifications are switches that change a local record. | The switches control which emails are sent. |

---

## 9. Decisions

These are settled. They are the specified behavior.

1. **One page, nothing hidden.** Name, email, notifications and the organization promise are always visible. Only editing the account, leaving an organization and deleting the account open a dialog.
2. **Email only, and said on the page.** ExecHQ is a website, so notifications are email, in two switches: the plan and follow-ups together, and the Daily Briefing. A line under the heading says email is the only way ExecHQ reaches a person, and that there are no app or push notifications.
3. **No role or title here.** It lives on the Plan page with the person's direction.
4. **No connections in V1.** Entry is manual.
5. **The email is editable** but a change is confirmed by a link to the new address before it takes effect.
6. **Deletion is immediate and final.** The person can take a copy first, in the same dialog.
7. **Organizations see a summary only,** of everyone together, on the Enterprise Dashboard, with no minimum group size, and never any individual's data. Members can leave at any time.
8. **Sign out is one tap,** with no confirmation.
9. **Export is one PDF,** downloaded in one tap. There is no format choice.
