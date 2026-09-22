# ExecHQ prototype — standing rules

A React/Next.js **design prototype** for ExecHQ: a private career advisor for senior
managers through SVPs. This repo exists to design and review screens, not to ship a
product. There is no backend, no API, no database, no auth, and no AI integration.
Nothing in this repo talks to a network.

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
| `app/`                | Routes. `app/page.tsx` is the hub, `app/catalogue/` and `app/stylesheet/` are its reference tools, `app/[flow]/[concept]/` is every product page. |
| `lib/hub-pages.ts`    | The prototype's own pages (hub, catalogue, stylesheet). Not product flows. |

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
- The prototype's own pages are separate. `/` is the file hub, `/catalogue` is the
  component catalogue and `/stylesheet` is the design system. They are declared in
  `lib/hub-pages.ts`, not in the manifest, because they have no sprint, no
  concepts and no status. They share `HubChrome`, never the product's `AppChrome`.
- Each flow declares an explicit `slug`, never derived from its title, so titles
  can change without breaking routes.
- `sprint` drives the "Not yet built — Sprint N" placeholder text.
- `chrome` picks the navigation chrome: `minimal` (Onboarding, Login), `app`
  (Homepage, Profile, Plan, Toolbox, Toolbox flow, Daily Briefing), `enterprise`
  (Enterprise Dashboard).
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
  (`webOnly` on its flow) and all three of the prototype's own pages — the hub,
  the catalogue and the stylesheet (`webOnly` in `lib/hub-pages.ts`).
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

## Git

Three branches:

- `scratch` — exploratory work and rough ideas, not for review
- `main` — the primary build, where all active work happens
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
colours) and `build`. All three must pass.
