# Onboarding — interaction spec

Approved concept: **Concept 3 — Guided**, as refined on 2026-10-02. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production", and what is still undecided is listed under "Open questions". Concepts 1 and 2 were not chosen and are archived on the `scratch` branch.

---

## 1. What it is

Onboarding is a person’s first session with ExecEngine. A new person arrives not knowing what ExecEngine is. They leave with an account, a plan they chose, and a first draft of the story of what they lead, all saved, and a short list of what to do next.

It does four jobs, in this order:

1. **Say what ExecEngine is,** plainly, before asking for anything.
2. **Learn where the person wants to go,** and what is in their way.
3. **Give them a plan,** chosen once, then made theirs by a few more questions.
4. **Give them something usable today:** a first draft of their story, with a clear choice of what to do with it next.

The whole flow speaks in ExecEngine's voice, in the third person ("ExecEngine will…"). It explains as it goes: what each thing is, and why it is being asked, until the person has answered, after which the explanation steps aside.

What it deliberately does not do:

- **Connect to anything, or ask for LinkedIn.** In V1 there is nothing to connect. The one outside source, a LinkedIn analytics spreadsheet the person exports and uploads, lives on the Signals page, not in onboarding (Kate, 2026-11-12).
- **Score, rank or compare.** No answer, fact or plan ranks the person against anyone.
- **Post or share anything.** Nothing leaves the person's account.
- **Ask for more than it needs.** An email (typed and confirmed, or from Google or Apple), an invite code, a direction, a choice of plan and an answer to each reflection are the only required steps. Every other question can be skipped, and the person can come back to it.
- **Ask the person to type an answer.** Every question is a choice. The only typing is the account email, its 6-digit confirmation code, an invite code, and refining the story (section 3.10).
- **Show progress as a number.** Progress is a thin line with no words (4.9). There are no step counters or percentages in the flow.

### Where it appears

Onboarding uses the `minimal` chrome with no header: no navigation, no footer line. It is reached from the product's front door and from Login (**Start here**, and **Start fresh** on the "different account" screen; see the Login spec). It ends on **Home** (Homepage Concept 1), reached from the last page's button.

In the prototype the route is `/onboarding/concept-3` and the flow opens on the phone frame.

---

## 2. The flow at a glance

The prototype's step bar names twelve steps. A few pages are reached only from another page and have no step of their own.

| # | Step bar | What happens | Required |
| --- | --- | --- | --- |
| 1 | Welcome | The opening statement | — |
| 2 | What ExecEngine is | What it is, in one page, and the privacy promise | — |
| 3 | Account | Google, Apple or a personal email, and the invite code. *Aside:* Check your email, for a typed address | An email, confirmed by its code or by Google or Apple, and an invite code |
| 4 | Where you are | Where the person is today: as many as are true, or their own words under Other | At least one answer |
| 5 | Direction | Where the person wants to go: pick, then narrow it down | At least one pick |
| 6 | Choose your plan | A question about what is in the way (for most directions), then the five plans, ExecEngine's pick first and marked; the person chooses | Choose a plan |
| 7 | Reflection | One question to sit with, with a reply | An answer |
| 8 | Questions | Up to three "Making it yours" questions, with two more reflections between them | No |
| 9 | Your plan | The plan, tuned to their answers: this week, then the stages | — |
| 10 | Your story | A question to sit with, about saying what they lead | An answer |
| 11 | First draft | The first draft, and the choice of what next. *Asides:* add more detail, longer versions. This is the **Playbook** (Positioning Builder) | — |
| 12 | Done | What is saved and what to do next | — |

```
Welcome ─▶ What ExecEngine is ─▶ Account ──(typed email)──▶ Check your email ─┐
                                │ (Google or Apple)                         │
                                ▼                                           │
                     Where are you today? ◀─────────────────────────────┘
                                ▼
                            Direction ─────────▶ Narrow it down ─┐
                                                                    ▼
                          What's in the way? (deciding question, if the direction has one)
                                                                    ▼
          Choose your plan (five plans, ExecEngine's pick first and marked)
                ▼   Use this plan
          Reflection ─▶ Question ─▶ Reflection ─▶ Question ─▶ Reflection ─▶ Question
                                                                    ▼
                                          Your plan: This week ─▶ Three stages
                                                                    ▼
                                    Your story (a question) ─▶ First draft
                                                                    │
                          ┌──────────── What next? ────────────────┤
                          ▼                    ▼                   ▼
                  Add more detail    Build longer versions   Save and come back later
                          └──────▶ back to the draft            │ (versions: Save it and finish)
                                                                ▼
                                                              Done ─▶ Home
```

The order is a decision, not an accident of the list (see section 10). Three points matter most:

- **The plan is chosen at step 6, before the personalising questions,** so the person knows what they are agreeing to. Steps 7 to 9 make it theirs. They do not reverse it.
- **The question that can change the plan is asked before the recommendation,** so the recommendation is made once.
- **The first draft comes before any extra detail is asked,** so the person has something in hand first, then chooses what to do with it.

---

## 3. The pages

### 3.1 Welcome

The cover. A large statement on the page surface.

- Small label: **ExecEngine**.
- Heading: **Somewhere to work on what comes next.**
- Line: "Part coach, part advisor, part confidant. Private to you, and built around where you want to go." (Kate, 2026-11-12, from Eric's why statement; 33 words on the page.)
- Closing line, in italic serif: "From "I'd like to be" to "I'm going to be.""
- Button: **Get started.**

The same wordmark and serif line open Login, so a returning person and a new one see one product. Login's own line is its own and was not changed with this one.

**On web the Welcome splits,** as Login's does. A dark panel on the left (40% of the width) carries the **ExecEngine** wordmark and, in italic serif, "Somewhere to work on what comes next." The sheet on the right carries the heading **From "I'd like to be" to "I'm going to be."**, the line "Part coach, part advisor, part confidant. Private to you, and built around where you want to go.", and **Get started**, centered across and down the sheet. Phone and tablet keep the cover above.

### 3.2 What ExecEngine is

What ExecEngine is, said in a glance and built in one idea at a time (Kate, 2026-11-12; it was a heading, a line, three explained points and a privacy box, about 120 words, which ran below the fold). 40 words. The detail is left for the product, where the person sees it.

- Label **What ExecEngine is.** Heading: **Everything you need for what comes next.**
- Three statements, each with a small drawing in a tile:
  1. **Know where you stand** (a pin)
  2. **Plan where you're going** (a path through three points)
  3. **The tools to get you there** (four squares)
- **In your Playbook**, with the four tools by their Playbook labels, each with its own illustration: **Positioning statement, Pitch builder, Situation brief, Thought leadership.** Two to a row on phone and tablet, four in a row on web.
- With a lock: "Private. For your eyes only."
- Button: **Continue.**

**It builds in once,** when the page arrives, over about five seconds. Each piece rises into place at its own moment: the first statement at 0.6s, the second at 1.4s, the third at 2.2s, the Playbook label at 3.2s, the tools at 3.4s to 3.85s (0.15s apart), privacy at 4.3s. Inside each tile, the drawing says the idea: the pin drops in, the path draws and its points appear, the squares appear one by one. Each piece takes 320ms (`--duration-slow`).

- **Continue is there from the first frame,** so nothing waits on the motion.
- **Everything is in the page from the start;** only its showing is delayed, so a screen reader reads the page whole.
- **With reduced motion asked for,** the page shows at rest, with no movement.
- It plays again only if the person comes back to the page.

The privacy promise is said here, before anything personal is asked. There is no separate privacy page. Its longer wording ("Not your employer, not your manager, not anyone else. Everything ExecEngine makes is yours to keep, edit, and export.") is no longer on this page. Where the product says it in full is open (section 11).

### 3.3 Account

A personal email, then the invite code, both required (Kate, 2026-11-12). 29 words.

- Label **Your account.** Heading: **First, somewhere to keep all this.** No line and no "Why this matters": the drawer covered both, so the reason for a personal address sits under its field instead.
- The answer drawer opens with **Continue with Google** and **Continue with Apple**, the same buttons as Login's, then a divider reading "or", then **Your personal email** (required; placeholder you@example.com) with the hint "Not your work one, so it stays yours wherever your career goes." Under it, **Your invite code** (required) with the hint "From your invitation." Button **Continue.**
- **Google or Apple** opens that provider's own account picker (a stand-in in the prototype, as on Login). Once an account is picked, the buttons, the divider and the field give way to one line: a small label **With Google** (or **With Apple**), the address, and **Change.** Change brings the buttons and an empty field back, with the cursor in the field. The invite-code field stays, and is still required.

Rules:

- **A personal address is asked for, not enforced** (Kate, 2026-11-12, replacing "any address" from 2026-09-22). The field's name and hint ask for one; a work address is still accepted, because a work domain cannot be told from a personal one reliably. The same goes for Google and Apple: a work Google account and Apple's **Hide my email** relay address both make an account, with no warning. An empty field shows "We need an email address to create the account."
- **Everyone has an invite code,** so it is a required field, with no "I don't have a code". **Continue** stays off until both the email (or a Google or Apple account) and a code are given. A recognized code is kept. An unrecognized one shows the notice "We do not recognize that code. Check it against the invitation you were sent. A code only changes who pays, never what you get." Coming back to the page, the code is kept, and so is the way in (Google, Apple or a typed email).
- **Continue sends the answer in one press,** with the keyboard up. Return on a real keyboard does the same.
- **Where Continue goes.** With Google or Apple, the address is already confirmed, so Continue goes straight to Where are you today. With a typed address it goes to **Check your email** (3.3a), unless that same address has already been confirmed in this session.

### 3.3a Check your email

Reached only from Account, for a typed address, by decision on 2026-10-08. It has no step of its own on the step bar. The code works the same way as Login's (see the Login spec).

- Label **Your account.** Heading: **Check your email.** Line: "ExecEngine has sent a 6-digit code to {email}. It works for 10 minutes."
- "Why this matters": "So the account is yours: only someone with your inbox can open it, and it's where your plan and your story come back to you."
- The answer drawer asks **Type the code from the email.** with six code cells (one real field, so pasting and the phone's code suggestion work). Under it, a row with **Send it again** (after a 30-second wait, shown as "Send it again in 29s") and **Use a different address**, which goes back to Account with the address in its field. Then "Nothing arrived? Check your junk folder." Button **Continue**, off until six digits are typed.
- **The email arrives** about 1.6 seconds after the page opens, as the phone's own notification over the top of the page: **ExecEngine**, **Confirm your email**, "Here's the code to finish setting up." Its arrival is announced politely. Tapping it opens the email in a sheet: subject **Confirm your email**, the line "Type this code in ExecEngine to confirm your email:", the code large, and "This code works for 10 minutes and only once. If you didn't ask for it, you can ignore this email." **Inbox** closes it.
- **The subject and preview say nothing about the person's career,** so nothing private shows on a lock screen, the same rule as Login's email.
- **Send it again** clears the cells, sends a new email (it arrives the same way) and announces "Sent again."
- Continue confirms the address and goes on to Where are you today.

**Wrong and expired codes** use Login's screens, by decision on 2026-10-08:

- **A wrong code.** Continue with six digits that are not the emailed code keeps the person on the page, shows Login's error under the cells ("That code doesn't match. Check the latest email and try again."), clears the cells and puts focus back in the first one. The cells are marked invalid and the error is announced. Typing again clears it. **After five wrong tries** the code stops working and the expired screen shows, as on Login.
- **An expired code** (10 minutes, or five wrong tries). The page becomes Login's expired screen, still labeled **Your account**, with no drawer: heading **That code has expired**, line "Codes work for 10 minutes and only once. ExecEngine can send a new one to {email}." (Login's line, in onboarding's voice.) Button **Send a new code**, which brings the code page back with empty cells, the 30-second wait restarted and the new email on its way, and announces "Sent again." Under it, **Use a different address**, back to Account. Focus moves to the heading each way. In the prototype the 10 minutes are reached from the drawn email's **Open it again after 10 minutes**, as on Login.

### 3.4 Signals (removed)

Onboarding no longer has a Signals step or a LinkedIn upload page (Kate, 2026-11-12). LinkedIn lives on the Signals page ("Add more LinkedIn data", Signals spec 5.4), and onboarding does not mention it, Done included. Account goes on to Where are you today (3.4a).

### 3.4a Where are you today?

Where the person is now, asked before where they want to go (Kate, 2026-11-12). It is Eric's "assess where they stand", and it names what is happening to senior people now. 25 words.

- Label **Where you are.** Heading **Where are you today?** Line "Pick as many as are true." "Why this matters": "Your plan starts from where you are, not from a template."
- In the drawer, six answers, each with a **tick box**, as many as are true: **Doing well, and ready for more · New in my role · Stuck, or passed over · Going through a restructure or merger · My role is changing with AI · Other.**
- **Other** stands in for "None of these? Show me more options": there are no held-back answers. Ticking it opens a field, **In your own words**, under the list and puts the cursor in it. Unticking it closes the field and clears it. Other can be ticked with any of the others.
- Button **Next**, off until something is ticked, and while Other is ticked with its field empty. Return in the field does the same as Next. The peek bar says how many are picked.
- **What it does:** the answers open the reason on ExecEngine's pick (3.7), as "Today, you're new in your role and you're going through a restructure or merger.", her own words quoted as she wrote them. They are said back first on the plan page's **Built from what you said** (3.9), as **Where you are today**, in the list's order with her own words last, with **Change**. They do not change which plan is recommended.

This page alone uses tick boxes and Other; every other question keeps the pattern in 4.3 (Kate, 2026-11-12).

### 3.5 Direction

The second question, after where the person is today. The heading is **Where do you want to go next?** with "Pick as many as are true." The "Why this matters" note says: "Everything ExecEngine builds points here. Pick all that are true, and it will start with the one that matters most." The answers come up in the drawer.

**Page one.** Six options, as equal-width buttons, one to a row, and as many as are true can be picked (Appendix A):

- Reach the C-suite within three years
- Take on a bigger leadership role
- Be seen as an executive
- Nail an upcoming presentation
- Make a move within my company
- I'm not sure yet (shown here, not held back, from 2026-11-12)

Below them: **None of these? Show me more options** (adds two: Lead a bigger organization; Carry more weight where I am; the button then disappears).

No answer leads out of the person's company: ExecEngine doesn't steer anyone out of it, but a move inside it is in (Kate, 2026-11-12). "Get out of where I am" was removed, and "Find my next move" became "Make a move within my company". The drawer's peek bar says how many are picked. The button reads **Narrow it down** with one option picked and **Which matters most?** with more than one. There is no field to type in: every answer is a choice.

**Page two, narrowing.** Each option picked becomes a group of **two more specific versions**, to tap (Appendix A). One is chosen. With several picks the heading is **Which matters most right now?** and the line "ExecEngine will start there, and keep the rest in view." With one pick it is **Which is closest?** and "A little more detail gives ExecEngine a clearer first step.", except when that pick is **I'm not sure yet**, where the line is "That's what ExecEngine is for: it will help you figure it out."

What is kept:

- The chosen version becomes the person's direction, and is said back as they chose it. It stands for the option it came from: the plan, the goal and the questions all follow the option (section 5).
- The other picks are kept as "also picked" and said again on the plan page's Built from what you said.

### 3.6 What's in the way (the deciding question)

For most directions, one question is asked before the recommendation, because its answer can change the plan. Label **Before ExecEngine recommends anything.** Its heading depends on the direction: **What's in the way?** (a bigger role) or **What's making you want a change?** (a move within the company). The influence directions (Take on a bigger leadership role, Carry more weight where I am) have none: **What's holding you back?** was dropped (Kate, 2026-11-12). The line is "Pick as many as are true."

- Five options, multiple choice, and **None of these? Show me more options** (four more). See Appendix B.
- Buttons: **Next** and **Skip this one.** The person can skip.
- Directions about a coming moment (a board presentation, a review) have no deciding question, and go straight to Choose your plan.

### 3.7 Choose your plan

This is where the plan is chosen, and the person chooses it (Kate, 2026-11-12). ExecEngine says which it would pick and why, but all five are on the page as equals to choose from. It replaces the Recommendation page and its "See other plans" page.

- Label **Your plan.** Heading **Choose your plan.** Line: "Whichever you choose, the next few questions make it yours." 13 words of the page's own; the plans are the answers.
- The five plans as cards, one choice (a radio group named "Choose your plan"). Each card is the plan's **name** and when it is for (Appendix C). The plan's focus line is left to the plan page.
- **ExecEngine's pick comes first and is chosen to start with**, so one press of **Use this plan** carries on. It is marked **Recommended** and carries its reason, built from what the person said: where they are today ("Today, you're new in your role and you're going through a restructure or merger."; 2026-11-12), their direction, then what is in their way, then "That's what this plan is for." If an answer sent the plan somewhere else, that answer's own reason is used. The other four follow in the usual order.
- Button **Use this plan.** Choosing another card and pressing it chooses that plan and goes straight on.
- **Removed with the old page:** what a plan is ("A plan is how you get… two parts"), said on the plan page anyway; "You also picked: {them}…" (the other picks are still kept, and said on the plan page's **Built from what you said**); "You chose this one instead…".

On phone and tablet the list scrolls under a pinned **Use this plan**; about three cards show at once.

### 3.8 Reflection and the questions that make it yours

After the plan is chosen, up to three more questions make it the person's own. Before each one, a **reflection:** a question to sit with, not needed for the plan.

Order, with up to three of each: **Reflection (time) → Question → Reflection (CEO) → Question → Reflection (manager) → Question.** A reflection is only ever asked before a question, so if a direction has fewer than three questions, the reflection that would have come before the missing question is left out too.

**A reflection.** Label **A question to sit with.** Heading and line are the question. "Why this matters" is shown until it is answered. Four options (three for the story question) as equal-width buttons. **Answer** sends it. After answering:

- The line and the "Why this matters" note go away.
- A quiet line shows **You said** with the answer and **Change.**
- ExecEngine's reply appears as a pull quote in serif, one or two sentences, one reply per option.
- A **Worth knowing** card gives a sourced fact (rules in 4.6).
- **Continue** stays pinned at the foot.

The reflections are:

| Reflection | Question | Options |
| --- | --- | --- |
| Time | How much time do you spend on your career each week? | None, honestly; Under an hour; An hour or two; More than that |
| CEO | If your CEO described what you do, would they get it right? | Yes, exactly; Roughly; Probably not; They don't know me |
| Manager | When did you last talk to your manager about what's next for you? | This month; In the last six months; Over a year ago; Never, really |
| Story (step 10) | Could you say what you lead in one sentence, right now? | Yes, easily; Roughly; Not really |

**The questions** use the same pattern as Direction and the deciding question: equal-width options, five options and **None of these? Show me more options.** The **list-type** questions take several answers ("Pick as many as are true."). The **scale-type** questions, where each option is a point on a line, take one. Buttons: **Next** and **Skip this one.** The full list, by direction, is in Appendix B.

### 3.9 Your plan

The plan, tuned to what the person said. Two pages.

**Page one: This week.** Label **Your plan.** Heading **This week.** Line "Here's your plan, tuned to what you've said, one part at a time."

- **Built from what you said:** a short list of the person's answers, each with a **Change** link. The first row is where they are today (3.4a), the second their direction. The rest are the questions they answered. **Change** on where they are today, or on a question, goes to it and returns here when it is answered. **Change** on the direction starts the questions again from Direction, with their picks kept; a new direction clears the plan they chose for the old one.
- A dark card with **the one task to do first** (for example "Write the story of what you lead"), a line of detail, **Why now:** a short reason, and the **data** behind it with its source (see 4.6).
- Button **Next part.**

**Page two: Three stages.** Heading **Three stages**, with "Each stage sets up the next, so the effort adds up." and "Stage by stage, toward {the goal}."

- Three stages, each with its name, what the person will have, and **Done when:** a checkable finish line. The first stage is marked **First · This week**, so the task on the first page is seen as the first step of stage one.
- A closing line: "Once these stages are done, ExecEngine will plan the next stretch with you, based on what worked and what didn't. It sharpens as you go: every draft you make and every conversation you log tells ExecEngine what to do next."
- Button **Continue.**

A plan has no end date and no length. A stage is never given a deadline.

### 3.10 Your story

**The question.** The reflection above: "Could you say what you lead in one sentence, right now?" with "Out loud, to someone who's never met you." It behaves as in 3.8. Its fact is Gallup's: only 46% of U.S. employees clearly know what is expected of them at work (2025).

**The first draft.** Here the person enters the **Playbook.** The label reads **Playbook · Positioning Builder** on this page, on **Add more detail** and on **Longer versions** (and on the "Writing your first draft" state), because the story is made in the Positioning Builder, one of the Playbook's four workflows. The question before it is still onboarding and keeps its own label. Heading **Here's your first draft.** It is written at once from what the person has already said. The line is "A start, from what you've shared. Add your role and a result to say what you lead." until they add detail, after which it says "Written from what you've shared, with the detail you added."

- The draft, in the person's voice ("I'm building toward a C-suite role within the next three years. What I want next is…"), with **Edit.** An edited draft is kept as written until the detail changes and the draft is rewritten.
- **Where you could use it:** three uses, from the plan.
- **Copy, Download, Email it to me.**
- Said once, on the first time the draft is seen, a line under the draft: "This is the Playbook, where ExecEngine makes your drafts. You'll find it any time from Ask or go." It is not shown again when the person returns to the draft.
- "Why this matters": "You can use this today. Add detail or build longer versions now, or come back to them from your plan."
- **What next?** at the foot, three equal choices, each a full-width outlined button with a line saying what it does:
  - **Add more detail:** "Your role, what you're responsible for and a result, so it says what you lead."
  - **Build out longer versions:** "Short, medium and long, for a bio, an introduction or LinkedIn."
  - **Save it and come back later:** "It's saved. Both of these wait for you as next steps on your plan."

None is the default, so leaving it for later is a real choice.

**Add more detail.** Label **Playbook · Positioning Builder.** Heading **Three things only you know.** Line "Your role, what you're responsible for, and one result. Skip any you like." Each is asked in turn in the drawer ("1 of 3"): **What's your current role? What are you responsible for? What's a result you're proud of?** Each has **Skip** and **Next**; the last has **Write my draft.** A card shows what good looks like for the question being asked (for example "VP of Marketing, leading brand and demand."). Writing the draft shows "Writing your first draft", then the rewritten draft. A hand edit is replaced, because the draft is written again from the facts. It returns to wherever it was opened from.

**Longer versions.** Label **Playbook · Positioning Builder.** Heading **Longer versions.** Line "The same story in three lengths, for different places: a line, a paragraph and the full bio."

- A switch for **Short / Medium / Long** shows the same story at each length. A fact ExecEngine doesn't know yet is a **dashed gap** ("To add: your name"), never something made up.
- When there are gaps: "The dashed parts are things ExecEngine doesn't know yet. Add them with the fields, or add more detail to your story." (worded to be true on every viewport, since the fields are below the bio on phone and tablet and beside it on web) and a set of fields, **What's missing from your bio?**: **Your name**, **How big is your team?** (five choices) and **What you're strongest at** (up to three of seven). **Add more detail** goes to the three questions above and returns here.
  - **On web the bio fills in as the fields are answered.** The fields sit right beside it, so there is no button: each answer is kept at once and the text changes as it is given. The card shows its question as a visible title, since the page's heading is far from it.
  - **On phone and tablet the drawer covers the bio,** so **Update my bio** applies what was typed, and "Bio updated." is announced to screen readers.
  - **The fields stay for as long as the person is on the page,** even once the last gap is filled, so they can change an answer.
- **Copy, Download, Email it to me.**
- Buttons: **Save it and finish** and **Back to my draft.**

### 3.11 Done

- Label **You're set up.** Heading **Your plan and story are saved.** Line: "You've done the hardest part: saying where you want to go."
- A numbered list, **What to do next**, in a card in the middle of the page, showing only what is left, in this order:
  1. **Add more detail,** if the draft has no role or result yet. Its line begins "In your Playbook."
  2. **Build longer versions,** if they have not been opened. Its line begins "In your Playbook."
  3. The plan's **next stage** (its name and first outcome).

LinkedIn is not on the list: it lives on the Signals page (2026-11-12).
- Button **Go to my homepage.**

The list shrinks as steps are done. It never repeats what the person has just seen, and it does not summarize their answers: the plan page already did.

---

## 4. Rules for every page

### 4.1 Page anatomy

Every page after the Welcome is one **guide page**, in this order: a small label; the heading; an optional line; the page's own content; the **"Why this matters"** note; the actions. Where a page asks a question, its answers come up in a **drawer** pinned under the page on phone and tablet, and in a **card** beside the question on web.

- **Heading.** One level-1 heading per page. When the page changes, focus moves to it.
- **"Why this matters."** A short note saying why the page exists. It is shown before a question is answered and removed after (on reflections), and is left off pages where there is nothing being asked.
- **Actions** sit at the foot. The primary is a filled button. A skip or alternative is a peer of the same size beside or beneath it, never a smaller link, so skipping reads as a real choice. Where a page's real action is in its body, the foot offers only a quiet way past it.
- **Pinned.** On phone and tablet the drawer's buttons stay pinned at its foot (on web, in the card, they sit just below the fields), and the **Continue** on an answered reflection stays in reach at the foot of the screen, so a long page never hides the way on.

### 4.2 The answer drawer

- **On web the drawer is a card** beside the question (section 6), always open, with no handle, peek bar or drawn keyboard. Everything else here describes phone and tablet.
- **Open** by default when a page arrives. It carries only the answer; the question and its reason stay on the page above, so the two are read together.
- **Fold (phone and tablet).** A handle folds the drawer to a **peek bar** carrying the question and a status ("Tap to answer", "3 picked", "Answered"); the bar brings it back. Both are real buttons, so nothing needs dragging (WCAG 2.2 SC 2.5.7).
- **The keyboard (phone and tablet).** While a text field in the drawer has focus, a drawn phone keyboard sits under it, with its return key labeled with the drawer's button. Pressing the return key, pressing Return on a real keyboard, or pressing the drawer's own button all send the answer, and none of them first closes the keyboard. If drawer and keyboard together are taller than the screen, the drawer scrolls and its buttons stay pinned at its foot.
- **One press.** Pressing a button in the drawer never takes focus from the field, so the press always lands.

### 4.3 The answer pattern

Used by Direction, the deciding question, the "Making it yours" questions and the reflections. **The one place the person types is the account email and its code, the invite code, Other on Where are you today (3.4a), and the details they add to refine their story** (3.10):

1. **Options** are equal-width buttons, one to a row, never wrapping tags.
2. **Choices only.** There is no field to type an answer in. Where the person's situation is not listed, **None of these? Show me more options** adds more, and **Skip this one** is always there.
3. **Five options and a way to more.** Where the options are a list, five are shown and **None of these? Show me more options** adds four. It disappears once used.
4. **Several or one.** List-type questions take as many as are true. Scale-type questions take one. Where one answer is expected, choosing another replaces the first.
5. **A way past.** Questions have **Skip this one.** Only an email, a direction, and the reflections' answers are required.

### 4.4 Voice

- **ExecEngine speaks in the third person.** "ExecEngine will draft that sentence for you next." The product never says "I".
- **The person's own words stay in the first person:** the options they pick ("Find my next move"), their drafts, and the details they type to refine their story.
- **"We" is not used** for ExecEngine. ("Before we begin" and similar inclusive uses were removed.)
- **No pressure and no scoring.** Replies are warm and specific, never ranking.

### 4.5 Explanation steps aside

What a page explains is said once, and in one place: what a plan is, at the choice; what ExecEngine heard, on the plan page; why a question is asked, before it is answered. After an answer, the page does not repeat the explanation.

### 4.6 Facts and data

Every figure shown as data is **real, sourced and shown with its source.** It appears on the reflections ("Worth knowing") and under the plan's "Why now." A fact never ranks the person against others. Until a fact is found, the card shows a **marked placeholder** ("A sourced fact is needed here") in a dashed box that cannot be mistaken for copy. See Open questions for which are still placeholders.

### 4.7 Waiting

Where ExecEngine writes something, a short state names it. The draft shows "Writing your first draft", for 1.1 seconds in the prototype.

### 4.8 Focus and announcements

- Each time the page changes, focus moves to the new page's heading. It does not move on first paint.
- The heading shows a visible focus ring when it takes focus from the keyboard.
- Confirmations (copied, emailed, sent) are announced politely.

### 4.9 Progress

A thin line at the very top of every page after the Welcome shows how far through onboarding the person is. It has no words, count or percentage. (Kate, 2026-11-12, reversing "no progress" from 2026-09-24.)

- **What it measures.** The pages a person moves on through, in order, Welcome excluded: What ExecEngine is is the first, Done the last and full. In the prototype that is 17 pages, so each fills about 6%.
- **Pages reached from another page** (Check your email, Add more detail, Longer versions) show the fill of the page they came from, and do not move it.
- **Pages a path passes** move it on. A direction with no deciding question, or with fewer than three questions, passes those pages and the line moves further. That is why it is an estimate, never a count: some paths are shorter than others.
- **Not in edit mode.** Changing direction from the Plan keeps its own "Change your direction" header, with no line.
- **Look.** 3px (`--border-width-thick`) tall, pill ends, the full width of the page's content. The track is the border color and the fill the primary text color, so on a navy page both turn to their inverse colors on their own. On web it spans the question's column, not the answer card.
- **Motion.** The fill grows over `--duration-base` (200ms) when it changes, and does not animate when reduced motion is asked for.
- **Accessibility.** A native `progress` element named "Onboarding progress", with its value 0 to 100, so a screen reader says "Onboarding progress, 35%". Focus never moves to it.

### 4.10 Forty words a screen

Every screen says what it needs in **40 words or fewer.** (Kate, 2026-11-12.)

- **Counts:** the label, the heading, the line, "Why this matters", and every card, reply and "Worth knowing" fact.
- **Does not count:** answer options, buttons and links (including "None of these? Show me more options"), the person's own words (what they picked, their draft, what they typed), a fact's source line.
- **Where it stands.** Within it: Welcome (33), What ExecEngine is (40), Account (29), Where are you today (25), Choose your plan (13, plus the reason on ExecEngine's pick). The Signals step (53) is gone. Most other screens are over: about 110 to 120 words on the plan page's stages and the First draft. Each is cut to fit as its own edit is approved; this section is updated as they are.

---

## 5. How it decides

### 5.1 From direction to plan

Every direction has a **need.** The need picks the recommended plan. The plans' names are the plan briefs' (`plans/`), from 2026-11-12, except the fifth: the brief calls it Chart a New Course, but it is shown as Find your next direction until the brief is rewritten for a move within the company.

| Need | Recommended plan |
| --- | --- |
| positioning | Step Up |
| influence | Lead Where You Are |
| visibility | Make Your Mark |
| preparation | Make the Move |
| exploration | Find your next direction |

- An option from the list has its own need (Appendix A). Rewording an option, or choosing a narrower version, never changes it.

### 5.2 Which questions are asked

The need also picks the questions (Appendix B). Each need has three, of which at most one is the deciding question.

| Need | Deciding question | Making it yours |
| --- | --- | --- |
| positioning | What's in the way? | What kind of step up? When do you want to get there? |
| influence | none (What's holding you back? dropped 2026-11-12) | Where do you want more say? Who do you most need on side? |
| visibility | none | Who needs to see you differently? How do they see you now? Where do you show up today? |
| preparation | none | What's coming up? When is it? How ready do you feel? |
| exploration | What's making you want a change? | What would you keep? How soon? |

A question is left out when the wording of the direction already answers it (for example a named moment such as a board, or a date).

### 5.3 The question that can change the plan

Three answers, if chosen, send the plan somewhere else. The reason shown is theirs.

| Question | Answer | Plan becomes | Reason shown |
| --- | --- | --- | --- |
| What's in the way? | Nobody sees my work | Make Your Mark | The results are there. What's missing is being seen by the people deciding, and that's what this plan is for. |
| What's in the way? | Wrong company for it | Find your next direction | If the next step may not be where you are, it's worth working out the direction before making the case. |
| What's making you want a change? | Hit a ceiling | Step Up | A ceiling is a scope problem. Making the case for a bigger role comes before looking elsewhere. |

If several answers are chosen, **the first one chosen that changes the plan decides.** The recommendation is made once, after this question. Nothing asked later can reverse it.

### 5.4 Several answers

A question can hold several chosen options. Each chosen option adds its own sentence to what ExecEngine says back ("Right now nobody sees your work. The results are there…"), in the order chosen, and its own line to the first draft ("The results are there. My focus now is making sure the people who decide can see them.").

### 5.5 Choosing and changing the plan

- The plan is chosen once, on Choose your plan, by the person; ExecEngine's pick is first and chosen to start with.
- The questions after personalize the plan the person chose. They never change which plan it is.
- **Changing the direction clears the chosen plan,** because the old choice was for a different goal. Changing a question answer keeps it.
- Jumping back is possible only through **Change** on the plan page. (The step bar is a prototype tool; see section 9.)

### 5.6 The plan's content

Each of the five plans has a name, a formal name, who it is for, one task for this week with the reason and data behind it, three stages with what the person will have and a finish line for each, and the places the first draft could be used (Appendix C). The plan page fills the **Built from** list, the task and the stages. The stages are the plan's own; only the goal they build toward is the person's.

### 5.7 The draft, the detail and the versions

- **The first draft** is written from the direction, the answers to the questions and, if given, a role, scope and result. With none, it says where the person is headed and what is in their way, in their voice. With them, it begins by saying what they lead.
- **The three detail questions** (role, scope, result) rewrite the draft. They are the only questions the draft depends on beyond the direction.
- **The longer versions** are the same story at three lengths, written from the same facts and a name, a team size and strengths. Anything missing is a marked gap.
- **Saving** is available at every point after the draft, and what is saved is whatever the person has so far. Nothing is lost by leaving the rest for later.

---

## 6. Specifications

### Sizes and tokens

Use the design tokens in the real build, never the raw numbers. The pixel values are for checking against the design.

| What | Value | Token |
| --- | --- | --- |
| Phone frame (prototype) | 393 × 852px | none (fixed) |
| Tablet frame (prototype) | 820 × 1180px | none (fixed) |
| Content column | At most 68ch, centered | `--content-measure` |
| Page padding | 24px sides | `--space-lg` |
| Gap between items on a page | 24px | `--space-lg` |
| Option buttons | Full column width, one to a row | none |
| Drawer top corners | 20px | `--radius-xl` |
| Drawn keyboard | Four rows, about 256px tall | none (fixed) |
| Code email arrives | 1.6 seconds after the page opens (prototype) | none |
| Wait before "Send it again" | 30 seconds | none |
| Email notification | Inset 16px from the top and sides; on web, 24rem wide at the top right | `--space-md` |
| Generating state | 1.1 seconds (prototype) | none |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |

All colors, type, spacing, radii, borders and shadows are tokens. No color is hard-coded. The product is built in greyscale first, with color switched on from the dock.

### Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Arrangement | One column, the width of the screen less 24px each side | **The same as the phone:** one column, centered, at the content measure | Two columns on any page with answers: the question on the left, the answers on the right. Other pages are one column, centered, at the content measure |
| Answers | A **drawer** pinned under the page, full width | The same drawer, its contents kept to the reading width | A **card** beside the question, at most 64rem (1024px) across both columns, with 24px padding and rounded corners (`--radius-xl`). No sheet, fold handle or peek bar. The card stays in view while the left column scrolls |
| Drawn keyboard | Under the drawer while a field has focus | Same as the phone | None. A person on a computer uses their own keyboard |
| Welcome | The cover, vertically centered | Same as the phone | Split: a dark panel and a sheet side by side (3.1) |

**Tablet is the phone layout.** It does not get a layout of its own: the content simply stays at the reading width in the wider frame. Only web changes arrangement, because only web has the room to put the question and its answers side by side.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. Onboarding opens on the phone frame.

### Touch targets

Every interactive control is meant to be at least **44 × 44px** (`--button-target`) on every viewport, as in the Login and Profile specs. WCAG 2.2 AA requires only 24px (SC 2.5.8). 44px is the ExecEngine standard because the product is used one-handed.

**The prototype does not yet meet this.** Measured on the phone frame:

| Control | Measured | Meets 44px |
| --- | --- | --- |
| Primary and secondary buttons | 345 × 34px | No |
| Option buttons | 345 × 40px | No |
| Small buttons ("None of these? Show me more options", "On your phone? Email me these steps") | about 30px tall | No |
| Text input | 53px tall | Yes |
| Length switch (Short, Medium, Long) | 48px tall | Yes |
| "What next?" buttons | 66px tall | Yes |
| Drawer fold handle | 64 × 24px | No |
| "Change" links | 61 × 24px | No |
| Copy, Download, Email links | 26px tall | No |
| Edit | 47 × 30px | No |
| Inline links and disclosures | 17 to 22px tall | No |

Production must give every control a tappable area of at least 44px, drawn smaller where the design calls for it, with no two areas overlapping. This is listed again under Open questions.

---

## 7. Accessibility (WCAG 2.2 AA)

- **Headings.** One level-1 heading per page, in a sensible order. The small label above it is not a heading.
- **Labels.** Every field and every group of options has a visible or accessible name.
- **Keyboard.** Everything works with a keyboard alone. Tab order follows reading order. Return sends a one-line answer. The drawn keyboard and its return key are decoration for sighted mouse users: hidden from assistive technology and out of the tab order.
- **Focus** is visible on every control, and moves to the heading when the page changes.
- **Contrast.** Text 4.5:1 and non-text 3:1 in greyscale and in color. The dark card and the dark option buttons meet it.
- **Not by color alone.** A chosen option is shown by fill and by its pressed state, not color. A placeholder fact is shown by a dashed border and its words.
- **Dragging is never the only way.** The drawer folds with a button.
- **Pressed state.** Option buttons are toggle buttons with a pressed state, so a screen reader hears what is chosen.
- **Errors** (an empty email, an unrecognised code, a wrong file) sit with their field and are announced.
- **Motion.** Waiting states and page changes respect `prefers-reduced-motion`.
- **Change links** carry the question they belong to ("Change: What's in the way?"), so a screen reader never hears four identical links.

---

## 8. Components

| Component | Role |
| --- | --- |
| `OnboardingConcept3` (in `flows/onboarding/concept-3`) | The flow: the pages, their order, and how the answers become the plan. |
| `GuidePage` | The page: the progress line (`progress`, 0 to 1), label, heading, line, content, "Why this matters", actions, and the drawer. |
| `AnswerDrawer`, `DeviceKeyboard` | The drawer that carries the answer, and the drawn keyboard. |
| `ChipGroup`, `Input`, `ToggleGroup` | The options (equal-width, single or several), the fields, and the length switch. |
| `ProviderButtons`, `AccountPicker` | Continue with Google and Apple, and the stand-in for each provider's picker. Shared with Login. |
| `CodeField`, `MailNotification`, `SignInEmail`, `Sheet` | The six code cells, the email's notification (carried by `GuidePage`'s overlay), the drawn email with onboarding's wording, and the sheet it opens in. Shared with Login. |
| `ProductIntro` | What ExecEngine is: the three statements and their drawings, the Playbook's tools and the privacy line, and the build-in. |
| `PointList`, `PlanTemplateCard`, `ReflectionReply` | Numbered points; the plan cards on Choose your plan; the pull-quote reply and its fact. (`RecommendationCard` is no longer used in onboarding.) |
| `ThisWeekCard`, `StoryDraft`, `StoryText`, `ExportLinks`, `NextSteps` | The task card with its data; the editable draft; the story with its gaps; Copy, Download and Email; the "What next?" choices. |
| `GoodExample`, `GeneratingState`, `Notice` | What good looks like; the waiting state; the invite-code notice. |
| `Button` | Every button. |

`flows/onboarding/shared` holds the answers and their rules, and `mock/onboarding.ts` holds every word and option, which is why the appendices here can be checked against it.

---

## 9. Prototype versus production

| Prototype | Production |
| --- | --- |
| Nothing is stored. Answers live in the page and are lost on reload. | The account is created and the flow can be resumed (see Open questions). |
| Any non-empty email is accepted. Any typed invite code is accepted. | Any address is accepted, as decided; the hint asks for a personal one. The invite code is checked, and an unrecognised one shows the notice. |
| Google and Apple open a drawn stand-in for their pickers, with marks in one colour. | Their own sign-in windows, with the buttons drawn to Google's and Apple's brand rules. |
| No email is sent. The code email is drawn on screen; only its code (482913) confirms the address, as on Login. Five wrong tries expire it; on time, it expires only when the email's "Open it again after 10 minutes" is pressed. | A real code is emailed and works once, for 10 minutes. A wrong one shows the error with the cells; an expired one shows the expired screen. |
| Nothing is sent. "Email me these steps", "Email it to me" and "Download" confirm what they would do. | They send and download for real. |
| The first draft, the versions and the replies are written from fixed templates. | They are written for the person (the generation approach is not specified here). |
| A drawn keyboard appears under the drawer on the phone and tablet frames when a field has focus. | The real keyboard. The drawn one is not built. On web the prototype draws none. |
| A step bar above the canvas jumps to any step, filling in sample answers, and a dock switches viewport and color. | Neither exists. People move only forward, or back through **Change.** |
| Plans, options and replies are the fixed content in Appendices A to C. | Content for more plans and options is a content decision (Open questions). |
| Two plans' "Why now" data are placeholders. | Every figure is real and sourced before this ships. |

---

## 10. Decisions

These are settled. They are the specified behavior. The dates are when they were made.

1. **Concept 3 is the onboarding.** (2026-10-02)
2. **ExecEngine speaks in the third person,** and the person's own words stay in the first. (2026-10-02)
3. **The plan is chosen on Choose your plan, by the person,** from all five, with ExecEngine's pick first, marked and chosen to start with, before the personalising questions. (2026-10-02; the person chooses from 2026-11-12)
4. **The question that can change the plan is asked before the recommendation,** so it is made once. (2026-09-30)
5. **The read-back page is gone.** What ExecEngine heard is a list on the plan page, each row with a way to change it. A free-text edit that changed nothing downstream is removed. (2026-10-02)
6. **The plan is two pages:** this week, then three stages with a finish line each. No part counters. A plan has no end date. (2026-10-02, 2026-09-29)
7. **One answer pattern across the flow:** equal-width options, five options and a way to more, several answers for lists and one for scales. (2026-10-02)
8. **Direction is two steps:** pick, then narrow each pick to one of two more specific versions. (2026-10-02)
9. **The first draft comes first,** then a choice: add detail, build longer versions, or save and come back. The three detail questions are not put in front of the draft. (2026-10-02, reversing the order tried earlier that day)
10. **Data is real or marked.** A figure is shown with its source, or as a placeholder. (2026-10-02)
11. **Nothing is connected in V1.** LinkedIn is a spreadsheet the person uploads, on the Signals page, not in onboarding. (2026-09-28; out of onboarding 2026-11-12)
12. **A personal email is asked for,** by the field's name and a hint, and a work one is still accepted. (2026-11-12, replacing "any email", 2026-09-22)
13. **Privacy is said once, on "What ExecEngine is,"** before anything personal is asked, in one line. (2026-10-02; one line from 2026-11-12)
14. **The Done page lists only what is left,** and does not repeat what the person has seen. (2026-10-02)
15. **No step counters, percentages or scores** appear anywhere in the flow. **Progress is a thin line with no words** at the top of every page after the Welcome (4.9). (2026-11-12, replacing "no progress", 2026-09-24)
16. **No open responses,** with one exception: Other on Where are you today (3.4a, 2026-11-12). Every other answer in onboarding is a choice. The only typing is the account email, an invite code, Other on Where are you today, and refining the story (a role, what the person is responsible for, a result, a name for the bio, and editing the draft). (2026-10-02)
17. **Everyone has an invite code:** it is a required field, with no "I don't have a code". (2026-11-12, replacing the required choice of 2026-10-02)
18. **The story build-out is the Playbook, and the pages say so.** The draft, add-detail and longer-versions pages are labeled "Playbook · Positioning Builder," the Playbook is explained once on the first draft, and Done says "In your Playbook" on the story steps that are left. Onboarding does not use the Playbook's own frame or navigation. (2026-10-02)
19. **Tablet is the phone layout; only web changes.** On web the answers sit in a card beside the question, with no bottom sheet and no drawn keyboard, and the Welcome splits as Login's does. (2026-10-02)
20. **On web the longer versions fill in live,** beside their fields, with no button. On phone and tablet a button applies the answers. (2026-10-02)
21. **Google and Apple sign up on Account,** the same buttons as Login's, and any account they give is accepted. A typed email is confirmed on a page of its own by a 6-digit code, the same as Login's; Google and Apple pass it, because they have confirmed the address already. A wrong or expired code uses Login's screens and rules: the error under the cells, which clear, and after five wrong tries or 10 minutes **That code has expired** with **Send a new code**. (2026-10-08)
22. **Forty words or fewer on every screen,** counting the page's own words, not the options, buttons or the person's own words (4.10). (2026-11-12)
24. **Where are you today? comes before Direction,** as many answers as are true, with tick boxes, and Other opening a field for the person's own words. That page only; the other questions keep their pattern. (2026-11-12)
25. **No answer leads out of the person's company.** A move within it is in: "Make a move within my company" (another function, or another part of the business) replaces "Find my next move", and "Get out of where I am" is removed. "Nail an upcoming presentation" drops "board". Find your next direction stays, as the plan for a move inside the company. (2026-11-12)
26. **The plans take the plan briefs' names:** Step Up, Make Your Mark, Make the Move, Lead Where You Are, everywhere a person sees them (onboarding, Home, the Plan page, Profile). The fifth stays Find your next direction until its brief is rewritten. Stages and first steps are not changed yet (open question 12). (2026-11-12)
27. **The person chooses the plan.** Choose your plan replaces the Recommendation and See other plans: five cards, ExecEngine's pick first, marked and chosen to start with, its reason on it; "Whichever you choose, the next few questions make it yours." (2026-11-12)
28. **No deciding question on the influence path.** What's holding you back? is dropped; the influence directions go from narrowing straight to Choose your plan, and "Too junior on paper" no longer sends anyone to Step Up. (2026-11-12)
23. **LinkedIn is not in onboarding.** No Signals step and no upload page; Account goes straight to Direction, and Done does not mention it. It lives on the Signals page. (2026-11-12, reversing "signals come early", 2026-09-24)

---

## 11. Open questions

These are not decided. They need an answer before this is built.

1. **Two plans have no sourced "Why now" data:** Make the Move and Lead Where You Are. The Step Up figure (LinkedIn @Work study, 46%) needs its original date and sample confirmed.
2. **Tap targets.** Most controls are 30 to 40px. They need a 44px tappable area (section 6).
3. **Linking an Apple relay address** to the person's real one later is open, as on Login.
4. **What the invite code does.** The notice says a code "only changes who pays." What the code is, who issues it and how it is checked is not specified.
5. **Leaving part-way.** Whether a person who leaves can return to where they were, and what is kept, is not designed.
6. **Reflections cannot be skipped.** Every other question can. Whether that is intended is not decided.
7. **How the draft and the longer versions are written** for real is not specified. The prototype uses fixed templates with the person's words dropped in.
8. **More plans and options.** The flow has five plans and eight directions. Whether more are wanted, and who writes them, is a content decision.
9. **Status.** The concept is approved, but its status in the manifest stays `draft` until Kate says it has passed final review.
10. **The full privacy promise.** What ExecEngine is now says only "Private. For your eyes only." Where the longer promise (not your employer or manager; everything is yours to keep, edit and export) is said, in onboarding or the product, is not decided.
11. **Later questions that assume leaving the company** (Appendix B): "A move to another company", "Wrong company for it", "Industry is shrinking", "The culture doesn't fit", "Better pay or flexibility", "My industry", "My location", "Actively looking", "Only if the offer's right", "Negotiation or offer", "Job interview". To be changed with the questions (decision 25).
12. **The plans' stages and first steps** still follow onboarding as built (three stages each), not the plan briefs (three to five, and a different first step for Make the Move, Lead Where You Are and Find your next direction). Lining them up changes the Plan page's roadmap. The names already match (decision 26).

---

## Appendices: the content

These tables are the content as built. The full wording of every page, reply and fact is in `mock/onboarding.ts`.

### A. Directions

The first page shows the five **first options**. "None of these? Show me more options" adds the four **held-back options**. Each option has two narrower versions, shown on the second page. The need and the plan follow the option, never the narrower wording.

| Option | Need | Narrower version 1 | Narrower version 2 |
| --- | --- | --- | --- |
| Reach the C-suite within three years | positioning | Become CEO or run a business unit | Become a functional chief, like CMO, CFO or CTO |
| Take on a bigger leadership role | influence | Run a larger team, or more teams | Own a bigger area of the business |
| Be seen as an executive | visibility | Be seen as an executive by my own leadership | Be seen as an executive beyond my company |
| Nail an upcoming presentation *(was "…board presentation")* | preparation | Win backing for a proposal | Present results and the plan ahead with confidence |
| Make a move within my company *(was "Find my next move")* | exploration | Move into another function, like marketing to sales | Move to another part of the business |
| Lead a bigger organization *(held back)* | positioning | Run a larger business or division | Lead across more functions or regions |
| Carry more weight where I am *(held back)* | influence | Have more say in company decisions | Be trusted with bigger, more visible work |
| I'm not sure yet *(shown with the first five from 2026-11-12; was "I do not know yet", held back)* | exploration | Understand why I’ve hit a ceiling | Explore what else is out there |

### B. Questions

**Deciding** questions are asked before the recommendation and can change the plan (see 5.3). **Making it yours** questions are asked after it. "Single" means one answer; "multiple" means as many as are true. Each question shows its **five options** and, after "None of these? Show me more options", its **four held-back options**. A question marked *skipped when* is left out if the person's direction already answers it.

**Need: positioning**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What kind of step up? | Multiple | Making it yours | Bigger team; Broader remit; A seat at the top table; A new title; More budget and say | A move to another company; A bigger P&L; Visibility with the board; A role that doesn’t exist yet |
| When do you want to get there? | Single | Making it yours (skipped when the direction already says it) | Within a year; 1–2 years; 3+ years; No fixed timeline; When the right role opens | Within six months; In about five years; After my next promotion; Depends on the company |
| What’s in the way? | Multiple | Deciding | No clear path up; Nobody sees my work; I can’t make my case; Wrong company for it; My boss isn’t backing me | The role I want is taken; I don’t have the experience yet; A reorganization has stalled things; I don’t know what it would take |

**Need: influence**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| Where do you want more say? | Multiple | Making it yours | My team’s direction; Company strategy; Budget and headcount; Across other teams; Hiring and promotions | Customers and partners; What we make and sell; How we’re organized; Which projects get funded |
| Who do you most need on side? | Multiple | Making it yours | My boss; My boss’s peers; The exec team; My own team; Peers across the company | The CEO; The board; Finance; People outside the company |

**Need: visibility**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| Who needs to see you differently? | Multiple | Making it yours | Leaders in my company; My industry; Recruiters and boards; All of them; Customers and clients | Peers at other companies; Investors; The press and conferences; My own team |
| How do they see you now? | Single | Making it yours | Strong operator; Specialist; Hard worker, low profile; Not sure; Reliable but forgettable | A technical expert; A fixer; More junior than I am; Someone to watch |
| Where do you show up today? | Multiple | Making it yours | Meetings only; LinkedIn now and then; Industry events; Nowhere yet; Speaking or panels | Writing or articles; Podcasts or interviews; Boards or advisory roles; Internal town halls |

**Need: preparation**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What’s coming up? | Multiple | Making it yours (skipped when the direction already says it) | Promotion conversation; Performance review; Board or exec presentation; Negotiation or offer; Job interview | Investor or client pitch; A reorganization; A talk or keynote; A difficult conversation |
| When is it? | Single | Making it yours (skipped when the direction already says it) | This week; This month; Next few months; Not scheduled yet; Tomorrow | In a day or two; In about six months; Next year; It depends on someone else |
| How ready do you feel? | Single | Making it yours | Ready, want a check; Know what, not how; Not sure where to start; Dreading it; Nervous but prepared | Overprepared; Usually winging it; Worried about one person; Haven’t thought about it yet |

**Need: exploration**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What’s making you want a change? | Multiple | Deciding | Hit a ceiling; Lost interest; Industry is shrinking; Life has changed; Passed over for a role | New boss or reorganization; Better pay or flexibility; The culture doesn’t fit; Ready for a new challenge |
| What would you keep? | Multiple | Making it yours | My function; My industry; My seniority; Nothing in particular; My location | My team; My pay; My flexibility; My values |
| How soon? | Single | Making it yours (skipped when the direction already says it) | Actively looking; Within a year; Just exploring; Not sure; When the right thing appears | Within three months; In a year or two; After something big at work; Only if the offer’s right |

### C. Plans

| Plan (formal name) | For when | This week | Why now, with data | The three stages |
| --- | --- | --- | --- | --- |
| **Step Up** (Increase leadership scope) | You’re ready for a bigger role and want the promotion or remit to match. | Write the story of what you lead | Every conversation about a bigger role starts with “what do you lead?” 46% of professionals said they would not feel confident describing their achievements to their dream employer if they met them on the street. — LinkedIn @Work study | First: Say what you lead; Next: Show the proof; Then: Get in front of the deciders |
| **Make Your Mark** (Build executive presence) | You need to be seen, and to have a clear point of view. | Write how you describe yourself | Everything you say in public builds on it. Executive presence accounts for 26% of what it takes to get promoted. — Center for Talent Innovation, survey of 268 senior executives, 2012 | First: Decide what you stand for; Next: Say it in public; Then: Get invited |
| **Make the Move** (Prepare for a career inflection point) | A promotion, review, board presentation or negotiation is coming up. | Write the story you’ll tell in the room | It’s the core of your case, and the thing you’ll rehearse. *Placeholder: a sourced fact is still needed.* | This week: Get the situation on paper; Before the date: Prepare your case; After: Capture what happened |
| **Lead Where You Are** (Strengthen influence in the current organization) | You want to grow where you already are. | Write the story of what you own | Your work gets heard when it’s described in the terms decisions are made in. *Placeholder: a sourced fact is still needed.* | First: Make your work easy to see; Next: Widen who hears about it; Then: Become the go-to |
| **Find your next direction** (Explore and clarify a next direction) | You want a different role here, or aren’t sure yet which. *(2026-11-12; was "You feel stuck but can’t yet name the next role.")* | Write the story of what you’re good at | It shows which strengths go with you anywhere, before you choose where. People who use their strengths every day are six times as likely to be engaged at work. — Gallup, 2015 | First: Work out what travels; Next: Test it cheaply; Then: Choose your direction |
