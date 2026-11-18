# Onboarding: What ExecEngine is, in a glance

12 November 2026 · Kate Hester

The second onboarding page is rebuilt: three short statements, the four Playbook tools by name, and privacy in one line, built in one idea at a time. It drops from about 120 words to 40, and fits above the button with no scrolling. The full rules are in the Onboarding spec, section 3.2.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Heading | Crafting a plan for your career and the work to carry it out | Everything you need for what comes next. |
| Line | A private career advisor for modern professionals ready to grow, with no agenda but your own. | None |
| Body | Three numbered points, each a title and a sentence | Three statements, each with a drawing: **Know where you stand · Plan where you're going · The tools to get you there** |
| Playbook | Not mentioned | **In your Playbook**: Positioning statement, Pitch builder, Situation brief, Thought leadership |
| Privacy | A titled box, two sentences | One line with a lock: "Private. For your eyes only." |
| Words | About 120, past the fold on a phone | 40, all above Continue |
| Motion | None | Builds in once, about five seconds |

## The build

Times are from the page arriving. Each piece rises 12px into place and fades in over 320ms (`--duration-slow`, `--easing-standard`).

| Piece | Starts | Its drawing |
| --- | --- | --- |
| Know where you stand | 0.6s | The pin drops in (600ms, a small overshoot) |
| Plan where you're going | 1.4s | The path draws (800ms); its two points appear at +0.6s and +0.9s |
| The tools to get you there | 2.2s | Four squares appear, 0.15s apart |
| In your Playbook | 3.2s | |
| The four tools | 3.4s, 3.55s, 3.7s, 3.85s | Each scales in from 85% |
| Privacy | 4.3s | |

- **Continue is there from the first frame.** Nothing waits on the motion.
- **Everything is in the page from the start;** only its showing is delayed, so a screen reader reads the page whole.
- **Reduced motion:** no movement; the page shows at rest.
- **Once.** It plays when the page arrives, and again only if she comes back to it.

## Layout

- **Statement tiles:** 40px square, 10px corners, the quiet navy surface (`--color-surface-quiet-on-inverse`), drawing 24px in the headline yellow. Statements in the display face, 18px semibold, 12px apart.
- **Tools:** two to a row on phone and tablet, four in a row on web; 8px apart. Each is a 16px-corner card on the quiet navy surface with a 1px edge (`--color-border-inverse`), the Playbook's own tool illustration (icon level, 22px, in yellow) and its label, 14px semibold.
- **Privacy:** the lock icon, 16px, and the line in 14px muted light blue.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The component | `components/onboarding/ProductIntro` |
| The words | `GUIDE_C3.about` in `mock/onboarding.ts` |
| Styles and motion | `.product-intro` in `styles/app.css` |
| In the catalogue | ProductIntro: "Building in" (reload to watch it again), "Long text" and "At rest" |

## Still open

- **The full privacy promise** ("Not your employer, not your manager… yours to keep, edit, and export") is no longer on this page. Where it is said in full is not decided (spec, open question 10).
