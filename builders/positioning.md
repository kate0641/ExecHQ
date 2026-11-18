# Positioning Builder

**Makes: her positioning statement, bios in three lengths and a leadership narrative.** Marked used as **Used**.

**Status: draft.** From the *Sprint 4 Experience Brief* and the *Functional Scope* (3.1 Positioning Builder), and what the prototype does today. Lines marked **Proposed** are Claude's, for Kate to confirm. Rules every builder shares are in `builders/shared.md`; this brief has the same seven sections as the other three.

---

## 1. Builder card

| | |
| --- | --- |
| **What it makes** | Her positioning statement (one sentence, carried from onboarding); an executive bio in short, medium and long forms; a leadership narrative (what I do, what I am known for, what I am building toward); an optional introduction for one moment; a recommended next use. |
| **What it is for** | A reusable, executive-level account of who she is, the value she creates and where she is headed. Every other builder draws on it, so it is the one she is most likely to come back to. |
| **When to use it** | Before anything that introduces her: a promotion conversation, a new boss, a conference program. |
| **Use case screen** | "Your positioning statement, a bio in three lengths and a leadership narrative, in your words." / "Use it before anything that introduces you: a promotion conversation, a new boss, a conference program." |

**One artifact, not a copy.** Her onboarding statement is this artifact. Opening Positioning Builder from anywhere opens that statement, with its history: version 1 is the statement as onboarding left it, and building it out adds version 2. It is never started fresh beside it.

**Every build continues it** (CEO, 19 Oct). Building it out again adds the next version (3, 4, and on), never replacing the one before, so she can go back to or reference any earlier build in Versions.

**A closed statement reopens, with a note** (CEO, 19 Oct). Building out a statement she closed in the library reopens it as a draft, on the same artifact, and references the statement she had: the start screen and the draft both say "You closed this statement on {date}." with the statement, so she builds from it rather than starting again.

### 1.1 How people arrive here

- **From onboarding.** The first win for most people: the one-sentence statement she saves at the end of onboarding is her first artifact.
- **From an action step** whose tool is Positioning Builder:

| Plan | Action step |
| --- | --- |
| Step Up | 1.1 Write a one-sentence statement of the scope she wants to lead and why she is ready; 1.2 Add three examples of work that show enterprise-level judgment |
| Make Your Mark | 1.1 Write how she describes herself, in her words, not her employer's; 1.2 Name three to five topics she is willing to defend; 2.2 Bring her LinkedIn profile in line with her point of view |
| Make the Move | 1.2 Write the story she will tell in the room; 2.1 Gather proof for every claim in her story; 2.2 Prepare the materials the moment calls for (a bio); 2.3 Make sure her public profile tells the same story |
| Lead Where You Are | 1.2 Write the story of what she owns, in the words her leadership already uses; 2.1 Reframe one recent win as impact on the business |
| Chart a New Course | 1.2 Write what she is good at, separated from where she has done it; 4.1 Write the story that makes the move look deliberate; 4.2 Bring her public profile quietly in line with the narrative |

- **In the prototype's mock plan:** "Write your bio" (`bio`), "Use your leadership story in your next 1:1" (`use-story`) and "Build a documented case for broader scope" (`scope-case`).
- **From "What's on your mind?"** when what she says names a bio, an introduction, a promotion, positioning, a new boss, manager or role, "about me" or her profile.
- **From the Playbook or the library.** Her statement in the library carries "Build it out in Positioning Builder: a bio in three lengths and your leadership narrative." until it is built out.

### 1.2 When another builder fits better

**Proposed.**

- She is preparing for one conversation, not describing herself in general → **Situation Brief**, which uses her statement in its opening.
- She wants to be invited somewhere → **Pitch Builder**, with her short bio attached.
- She wants to say what she thinks, not who she is → **Thought Leadership Builder**.

---

## 2. What it knows and what it asks

### 2.1 What it already has

Shown on the last screen to check, each with where it came from and Edit:

| Fact | Where it comes from |
| --- | --- |
| Your positioning statement | Onboarding ("Your statement from onboarding") |
| Your role, as you'd say it | Her plan and profile |
| Where you're headed | Her direction |

### 2.2 What it asks

| Question | Short name | Kind | Required | Notes |
| --- | --- | --- | --- | --- |
| An introduction for a particular moment | Introduction | Pick any: A promotion conversation, An executive introduction, A conference program | No | The first question, on the use case screen. The three for now; she can make more than one, and each adds its own introduction to the draft (CEO, 19 Oct). |
| What are you known for? | Known for | Her words | Yes | "What colleagues would say you're the person for. A line is enough." |
| Strengths you'd want named | Strengths | Her words | No | Goes into the long bio. |
| Who is it mainly for? | Audience | One choice: Senior leaders where I work, An external audience, Recruiters and boards | No | Sets the long bio's last question. The PRD's optional audience. |
| Where will you use it first? | Format | One choice: LinkedIn About section, A speaker bio, An internal profile, An email introduction | No | Adds a version made for it, where possible (CEO, 19 Oct; see section 3), and names the bio to start with in the recommended next use. The PRD's optional desired format. |
| Paste a bio you already have | Source text | Her words, long | No | "An old bio or profile. ExecHQ uses it to fill what it would otherwise ask." ExecHQ reads all of it, not one sentence, for the full picture of her background and experience (CEO, 19 Oct): what came before her current role, roles and results it names, and anything that answers a question the draft would otherwise ask. Nothing in it is reworded into a claim she didn't make. The PRD's user-provided source text. |

### 2.3 Enrichers

**Add three recent accomplishments.** "Your bios can name something you delivered, instead of leaving a question for it." Add them / Not now. Once added it is one more optional question on the same screen ("One a line. Leave out names and numbers you can't share."). The first goes into the medium bio, the rest into the long bio. Never blocks the draft.

---

## 3. The draft

"Here is a first draft of your bios and narrative, built on your statement. Change anything; it is yours." Bios use her name, never a pronoun ExecHQ assumed.

| Section | What it is for | Her words | ExecHQ's wording | Left as a question when missing |
| --- | --- | --- | --- | --- |
| **Positioning statement** | The one sentence, as onboarding left it | Her statement | None | What is your positioning statement? |
| **Short bio** | Wherever she is introduced in a line | Her name, role, what she is known for | "[Name] is [role], known for …" | What is your role? What are you known for? |
| **Medium bio** | A program, a profile, an introduction email | The short bio, where she is headed, her first accomplishment | "[First name] is building toward …" | Where are you headed? Which result would you put in the second line? |
| **Long bio** | A speaker page or a document about her | The medium bio, her other accomplishments, her strengths, her statement in quotes, and what a bio she pasted says about her background | "Colleagues name … as what they rely on." "In [first name]'s words: '…'" | What came before your current role? (unless she pasted a bio). Then, by who it is mainly for: Which result would your leadership remember you for? / Where have you spoken or been published? / Which decision best shows your judgment? (or, with no audience, Anything you'd like people to know outside work?) |
| **Leadership narrative** | What she says about herself, first person | Her statement, role, what she is known for, where she is headed | "What I do: … What I am known for: … What I am building toward: …" | Where are you headed? |
| **Introduction for [the moment]** | One for each moment she chose | Her statement, what she is known for, where she is headed | An opening for the moment ("I'd like to talk about what comes next for me." / "Thank you for making the time.") | For a conference program: What is the session about? |
| **For [where she'll use it first]** | Only when she chose a format: a version made for it (CEO, 19 Oct; wording confirmed by Kate, 19 Oct, one format at a time): a LinkedIn About section is first person and longer, in three short paragraphs (what I do, what I'm known for, what I'm building toward); a speaker bio is third person, about 100 words, ending with what she speaks on; an internal profile is first person, the medium bio plus what she is focused on now; an email introduction is a short third-person paragraph someone can forward | The bios' facts, in the form the format needs | The framing each format needs ("I lead …" / "[Name] speaks on …" / "I'd like to introduce …") | For a speaker bio: What do you speak about? For an internal profile: What are you focused on this quarter? |
| **Recommended next use** | What to do with it | None | Which bio to start with, for where she'll use it first ("Start with the long bio for your LinkedIn About section."), then her plan's next step ("Then use the narrative for your next step: brief your manager before Thursday's check-in."). Without either: "Use the short bio wherever you are introduced. Use the narrative to open your next conversation about scope." | None |

Rules for this builder:

- **Each output on its own.** Every section can be copied on its own; the bios can also be downloaded as PDF or Word on their own.
- **Changing the statement offers a refresh, never forces one.** "Your statement changed. Your bios and narrative still say the old one. Refresh them to match?" Refresh them / Keep them as they are. A refresh is a new version; the earlier one is still there.

---

## 4. Changing it

The shared options (voice, specificity, length, audience) and the conversational follow-up. Revisions act on the bios and the narrative, never on her statement:

- **Shorter** takes the open questions out of the medium and long bios.
- **Longer** adds a question for her to the long bio ("Which decision are you proudest of, and why?") and to the narrative ("Why does this direction matter to you?"), never a fact.
- **Emphasis** (What I lead · What I'm known for · Where I'm headed) puts that part of the narrative first.
- Voice, specificity and audience are recorded with the version; the prototype does not rewrite for them (no model).

---

## 5. Using it

| | |
| --- | --- |
| **Copy** | "Copy" for the whole artifact, and Copy on each section |
| **Export** | PDF and Word for each bio |
| **Mark ready, then used** | "Mark ready", then "Mark used": she used it in a conversation, a profile or a program |
| **Check back** | 7 days after she marks it used (Kate, 19 Oct) |
| **The question** | "You used your leadership story on Tuesday. How did it go when you used it?" Its own question, with the shared answers (Kate, 19 Oct). |
| **Signal Picture** | Once used, where she used it and what came of it, under the plan area it serves (in the mock, "Being seen as a leader, not only an operator") |

### After she answers

Her tap is all the feedback: ExecHQ asks nothing more, says her answer back, and always gives the next step (Kate, 13 Oct). One leads, with at most one more. A Plan step goes on her Plan only when she taps **Add it to your plan**; where a step is already done or passed on, the next step on her Plan takes its place. "Not now" folds it to one line. Built by rules (`AFTER_ANSWER` in `mock/playbook.ts`); no model in the pilot.

| Answer | Next step | Then |
| --- | --- | --- |
| It went well | **Add to plan:** *Post what you lead on LinkedIn* | **Use the long bio on LinkedIn** (copies it) |
| It was mixed | **Sharpen it:** a new version of the bios and narrative, More specific; her statement stays | Next on your plan |
| Not the way I hoped | **Add to plan:** *Ask your manager what broader scope means to them* | **Sharpen it** |
| Nothing yet | **Use it where you're next introduced:** copies the short bio | "ExecHQ will ask again on …" |
| It's no longer relevant | Next on your plan. Her statement never closes: ExecHQ only stops asking about this use of it. | |

---

## 6. How the agent behaves here

**Proposed, all of this section.** It adds to the rules every builder shares (`builders/shared.md`, section 8) and keeps the four guardrails (section 9).

- **Her account of herself, not a résumé.** Plain claims she would say out loud. No "results-driven", "passionate" or "visionary".
- **Never invents a credential.** No employers, titles, degrees, awards or numbers she didn't give. A gap is a question.
- **Her name, never an assumed pronoun.** Bios repeat her name or first name.
- **The statement is hers.** It never rewrites her statement unprompted; it offers, and she decides.
- **Built to be reused.** It keeps every output short enough to paste where it's needed.

---

## 7. Open questions

None. Answered by the CEO on 19 Oct: building out again continues the artifact, and a closed statement reopens with a note (section 1); the three introductions, more than one allowed (2.2); the whole of a pasted bio is used (2.2); format adds a version made for it (2.2, 3). Confirmed by Kate on 19 Oct: what each format version says, one format at a time (3), and its own follow-up question (5).
