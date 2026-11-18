# Welcome offers Log in; any code works in the prototype

13 November 2026 · Kate Hester

Two small changes from the 13 November walkthrough. The full rules are in the Onboarding spec, section 3.1, section 9 and decision 35, and in the Login and Admin login specs' prototype tables.

## Welcome is the front door

- **A first visit opens Welcome, not Login.** In staging a first-time visitor currently lands on Login; that is the fix. A returning person, known on the device, still opens on Login.
- **Welcome offers both ways in.** Under **Get started**: "Already have an account? **Log in**", a line with a link to Login. It mirrors Login's "New to ExecEngine? Start here".

| Part | Words | Style |
| --- | --- | --- |
| Line | Already have an account? | `--text-sm`, the muted light text on the navy cover |
| Link | Log in | the light text, semibold, underlined |

On phone and tablet it sits under the button; on web, at the foot of the sheet.

## Codes, in the prototype only

- **Any six digits confirm the email** on onboarding's "Check your email", and sign in on Login and Admin login, so a reviewer never has to open the drawn email to move on.
- **000000 shows the wrong-code error**, so that state can still be reviewed. The expired screen is still reached from the drawn email.
- **The product is unchanged:** it checks the real code, as the specs say.
- The invite code on Account already accepted anything typed; that is unchanged.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| Which codes go through | `isAcceptedCode` and `WRONG_CODE` in `mock/login.ts` |
| The Log in line | `case "welcome"` in `flows/onboarding/concept-3/OnboardingConcept3.tsx`; words in `GUIDE_C3.welcome` |
| Styles | `.guide__login` in `styles/app.css` |
