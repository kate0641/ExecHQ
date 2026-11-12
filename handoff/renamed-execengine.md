# Renamed: ExecHQ is now ExecEngine

12 November 2026 · Kate Hester

The product is now called **ExecEngine**, the name in Eric's why statement. Every word a person sees changes. Nothing about how any screen behaves changes. The specs already say ExecEngine throughout.

## What to do

1. **Use "ExecEngine" wherever the product names itself:** copy, page titles, emails, notifications, accessible names and the third-person voice ("ExecEngine will…", "ExecEngine's recommendation").
2. **Draw the new logo.** Until the brand artwork arrives, "Engine" is set in type after the drawn "Exec" (see Rules).
3. **Use the new domain and file name** shown in the table below.

## Before and now

| Where | Before | Now |
| --- | --- | --- |
| Every on-screen mention | ExecHQ, ExecHQ's | ExecEngine, ExecEngine's |
| The logo | "Exec" (serif, gold) + "HQ" (sans, navy), both artwork | "Exec" artwork + "Engine" in Kulim Park, same colours |
| The browser address bar drawn in the phone and tablet frames | exechq.com | execengine.com |
| Profile's download | `exechq-{first}-{last}.pdf` | `execengine-{first}-{last}.pdf` |
| The sign-in email's sender avatar | HQ | EE |
| Screen readers, on the logo | "ExecHQ" | "ExecEngine" |

## Rules

- **The logo stand-in.** "Engine" sits where "HQ" did: the same cap height as "Exec", the same baseline, the same colour token (`--color-logo-name`, navy on light, light blue on dark), in Kulim Park semibold (600). Its "g" drops just below the logo's box; the logo lets it show (`overflow: visible`).
- **The logo is wider.** About 4.7 times as wide as it is tall, where ExecHQ was about 3.4: 39% wider at the same height. Header sizes are unchanged (24px tall in chrome, 64px where the logo opens a screen), so at 24px it is about 114px wide, and at 64px about 303px. Both fit the 393px phone with its side margins.
- **The final artwork replaces only the logo component.** Sizes, colours and where the logo sits stay as they are.
- **Accessible name.** The artwork is hidden from screen readers. A visually hidden "ExecEngine" beside it names it.

## What keeps the old name, on purpose

Nothing here is seen by a person using the product.

- The repository, folders and `package.json` name.
- The prototype's `localStorage` keys (`exechq.…`, `exechq-…`). Renaming them would wipe every reviewer's saved state.
- Code identifiers, such as the draft segment tag `by: "exechq"` and the `draft-editor__exechq` class.
- The source PDFs in `docs/`.
- Dated handoff notes written before 12 November. They record what was true when they were written.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The logo and its stand-in | `components/primitives/Logo/Logo.tsx`, `.logo__name` in `styles/app.css`, `--color-logo-name` in `styles/tokens.css` |
| In the catalogue | Logo: all three variants; Wordmark |
| The address bar | `components/layout/DeviceFrame/DeviceFrame.tsx` |
| The sign-in email's avatar | `components/login/SignInEmail/SignInEmail.tsx` |
| Profile's download name | `mock/profile.ts` |
| All copy | `mock/*.ts` |

## Still open

- **The ExecEngine logo artwork,** from the brand files.
- **The real domain.** execengine.com is drawn in the frames as a stand-in.
- **The onboarding copy against the why statement.** Proposed separately, not part of this change.
