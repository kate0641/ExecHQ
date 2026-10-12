# Rules for every plan

**Status: draft.** From *ExecHQ: Content and Mapping* (Kate, 12 October 2026). Lines marked **Proposed** are Claude's, for Kate to confirm.

These are the agent's background rules. They are never shown to the user as written. Each plan has its own brief; this page holds what every plan shares.

---

## 1. The V1 plan library

Five plan templates make up V1. They are the routing backbone of onboarding and of every recommendation: each person is on exactly one plan, and every action step comes from that plan's playbook.

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

Every plan brief has the same five parts:

1. **Plan card.** Who it is for, the outcome, common constraints, how people arrive at it, and its stages, each with a success signal.
2. **Action playbook.** The operational layer: for each stage, the action steps the product can recommend, when each becomes appropriate, what counts as done, what evidence ExecHQ keeps, and which plan area and signal it moves. It is conditional logic, not a longer list of tasks.
3. **Signal emphasis.** Which of the six signals each stage leans on.
4. **How the agent behaves** on this plan.
5. **Open questions.**

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

Each plan's signal emphasis matrix gives each signal a role in each stage. The point is to sequence emphasis, not to ask her to work on all six at once. Each signal gets at least one Primary moment somewhere in the plan.

| Label | Meaning |
| --- | --- |
| **Primary** | The plan actively recommends or prioritizes work in this signal during the stage |
| **Foundation** | Define the inputs or readiness needed for later work in this signal |
| **Evidence** | Record, reuse or evaluate the result of earlier work in this signal |

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
