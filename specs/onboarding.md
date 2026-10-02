# Onboarding — interaction spec

Approved concept: **Concept 3 — Guided**, as refined on 2026-10-02. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behaviour is stated under "Prototype versus production", and what is still undecided is listed under "Open questions". Concepts 1 and 2 were not chosen and are archived on the `scratch` branch.

---

## 1. What it is

Onboarding is a person’s first session with ExecHQ. A new person arrives not knowing what ExecHQ is. They leave with an account, a plan they chose, and a first draft of the story of what they lead, all saved, and a short list of what to do next.

It does four jobs, in this order:

1. **Say what ExecHQ is,** plainly, before asking for anything.
2. **Learn where the person wants to go,** and what is in their way.
3. **Give them a plan,** chosen once, then made theirs by a few more questions.
4. **Give them something usable today:** a first draft of their story, with a clear choice of what to do with it next.

The whole flow speaks in ExecHQ's voice, in the third person ("ExecHQ will…"). It explains as it goes: what each thing is, and why it is being asked, until the person has answered, after which the explanation steps aside.

What it deliberately does not do:

- **Connect to anything.** In V1 there is nothing to connect: the only outside data is a LinkedIn analytics spreadsheet the person exports and uploads themselves.
- **Score, rank or compare.** No answer, fact or plan ranks the person against anyone.
- **Post or share anything.** Nothing leaves the person's account.
- **Ask for more than it needs.** An email, a direction, a choice of plan and an answer to each reflection are the only required steps. Every other question can be skipped, and the person can come back to it.
- **Show progress as a number.** There are no step counters or percentages in the flow.

### Where it appears

Onboarding uses the `minimal` chrome with no header: no navigation, no footer line. It is reached from the product's front door and from Login (**Start here**, and **Start fresh** on the "different account" screen; see the Login spec). It ends on **Home** (Homepage Concept 1), reached from the last page's button.

In the prototype the route is `/onboarding/concept-3` and the flow opens on the phone frame.

---

## 2. The flow at a glance

The prototype's step bar names twelve steps. A few pages are reached only from another page and have no step of their own.

| # | Step bar | What happens | Required |
| --- | --- | --- | --- |
| 1 | Welcome | The opening statement | — |
| 2 | What ExecHQ is | What it is, in one page, and the privacy promise | — |
| 3 | Account | Email, and an invite code if they have one | Email |
| 4 | Signals | Optionally bring in LinkedIn numbers. *Aside:* the LinkedIn upload page | No |
| 5 | Direction | Where the person wants to go: pick, then narrow it down | At least one pick |
| 6 | Recommendation | A question about what is in the way (for most directions), then the recommended plan, chosen here. *Aside:* the other plans | Choose a plan |
| 7 | Reflection | One question to sit with, with a reply | An answer |
| 8 | Questions | Up to three "Making it yours" questions, with two more reflections between them | No |
| 9 | Your plan | The plan, tuned to their answers: this week, then the stages | — |
| 10 | Your story | A question to sit with, about saying what they lead | An answer |
| 11 | First draft | The first draft, and the choice of what next. *Asides:* add more detail, longer versions | — |
| 12 | Done | What is saved and what to do next | — |

```
Welcome ─▶ What ExecHQ is ─▶ Account ─▶ Signals ──(Add)──▶ LinkedIn upload ─┐
                                           │◀───────────────────────────────┘
                                           ▼
                                       Direction ─▶ Narrow it down ─┐
                                                                    ▼
                          What's in the way? (deciding question, if the direction has one)
                                                                    ▼
          Recommendation ──(See other plans)──▶ Other plans ──(Use this one)──┐
                │◀──────────────────────────────────────────────────────────────┘
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

- Small label: **ExecHQ**.
- Heading: **Somewhere to work on what comes next.**
- Line: "Your private career advisor that doesn't just show you the way — it works for you and with you to get you there."
- Closing line, in italic serif: "From "I'd like to be" to "I'm going to be.""
- Button: **Get started.**

The same wordmark and line open Login, so a returning person and a new one see one product.

### 3.2 What ExecHQ is

- Label **What ExecHQ is.** Heading: **Crafting a plan for your career and the work to carry it out.**
- Line: "A private career advisor for modern professionals ready to grow, with no agenda but your own."
- Three numbered points, each a heading and a line:
  1. **A plan for where you want to go.** Short-, medium-, and long-term steps with clear benchmarks. Not a list of forty tasks that get you nowhere.
  2. **Work done, not just advice.** Most steps come with artifacts made for you to use: ExecHQ drafts them, you make them yours.
  3. **Something that grows with you.** Finish a step, share what happened, or change direction, and ExecHQ updates the plan.
- **Private by design.** For your eyes only. Not your employer, not your manager, not anyone else. Everything ExecHQ makes is yours to keep, edit, and export.
- Button: **Continue.**

The privacy promise is said here, before anything personal is asked. There is no separate privacy page.

### 3.3 Account

- Label **Your account.** Heading: **First, somewhere to keep all this.** Line: "Your plan and your story are saved to your account, so you can come back to them."
- "Why this matters": "Everything you tell ExecHQ builds on what came before. Your account is how it remembers, and how you come back to it."
- The answer drawer asks **What's your email?** (one field, placeholder you@example.com), with a link **I have an invite code** that opens an invite code field ("I don't have a code" closes it). Button **Continue.**

Rules:

- **Any address is accepted,** work or personal, by decision on 2026-09-22: the account is the person's and they can change the address whenever they like. An empty field shows "We need an email address to create the account."
- **An invite code is optional.** A recognised code is kept. An unrecognised one shows the notice "We do not recognise that code. Check it against the invitation you were sent. You can also continue without one — a code only changes who pays, never what you get." The person can continue either way.
- **Continue sends the answer in one press,** with the keyboard up. Return on a real keyboard does the same.

### 3.4 Signals

- Label **Optional.** Heading: **Start from how you already show up.** Line: "ExecHQ reads how far your posts reach, and who they reach, so your plan starts from where you already are."
- One row: the LinkedIn mark, **LinkedIn**, "Your posts and audience, from the past year." It is not a button.
- "You'll be able to add other signals later." and, with a lock: "Nothing is posted or shared. Delete the file anytime."
- Actions, as equal peers: **Add LinkedIn numbers** and **Skip for now.** Once a file is in, or the steps have been emailed, there is one button, **Continue**, and the row shows a status chip (**Reading…**, **Ready**, **Read**, **Steps sent**) that opens the upload page again.

#### The LinkedIn upload page

Reached from Signals. Label **Optional · LinkedIn.** Heading **Bring in your LinkedIn numbers.** Line: "Export a spreadsheet from LinkedIn and add it here. About a minute, on a computer."

- Three steps: **1.** Open your LinkedIn analytics (a link that opens LinkedIn in a new tab). **2.** At the top, choose **Past 365 days.** **3.** Press **Export**, then **Confirm.** A spreadsheet downloads.
- A disclosure, **I don't see Export**: "Analytics show once you've posted at least once. If you haven't posted yet, leave this for now: your plan will help you start."
- **Upload the spreadsheet** (the page's main button, with the hint "The spreadsheet from step 3") opens a real file picker for `.xlsx` and `.xls` files.
- **On your phone? Email me these steps** sends the steps to the address given. The page then says "Sent to {email}. Do it on your computer when you're ready. It'll be on your plan too."
- **Not now** (a quiet secondary at the foot) goes back to Signals.

What the file does:

| State | What the person sees |
| --- | --- |
| Reading | "Reading it now. Carry on, and it'll be ready by the time you need it." with a progress bar. The person can carry on at once. |
| Ready | "{n} posts and your audience, from the last year." |
| No posts | "Read it. No posts in the last year, so there's nothing to measure yet. Your plan will help you start." |
| Wrong file | "That doesn't look like a LinkedIn analytics export. It should be the .xlsx from step 3. Try again, or leave it for now." |
| Failed | "That didn't upload. Nothing was saved. Try again, or carry on without it." |

Reading happens in the background and never makes the person wait. Once a file is in, the page shows its name and status, **Choose a different file**, and **Continue,** which returns to Signals.

### 3.5 Direction

The first question that matters. The heading is **Where do you want to go next?** with "Pick as many as are true." The "Why this matters" note says: "Everything ExecHQ builds points here. Pick all that are true, and it will start with the one that matters most." The answers come up in the drawer.

**Page one.** Five options, as equal-width buttons, one to a row, and as many as are true can be picked (Appendix A):

- Reach the C-suite within three years
- Take on a bigger leadership role
- Be seen as an executive
- Nail an upcoming board presentation
- Find my next move

Below them: **None of these? Show me more options** (adds four: Lead a bigger organisation; Carry more weight where I am; Get out of where I am; I do not know yet; the button then disappears), and an always-open field, **Or in your own words.** Words typed there count as one more pick. The drawer's peek bar says how many are picked. The button reads **Narrow it down** with one option from the list picked, **Which matters most?** with more than one, and **Continue** if only typed words were given, since there is nothing to narrow and it goes straight on.

**Page two, narrowing.** Each option picked becomes a group of **two more specific versions**, to tap (Appendix A). One is chosen. Typed words from page one appear as their own choice. A field, **Or say what matters most in your own words**, stays open. With several picks the heading is **Which matters most right now?** and the line "ExecHQ will start there, and keep the rest in view." With one pick it is **Which is closest?** and "A little more detail gives ExecHQ a clearer first step."

What is kept:

- The chosen version becomes the person's direction, and reads back in their words. It stands for the option it came from: the plan, the goal and the questions all follow the option (section 5).
- The other picks are kept as "also picked" and said again on the Recommendation.
- Typed words are kept as typed.

### 3.6 What's in the way (the deciding question)

For most directions, one question is asked before the recommendation, because its answer can change the plan. Label **Before ExecHQ recommends anything.** Its heading depends on the direction: **What's in the way?** (a bigger role), **What's holding you back?** (more weight where you are) or **What's making you want a change?** (finding a next move). The line is "Pick as many as are true."

- Five options, multiple choice, and **None of these? Show me more options** (four more). See Appendix B.
- The always-open **Or in your own words** field.
- Buttons: **Next** and **Skip this one.** The person can skip.
- Directions about a coming moment (a board presentation, a review) have no deciding question, and go straight to the Recommendation.

### 3.7 Recommendation: choose the plan

This is where the plan is chosen.

- Label **ExecHQ's recommendation.** The heading is the **plan's name** (for example **Step up**).
- A card: "This plan is for when you're ready for a bigger role and want the promotion or remit to match." Then the reason, built from what the person said: their direction, then what is in their way, then "That's what this plan is for." If an answer sent the plan somewhere else, that answer's own reason is used.
- If other directions were picked: "You also picked: {them}. ExecHQ will keep {it/them} in view as your plan grows."
- "A plan is how you get from where you are to where you want to be. Yours has two parts." with two numbered lines: **This week:** the one thing to do first. **Three stages:** what your plan builds toward, in order, each with a finish line. When they're done, ExecHQ plans the next stretch with you.
- "Next, a few quick questions to make it yours."
- Buttons: **Use this plan** and **See other plans.**

**See other plans** opens the five plans as cards to compare (Appendix C), with ExecHQ's recommendation marked. Choosing one and pressing **Use this one** chooses it and **goes straight on** to the next page. It does not return to the Recommendation. If the person chose a different plan, the Recommendation (if they come back to it) says "You chose this one instead. ExecHQ recommended {plan}."

### 3.8 Reflection and the questions that make it yours

After the plan is chosen, up to three more questions make it the person's own. Before each one, a **reflection:** a question to sit with, not needed for the plan.

Order, with up to three of each: **Reflection (time) → Question → Reflection (CEO) → Question → Reflection (manager) → Question.** A reflection is only ever asked before a question, so if a direction has fewer than three questions, the reflection that would have come before the missing question is left out too.

**A reflection.** Label **A question to sit with.** Heading and line are the question. "Why this matters" is shown until it is answered. Four options (three for the story question) as equal-width buttons, plus the always-open **Or in your own words** field. **Answer** sends it. After answering:

- The line and the "Why this matters" note go away.
- A quiet line shows **You said** with the answer and **Change.**
- ExecHQ's reply appears as a pull quote in serif, one or two sentences, one reply per option, and a generic reply for typed words.
- A **Worth knowing** card gives a sourced fact (rules in 4.6).
- **Continue** stays pinned at the foot.

The reflections are:

| Reflection | Question | Options |
| --- | --- | --- |
| Time | How much time do you spend on your career each week? | None, honestly; Under an hour; An hour or two; More than that |
| CEO | If your CEO described what you do, would they get it right? | Yes, exactly; Roughly; Probably not; They don't know me |
| Manager | When did you last talk to your manager about what's next for you? | This month; In the last six months; Over a year ago; Never, really |
| Story (step 10) | Could you say what you lead in one sentence, right now? | Yes, easily; Roughly; Not really |

**The questions** use the same pattern as Direction and the deciding question: equal-width options, an open own-words field, five options and **None of these? Show me more options.** The **list-type** questions take several answers ("Pick as many as are true."). The **scale-type** questions, where each option is a point on a line, take one. Buttons: **Next** and **Skip this one.** The full list, by direction, is in Appendix B.

### 3.9 Your plan

The plan, tuned to what the person said. Two pages.

**Page one: This week.** Label **Your plan.** Heading **This week.** Line "Here's your plan, tuned to what you've said, one part at a time."

- **Built from what you said:** a short list of the person's answers, each with a **Change** link. The first row is their direction. The rest are the questions they answered. **Change** on a question goes to that question and returns here when it is answered. **Change** on the direction starts the questions again from Direction, with their picks kept; a new direction clears the plan they chose for the old one.
- A dark card with **the one task to do first** (for example "Write the story of what you lead"), a line of detail, **Why now:** a short reason, and the **data** behind it with its source (see 4.6).
- Button **Next part.**

**Page two: Three stages.** Heading **Three stages**, with "Each stage sets up the next, so the effort adds up." and "Stage by stage, toward {the goal}."

- Three stages, each with its name, what the person will have, and **Done when:** a checkable finish line. The first stage is marked **First · This week**, so the task on the first page is seen as the first step of stage one.
- A closing line: "Once these stages are done, ExecHQ will plan the next stretch with you, based on what worked and what didn't. It sharpens as you go: every draft you make and every conversation you log tells ExecHQ what to do next."
- Button **Continue.**

A plan has no end date and no length. A stage is never given a deadline.

### 3.10 Your story

**The question.** The reflection above: "Could you say what you lead in one sentence, right now?" with "Out loud, to someone who's never met you." It behaves as in 3.8. Its fact is Gallup's: only 46% of U.S. employees clearly know what is expected of them at work (2025).

**The first draft.** Label **Your story.** Heading **Here's your first draft.** It is written at once from what the person has already said. The line is "A start, from what you've shared. Add your role and a result to say what you lead." until they add detail, after which it says "Written from what you've shared, with the detail you added."

- The draft, in the person's voice ("I'm building toward a C-suite role within the next three years. What I want next is…"), with **Edit.** An edited draft is kept as written until the detail changes and the draft is rewritten.
- **Where you could use it:** three uses, from the plan.
- **Copy, Download, Email it to me.**
- "Why this matters": "You can use this today. Add detail or build longer versions now, or come back to them from your plan."
- **What next?** at the foot, three equal choices, each a full-width outlined button with a line saying what it does:
  - **Add more detail:** "Your role, what you're responsible for and a result, so it says what you lead."
  - **Build out longer versions:** "Short, medium and long, for a bio, an introduction or LinkedIn."
  - **Save it and come back later:** "It's saved. Both of these wait for you as next steps on your plan."

None is the default, so leaving it for later is a real choice.

**Add more detail.** Label **Your story.** Heading **Three things only you know.** Line "Your role, what you're responsible for, and one result. Skip any you like." Each is asked in turn in the drawer ("1 of 3"): **What's your current role? What are you responsible for? What's a result you're proud of?** Each has **Skip** and **Next**; the last has **Write my draft.** A card shows what good looks like for the question being asked (for example "VP of Marketing, leading brand and demand."). Writing the draft shows "Writing your first draft", then the rewritten draft. A hand edit is replaced, because the draft is written again from the facts. It returns to wherever it was opened from.

**Longer versions.** Label **Your story.** Heading **Longer versions.** Line "The same story in three lengths, for different places: a line, a paragraph and the full bio."

- A switch for **Short / Medium / Long** shows the same story at each length. A fact ExecHQ doesn't know yet is a **dashed gap** ("To add: your name"), never something made up.
- When there are gaps: "The dashed parts are things ExecHQ doesn't know yet. Add them below, or add more detail to your story." and a drawer, **What's missing from your bio?**, asks for **Your name**, **How big is your team?** (five choices) and **What you're strongest at** (up to three of seven). **Update my bio** fills the gaps. **Add more detail** goes to the three questions above and returns here.
- **Copy, Download, Email it to me.**
- Buttons: **Save it and finish** and **Back to my draft.**

### 3.11 Done

- Label **You're set up.** Heading **Your plan and story are saved.** Line: "You've done the hardest part: saying where you want to go."
- A numbered list, **What to do next**, in a card in the middle of the page, showing only what is left, in this order:
  1. **Add more detail,** if the draft has no role or result yet.
  2. **Build longer versions,** if they have not been opened.
  3. The plan's **next stage** (its name and first outcome).
  4. **Bring in your LinkedIn numbers,** if they have not come in.
- Button **Go to my homepage.**

The list shrinks as steps are done. It never repeats what the person has just seen, and it does not summarise their answers: the plan page already did.

---

## 4. Rules for every page

### 4.1 Page anatomy

Every page after the Welcome is one **guide page**, in this order: a small label; the heading; an optional line; the page's own content; the **"Why this matters"** note; the actions. Where a page asks a question, its answers come up in a **drawer** pinned under the page.

- **Heading.** One level-1 heading per page. When the page changes, focus moves to it.
- **"Why this matters."** A short note saying why the page exists. It is shown before a question is answered and removed after (on reflections), and is left off pages where there is nothing being asked.
- **Actions** sit at the foot. The primary is a filled button. A skip or alternative is a peer of the same size beside or beneath it, never a smaller link, so skipping reads as a real choice. Where a page's real action is in its body, the foot offers only a quiet way past it.
- **Pinned.** The drawer's buttons stay pinned at its foot, and the **Continue** on an answered reflection stays in reach at the foot of the screen, so a long page never hides the way on.

### 4.2 The answer drawer

- **Open** by default when a page arrives. It carries only the answer; the question and its reason stay on the page above, so the two are read together.
- **Fold.** A handle folds the drawer to a **peek bar** carrying the question and a status ("Tap to answer", "3 picked", "Answered"); the bar brings it back. Both are real buttons, so nothing needs dragging (WCAG 2.2 SC 2.5.7).
- **The keyboard.** While a text field in the drawer has focus, a drawn phone keyboard sits under it, with its return key labelled with the drawer's button. Pressing the return key, pressing Return on a real keyboard, or pressing the drawer's own button all send the answer, and none of them first closes the keyboard. If drawer and keyboard together are taller than the screen, the drawer scrolls and its buttons stay pinned at its foot.
- **One press.** Pressing a button in the drawer never takes focus from the field, so the press always lands.

### 4.3 The answer pattern

Used by Direction, the deciding question, the "Making it yours" questions and the reflections:

1. **Options** are equal-width buttons, one to a row, never wrapping tags.
2. **Own words** is an always-open field under the options. What is typed counts as an answer, and is kept in the person's words.
3. **Five options and a way to more.** Where the options are a list, five are shown and **None of these? Show me more options** adds four. It disappears once used.
4. **Several or one.** List-type questions take as many as are true. Scale-type questions take one. Where one answer is expected, choosing another replaces the first.
5. **A way past.** Questions have **Skip this one.** Only an email, a direction, and the reflections' answers are required.

### 4.4 Voice

- **ExecHQ speaks in the third person.** "ExecHQ will draft that sentence for you next." The product never says "I".
- **The person's own words stay in the first person:** the options they pick ("Find my next move"), their drafts, their typed answers.
- **"We" is not used** for ExecHQ. ("Before we begin" and similar inclusive uses were removed.)
- **No pressure and no scoring.** Replies are warm and specific, never ranking.

### 4.5 Explanation steps aside

What a page explains is said once, and in one place: what a plan is, at the choice; what ExecHQ heard, on the plan page; why a question is asked, before it is answered. After an answer, the page does not repeat the explanation.

### 4.6 Facts and data

Every figure shown as data is **real, sourced and shown with its source.** It appears on the reflections ("Worth knowing") and under the plan's "Why now." A fact never ranks the person against others. Until a fact is found, the card shows a **marked placeholder** ("A sourced fact is needed here") in a dashed box that cannot be mistaken for copy. See Open questions for which are still placeholders.

### 4.7 Waiting

Where ExecHQ writes something, a short state names it. The draft shows "Writing your first draft", for 1.1 seconds in the prototype. The LinkedIn file reads in the background for 8 seconds and the person is never kept waiting for it.

### 4.8 Focus and announcements

- Each time the page changes, focus moves to the new page's heading. It does not move on first paint.
- The heading shows a visible focus ring when it takes focus from the keyboard.
- Confirmations (copied, emailed, sent) are announced politely.

---

## 5. How it decides

### 5.1 From direction to plan

Every direction has a **need.** The need picks the recommended plan.

| Need | Recommended plan |
| --- | --- |
| positioning | Step up |
| influence | Grow your influence where you are |
| visibility | Build your executive presence |
| preparation | Get ready for a big moment |
| exploration | Find your next direction |

- An option from the list has its own need (Appendix A). Rewording an option, or choosing a narrower version, never changes it.
- **Typed words** are matched to a need by meaning. The prototype uses keyword tests as a stand-in: a coming promotion conversation, review, board or interview is *preparation*; "I don't know", a ceiling, "out of" or "next move" is *exploration*; being seen or read as an executive is *visibility*; influence, weight or "where I am" is *influence*; leading, a bigger scope, the C-suite is *positioning*, which is also the default. Production uses real interpretation. The outcomes in this spec are the requirement, not the keywords.

### 5.2 Which questions are asked

The need also picks the questions (Appendix B). Each need has three, of which at most one is the deciding question.

| Need | Deciding question | Making it yours |
| --- | --- | --- |
| positioning | What's in the way? | What kind of step up? When do you want to get there? |
| influence | What's holding you back? | Where do you want more say? Who do you most need on side? |
| visibility | none | Who needs to see you differently? How do they see you now? Where do you show up today? |
| preparation | none | What's coming up? When is it? How ready do you feel? |
| exploration | What's making you want a change? | What would you keep? How soon? |

A question is left out when the person's own words already answer it (a date, or the moment itself).

### 5.3 The question that can change the plan

Three answers, if chosen, send the plan somewhere else. The reason shown is theirs.

| Question | Answer | Plan becomes | Reason shown |
| --- | --- | --- | --- |
| What's in the way? | Nobody sees my work | Build your executive presence | The results are there. What's missing is being seen by the people deciding, and that's what this plan is for. |
| What's in the way? | Wrong company for it | Find your next direction | If the next step may not be where you are, it's worth working out the direction before making the case. |
| What's holding you back? | Too junior on paper | Step up | Your title undersells what you do, so the case for a bigger role comes first. |
| What's making you want a change? | Hit a ceiling | Step up | A ceiling is a scope problem. Making the case for a bigger role comes before looking elsewhere. |

If several answers are chosen, **the first one chosen that changes the plan decides.** The recommendation is made once, after this question. Nothing asked later can reverse it.

### 5.4 Several answers

A question can hold several chosen options and typed words. Each chosen option adds its own sentence to what ExecHQ says back ("Right now nobody sees your work. The results are there…"), in the order chosen, and its own line to the first draft ("The results are there. My focus now is making sure the people who decide can see them."). Typed words are said back in the person's words, turned from "I" to "you."

### 5.5 Choosing and changing the plan

- The plan is chosen once, on the Recommendation. Choosing another plan from **See other plans** is the same act.
- The questions after personalise the plan the person chose. They never change which plan it is.
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
| Content column | At most 68ch, centred | `--content-measure` |
| Page padding | 24px sides | `--space-lg` |
| Gap between items on a page | 24px | `--space-lg` |
| Option buttons | Full column width, one to a row | none |
| Drawer top corners | 20px | `--radius-xl` |
| Drawn keyboard | Four rows, about 256px tall | none (fixed) |
| Generating state | 1.1 seconds (prototype) | none |
| LinkedIn file read | 8 seconds, in the background (prototype) | none |
| Focus ring | 1.5px solid, 2px offset | `--focus-ring`, `--focus-ring-offset` |

All colours, type, spacing, radii, borders and shadows are tokens. No colour is hard-coded. The product is built in greyscale first, with colour switched on from the dock.

### Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Arrangement | One column, the width of the screen less 24px each side | One column, centred, at the content measure | One column, centred, at the content measure |
| Drawer | Pinned under the page, full width | Pinned under the page; its contents keep to the reading width | Same as tablet |
| Welcome | Statement vertically centred | Same | Same |

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. Onboarding opens on the phone frame.

### Touch targets

Every interactive control is meant to be at least **44 × 44px** (`--button-target`) on every viewport, as in the Login and Profile specs. WCAG 2.2 AA requires only 24px (SC 2.5.8). 44px is the ExecHQ standard because the product is used one-handed.

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
- **Labels.** Every field and every group of options has a visible or accessible name. The own-words fields are labelled "Or in your own words."
- **Keyboard.** Everything works with a keyboard alone. Tab order follows reading order. Return sends a one-line answer. The drawn keyboard and its return key are decoration for sighted mouse users: hidden from assistive technology and out of the tab order.
- **Focus** is visible on every control, and moves to the heading when the page changes.
- **Contrast.** Text 4.5:1 and non-text 3:1 in greyscale and in colour. The dark card and the dark option buttons meet it.
- **Not by colour alone.** A chosen option is shown by fill and by its pressed state, not colour. A placeholder fact is shown by a dashed border and its words.
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
| `GuidePage` | The page: label, heading, line, content, "Why this matters", actions, and the drawer. |
| `AnswerDrawer`, `DeviceKeyboard` | The drawer that carries the answer, and the drawn keyboard. |
| `ChipGroup`, `Input`, `ToggleGroup` | The options (equal-width, single or several), the fields, and the length switch. |
| `PointList`, `RecommendationCard`, `ReflectionReply` | Numbered points and the private promise; the plan card; the pull-quote reply and its fact. |
| `ThisWeekCard`, `StoryDraft`, `StoryText`, `ExportLinks`, `NextSteps` | The task card with its data; the editable draft; the story with its gaps; Copy, Download and Email; the "What next?" choices. |
| `SignalSources`, `LinkedInUpload`, `LinkedInSteps` | The LinkedIn row, and the upload page and its steps. |
| `PlanTemplateCard`, `GoodExample`, `GeneratingState`, `Notice` | The other plans; what good looks like; the waiting state; the invite-code notice. |
| `Button` | Every button. |

`flows/onboarding/shared` holds the answers and their rules, and `mock/onboarding.ts` holds every word and option, which is why the appendices here can be checked against it.

---

## 9. Prototype versus production

| Prototype | Production |
| --- | --- |
| Nothing is stored. Answers live in the page and are lost on reload. | The account is created and the flow can be resumed (see Open questions). |
| Any non-empty email is accepted. Any invite code is accepted. | Any address is accepted, as decided. The invite code is checked, and an unrecognised one shows the notice. |
| Nothing is sent. "Email me these steps", "Email it to me" and "Download" confirm what they would do. | They send and download for real. |
| The LinkedIn file is never read, only named. Reading is a timer. | The file is read and the figures are used for the plan and the drafts. |
| Typed directions are matched to a need by keyword tests. | Typed directions are interpreted properly. |
| The first draft, the versions and the replies are written from fixed templates. | They are written for the person (the generation approach is not specified here). |
| A drawn keyboard appears under the drawer when a field has focus. | The real keyboard. The drawn one is not built. |
| A step bar above the canvas jumps to any step, filling in sample answers, and a dock switches viewport and colour. | Neither exists. People move only forward, or back through **Change.** |
| Plans, options and replies are the fixed content in Appendices A to C. | Content for more plans and options is a content decision (Open questions). |
| Two plans' "Why now" data are placeholders. | Every figure is real and sourced before this ships. |

---

## 10. Decisions

These are settled. They are the specified behaviour. The dates are when they were made.

1. **Concept 3 is the onboarding.** (2026-10-02)
2. **ExecHQ speaks in the third person,** and the person's own words stay in the first. (2026-10-02)
3. **The plan is chosen at the Recommendation,** with what a plan is said there, before the personalising questions. Choosing another plan goes straight on. (2026-10-02)
4. **The question that can change the plan is asked before the recommendation,** so it is made once. (2026-09-30)
5. **The read-back page is gone.** What ExecHQ heard is a list on the plan page, each row with a way to change it. A free-text edit that changed nothing downstream is removed. (2026-10-02)
6. **The plan is two pages:** this week, then three stages with a finish line each. No part counters. A plan has no end date. (2026-10-02, 2026-09-29)
7. **One answer pattern across the flow:** equal-width options, an open own-words field, five options and a way to more, several answers for lists and one for scales. (2026-10-02)
8. **Direction is two steps:** pick, then narrow each pick to one of two more specific versions. (2026-10-02)
9. **The first draft comes first,** then a choice: add detail, build longer versions, or save and come back. The three detail questions are not put in front of the draft. (2026-10-02, reversing the order tried earlier that day)
10. **Data is real or marked.** A figure is shown with its source, or as a placeholder. (2026-10-02)
11. **Nothing is connected in V1.** LinkedIn is a spreadsheet the person uploads. (2026-09-28)
12. **Any email is accepted,** work or personal. (2026-09-22)
13. **Privacy is said once, on "What ExecHQ is,"** before anything personal is asked. (2026-10-02)
14. **The Done page lists only what is left,** and does not repeat what the person has seen. (2026-10-02)
15. **No step counters, percentages or scores** appear anywhere in the flow.

---

## 11. Open questions

These are not decided. They need an answer before this is built.

1. **Two plans have no sourced "Why now" data:** Get ready for a big moment and Grow your influence where you are. The Step up figure (LinkedIn @Work study, 46%) needs its original date and sample confirmed.
2. **Tap targets.** Most controls are 30 to 40px. They need a 44px tappable area (section 6).
3. **How the account is made and signed in to.** The email is asked here, but nothing says whether it is verified at this point or only on the person's next sign-in by the emailed code (see the Login spec).
4. **What the invite code does.** The notice says a code "only changes who pays." What the code is, who issues it and how it is checked is not specified.
5. **Leaving part-way.** Whether a person who leaves can return to where they were, and what is kept, is not designed.
6. **Reflections cannot be skipped.** Every other question can. Whether that is intended is not decided.
7. **How the draft and the longer versions are written** for real is not specified. The prototype uses fixed templates with the person's words dropped in.
8. **More plans and options.** The flow has five plans and nine directions. Whether more are wanted, and who writes them, is a content decision.
9. **Status.** The concept is approved, but its status in the manifest stays `draft` until Kate says it has passed final review.

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
| Nail an upcoming board presentation | preparation | Win the board’s backing for a proposal | Present results and the plan ahead with confidence |
| Find my next move | exploration | Move to a new company in my field | Move into a different role or industry |
| Lead a bigger organisation *(held back)* | positioning | Run a larger business or division | Lead across more functions or regions |
| Carry more weight where I am *(held back)* | influence | Have more say in company decisions | Be trusted with bigger, more visible work |
| Get out of where I am *(held back)* | exploration | Leave my industry for something new | Leave my company, but stay in my field |
| I do not know yet *(held back)* | exploration | Understand why I’ve hit a ceiling | Explore what else is out there |

### B. Questions

**Deciding** questions are asked before the recommendation and can change the plan (see 5.3). **Making it yours** questions are asked after it. "Single" means one answer; "multiple" means as many as are true. Each question shows its **five options** and, after "None of these? Show me more options", its **four held-back options**. A question marked *skipped when* is left out if the person's direction already answers it.

**Need: positioning**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What kind of step up? | Multiple | Making it yours | Bigger team; Broader remit; A seat at the top table; A new title; More budget and say | A move to another company; A bigger P&L; Visibility with the board; A role that doesn’t exist yet |
| When do you want to get there? | Single | Making it yours (skipped when the direction already says it) | Within a year; 1–2 years; 3+ years; No fixed timeline; When the right role opens | Within six months; In about five years; After my next promotion; Depends on the company |
| What’s in the way? | Multiple | Deciding | No clear path up; Nobody sees my work; I can’t make my case; Wrong company for it; My boss isn’t backing me | The role I want is taken; I don’t have the experience yet; A reorganisation has stalled things; I don’t know what it would take |

**Need: influence**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| Where do you want more say? | Multiple | Making it yours | My team’s direction; Company strategy; Budget and headcount; Across other teams; Hiring and promotions | Customers and partners; What we make and sell; How we’re organised; Which projects get funded |
| Who do you most need on side? | Multiple | Making it yours | My boss; My boss’s peers; The exec team; My own team; Peers across the company | The CEO; The board; Finance; People outside the company |
| What’s holding you back? | Multiple | Deciding | I’m not in the room; I’m in the room but not heard; Too junior on paper; Politics; Decisions are made before the meeting | I’m seen as too operational; The company moves slowly; I don’t know who really decides; I’m new here |

**Need: visibility**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| Who needs to see you differently? | Multiple | Making it yours | Leaders in my company; My industry; Recruiters and boards; All of them; Customers and clients | Peers at other companies; Investors; The press and conferences; My own team |
| How do they see you now? | Single | Making it yours | Strong operator; Specialist; Hard worker, low profile; Not sure; Reliable but forgettable | A technical expert; A fixer; More junior than I am; Someone to watch |
| Where do you show up today? | Multiple | Making it yours | Meetings only; LinkedIn now and then; Industry events; Nowhere yet; Speaking or panels | Writing or articles; Podcasts or interviews; Boards or advisory roles; Internal town halls |

**Need: preparation**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What’s coming up? | Multiple | Making it yours (skipped when the direction already says it) | Promotion conversation; Performance review; Board or exec presentation; Negotiation or offer; Job interview | Investor or client pitch; A reorganisation; A talk or keynote; A difficult conversation |
| When is it? | Single | Making it yours (skipped when the direction already says it) | This week; This month; Next few months; Not scheduled yet; Tomorrow | In a day or two; In about six months; Next year; It depends on someone else |
| How ready do you feel? | Single | Making it yours | Ready, want a check; Know what, not how; Not sure where to start; Dreading it; Nervous but prepared | Overprepared; Usually winging it; Worried about one person; Haven’t thought about it yet |

**Need: exploration**

| Question | Kind | Asked | Options | Held back |
| --- | --- | --- | --- | --- |
| What’s making you want a change? | Multiple | Deciding | Hit a ceiling; Lost interest; Industry is shrinking; Life has changed; Passed over for a role | New boss or reorganisation; Better pay or flexibility; The culture doesn’t fit; Ready for a new challenge |
| What would you keep? | Multiple | Making it yours | My function; My industry; My seniority; Nothing in particular; My location | My team; My pay; My flexibility; My values |
| How soon? | Single | Making it yours (skipped when the direction already says it) | Actively looking; Within a year; Just exploring; Not sure; When the right thing appears | Within three months; In a year or two; After something big at work; Only if the offer’s right |

### C. Plans

| Plan (formal name) | For when | This week | Why now, with data | The three stages |
| --- | --- | --- | --- | --- |
| **Step up** (Increase leadership scope) | You’re ready for a bigger role and want the promotion or remit to match. | Write the story of what you lead | Every conversation about a bigger role starts with “what do you lead?” 46% of professionals said they would not feel confident describing their achievements to their dream employer if they met them on the street. — LinkedIn @Work study | First: Say what you lead; Next: Show the proof; Then: Get in front of the deciders |
| **Build your executive presence** (Build executive presence) | You need to be seen, and to have a clear point of view. | Write how you describe yourself | Everything you say in public builds on it. Executive presence accounts for 26% of what it takes to get promoted. — Center for Talent Innovation, survey of 268 senior executives, 2012 | First: Decide what you stand for; Next: Say it in public; Then: Get invited |
| **Get ready for a big moment** (Prepare for a career inflection point) | A promotion, review, board presentation or negotiation is coming up. | Write the story you’ll tell in the room | It’s the core of your case, and the thing you’ll rehearse. *Placeholder: a sourced fact is still needed.* | This week: Get the situation on paper; Before the date: Prepare your case; After: Capture what happened |
| **Grow your influence where you are** (Strengthen influence in the current organisation) | You want to grow where you already are. | Write the story of what you own | Your work gets heard when it’s described in the terms decisions are made in. *Placeholder: a sourced fact is still needed.* | First: Make your work easy to see; Next: Widen who hears about it; Then: Become the go-to |
| **Find your next direction** (Explore and clarify a next direction) | You feel stuck but can’t yet name the next role. | Write the story of what you’re good at | It shows which strengths go with you anywhere, before you choose where. People who use their strengths every day are six times as likely to be engaged at work. — Gallup, 2015 | First: Work out what travels; Next: Test it cheaply; Then: Choose your direction |
