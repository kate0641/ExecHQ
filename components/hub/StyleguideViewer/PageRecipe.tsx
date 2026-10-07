import { Button } from "@/components/primitives/Button";

/**
 * How a page is built: the rules each designed page has settled, so the next
 * page starts from them instead of from scratch.
 *
 * Every rule names the page it came from. When a page refines a rule, change
 * the rule here and add the page to its `from`; when a page adds a shared
 * piece to styles/app.css (under SHARED PATTERNS), list it in PAGES below.
 * The specimen is built from those shared classes and the real Button, so it
 * shows the pattern as it ships.
 */

interface Rule {
  rule: string;
  why: string;
  /** The page, or pages, that settled it. */
  from: string;
  /** The tokens or classes that carry it. */
  uses?: string[];
}

const RULES: { title: string; note: string; rules: Rule[] }[] = [
  {
    title: "Surfaces",
    note: "What the page is made of.",
    rules: [
      {
        rule: "The page is stone. Content sits on white cards with a soft stone edge and no shadow.",
        why: "Clean, not playful: one quiet edge separates a card from the page without stacking tints.",
        from: "Home",
        uses: ["--color-surface", "--color-surface-raised", "--color-border", ".card"],
      },
      {
        rule: "Never a card inside a card. Inside a card, split things with a hairline.",
        why: "Nested rounded boxes read as bubbly; hairlines and type read as considered.",
        from: "Home, Profile",
        uses: [".card--reads", "--color-border-subtle"],
      },
      {
        rule: "At most one dark block on a screen, and only for the one thing to do next.",
        why: "Navy is the anchor. Two anchors compete; a settings page like Profile needs none.",
        from: "Home",
        uses: ["--color-surface-inverse"],
      },
    ],
  },
  {
    title: "Colour",
    note: "Few colour areas, each with one job.",
    rules: [
      {
        rule: "One accent per screen. Before adding a colour, say which colour it replaces.",
        why: "Several colour areas at once (header tint, card fill, gold, glows, lime) tipped Home towards playful.",
        from: "Home",
      },
      {
        rule: "Colour is never the only cue. The words carry the meaning; the page must still read in greyscale.",
        why: "Accessibility, and the greyscale switch reviewers use. Outcome dots are hidden from screen readers for this reason.",
        from: "Home",
        uses: ["--color-outcome-*"],
      },
      {
        rule: "Red is only for destroying something: deleting the account, removing a connection.",
        why: "Kept rare, so it always means the same thing.",
        from: "Profile",
        uses: ["--color-danger"],
      },
    ],
  },
  {
    title: "Type",
    note: "Kulim Park for headings only; Inter for everything she reads or presses.",
    rules: [
      {
        rule: "Kulim Park is for display, title and heading. Labels, eyebrows, subheadings, body and captions are Inter.",
        why: "Kulim gives the page its voice in a few places; Inter keeps everything else calm and easy to read.",
        from: "Home",
        uses: ["--type-label-font", "--type-eyebrow-font", "--type-subheading-font"],
      },
      {
        rule: "A section is a heading on the page, an optional line under it, then the card. The heading never goes inside the card.",
        why: "Every page scans the same way: Home's Progress Tracker and Signal Picture, Profile's Account and Notifications.",
        from: "Home, Profile",
        uses: ["--type-heading-*", "--type-body-sm-*"],
      },
      {
        rule: "A labelled read inside a card is a grey eyebrow, then the words. Blue eyebrows introduce a heading; grey ones label a read.",
        why: "Why this / Why now / Why you on Home; Name and Email on Profile. One look for one job.",
        from: "Home, Profile",
        uses: [".read", "--type-eyebrow-*", "--color-text-secondary"],
      },
      {
        rule: "Body copy at 1.7 leading with a 12px gap between paragraphs. Captions are 13px regular.",
        why: "Text-heavy screens get lighter through rhythm, never by cutting the copy.",
        from: "Home",
        uses: ["--leading-relaxed", "--space-paragraph", "--type-caption-*"],
      },
    ],
  },
  {
    title: "Controls",
    note: "Only buttons are pills, so the shape means \"press me\".",
    rules: [
      {
        rule: "Yellow is the one main action on a screen. Light blue is everything secondary.",
        why: "One clear next move. Still open: whether light blue and yellow are distinct enough side by side.",
        from: "Home",
        uses: ["--color-action", "--radius-button"],
      },
      {
        rule: "Hover never carries meaning. Every tap target is at least 44px.",
        why: "ExecHQ is used on a phone first.",
        from: "Home",
      },
    ],
  },
  {
    title: "Spacing",
    note: "Gaps are named for their job.",
    rules: [
      {
        rule: "Cards run 12px from the phone's edge, 16px apart, with 16px inside (20px in a feature card).",
        why: "Wider cards, steady rhythm.",
        from: "Home",
        uses: ["--space-screen-side", "--space-between-cards", "--space-card-padding", "--space-feature-padding"],
      },
      {
        rule: "Sections sit 32px apart; inside a section, heading, line and card sit 12px apart.",
        why: "The gap between groups must be clearly bigger than the gaps inside them, or the page reads as one long list.",
        from: "Profile",
        uses: ["--space-xl", "--space-sm"],
      },
    ],
  },
];

/** Each page designed, and what it added to the system for the next one. */
const PAGES: { page: string; date: string; added: string[] }[] = [
  {
    page: "Home",
    date: "6 October 2026",
    added: [
      "Clean direction: stone page, white outlined cards, one navy anchor.",
      "Inter for every type role below heading.",
      "Grey eyebrow reads split by hairlines (the next-step card).",
      "13px regular captions; outcome dots as a second cue.",
    ],
  },
  {
    page: "Profile",
    date: "6 October 2026",
    added: [
      "Home's card and read lifted into shared classes: .card, .card--reads, .read.",
      "The section rule: heading on the page, line, then the card.",
      "Section rhythm: 32px between sections, 12px inside.",
    ],
  },
];

/** A section built only from the shared pieces, at phone width. */
function Specimen() {
  return (
    <div className="page-recipe__specimen">
      <div className="page-recipe__section">
        <p className="page-recipe__heading">Your account</p>
        <p className="page-recipe__lead">The line under a heading says what the card is for.</p>
        <div className="card card--reads">
          <div className="read">
            <span className="read__label">Name</span>
            <p className="read__value">Maya Chen</p>
          </div>
          <div className="read">
            <span className="read__label">Email</span>
            <p className="read__value">maya.chen@example.com</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="read">
          <span className="read__label">Why this</span>
          <p className="read__value">One card for one job, with a main action if it has one.</p>
        </div>
        <Button fullWidth>Main action</Button>
        <Button variant="secondary" fullWidth>
          Secondary action
        </Button>
      </div>
    </div>
  );
}

export function PageRecipe() {
  return (
    <div className="page-recipe">
      <div className="styleguide__group">
        <h3 className="styleguide__group-title">The pattern</h3>
        <p className="styleguide__group-note">
          A section and a card, built only from the shared classes. Start every new page here.
        </p>
        <Specimen />
      </div>

      {RULES.map((group) => (
        <div className="styleguide__group" key={group.title}>
          <h3 className="styleguide__group-title">{group.title}</h3>
          <p className="styleguide__group-note">{group.note}</p>
          <ul className="page-recipe__rules">
            {group.rules.map((rule) => (
              <li className="page-recipe__rule" key={rule.rule}>
                <p className="page-recipe__rule-text">{rule.rule}</p>
                <p className="page-recipe__why">{rule.why}</p>
                <p className="page-recipe__meta">
                  <span className="page-recipe__from">From {rule.from}</span>
                  {rule.uses?.map((use) => (
                    <code className="page-recipe__use" key={use}>
                      {use}
                    </code>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="styleguide__group">
        <h3 className="styleguide__group-title">Pages that shaped it</h3>
        <p className="styleguide__group-note">
          Each page designed refines the rules above. Add a line when one does.
        </p>
        <ol className="page-recipe__pages">
          {PAGES.map((entry) => (
            <li className="page-recipe__page" key={entry.page}>
              <p className="page-recipe__rule-text">
                {entry.page} <span className="page-recipe__from">{entry.date}</span>
              </p>
              <ul className="page-recipe__added">
                {entry.added.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default PageRecipe;
