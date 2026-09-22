# ExecHQ prototype

A design prototype for **ExecHQ** — a private career advisor for senior managers
through SVPs that turns a stated career direction into an actionable plan.

This repo exists to design and review screens. It is not the product. There is
no backend, no API, no database, no sign-in and no AI. Nothing in it talks to a
network.

This is **Sprint 0**: the shell the later sprints drop into. The product screens
themselves — onboarding, plan, toolbox, briefing, dashboard — are designed in
sprints 1 to 5, and every one of them is currently a placeholder.

---

## Running it

You need [Node.js](https://nodejs.org) 20 or newer. The package manager is
**npm** — not yarn, pnpm or bun.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. That is the file hub, and everything else is
linked from there.

Other commands:

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run build`        | Production build. Must pass before anything is handed over. |
| `npm run lint`         | ESLint, including accessibility rules. Zero warnings allowed. |
| `npm run check:tokens` | Fails if a colour value appears outside the tokens file.  |
| `npm run check`        | All three of the above, in order.                         |
| `npm run sync:specs`   | Creates a stub spec file for any flow that lacks one.     |

---

## Where things live

```
prototype.config.ts   The manifest. Every flow, page and route is declared here.
specs/                One interaction spec per flow. The hub renders them.
mock/                 Local mock JSON, if a placeholder page ever needs data.
docs/                 The source product PDFs. Context only, never rendered as UI.

styles/tokens.css     Every colour, space, type size, radius, border and shadow.
styles/app.css        The single shared stylesheet of reusable classes.

app/                  Routes. app/page.tsx is the hub, app/catalogue/ and
                      app/stylesheet/ are its reference tools, and
                      app/[flow]/[concept]/ is every product page, generated
                      from the manifest.
components/           Every component, hand-written. No UI kits.
lib/                  Manifest, spec and token readers, the hub page list, and
                      the viewport store.
scripts/              The token guard and the spec stub generator.
```

---

## The file hub

`/` is the home base: the index of every flow and concept page, grouped by
sprint, each with its status badge and its interaction spec in the slot
underneath.

Two reference tools are linked from it, each its own page:

| Page          | What it is                                                     |
| ------------- | -------------------------------------------------------------- |
| `/catalogue`  | Every component, in every state, with a search box and filters for status and flow. "Approved only" shows the set handed off to engineering. |
| `/stylesheet` | The design system rendered: colour swatches, the type scale in all three fonts, spacing, radii, shadows and borders. |

All three share a header with navigation between them, and they are declared in
`lib/hub-pages.ts` rather than the manifest — they are tools for designing
ExecHQ, not screens in it.

The **hub button** in the floating toolbar opens a slide-out panel with links to
those three pages and the full flow index, so you can jump anywhere without
losing your place. It closes on Escape or a click outside, and focus returns to
the button.

---

## The floating toolbar

The toolbar carries the viewport toggle and the hub button, and floats above the
canvas so it is on every page without taking a strip of the layout.

**You can move it.** Drag it by the grip or by any empty part of the bar. If you
would rather not drag, press the grip and it hops to the next corner. With the
grip focused, the arrow keys nudge it (hold Shift for bigger steps) and Home
puts it back at the top left. Wherever you leave it is where it will be next
time, and it always stays inside the window.

## How the viewport toggle works

The toggle switches the canvas between **Web**, **Tablet** and **Mobile**.
Mobile and tablet render inside a device frame drawn in CSS — bezel, rounded
corners, and a status bar on mobile. Content scrolls inside the frame, so the
frame stays put.

The important technical detail, if you are writing CSS in this repo:

> **Responsive styling never uses `@media`.**

A media query responds to the browser window, so a 390px frame inside a 1400px
window would never pick up mobile styles. Instead the toggle sets a
`data-viewport` attribute on the wrapper, and responsive rules key off that:

```css
[data-viewport="mobile"] .chrome__nav {
  position: sticky;
  bottom: 0;
}
```

`@media` is still correct for `prefers-reduced-motion` and print, and nothing
else.

The choice persists across navigation and reloads. On the Enterprise Dashboard,
which is web only, the Mobile and Tablet options are disabled with an
explanation and the canvas stays at web width.

---

## Adding a new concept page

One edit, one file. Open `prototype.config.ts` and add a concept to the flow:

```ts
{
  slug: 'plan',
  title: 'Plan',
  sprint: 3,
  chrome: 'app',
  description: '…',
  concepts: [
    { slug: 'concept-1', title: 'Concept 1' },
    { slug: 'concept-2', title: 'Concept 2', summary: 'Roadmap first.' }, // new
  ],
}
```

That is all. The route `/plan/concept-2` starts resolving, the page appears in
the hub and in the slide-out panel, and it renders with the right navigation
chrome and the right "Not yet built — Sprint 3" placeholder.

**Adding a whole new flow** is the same idea — add a flow object with its own
`slug`, `title`, `sprint`, `chrome` and `description`, then run
`npm run sync:specs` to create its spec file.

A few notes on the fields:

- `slug` is explicit and never derived from the title, so titles can change
  without breaking routes.
- `sprint` drives the placeholder text.
- `chrome` is `minimal` (onboarding, login), `app` (the signed-in product) or
  `enterprise`.
- `webOnly: true` locks the viewport toggle to web.
- `status` is `draft`, `in-review` or `approved`, and defaults to `draft`.

---

## Adding a component to the catalogue

Components live in `components/<group>/<Name>/` and each one has three files:

```
components/primitives/Button/
  Button.tsx          the component
  Button.states.ts    its variants and states
  index.ts            the export
```

The states file is what the catalogue reads:

```ts
import { defineComponentStates } from "@/components/types";
import { Button } from "./Button";

export const buttonStates = defineComponentStates({
  name: "Button",
  group: "primitives",       // primitives | form controls | navigation | layout | cards | feedback
  status: "draft",
  flows: ["onboarding"],     // which flows use it; [] means shell only
  description: "…",
  component: Button,         // the real component, never a copy
  variants: [
    { label: "Primary — default", props: { children: "Save draft" } },
    { label: "Primary — disabled", props: { children: "Save draft", disabled: true } },
  ],
});
```

Then add one line to `components/registry.ts`:

```ts
import { buttonStates } from "./primitives/Button/Button.states";
// …
export const registry: RegisteredComponent[] = [buttonStates /* … */];
```

Because the states file imports the real component and the catalogue renders
only what the registry gives it, the catalogue cannot show a stale copy.

**Showing hover, focus and active states.** Those cannot be expressed as props,
so the component merges a `className` and the stylesheet puts the demo class on
the same rule as the real selector:

```css
.btn--primary:hover,
.btn--primary.is-hover { … }
```

Then a variant passes `className: "is-hover"`. There is only ever one set of
styles, so the two cannot diverge.

Shell infrastructure — the device frame, the dev toolbar, the navigation chrome
and the hub panel — is deliberately not in the catalogue. It is the prototype's
frame, not product UI.

---

## Colour

Everything is greyscale right now, on purpose, so hierarchy and structure get
judged before colour does.

Every colour is a CSS custom property declared once in `styles/tokens.css`, and
`npm run check:tokens` fails the build if a hex, `rgb()`, `hsl()` or colour
keyword shows up anywhere else. The brand palette — navy primary, gold accent,
muted slate blue secondary — lands by editing the raw palette and the brand
slots at the top of that one file.

Contrast passes comfortably in greyscale. It will need re-verifying when the
palette arrives: gold on navy is the likely failure point.

---

## Fonts

| Token            | Family            | Role                                        |
| ---------------- | ----------------- | ------------------------------------------- |
| `--font-display` | Red Hat Display   | Headings and UI labels                      |
| `--font-serif`   | Libre Baskerville | Pull quotes and editorial moments, sparingly |
| `--font-body`    | Inter             | Body copy and interface text                |

They load through `next/font/google` in `app/layout.tsx`.

---

## Accessibility

The target is **WCAG 2.2 AA**, and `npm run lint` enforces the part a linter can
see. In practice that means semantic landmarks and correct heading order on
every page, full keyboard operability, visible focus indicators on everything,
labels on every control, 4.5:1 text contrast and 3:1 for non-text, and respect
for `prefers-reduced-motion`.

---

## Git

| Branch     | What it is                                                     |
| ---------- | -------------------------------------------------------------- |
| `scratch`  | Exploratory work and rough ideas. Not for review.               |
| `main`     | The primary build. All active work happens here.                |
| `approved` | Reviewed and signed off.                                        |

Individual pages are never cherry-picked into `approved`. Approval is tracked
per concept with the `status` field in the manifest; `approved` is only updated
by merging all of `main` at a checkpoint Kate calls.

---

## Dependencies

Next.js, React, TypeScript, ESLint and `eslint-plugin-jsx-a11y`. That is the
whole list, and it is meant to stay that way. Every component here is written
from scratch — no MUI, Chakra, shadcn, Radix, Tailwind or animation libraries.
Ask before adding anything.
