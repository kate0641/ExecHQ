# Admin profile — interaction spec

Concept: **Concept 1 — Sections** (status: draft). It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production". The route is still `/sponsor-profile`; the page was renamed from Sponsor profile on 2026-10-26.

---

## 1. What it is

The Admin profile is the program admin's own account: who they are, their cohort at a glance, and what they can and can't see. It is plain and practical by design. There was no brief, so it is kept to what an admin needs (decided 2026-10-22).

What it deliberately does not do:

- **Edit the cohort.** The cohort is shown here, not changed. Its code and figures live on the Admin Dashboard.
- **Hold settings that aren't needed yet.** Billing, seats, other admins and email settings are left out until a brief asks for them. Emails were removed on 2026-10-23, and so was a Signing in section.

### Where it appears

It uses the `enterprise` chrome. It is reached from the admin's **initials** at the right of the header, on every Admin page; there is no menu (decided 2026-10-22). While the admin is on this page, the initials are filled, to show it is the current page. It is **web only**.

---

## 2. Layout

The page uses the width, as the participant Profile does on web (decided 2026-10-23, option Sections):

1. **The head**, top left: a "← Dashboard" link, the level-1 heading **Your profile**, and a line with the admin's name, job title and organization ("Dana Okafor · Head of Leadership Development, Northgate").
2. **Two columns** under it:
   - **On the left, the list of sections**, each a row with its name and a line under it:
     - **Your details**, with the admin's name.
     - **Your cohort**, with the cohort's name, or "No cohort yet".
     - **What you can see**, with "Totals only, 10 or more".

     The chosen row is marked. **Sign out** closes the list, as a secondary button under it.
   - **On the right, the chosen section,** under its own level-2 heading. It opens on Your details.

The list's card lines up with the section's card, not with the section's heading: the list starts one heading and one gap down (2026-10-23). The list stays in view as the page scrolls.

---

## 3. The sections

### 3.1 Your details

Four rows: **Name**, **Job title**, **Work email** and **Organization**, each with its value on the right. A fifth row, **Edit** ("Your name and job title"), is the only control: one Edit for the section (decided 2026-10-23).

Only the name and job title can be changed here. The work email is how the admin signs in, so it changes through their ExecHQ contact. The organization is set by ExecHQ.

### 3.2 Your cohort

Four rows: **Cohort** (its name), **Started** (or **Starts**, before the start date), **People expected**, and **Code** (for example "EXEC-4821 · Open to new joiners", or "Closed to new joiners").

With no cohort yet, the section shows one row, **No cohort yet**, with "Set one up on your dashboard to get a code to share." There is no link to the dashboard here; the "← Dashboard" link at the top of the page is the way back (decided 2026-10-23).

### 3.3 What you can see

A card with four rules, then what participants are told:

- "Totals for the whole cohort. Never a participant, their plan or their work."
- "Every figure stays hidden until 10 or more participants are active in the dates you choose."
- "A channel participants post on shows only when 10 or more are behind it."
- "Exports carry the same totals, with no row for any person."

Then "What participants are told, in their own Profile:", and quoted: "Northgate sees totals for the whole group. It never sees you, your plan or your work." These words come from the participant Profile's own copy, so the two cannot drift apart.

---

## 4. Interactions

### 4.1 Choosing a section

Pressing a row in the list shows its section on the right and marks the row. Focus stays on the row. An edit in progress is closed without saving.

### 4.2 Editing name and job title

**Edit** replaces the section's rows with a form headed **Your name and job title**, with two fields, **Name** and **Job title**, filled with the current values, and **Save** and **Cancel**. Focus moves to the form's heading.

- **Save** checks that both fields have something in them. An empty name shows "Enter your name." and an empty job title shows "Enter your job title.", each under its field, clearing as the admin types. When both are filled, the rows come back with the new values. The head's line updates, and "Your name and job title are saved." is announced.
- **Cancel** puts the rows back unchanged.
- After either, focus returns to **Edit**.

### 4.3 Sign out

**Sign out** signs the admin out and goes to the Admin login (decided 2026-10-23). There is no confirmation.

---

## 5. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Page width | Fills the window, at most 1440px | `--viewport-web-max` |
| List column | At least 15rem, at most 20rem | none (fixed) |
| Section column | At most 46rem | none (fixed) |
| Gap between the columns | 32px | `--space-xl` |
| List offset | One heading's line height plus 16px, so the cards line up | `--type-heading-size`, `--type-heading-leading`, `--space-md` |
| Gap between the list and Sign out | 16px | `--space-md` |
| Rows | 16px padding, as the participant Profile | none (from `SettingsRow`) |
| The chosen row | The selected surface, with a 3px inverse bar on its left | `--color-surface-selected`, `--border-width-thick` |
| Section heading | 28px | `--type-heading-size` |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |

All colors are tokens. No color is hard-coded.

### Targets

Every control is at least 44 × 44px (`--button-target`): the list's rows, Edit, the form's fields and buttons, Sign out, the "← Dashboard" link and the initials.

---

## 6. Accessibility (WCAG 2.2 AA)

- **Headings.** "Your profile" is level 1. The section's heading on the right is level 2, and the form's heading is level 3.
- **Landmarks.** The list of sections is a navigation landmark named "Profile sections". The chosen row is marked as current to assistive technology (`aria-current`), as well as visibly.
- **Labels and errors.** Each field has a visible label. Errors sit under their field, are linked to it, mark it invalid and are announced.
- **Keyboard.** Tab order follows reading order: Dashboard, the three rows, Sign out, then the section. Enter or Space chooses a row.
- **Focus** moves to the form's heading on Edit, and back to Edit after Save or Cancel. It is visible on every control.
- **Announcements.** Saving is announced in a polite live region.

---

## 7. Components

| Component | Role |
| --- | --- |
| `SponsorProfileConcept1` (in `flows/sponsor-profile/concept-1`) | The page: head, list, sections and the edit form. |
| `SettingsGroup`, `SettingsRow` | The list's rows and every section's rows, shared with the participant Profile. |
| `ProfileLink` | The initials in the header, filled on this page. |
| `Input`, `Button`, `Icon` | The shared pieces. |

---

## 8. Prototype versus production

| Prototype | Production |
| --- | --- |
| The admin is an invented person, Dana Okafor, Head of Leadership Development at Northgate, dana.okafor@northgate.com. | The signed-in admin. |
| The cohort comes from the dock's cohort picker. | The admin's own cohort. |
| A name or title change lasts until the page is reloaded. | Stored, and shown wherever the admin's name appears. |
| Sign out goes straight to the Admin login. | It ends the session, then goes to the Admin login. |

---

## 9. Decisions

These are settled. They are the specified behavior.

1. **Opened from the initials,** with no menu (2026-10-22).
2. **Sections:** a list on the left and the chosen section on the right, with Sign out closing the list (2026-10-23).
3. **Three sections:** Your details, Your cohort, What you can see. There are no Emails and no Signing in (2026-10-23).
4. **One Edit** for the name and job title. The work email and organization are not edited here.
5. **The cohort is shown, not edited.** The way back to the dashboard is the "← Dashboard" link at the top.
6. **What you can see** quotes what participants are told, from the same copy.
7. **Sign out goes to the Admin login.**
8. **Desktop only.**

### Open

- How an admin's work email is changed (through the ExecHQ contact) is a support process, still to be written up.
