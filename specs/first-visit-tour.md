# First-visit tour — interaction spec

Concept: **Concept 1 — Three stops**, as built on 2026-11-18 (designed 2026-11-12 with onboarding; Onboarding spec 3.12). It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production". Nothing is left open: every question is settled under "Decisions".

In the prototype it opens at `/first-visit-tour/concept-1`, which is Home with the tour running. Reload the page to see it again from the start.

---

## 1. What it is

The first time a person reaches Home after onboarding, Home opens with a three-stop tour of how to get around. Everything in ExecEngine is reached from the **Ask or go** pill, and the tour shows it: the screen dims, one thing at a time is lit with a yellow ring, and a short card beside it says what it is.

It teaches the navigation, not the product: it does not explain Home's sections, the plan or the Playbook.

### When it shows

- **Once per account,** on the first visit to Home after onboarding, whichever way the person arrives there: from Your plan's **Later, take me to my homepage**, or from the first draft's **Save it and go to my homepage** (Onboarding spec 3.9, 3.10).
- **Never again** once it has ended, whether by **Got it**, **Skip the tour** or Escape. Ending it in any way records it as seen on the account (decision 2).
- **Not** on Login, not after a returning person signs in, and not on any page but Home.
- If the person leaves Home before it ends (closes the tab, reloads), it has not been seen, and it shows again on their next visit to Home.

---

## 2. The stops

| Stop | Counter | What is lit | The panel | Card title | Card body | Main button |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 of 3 | The **Ask or go** pill | Closed | **Everything starts here** | Tap to go anywhere, or ask ExecEngine anything. | **Next** |
| 2 | 2 of 3 | **Go to**: the row of six places at the top of the panel | Opens for this stop | **Six places, one tap away** | Your plan, your signals, your Playbook, the daily briefing and your profile. | **Next** |
| 3 | 3 of 3 | **Ask your advisor** with its suggested questions, and the field to type in, lit together as one box | Stays open | **Chat with ExecEngine** | Ask anything about your plan, or tap a question to start. It knows what you've told it. | **Got it** |

Every card also has **Skip the tour**.

---

## 3. How it behaves

### Each stop

- **The screen dims** with the overlay color, except the lit part, which stays clear with a yellow ring around it. The ring sits 6px outside what it lights, with corners that follow it: 26px plus 6px on the pill, 16px plus 6px on Go to and on the chat box.
- **The card** sits 14px below what is lit, or 14px above it when what is lit is in the lower half of the screen. So stop 1's card (the pill is at the foot) is above it, stop 2's is below Go to, and stop 3's is above the chat box.
- **The card** holds, in order: the counter ("1 of 3") in small capitals, the title, the body, then a row with **Skip the tour** on the left (an underlined text button) and the main button on the right (a filled pill, **Next** or **Got it**).
- **What is lit is measured, not fixed.** While the panel slides open for stop 2, the ring follows it until it settles (up to two seconds), and it is measured again whenever the window changes size.
- **Nothing behind the tour can be pressed** while it runs. Presses on the dimmed screen do nothing; they do not end the tour.

### Moving through it

- **Next** goes to the next stop. Before stop 2, the panel opens (the sheet rises on the phone, the pill grows into its card on tablet and web; Navigation spec 3). The ring and card for the new stop appear once what they light is in place.
- **Got it** (stop 3) ends the tour **with the panel still open and the cursor in its field**, so the person can type at once.
- **Skip the tour,** or **Escape,** ends it at any stop and **closes the panel** if it is open. Home is left as it was before the tour.
- There is no Back. A person who wants to see a stop again can open the panel themselves.

### Motion

- The panel opens with its own motion (Navigation spec 3). The ring and card appear in place, with no motion of their own, and with reduced motion asked for nothing changes: there is nothing extra to turn off.

---

## 4. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Where it draws | Over the whole screen, inside the browser's page area (Safari's bars stay above and below it) | Over the whole screen | Over the whole canvas |
| The panel at stop 2 and 3 | The sheet, risen from the foot | The card, grown from the pill and centred | The card, grown from the pill and centred |
| The card | The width of the screen less 16px each side | The same | The same: the width of the canvas less 16px each side |

The stops, words and rules are the same on every viewport.

---

## 5. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers.

| What | Value | Token |
| --- | --- | --- |
| Dim | The overlay color, 48% | `--color-overlay` |
| Ring | 3px, yellow | `--border-width-thick`, `--color-headline-on-inverse` |
| Ring offset from what it lights | 6px | none (fixed) |
| Space between the lit part and the card | 14px | none (fixed) |
| Card padding | 16px | `--space-md` |
| Card corners | 16px | `--radius-lg` |
| Card surface and shadow | Raised surface, large shadow | `--color-surface-raised`, `--shadow-lg` |
| Counter | 12px, semibold, small capitals | `--type-eyebrow-*`, `--color-eyebrow` |
| Title | 18px, display face, semibold | `--font-display`, `--text-lg` |
| Body | 14px, secondary text | `--text-sm`, `--color-text-secondary` |
| Buttons | At least 44px tall, pill | `--button-target`, `--radius-pill` |
| Main button | Filled, inverse | `--color-surface-inverse`, `--color-text-inverse` |
| Layer | Above the page and the panel | `--z-menu` |
| Focus ring | 2px, 2px offset | `--focus-ring`, `--focus-ring-offset` |

### Touch targets

Both buttons are at least 44px tall. **Skip the tour** is a text button with a 44px tall tappable area; **Next** and **Got it** are 44px pills.

---

## 6. Accessibility (WCAG 2.2 AA)

- **A modal dialog** named "A quick tour", described by the stop's title. Nothing behind it can be reached by keyboard, pointer or screen reader while it runs.
- **Focus** goes to the main button (**Next** or **Got it**) at every stop, as soon as what it lights is in place.
- **Keyboard:** Tab moves between Skip the tour and the main button; Enter or Space presses them; Escape skips the tour.
- **When it ends:** after Got it, focus goes to the panel's field; after Skip the tour or Escape, the panel closes and focus returns to the page.
- **The ring and the dim are decoration,** hidden from assistive technology. What is lit is said in the card's words.
- **Contrast:** the card's text on its surface meets 4.5:1, and the yellow ring meets 3:1 against the dim.
- **Not by color alone:** what is lit is shown by the ring and by being the only undimmed part of the screen.

---

## 7. Components

| Component | Role |
| --- | --- |
| `FirstVisitTour` (`components/navigation/FirstVisitTour`) | One stop: the dim, the ring, the card and its buttons, the dialog and Escape. It is told where to draw the ring. |
| The tour runner in `ConciergeConcept` (`flows/navigation/concept-1`) | Which stops there are and what each lights, opening the panel for stop 2, measuring what is lit, placing the card above or below, and how it ends. |
| `ConciergePanel` | The Ask or go panel the tour lights and opens. |

The words are `TOUR_COPY` in `mock/onboarding.ts`.

---

## 8. Prototype versus production

| Prototype | Production |
| --- | --- |
| It runs whenever Home is opened with `?tour=1`, which onboarding's last buttons add, and always on `/first-visit-tour/concept-1`. The address loses `?tour=1` when it ends, so a reload shows Home as it is. | It runs on the first visit to Home after onboarding, once per account. Ending it records it as seen on the account. |
| Nothing is stored: the same person can see it again by reloading the tour's page. | Seen is stored on the account, not the device, so it doesn't come back on a new phone or browser. |

---

## 9. Decisions

1. **Three stops, on Home, after onboarding:** the Ask or go pill, Go to, and chatting with the advisor. The Plan page and Home's sections are not part of it. (2026-11-12)
2. **Skipping counts as seen.** Got it, Skip the tour and Escape all record it as seen on the account, and it never shows again. (2026-11-18, UX review: "Skip tour 100%")
3. **No way to bring it back in V1.** It is a one-time teaching moment; the panel it teaches is always one tap away, and the advisor answers "how do I get to…?". (2026-11-18)
4. **Got it leaves the panel open with the cursor in its field;** skipping closes it. (2026-11-12)
5. **It teaches the panel as it now looks:** stop 3 lights **Ask your advisor**, with no logo over it (Navigation spec, 2026-11-18).
6. **A review page of its own.** The file hub lists the tour as its own flow, opening on Home with the tour running, so it can be reviewed without going through onboarding. (2026-11-18)
