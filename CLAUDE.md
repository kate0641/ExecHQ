# ExecHQ prototype — standing rules

A React/Next.js **design prototype** for ExecHQ: a private career advisor for senior
managers through SVPs. This repo exists to design and review screens, not to ship a
product. There is no backend, no API, no database, no auth, and no AI integration.
Nothing in this repo talks to a network.

## Design sessions — read this first

**Who this applies to.** At the start of every session, run `git config user.email`.
If it is one of Kate's addresses (`MAINTAINER_EMAILS` in `scripts/design-areas.mjs`),
skip this section: Kate works on `main` as the rest of this file describes.
Anyone else is a designer, this is a design session, and this section overrides
"all active work happens on `main`" under **Git** below.

The designer talks in ordinary language and may not know git. You run every git
step, the same way every time, and say what you did in plain words. Never
discard, reset or overwrite their work without asking first.

### Start

Done when: a new `design/<idea>` branch exists off the latest `main`, the app is
running, and the showroom is open.

1. `git status --porcelain`. If anything is uncommitted, ask what it is. If it
   belongs to an earlier idea, finish that idea first (see **Done**). Never
   throw it away without the designer saying so.
2. `git fetch origin`, then `git switch main`, then `git pull --ff-only origin main`.
   If the pull refuses, something was committed on `main` by mistake: stop,
   tell the designer, and leave it for Kate.
3. Turn the idea into a short name — lowercase, hyphens, three or four words —
   and check it with the designer. Then `git switch -c design/<name>`.
4. Start the app with `npm run showroom` (in the background) and open the
   address it prints, which ends `/showroom`.

### While working

Done when: every commit is on the `design/*` branch and every change is inside
the design areas.

- **Only change the design areas**: `components/`, `styles/`, `mock/`, `flows/`
  and `app/showroom/`. The list lives in `scripts/design-areas.mjs`, and a hook
  (`.claude/settings.json`) blocks edits anywhere else. If an idea needs a file
  outside them — a new route or concept, the manifest, a spec, a dependency,
  config — stop and tell the designer it is a change for Kate.
- **Keep to the rules in the rest of this file.** Colours, type, spacing, radii,
  borders and shadows change in `styles/tokens.css` and nowhere else. No UI kits,
  icon sets or new packages. Responsive styles use `data-viewport`, never
  `@media`. WCAG 2.2 AA holds.
- **Show every change in the showroom.** A token change is checked in
  `/showroom/design-system`, a component change in `/showroom/components`, and
  a flow change in `/showroom/playground`. A new component gets its
  `*.states.ts` file and a registry line in the same change.
- **Every state stays shown.** If a component gains a state, add a variant
  whose label names it. If the build reports a state as newly covered, remove
  it from `components/states-baseline.json` as the message says.
- **Never change a `status`**, in a states file or the manifest. Only Kate does.
- Commit in small steps, with messages that say what changed in plain words.
  Never commit `.env.local`.
- A new idea after a pull request is open is a new session: back to **Start**.

### Update the branch

When the designer asks, or the pull request says the branch is out of date or
has conflicts.

1. Commit anything unsaved on the branch.
2. `git fetch origin`, then `git merge origin/main`.
3. If there are conflicts, stop. List the files, show both versions of each
   clash in plain words, and ask which to keep. Never choose for them.
4. `git push`. Never rebase and never force-push.

### Done

Done when: the branch is pushed and a pull request into `main` is open.

1. `npm run check`. Fix anything that fails inside the design areas; if a
   failure is outside them, stop and tell the designer.
2. Commit, then `git push -u origin design/<name>`.
3. `gh pr create --base main`, with a plain-words title and a body that fills
   in `.github/pull_request_template.md`: what changed, where to look, and the
   checklist.
4. Vercel comments on the pull request with a preview link once it has built,
   usually within a couple of minutes. Check the pull request once or twice
   (`gh pr view --comments`). When the link is there, give the designer the
   showroom page to look at: the preview link plus `/showroom/…`. If it is not
   there yet, give them the pull request link and say the preview will appear
   on it.
5. **Stop.** Do not merge, approve, close or keep changing the pull request. Kate
   reviews it and merges it; nothing reaches `main` until she does.

## Where things live

| Path                  | What it is                                                        |
| --------------------- | ----------------------------------------------------------------- |
| `docs/`               | Source product PDFs. Context and vocabulary only — never rendered as product UI. |
| `prototype.config.ts` | The manifest. Single source of truth for flows, concepts, routes, sprints, statuses. |
| `specs/`              | One interaction spec markdown file per flow slug. Rendered by the hub. |
| `mock/`               | Local mock JSON. The only data source a placeholder page may use. |
| `styles/tokens.css`   | Every colour, spacing, type, radius, border and shadow value.     |
| `styles/app.css`      | The single shared stylesheet of reusable classes.                 |
| `components/`         | Every component, hand-written. Each ships a sibling `*.states.ts`. |
| `app/`                | Routes. `app/page.tsx` is the hub, `app/showroom/` is the private showroom (design system, component catalogue, playground), `app/[flow]/[concept]/` is every product page. |
| `lib/hub-pages.ts`    | The prototype's own pages (hub and showroom). Not product flows. |
| `lib/showroom.ts`     | Whether the showroom is built. Decided in `next.config.ts`. |
| `DESIGN.md`           | The designers' one-page laptop setup. Keep it in step with `npm run showroom`. |
| `scripts/design-areas.mjs` | The design areas and Kate's git addresses, for the design-session hook and the pull request check. |
| `.github/`            | The pull request check, `CODEOWNERS` and the pull request template. |

## Greyscale via tokens

The prototype is built entirely in greyscale so hierarchy and structure are
evaluated before colour.

- **Every** colour is a CSS custom property declared once in `styles/tokens.css`.
- **No hard-coded hex, rgb, hsl, oklch or colour keyword anywhere else** — not in
  CSS, not in TSX, not in inline styles. `npm run check:tokens` enforces this and
  runs as part of `npm run check`.
- Token names are semantic (`--color-surface`, `--color-accent`), never literal
  (`--color-grey-400`), because the real palette lands later: navy (primary),
  gold (accent), muted slate blue (secondary). Swapping it in must mean editing
  `styles/tokens.css` and nothing else.
- Spacing, type scale, radii, border widths and shadows are tokenised the same way.
- Contrast currently passes easily in greyscale. **Re-verify every pair when navy
  and gold arrive** — gold on navy is the likely failure point.

## Font roles

Loaded via `next/font/google` in `app/layout.tsx`, exposed as tokens:

| Token            | Family             | Role                                        |
| ---------------- | ------------------ | ------------------------------------------- |
| `--font-display` | Red Hat Display    | Headings and UI labels (primary)            |
| `--font-serif`   | Libre Baskerville  | Pull quotes and editorial moments (sparing) |
| `--font-body`    | Inter              | Body copy and interface text                |

Libre Baskerville is deliberate and rare. If it is doing the job of body copy,
it is being misused.

## Manifest-driven routing

`prototype.config.ts` declares every flow and concept. The hub, the slide-out hub
panel and the routes are all generated from it.

- Adding a concept is **one entry in one file**. Never hand-edit a route, a nav
  item and a hub link to add a page.
- Routes resolve as `/<flow-slug>/<concept-slug>` from `app/[flow]/[concept]/page.tsx`,
  with `generateStaticParams()` reading the manifest and `dynamicParams = false`
  so anything undeclared 404s.
- The prototype's own pages are separate. `/` is the file hub, and `/showroom`
  is the showroom: `/showroom/design-system`, `/showroom/components` (the
  component catalogue) and `/showroom/playground`. They are declared in
  `lib/hub-pages.ts`, not in the manifest, because they have no sprint, no
  concepts and no status. They share `HubChrome`, never the product's `AppChrome`.

## The showroom is private

The showroom is **never built on the public production site**. `next.config.ts`
decides once, at build time: off on Vercel production whatever any setting says,
on for every Vercel preview deployment, and on locally when `.env.local` has
`SHOWROOM=on` (copied from `.env.example`). Where it is off, `app/showroom/layout.tsx`
turns every page under it into a 404 and `lib/hub-pages.ts` drops its links, so
nothing points at it. The file hub and the concept pages stay public.

Never add a way round that gate, and never link to a showroom page except
through `lib/hub-pages.ts`.
- Each flow declares an explicit `slug`, never derived from its title, so titles
  can change without breaking routes.
- `sprint` drives the "Not yet built — Sprint N" placeholder text.
- `chrome` picks the navigation chrome: `minimal` (Onboarding, Login), `app`
  (Homepage, Profile, Plan, Toolbox, Toolbox flow, Daily Briefing), `enterprise`
  (Enterprise Dashboard). `header: false` drops the wordmark header (Onboarding,
  whose welcome screen carries the wordmark itself).
- `webOnly: true` marks a flow the viewport toggle locks to web width.

## The prototype dock

A floating dock carries the viewport toggle and the hub button. It is present on
every page and overlays the canvas.

It is **vertical**, because everything on the canvas — headings, navigation, body
copy — runs horizontally, so a tall narrow strip covers far less of the screen
being reviewed than a wide bar does. It **anchors to the right edge**, because
the hub panel opens from the left and the two must not sit on top of each other.
Controls are icons from `components/primitives/Icon`, each with a visually-hidden
label that is also its tooltip.

It can be dragged anywhere and collapsed to just its handle. Both position and
collapsed state persist in `localStorage` via `lib/toolbar.ts`.

Two details worth knowing before changing it:

- A stored position of `null` means "not placed yet", and `.is-anchored` puts the
  dock at the right edge from CSS alone. That keeps the default free of any
  measurement, so the server and the client agree on the first paint. Home
  returns it to `null`.
- Collapsing uses the `hidden` attribute rather than CSS, so the controls leave
  the tab order when they are not on screen. `.devtools__content[hidden]` has to
  restate `display: none`, because a class selector outranks the user agent's
  `[hidden]` rule.

The toggle is deliberately **not** inside the hub panel: the panel is a modal
dialog, so it would hide the change the toggle is making.

Dragging is never the only way to do something (WCAG 2.2 SC 2.5.7). The handle
is a real button: pressing it without dragging cycles the dock through the
four corners, and with it focused the arrow keys nudge and Home resets. Any new
drag interaction must come with the same two alternatives.

## Viewport toggle

Switches the canvas between Web, Tablet and Mobile.

- **Product pages default to Mobile.** ExecHQ is a mobile-first product, so a
  concept page opens on the phone unless the reviewer has chosen otherwise.
- **Web-only routes** are locked to web with the Mobile and Tablet options
  visibly disabled and an accessible explanation: the Enterprise Dashboard
  (`webOnly` on its flow) and all of the prototype's own pages — the hub and
  the showroom (`webOnly` in `lib/hub-pages.ts`).
- A lock never overwrites the reviewer's choice. `selected` is what they picked,
  `viewport` is what renders, and the choice comes back on the next unlocked
  page.

- **Never use `@media` queries for this.** Media queries respond to the browser
  window, not to a simulated frame inside it. All responsive CSS is written
  against the `data-viewport` attribute the toggle sets on the canvas wrapper:
  `[data-viewport="mobile"] .card { … }`.
- Widths: mobile 393px, tablet 820px, web fills available width.
- Mobile and tablet render inside a device frame drawn in CSS — bezel, rounded
  corners, and a status bar area on mobile. No image assets.
- The selection persists across navigation (React context in the root layout,
  mirrored to `localStorage`).
- Content scrolls inside the device frame, not the browser window.
- Mobile and tablet frames always render at true size (393×852, 820×1180). When
  the window is shorter, the canvas scrolls to bring the frame into view; the
  frame never shrinks to fit.
- On `webOnly` flows the Mobile and Tablet options are visibly disabled with an
  accessible explanation, and the canvas stays at web width.
- `@media` is still correct for `prefers-reduced-motion` and print.

## Accessibility target: WCAG 2.2 AA

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and correct heading order
  on every page.
- Full keyboard operability, including the hub panel, the viewport toggle and the
  component catalogue menu.
- Visible, high-contrast focus indicators on every interactive element. Never
  remove an outline without replacing it.
- All controls labelled; icon-only buttons carry an accessible name.
- Text contrast at least 4.5:1, non-text at least 3:1.
- Respect `prefers-reduced-motion`.
- `eslint-plugin-jsx-a11y` must pass with **no warnings** (`npm run lint` runs with
  `--max-warnings=0`).

## Components and the catalogue

- Every component is written from scratch. **No third-party component libraries or
  UI kits** (MUI, Chakra, shadcn, Radix, …) and **no animation libraries**.
- Each component ships a sibling `X.states.ts` declaring its variants and every
  state it supports (default, hover, focus, active, disabled, loading, error,
  empty). `components/registry.ts` collects those files and the catalogue reads
  only from the registry.
- The catalogue renders the **real component imported from `components/`**. Never
  a copy or a re-implementation — that is the whole point, and it is how the
  catalogue cannot drift out of sync.
- Every component appears in the catalogue as soon as it exists.

## Status

`'draft' | 'in-review' | 'approved'`, defaulting to `'draft'`.

- Page status lives on the concept in `prototype.config.ts`.
- Component status lives in the component's `*.states.ts`, tracked separately —
  one component may appear across several flows at different stages.
- **Only Kate changes a status, and only when she says a page or component has
  passed final review.** Never promote a status on your own initiative.

## Dependencies

Ask before adding **any** dependency not required to run Next.js, lint, or fonts.
That includes markdown renderers, icon sets, date libraries and utility packages.
Write it from scratch or ask.

**Package manager is npm.** Never yarn, pnpm or bun. `package-lock.json` is
committed; no other lockfile may exist in the repo.

**Node is pinned to 24** in `.nvmrc` and `engines`, matching Vercel. `npm run
showroom` installs with `npm ci`, so it never rewrites the lockfile.

## Git

Three branches:

- `scratch` — exploratory work and rough ideas, not for review
- `main` — the primary build, where all active work happens
  (designers work on `design/*` branches instead — see **Design sessions**)
- `approved` — reviewed and signed off

All active development happens on `main` unless Kate says otherwise. Never
cherry-pick individual pages into `approved`. Approval is tracked per concept via
`status` in the manifest; `approved` is only ever updated by merging all of `main`
at a checkpoint Kate explicitly calls.

Commit in small, logical units with clear messages.

## Definition of done for any change

```bash
npm run check
```

That runs `lint` (no errors, no a11y warnings), `check:tokens` (no hard-coded
colours), `check:components` (every component has a states file and a catalogue
entry) and `build`. All four must pass. With the showroom on, the build also
fails if a component stops showing a state it showed before, or a new one
leaves a state neither shown nor ruled out — see `components/states-coverage.ts`.
