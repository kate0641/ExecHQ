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
        rule: "Never a card inside a card, and never a stack of boxes for a list. One card holds the list; a hairline splits each item.",
        why: "Nested or stacked rounded boxes read as bubbly; hairlines and type read as considered. Navigation's suggested questions were four boxes; now they are one card.",
        from: "Home, Profile, Navigation",
        uses: [".card--reads", "--color-border-subtle"],
      },
      {
        rule: "At most one dark block on a screen, and only for the one thing to do next, or where she is.",
        why: "Navy is the anchor. Two anchors compete; a settings page like Profile needs none. In the advisor panel the only navy is the destination she is on, so her own messages are light blue.",
        from: "Home, Navigation",
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
        rule: "Only paragraphs get the airy 1.7 line spacing. A one-line label, date or note uses tight spacing (1.3), so a card that ends in one doesn't look heavier at the bottom than at the top.",
        why: "Line spacing adds invisible space above and below each line. On a single line it pads the card's edge, so 20px of padding looks like 25.",
        from: "Navigation",
        uses: ["--leading-snug"],
      },
      {
        rule: "No text anywhere in the product is cut off with an ellipsis. Titles, headers, previews and placeholders wrap and show every word. An ellipsis written into the words stays: something in progress (Writing your first draft\u2026) and a prompt to type (Ask or go\u2026).",
        why: "Cut-off words hide what she needs to read. Keep a navy header short so it rarely needs a second line, but when it does, it wraps (designer, 2026-10-13).",
        from: "Home, Onboarding",
      },
      {
        rule: "Whatever is chosen or current steps up a weight: its label turns bold. Each label holds its bold width, so nothing shifts when the choice moves.",
        why: "The choice is said by the type as well as by colour, which helps when colour alone is hard to see. Rings, chips, the nav, steps, filters.",
        from: "Home",
        uses: ["--weight-bold", ".u-bold-hold"],
      },
      {
        rule: "Kulim Park is for display, title and heading. Labels, eyebrows, subheadings, body and captions are Inter.",
        why: "Kulim gives the page its voice in a few places; Inter keeps everything else calm and easy to read. This covers the advisor's name, the where-you-are chip and chat replies too.",
        from: "Home, Navigation",
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
        why: "Why this / Why now / Why you on Home; Name and Email on Profile; Go to and Ask me in the advisor panel. One look for one job.",
        from: "Home, Profile, Navigation",
        uses: [".read", "--type-eyebrow-*", "--color-text-secondary"],
      },
      {
        rule: "A label that names a group on the page (a list, a set of links, Why this matters) is a group title: the eyebrow's small capitals, a size up at 14px, in the copy's dark ink. The eyebrow itself stays for a single read or the line above a heading.",
        why: "A label over a whole group needs a little more weight than one over a single read, without becoming a heading. Titles matter as much as the copy, so none is greyed out.",
        from: "Onboarding",
        uses: ["--type-group-title-*", "--color-text-primary"],
      },
      {
        rule: "The title inside a list card (What to do next, What next?) is a card title: sentence case, Inter semibold, 16px, dark, 20px above the list.",
        why: "It is the title for every item in the card, not the first, so it sits further from the list than an item's title does from its own line.",
        from: "Onboarding",
        uses: ["--type-card-title-*", "--space-card-title"],
      },
      {
        rule: "A group title sits 12px above its group, more than a line of body copy leaves; a card title 20px. A form field's label, and a question over its answers, sit 12px above them too. Bullets sit 16px apart, a step more than paragraphs. Items split by hairlines get 20px either side of the line.",
        why: "Each kind of gap is said once and kept: a title belongs to its group, a bullet is its own item, a divider needs room to read as a divider.",
        from: "Onboarding",
        uses: ["--space-group-title", "--space-list-item", "--space-divided-item"],
      },
      {
        rule: "Lists are indented: numbers or bullets sit inside the text's margin and the lines indent after them. Nothing hangs past the padding.",
        why: "Hanging numbers in the advisor's answers ran out past the edge every other line respects.",
        from: "Navigation",
      },
      {
        rule: "Libre Baskerville italic is only for words that are said: a welcome line, ExecHQ speaking, her own words quoted back, a publication's name. Never a title, a label or interface text, and always clearly smaller than the screen's title.",
        why: "One clear job keeps the serif meaning the same thing wherever it shows. At 22px under a 28px title it competed with the title on Reflection.",
        from: "Onboarding",
        uses: ["--type-editorial-*"],
      },
      {
        rule: "The editorial role has four sizes, each with one job. 28px: the web welcome's statement on its dark panel. 18px: ExecHQ speaking on a guided step. 16px: her words quoted back, and the chat's welcome line. 14px, at the 500 weight: a short line under a heading, a quote inside the chat, a publication's name.",
        why: "The sizes had grown one per screen (14, 16, 22, 28). Four, each named for its job, make the choice obvious, and 14px italic needs the heavier weight to read.",
        from: "Onboarding",
        uses: ["--type-editorial-size", "--type-editorial-size-md", "--type-editorial-size-sm", "--type-editorial-size-xs", "--type-editorial-weight-xs"],
      },
      {
        rule: "Numbers in circles are one style everywhere: a 16px numeral in a 28px navy circle, the copy starting 16px past it, and 16px between items.",
        why: "The smallest circle that still holds the numeral comfortably. Larger circles outweighed the copy beside them; smaller numerals were hard to read.",
        from: "Onboarding",
        uses: ["--number-circle-size", "--number-circle-numeral", "--number-circle-gap", "--number-list-gap"],
      },
      {
        rule: "No line of copy leaves one word alone on its last line, and no line ends on a single word after a comma: that word drops to the next line.",
        why: "A lone word reads as a mistake and makes a short paragraph look unfinished; \"a result, so\" at a line's end hangs the same way. Both are set as the copy renders, never by editing it.",
        from: "Onboarding",
        uses: ["text-wrap: pretty", "keepAfterComma()"],
      },
      {
        rule: "A set of choices on the page is one card like a numbered list, without the numbers: each choice a title and a line, a hairline between them, a chevron at the right.",
        why: "Stacked outlined boxes read as a pile of buttons; one card with rows reads as a considered set, and the chevron says each row can be pressed.",
        from: "Onboarding",
        uses: [".next-steps", "--space-divided-item"],
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
        rule: "Only a card with a chevron is tappable. A card or chip without one is a reference, and its action sits on a button beside it.",
        why: "The same look must always do the same thing, or people tap what does nothing.",
        from: "Navigation",
      },
      {
        rule: "Every prompt the advisor offers is one button style: the raised surface, a thin edge, 20px corners, sized to its words and wrapping so all show.",
        why: "Suggested questions and reply buttons are the same job, so they look the same. Fixed corners keep a two-line prompt a rounded box, not a stretched pill.",
        from: "Navigation",
        uses: ["--radius-xl", "--color-border"],
      },
      {
        rule: "In a stack of controls about 44px tall (prompts, a shortcut, the message box), every one takes the same 20px corners.",
        why: "Mixed corners stacked on top of each other read as clutter.",
        from: "Navigation",
        uses: ["--radius-xl"],
      },
      {
        rule: "What she said or made always sits in a white card, one line or many. Its action sits at the card's top right, centred on the eyebrow's line, in grey so it stays behind her words, with 8px under the line before her words. Change is a 12px underlined link; Edit is the edit icon alone.",
        why: "Her input looks the same wherever it is shown, and the way to redo it is always in the same place. A pill there would be one more button competing with the yellow one.",
        from: "Onboarding, Profile",
        uses: [".read-head", ".edit-link", ".card--reads"],
      },
      {
        rule: "Change when she picks again from choices; Edit when she types again.",
        why: "The word says what will happen: Change reopens the question, Edit opens the words or fields.",
        from: "Onboarding, Profile",
      },
      {
        rule: "Yellow is the one main action on a screen. Light blue is everything secondary, including the advisor's reply buttons. No white outlined buttons.",
        why: "One clear next move, and a button looks the same wherever it appears. Still open: whether light blue and yellow are distinct enough side by side.",
        from: "Home, Navigation",
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
    title: "Chat",
    note: "The advisor should feel like a chat app on a phone: the conversation, and little else.",
    rules: [
      {
        rule: "No rules, boxes or outlined chips around the conversation. The header is just New chat and close, with no mark or name; on the phone they sit in the top corners, level with the grab bar.",
        why: "Layers of chrome above the first message made the panel feel clunky next to Claude or ChatGPT on mobile.",
        from: "Navigation",
      },
      {
        rule: "One even gap between every message, 28px, the same above and below each of hers. Answers are set like Claude's chat: 1.55 leading, paragraphs and cards 12px apart; numbered steps keep their numbers.",
        why: "16px and then 24px between turns felt tight, and uneven gaps around her messages made a card look attached to the wrong turn; no gaps inside an answer made it one block.",
        from: "Navigation",
        uses: ["--space-lg", "--space-2xs", "--space-sm", "--leading-normal"],
      },
      {
        rule: "The product's places are one row of icon tiles, all six in view, the one she is on in navy. While she chats the row stays put above the conversation.",
        why: "Destinations stay in reach while chatting. Kate's icon row was kept over text tabs (designer, 2026-10-09).",
        from: "Navigation",
        uses: ["--color-surface-inverse"],
      },
    ],
  },
  {
    title: "Spacing",
    note: "Gaps are named for their job.",
    rules: [
      {
        rule: "Cards run 12px from the phone's edge, 12px apart when one sits straight under another (half the 24px between sections; text without a card keeps the full gap), with 16px inside (20px in a feature card).",
        why: "Wider cards, steady rhythm.",
        from: "Home",
        uses: ["--space-screen-side", "--space-between-cards", "--space-card-padding", "--space-feature-padding"],
      },
      {
        rule: "A card's last thing, a button or a flat link, sits 20px from its bottom edge, the same as its first thing sits from the top.",
        why: "Every card ends the same way, so a link never looks squeezed against the edge. A tall tap target whose words sit high is the one allowance.",
        from: "Home",
        uses: ["--space-feature-padding"],
      },
      {
        rule: "Inside a card, three steps of space, each wider than the last: eyebrow to title 4px, title to copy 8px, copy to button 20px.",
        why: "The eyebrow and title read as one label, the copy belongs to them, and the button stands apart as the thing to do. Most cards take this; a card that needs otherwise is adjusted on its own.",
        from: "Home",
        uses: ["--space-eyebrow-title", "--space-title-copy", "--space-copy-action"],
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
  {
    page: "Navigation",
    date: "7 October 2026",
    added: [
      "A list of choices is one card with hairlines, not a stack of boxes.",
      "Grey eyebrows label groups inside a panel (Go to, Ask me).",
      "Kulim Park out of the chat: advisor name, reply chips and the where-you-are chip are Inter.",
      "Reply buttons are the light-blue secondary; her messages are light blue, not navy.",
      "Chat streamlined: slim header, 28px between messages, full-pill field, replies at the left.",
      "On the phone, New chat and close sit in the sheet's top corners with no header row.",
      "Say a thing once: a label is dropped when something above already says it (the advisor's name above each of his messages, under the panel's header).",
      "The places stay Kate's row of icon tiles, pinned above the chat (2026-10-09); text tabs were tried and set aside.",
    ],
  },
  {
    page: "Onboarding",
    date: "13 October 2026",
    added: [
      "One numbered circle: 16px numeral, 28px navy circle, copy 16px past it, as tokens.",
      "Her answers in a guided step are her side of a conversation: the raised surface with a thin edge, the one she picks navy and bold, 12px apart.",
      "Step labels are the blue eyebrow; Why this matters is a grey-eyebrow read with no rule beside it.",
      "The welcome is navy edge to edge with the light logo at 48px.",
      "No lone word on a last line.",
      "A group title role (dark small capitals at 14px) and a card title role (sentence case, 16px, 20px above its list), with their own spacing: 16px between bullets, 20px either side of a divider.",
      "What next is one card of rows with chevrons, like Done's list without numbers.",
      "No single word left after a comma at a line's end.",
      "Form labels and questions sit 12px above their field or answers. The Google and Apple sign-in buttons follow their makers' guidelines exactly: Google's dark theme in Google Sans with the four-colour G, Apple's black.",
      "Libre italic only for words that are said, in four sizes with one job each.",
      "Her input always in a card, its action grey at the top right, centred on the label: Change as a 12px link, Edit as the new edit icon (pencil and square). Change to pick again, Edit to type again.",
      "Flat links sit at the left, 32px apart; Edit carries a pencil.",
      "An answer drawer's main action is full width, and any second action (Skip, Back, Later) is a secondary button the same size under it, a peer and never a smaller link. Onboarding and the Plan's check-ins share it.",
      "An example to follow (What good looks like) is the system's card with a grey eyebrow, like First draft.",
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
