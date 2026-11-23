# Welcome and Login: new words

23 November 2026 · Kate Hester

All three lines of words on onboarding's Welcome change, and Login takes the same serif line and line. The wordmark, the button, "Already have an account? Log in" and the layout stay as they are. The full page is in the Onboarding spec, section 3.1.

## Before and now

| | Before | Now |
| --- | --- | --- |
| Heading | Somewhere to work on what comes next. | The private, personalized career growth platform for executives. |
| Line | "Part coach, part advisor, part confidant. Private to you, and built around where you want to go." | "Built exclusively around your goals, your ambitions and your path forward." |
| Serif line | From "I'd like to be" to "I'm going to be." | Part executive coach, part advisor, part confidant. |
| Words on the page | 33 | 35, within the 40-word rule |

## Where it shows

- **Phone and tablet:** the cover. Heading, then the line, then the serif line.
- **Web:** the dark panel carries the wordmark and the serif line; the sheet carries the heading, the line and Get started. (Before, the panel carried the old heading and the sheet's heading was the old serif line; the two now sit the same way round as on the phone.)
- **Login:** the dark panel carries the same serif line, and the sheet's promise under "Log in to ExecEngine" is the same line. On the phone and tablet, the panel on top; on web, the panel on the left.

## Login, before and now

| | Before | Now |
| --- | --- | --- |
| Serif line, dark panel | Somewhere to work on what comes next. | Part executive coach, part advisor, part confidant. |
| Promise, under the heading | "A private career advisor that takes you from "I'd like to be" to "I'm going to be". It doesn't just show you the way. It works for you to get you there." | "Built exclusively around your goals, your ambitions and your path forward." |

Login's heading, "Log in to ExecEngine", and everything under the promise stay as they are. Both pages read the words from one place, so they cannot drift apart.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The words | `GUIDE_C3.welcome` in `mock/onboarding.ts` |
| Login's copy of them | `LOGIN_COPY.welcome` in `mock/login.ts`, which reads `GUIDE_C3.welcome` |
| In the catalogue | GuidePage: "Cover"; WelcomeSplit: "A footer instead of an action" and "Compact, for later steps on the phone" |
