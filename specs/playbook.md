# Playbook — interaction spec

Approved concept: **Concept 2 — Starter row**, as of 2026-10-19. It is written so a developer can build it without the prototype open. Where the prototype fakes something, production behavior is stated under "Prototype versus production".

The Playbook was called the Toolbox until 2026-10-19. Concepts 1 (Tool cards) and 3 (Start from the moment) were the other ideas tried for this page. They are kept on the `scratch` branch and are not specified here. What making a draft looks like, once a tool opens, is in the Playbook flow spec.

---

## 1. What it is

The Playbook is where the person makes their drafts and finds them again. It has two parts, always in this order:

1. **The four tools:** Positioning Builder, Pitch Builder, Situation Brief and Thought Leadership Builder, with the tool their next plan step needs under them.
2. **The library:** everything they have made, filed by ExecHQ into one folder per tool.

What it deliberately does not do:

- **Ask them to organize anything.** ExecHQ files each draft in its tool's folder. There are no folders to make, no tags, no menus on rows.
- **Guess at what to make.** Finding the right tool is the advisor's job ("Which tool do I need?", 5.3), not a field on the page.
- **Show an empty library to someone who finished onboarding.** Their positioning statement from onboarding is their first artifact. Only someone who left onboarding before saving sees an empty library (4.4).

### Where it appears

The page uses the `app` chrome. It is the "Playbook" destination in the navigation (see the Navigation spec), with a pencil icon. The Plan, Home, the Signal Picture and the advisor link into its tools and drafts (5.2).

---

## 2. Layout by viewport

| | Phone | Tablet | Web |
| --- | --- | --- | --- |
| Production breakpoint | Below 768px | 768px to 1199px | 1200px and up |
| Prototype frame | 393px wide | 820px wide | Fills the window |
| Shape | One column: title, tools, Next on your plan, Library | The phone's layout | Two columns: a rail on the left, the library on the right |
| The tools | One row of four that fits the width, each an icon over a short name | Same as phone | Four rows in the rail, each the icon, the name and what it makes |
| Next on your plan | One row under the tools | Same as phone | In the rail, under the tools |
| The library | Four folders, 2 × 2; a folder opens as its own page | Same as phone | The folders as tabs, All first; the chosen tab's list in place |
| Search | A magnifying glass beside Library, opening a sheet | Same as phone | A search field beside the Library heading |

On web the rail (title, tools, Next on your plan) stays in view as the library scrolls.

In the prototype, responsiveness follows the simulated device frame (`data-viewport`), never the browser window. In production use the real breakpoints above.

---

## 3. The tools

### 3.1 The header

**Playbook** (level 1), then "Four ways to make your next draft."

### 3.2 The four tools

Always present, for new and returning people alike, in this order:

| Tool | Short name | What it makes |
| --- | --- | --- |
| Positioning Builder | Positioning statement | Your statement, bios and narrative |
| Pitch Builder | Pitch builder | Pitches for stages, shows and press |
| Situation Brief | Situation brief | One page before a moment that matters |
| Thought Leadership Builder | Thought leadership | A post or article in your voice |

Each opens its tool's start screen in the Playbook flow (see the Playbook flow spec). On phone and tablet each is an icon over its short name; on web each is a row with the icon, the short name and what it makes, and a chevron.

### 3.3 Next on your plan

Under the tools: **Next on your plan**, the tool their next plan step needs, and the step as the plan says it ("Situation Brief · Brief your manager before Thursday's check-in"). It opens that step in its tool with the step's facts filled in, or the draft if the step already has one. It is the first step on their plan that makes something with a tool. With no such step, the four tools stand alone.

---

## 4. The library

### 4.1 Folders

One folder per tool, filed by ExecHQ: **Positioning**, **Pitches**, **Briefs**, **Posts**. Each folder shows its tool's icon in a tinted disc (the name is always beside it, so the tint is never the only cue), how many it holds and where they stand ("3 · 2 drafts · 1 waiting to hear"), and when it last changed. An empty folder says "Nothing here yet".

### 4.2 A folder, opened

On phone and tablet a folder is its own page (`?folder={tool}`):

1. **Playbook**, with a back chevron, back to the Playbook.
2. **The tool's card:** the folder's name (level 1), what the tool makes, and the tool's start button ("Start a brief").
3. **How many** ("3 items") and, only when the folder holds two statuses or more, a **Status** menu: All, then each status it holds something in, each with its count. Once one is chosen the button says so ("Status: Draft").
4. **The list,** newest first.

An empty folder says "Anything you make in {tool} is filed here."

On web the folders are tabs over one list: **All** first (every artifact, each row naming its folder), then each folder with its count. A folder's tab has the same count and Status menu, with the tool's start button at the right of the bar. A link to `?folder={tool}` opens on that tab.

### 4.3 The rows

Each artifact is one row, no card, with a line between rows:

- **Its title.**
- **A line of what it says,** in a folder or in All, so same-named drafts can be told apart.
- **Where it stands,** in the Loop's words (Draft, Ready to use, Used, sent or published, Waiting to hear, Outcome logged, Closed), and, in All or in search, its folder first.
- **When they last touched it,** as a tag: "Today", "3 days ago", "2 weeks ago", then the date.

Tapping a row opens the artifact straight to its draft (see the Playbook flow spec). There is no menu on a row: what a row menu would hold (Use as a starting point, Close, Delete) is in the draft's Actions menu.

### 4.4 Nothing in the library

Only for someone who left onboarding before saving: **Nothing here yet**, "Your first draft starts from the first step on your plan.", with that step as a link to the Plan. Search is not offered.

### 4.5 Search

Across every folder, matching titles, what each says and the tool, as they type.

- **Phone and tablet:** the magnifying glass beside Library opens a sheet with **Search your library**. Before they type it lists **Recent**; then "{n} matches", or "Nothing in your library mentions “{query}”." Picking a match closes the sheet and opens the artifact. Closing the sheet returns focus to the magnifying glass.
- **Web:** a search field beside the Library heading. While there is a query, the tabs give way to one list of matches across every folder, each row naming its folder, under "{n} matches across every folder".

---

## 5. Interactions

### 5.1 Opening a tool or a draft

A tool opens its start screen; a draft opens straight to its draft. Both open in the Playbook flow (Concept 3, the Interview), which has its own spec.

### 5.2 Direct paths in

Every link into the Playbook from elsewhere goes through one rule: a step that already has a draft opens the draft (and the Plan's button says **Open your draft**); a step that makes something opens its tool with the step's facts filled in. The Briefing's "Write a post about this" opens Thought Leadership Builder with the read as its source.

### 5.3 Which tool do I need?

On the Playbook the advisor's first suggestion is **Which tool do I need?**. It asks "What's on your mind? Tell me what's coming up and I'll suggest the tool for it. Or pick what you want to have at the end.", with one answer per tool ("Notes for a conversation or meeting", "A pitch to a stage, a show or an editor", "A post or an article", "A better way to introduce myself"). What they type is matched to a tool by a few rules (a pitch or talk, a post or article, a review or meeting, an introduction or bio). The advisor says which ("That sounds like a Situation Brief: one page before a moment that matters.") and opens it with what they said; anything it can't place, it asks "What do you want to have at the end of it?" rather than guessing. The advisor also understands "toolbox" as the Playbook.

---

## 6. Accessibility

- One level 1: "Playbook", or the folder's name on its own page. Library is level 2.
- The tools are a labelled group of links. Every row is a single link named by its title.
- On web the folders are a tablist: arrow keys move between tabs, and the list is its tabpanel.
- The Status menu is a menu button with a radio group (arrow keys, Home, End, Escape back to the button).
- The search count is announced as they type. The search sheet takes focus and gives it back on close.
- Text contrast is at least 4.5:1, non-text at least 3:1, in greyscale and in colour.

---

## 7. Components

| Component | Where |
| --- | --- |
| `ToolPicker` | The four tools (`icons` on phone and tablet, `rail` on web), with Next on your plan |
| `LibraryFolder` | Each folder, and the open folder's card |
| `LibraryTabs` | The folders as tabs (web) |
| `List` | The library rows |
| `DropdownMenu` | The Status menu |
| `LibrarySearch` | The search sheet (phone and tablet) |
| `LibraryEmpty` | Nothing in the library |
| `Sheet` | The search sheet |
| `Badge` | When they last touched it |

---

## 8. Prototype versus production

| In the prototype | In production |
| --- | --- |
| Maya's library is sample artifacts that move with the dock's five moments | The library is the person's own work |
| What she makes is kept in the browser, and the dock's reset clears it | Kept on the account |
| Matching what she tells the advisor is a few word rules | The pilot's matching is rules-based too; which rules is open (9) |
| The tool drawings are placeholders | Final illustrations from design |

---

## 9. Decisions to confirm

Written from the approved prototype. These are choices it makes that nobody has yet confirmed:

1. **The name "Library"** for what they have made.
2. **Folders are filed by tool,** and nothing else: no folders of their own.
3. **No menu on library rows.** Close, Delete and Use as a starting point live on the draft.
4. **Next on your plan** is the first plan step that makes something with a tool.
5. **The advisor's tool-matching rules,** and what it says when it can't place what they typed.
6. **Tablet follows the phone,** with folders as their own pages.
