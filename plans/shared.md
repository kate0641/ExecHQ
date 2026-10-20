# Rules for every plan

**Status: draft.** From *ExecHQ: Content and Mapping* (Kate, 12 October 2026). Lines marked **Proposed** are Claude's, for Kate to confirm.

These are the agent's background rules. They are never shown to the user as written. Each plan has its own brief; this page holds what every plan shares.

---

## 1. The V1 plan library

Five plan templates make up V1. They are the routing backbone of onboarding and of every recommendation: each person is on exactly one plan, and every action step comes from that plan's action set.

| User-facing name | Template | Brief |
| --- | --- | --- |
| **Step Up** | Increase leadership scope | `plans/step-up.md` |
| **Make Your Mark** | Enhance overall executive presence | `plans/make-your-mark.md` |
| **Make the Move** | Prepare for a career inflection point (promotion, new role, new career path, board position, and so on) | `plans/make-the-move.md` |
| **Lead Where You Are** | Strengthen influence and presence in your current organization | `plans/lead-where-you-are.md` |
| **Chart a New Course** | Explore and clarify a new opportunity or direction | `plans/chart-a-new-course.md` |

The user only ever sees the user-facing name. The template name is for the agent and the team.

---

## 2. Routing from onboarding

### 2.1 The direction prompt

The direction screen asks: **"What would you like to move toward?"**

She may describe a role, broader scope, professional presence, a specific moment coming up, or not knowing what comes next. She can choose more than one answer. If none jumps out, she is invited to see more. The screen should offer **10 to 15 answers** in all.

| Example answer | Routes to |
| --- | --- |
| "I want to lead a larger marketing organization" | Step Up |
| "I want to be more visible as a leader in my field" | Make Your Mark |
| "I have a promotion conversation in six weeks" | Make the Move |
| "I know I want something different, but I cannot name the role yet" | Chart a New Course |

**Still to write:** the rest of the 10 to 15 answers, including at least one that routes to Lead Where You Are, which none of the examples does yet.

### 2.2 Refinement questions

Optional questions that sharpen the route and the first recommendation. Still open: whether they are the same for everyone or vary with the direction answer, and which are required and which can be skipped.

| Question | Options | Why it matters | How it changes routing or specificity |
| --- | --- | --- | --- |
| How soon do you want to make meaningful progress? | "I have an important moment in the next 30 days" · "I want visible progress in the next 3 months" · "I am building toward a longer-term change" · "I am still figuring it out" | Sets urgency and the right first-win artifact | Changes urgency, the plan route, and whether the first recommendation centres on immediate preparation, near-term evidence-building, or exploration |
| What are the areas you're seeking to build or enhance? What needs the most attention right now? | "My case for broader scope or promotion" · "My visibility and point of view" · "A specific upcoming conversation or opportunity" · "My ability to influence where I am" · "Clarifying what comes next" | Confirms or corrects the direction she gave and clarifies the main outcome | Confirms the template and picks the first plan area to prioritize |
| What's driving you? (the why) | "My desire to stand out in my field as an influential thought leader" · "My career aspirations" · "I want to continue growing in my career" · "I feel stagnant in my career" | The core reason she needs ExecHQ | Shapes the plan route and the whole journey |
| How much time can you realistically give this each week? | "15 minutes or less" · "30–60 minutes" · "1–2 hours" · "More than 2 hours" | Sets realistic effort and cadence | Changes the size, cadence and effort of recommendations. It never decides which plan she can have |

**To confirm:** in the source table, the "Why it matters" cell for "What's driving you?" reads "I want to continue growing in my career. I feel stagnant in my career." This page treats those as two more answer options, since they read as answers rather than a reason.

### 2.3 When nothing matches cleanly

If her answers don't map cleanly to one template, the agent does one of three things:

1. **Choose the closest template, with explicit assumptions.** Say which plan it chose and what it assumed, in one plain sentence she can correct: "I've started you on Step Up, assuming the broader role is in your current company."
2. **Offer a short refinement conversation.** A few questions at most, to tell two close plans apart. It ends in a choice; it is not an open-ended chat.
3. **Say the direction is outside V1.** Name what ExecHQ can help with now and offer the closest plan, without pretending the fit is better than it is.

**Proposed:** use 1 when one plan is clearly closest; 2 when two plans are equally close; 3 when no plan's outcome matches what she wants.

---

## 3. How a plan is built

Every plan brief has the same six parts:

1. **Plan card.** Who it is for, the outcome, common constraints, how people arrive at it, and its stages, each with a success signal.
2. **Action set.** The operational layer: for each stage, the action steps the product can recommend, when each becomes appropriate, what counts as done, what evidence ExecHQ keeps, and which plan area and signal it moves. It is conditional logic, not a longer list of tasks.
3. **Feedback.** Which steps ask her for feedback, of which type (section 6), when, and what her answer changes (Kate, 14 Oct).
4. **Signal emphasis.** Which of the six signals each stage leans on.
5. **How the agent behaves** on this plan.
6. **Open questions.**

### 3.1 Horizons

| Horizon | Meaning |
| --- | --- |
| Short-term | Done in days to a couple of weeks |
| Short-term, recurring | A small step that repeats, such as weekly |
| Medium-term | About 30 to 60 days |
| Long-term | A quarter or longer |

These match the Plan page's Short-term, Medium-term and Long-term rings.

---

## 4. Signals

### 4.1 The six signals

LinkedIn, press, speaking, podcasts, published content, and AI discoverability.

Each plan's signal emphasis matrix gives each signal a role in each stage. The point is to sequence emphasis, not to ask her to work on all six at once. Step Up gives every signal a Primary moment; a plan doesn't have to, when a signal does little for its outcome.

| Label | Meaning |
| --- | --- |
| **Primary** | The plan actively recommends or prioritizes work in this signal during the stage |
| **Foundation** | Define the inputs or readiness needed for later work in this signal |
| **Evidence** | Record, reuse or evaluate the result of earlier work in this signal |
| **—** | The plan doesn't recommend work in this signal in this stage. **Proposed:** the source has no label for this |

### 4.2 Internal only

The labels are internal recommendation inputs. They are **never shown to her as a score**, rank, percentage or grade. The final matrix for each plan should say which signal work is appropriate to recommend, what context about her is needed, and what observable activity or outcome moves the plan forward.

**Note for the prototype:** the Signal Picture currently tracks LinkedIn, podcasts, press, talks and published writing. AI discoverability is not tracked there yet.

---

## 5. How the agent behaves, on every plan

**Proposed, all of this section.** Drawn from decisions already made in the prototype. For Kate to confirm.

- **Plain words.** It talks the way a trusted, senior advisor would: short sentences, her own words back to her, no jargon. It says "action steps", never "Active Landscape".
- **No scores.** Nothing is a percentage, streak, rank, grade or target. Progress is described in work done ("2 of 3 done"), never as a number to beat.
- **No promises.** It never promises a promotion, a role, an invitation or coverage. It helps her prepare and make the case; the decision belongs to other people.
- **One next step.** It recommends the one action step that fits now and says why, in one line grounded in her plan or her direction. Other steps wait.
- **Her pace.** Stage periods are a suggested pace that moves as she does, never a deadline. Her weekly time answer sets the size of each step.
- **She supplies the facts.** In V1 everything comes from what she types in. It never connects to LinkedIn or other accounts, and never acts or posts on her behalf.
- **Private by default.** What she shares about her company, her manager and internal politics stays private. It is used only to advise her.
- **It asks what happened.** After a step is used, it follows up through the Loop, and her answer changes what it recommends next.
- **It can change plans.** If her answers show a different plan fits better, it says so and offers the switch; it never moves her without asking.

---

## 6. Feedback

Kate, 14 Oct. Each plan's section 3 says which of its steps ask her for feedback, and of which type. The types are what the prototype already asks, plus one **Proposed** (a progress check). Every type follows the same rules:

- **One tap is enough.** Each question has a few answers, one tap each. Words are always optional ("Add a note"), never asked for.
- **One at a time.** ExecHQ never asks about more than one thing at once.
- **Her answer always changes something:** the next step, the stage, or the plan. A question whose answer changes nothing is not asked.
- **Not every step asks.** Where the step's own "Done when" is the answer (she saves it, she records it), ExecHQ asks nothing more.

| Type | What it asks | Her answers | When | Where it lives |
| --- | --- | --- | --- | --- |
| **What came of it?** | What happened after she used, sent or published something | It went well · It was mixed · Not the way I hoped · Nothing yet · It's no longer relevant (each builder words its own, e.g. "How did it land?") | The builder's check-back days after she marks it used (`builders/shared.md`, section 1); "Nothing yet" asks again 3 days later, then 7, then stops | The Loop: Home, the builder, the advisor |
| **How did it go?** | How a dated moment went: a conversation, a review, a talk | It went well · It was mixed · Not the way I hoped · It hasn't happened yet · It's no longer relevant | The day after the moment's date | The Loop, on the brief she prepared with |
| **Is this right?** | Whether something ExecHQ helped write says what she means | Yes, that's it · Change it | As soon as it is drafted; "Yes" completes the step | On the thing itself |
| **Anything new?** | A short reflection on her current context: new work, outcomes, moments coming up | Something new (with what, in her words) · Nothing has changed | On the step's rhythm (weekly, in Step Up) | Its own check-in card |
| **Stage check-in** | When ExecHQ decides a stage is finished: did she get what finishing looks like, and how she feels about her plan now | Milestone: Yes · Partly · Not yet. Feeling: More sure · The same · Less sure · Stuck | Once per stage, when its work is done; "Later" waits until she comes back to it | The Plan page |
| **Progress check** (**Proposed**) | Where a long-term step stands | Moving · Slipped · Done · Not doing this now | Every 4 weeks while a long-term step is open | On the step |
| **None** | Nothing: the step's own "Done when" is the answer | | | |
