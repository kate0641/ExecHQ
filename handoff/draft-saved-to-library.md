# Draft saved to your library

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review (edit 15). People make a lot in the Playbook, and need to trust that it is kept and where to find it. When a first draft is written, in any of the four builders, a short card now says so. The full rules are in the Playbook flow spec, 4.5.

## What it says

| Part | Words |
| --- | --- |
| Check | A check that draws itself in a navy circle |
| Title | Draft saved to your library |
| Line | You can find it any time. |
| Link | Open your library (to the library on the Playbook page) |
| Close | An ×, named "Close" |

## How it behaves

- Appears once, as the first draft opens after **Write my first draft**. Not when a saved draft is opened again.
- Centered over the screen, which dims slightly behind it.
- **Goes on its own after about five seconds,** with a short fade. The ×, Escape, a tap outside it, or the link close it sooner.
- **Pauses while held:** pointer over it, or focus inside it, stops the five seconds (WCAG 2.2.1, timing adjustable).
- **Never takes focus.** Focus goes to the draft's label as before. The words are announced politely from a status message.
- Reduced motion: the check shows drawn, and there is no fade.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The card | `components/playbook/SavedNotice`, in the component catalogue |
| The words | `SAVED_NOTICE_COPY` in `mock/playbook.ts` |
| When it shows | `write()` in `flows/playbook-flow/useToolFlow.tsx` |
| Styles | `.saved-notice` in `styles/app.css` |
