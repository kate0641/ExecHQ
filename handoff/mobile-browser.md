# Mobile browser handoff

19 October 2026 · Kate Hester

ExecHQ is designed for the phone's browser, not a native app. Every mobile screen must work in the space Safari leaves when a page first loads, with its bars showing: about 670 points tall on a 393-point-wide iPhone, not the full 852.

## The build rule

Size screens to the visible height, never to `100vh`. On iOS Safari `100vh` is the height with the toolbars collapsed, which is why full-height screens scroll on first load and bottom buttons fall off screen. There is no need to measure or subtract the toolbar height: the browser does it.

| Unit | What it is | Use it for |
| --- | --- | --- |
| `100svh` | Height with the bars showing (small viewport) | Full-screen moments, so they always fit on first load |
| `100dvh` | Height that follows the bars as they show and hide | Containers that should grow when the bars collapse |
| `100lvh` | Height with the bars collapsed (what `100vh` gives on iOS) | Nothing in our layouts |

Supported in Safari 15.4+, Chrome 108+ and Firefox 101+.

Also set:

- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`.
- Pad every pinned bottom bar with `env(safe-area-inset-bottom)`, so it clears the home indicator and the floating Safari bar in iOS 26.
- Never go behind the browser's bars with negative margins or offsets: content there is hidden.

## Four layout patterns

Every mobile screen is one of these. The table under Screen by screen says which.

1. **Full-screen moment** (Welcome, Login). A flex column with `min-height: 100svh`. The top (wordmark, heading) is fixed, the middle (photo, panel, white space) is `flex: 1` and gives way first, and the main button is pushed to the foot with `margin-top: auto`. With room to spare the middle grows; it never pushes the button off screen.
2. **Pinned main action** (guided onboarding pages, Playbook Revise). The content scrolls; the action area is `position: sticky; bottom: 0` inside the scrolling column, with the page colour behind it and a short fade above, so content passes under it. Bottom inset 32px plus `env(safe-area-inset-bottom)`.
3. **Long page** (Home, Plan, Signals, Playbook, Briefing, Profile). Scrolls as normal. The Ask or go bar and any fixed action bar stay pinned at the foot, above the safe area.
4. **Keyboard up** (Account email, question answers). iOS lays the keyboard over the page and Safari's toolbar. Keep the answer drawer's action visible above it using the `visualViewport` API (resize event, then offset by `window.innerHeight - visualViewport.height`). Do not rely on `100dvh` alone here: it does not shrink for the keyboard on iOS.

## Screen by screen

Sizes measured in the prototype at 393 × 670, the visible page on an iPhone 16 with Safari's bars showing.

| Screen | Pattern | Pinned | Flexes / shrinks first |
| --- | --- | --- | --- |
| Onboarding: Welcome | Full-screen moment | Get started | The space between the quote and the button |
| Onboarding: What ExecHQ is | Pinned main action | Continue | The list scrolls under the button |
| Onboarding: Account, Direction, Reflection, Questions, Your story | Answer drawer | The drawer's buttons | The page above the drawer scrolls |
| Onboarding: Recommendation | Pinned main action | Use this plan, See other plans | The plan's parts scroll under the buttons |
| Onboarding: Your plan | Pinned main action | Next part | The plan scrolls under the button |
| Onboarding: Done | Full-screen moment | Go to my homepage | Gaps between parts tighten to 12px so it fits without scrolling |
| Login | Full-screen moment | None: the form sits in view on arrival | The dark panel's padding first (48px to 24px), then the panel; the wordmark and the line stay |
| Playbook flow: Revise | Pinned main action | Revise, Mark ready | The change-the-draft choices scroll under the buttons |
| Playbook flow: Draft, Ready | Long page | The fixed bar (Change it / Mark ready, or I've used this) | The draft scrolls |
| Home, Plan, Signals, Playbook, Briefing, Profile | Long page | Ask or go bar | The page scrolls |

On the web and tablet nothing pins: the actions sit in the page as before.

## Testing and the prototype

The prototype's Mobile view now draws Safari around the page: status bar 44, address bar 56, toolbar and home indicator 82, leaving the page 670 tall. Tablet draws the iPad's address bar and leaves 1124. Sheets and menus open inside the page area, and the toolbar hides while the drawn keyboard is up. Match what it shows.

- Test on a real iPhone in Safari, on first load, before scrolling: every main button visible, nothing scrolls on Welcome, Login or Done.
- Scroll so Safari's bars collapse: full-screen moments grow into the space, nothing jumps.
- Test the keyboard on Account and a question page: the action stays above the keyboard.
- Repeat in Chrome on Android, where the address bar is at the top and collapses the same way.

Later: added to the home screen as a web app (a manifest with `"display": "standalone"`), ExecHQ opens with no browser bars. That is a product decision, not part of this change.
