# Sprint 4 — Toolbox and Daily Briefing: review notes

_Written 11 October 2026 from the built prototype. Everything below is on `main`; nothing is pushed yet. Toolbox notes will be added when the Toolbox concepts are built._

## 1. Say this at kickoff

**The brief was amended on 11 October.** Three changes govern over the PDF:

1. The library is never empty for someone who finished onboarding. Their one-sentence positioning statement is their first artifact, with an invitation to build it out in Positioning Builder. Only someone who left onboarding before saving sees an empty state, which points to their first action step.
2. Each feature gets three concepts: two safe and one wild card. Every Toolbox concept leads with the tools and puts the library below them. Concepts vary in how the tools are presented, how creating works (guided steps, a document workspace, or starting from the situation) and how the library is organised.
3. The Toolbox always opens with the four tools at the top and the library below, for new and returning users alike. Any artifact shown in the Plan, an action step or a Loop follow-up opens that artifact directly, without going through the Toolbox page.

**"Active Landscape" is "action steps"** in the prototype, as in Sprint 3.

**Every publisher in the prototype is invented.** So are the three reads' headlines, summaries and highlighted passages. They are written for Maya and are not real articles. Real publisher names were dropped so that nothing invented is attributed to a real publication on a public site.

## 2. The Briefing concepts

All three share the same first visit, reads, reason lines and actions, so the comparison is about layout and how a read is met.

| Concept | Route | Kind | In one line |
| --- | --- | --- | --- |
| 1 — Front page | `/daily-briefing/concept-1` | Safe | The lead read as one large dark card, the other two as rows under it, all three in about one scroll. On web the lead takes the left two-thirds. Publishers are changed on the page. |
| 2 — One at a time | `/daily-briefing/concept-2` | Safe | One read fills the screen, with "1 of 3" at the top and Next in the thumb zone (a tap, not a swipe), then a last screen: "That's today's three." On web it's a centred card. |
| 3 — Annotated | `/daily-briefing/concept-3` | Wild card | Each read has one highlighted passage with ExecHQ's note on it. Tapping the passage opens a sheet with "Respond to this". On web the note moves into the margin and she can select her own passage. |

**Review the riskiest states first, as the brief asks.**

- **First visit.** Any concept, after the dock's reset. Publishers are chosen before the first set loads; the suggested set is one press.
- **The hand-off.** "Write a post about this" (Concepts 1 and 2) or "Respond to this" (Concept 3). It lands on Thought Leadership Builder, which is still the Sprint 4 stub until the Toolbox concepts are built. The link already carries the read, and the passage when there is one, so the builder can show its source the moment it exists. The `SourceLabel` component ("Started from today's Briefing") is in the catalogue now.

**Choosing publishers.** The choice is shared across all three concepts. The dock's reset puts the first visit back.

## 3. Decisions made while building (working, not settled)

- **At least three publishers.** The brief gives no minimum; three matches three reads a day.
- **The suggested set** leans towards leadership titles because of Maya's direction, with one marketing title.
- **Opening a read counts as reading it.** In Concept 2, Next also counts the read as seen, so "Read today's Briefing" on the Plan can complete on the first one (wired later this sprint).
- **Concept 2 has a quiet Back and "See all three"** beside the count, so Next is never the only way through.
- **Concept 2's Next sits just above the "Ask or go" pill**, so the pill stays as the way to the rest of ExecHQ. The alternative is to hide the pill on this page.
- **Concept 1's close is there from the start**, because all three reads are in view at once. It changes to "You've read today's three." once all three are opened.
- **Concept 3 keeps two notes on each read.** The reason line says why the read is here; the passage note says why that sentence. Its responses come from the passage, so it has no separate "Write a post about this" block.
- **Saved reads** are kept after the day and reached from a small link under the set. They are never listed with the day's three, so the page never looks like a feed.
- **Relevance feedback** is acknowledged in a few words, with Undo.
- **The Briefing email is now off by default** (Profile → Notifications), as the brief says. It sends at 8 am, local time.
- **Profile has a new "Daily Briefing" group with a Publishers row.** Concepts 2 and 3 link to it. Profile is approved, so this is a change to an approved page.

## 4. Open questions for the client

1. **Choosing your own passage (Concept 3, web) needs the whole article inside ExecHQ, and so a licence from each publisher.** A pre-chosen passage is a short quote with its source, which does not need one. If licences are out of scope for the pilot, Concept 3 keeps only the pre-chosen passage.
2. **Who chooses Concept 3's passage, and who writes its note?** In the pilot's rules-based curation that is either an editor or a model reading the article. Both carry a cost the brief does not price.
3. **Should the homepage card change with the chosen concept?** It stays as approved for now and opens whichever concept is chosen.

## 5. Working decisions from the brief's open questions

Taken as working answers on 11 October. Confirm with the client:

- The library is called "Library".
- The user can close any artifact at any time; after an outcome is recorded, ExecHQ suggests closing it.
- Positioning Builder keeps the one-sentence statement as its first output.
- Copy for every output; PDF and Word for the Situation Brief, bios and long-form articles.
- No "delete after use" on the Situation Brief.
- "Read today's Briefing" completes when one read is read, or a Thought Leadership draft is started from one.
- Reusing an artifact creates a new one, linked to the original.
- The Briefing is daily reads only.
