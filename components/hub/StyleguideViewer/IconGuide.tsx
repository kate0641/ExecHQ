import { Icon, type IconName } from "@/components/primitives/Icon";

/** The library: the standard set, grouped by what the icons are for. */
const ICON_GROUPS: { title: string; note: string; names: IconName[] }[] = [
  {
    title: "Navigation",
    note: "Getting around, opening and closing.",
    names: ["home", "menu", "close", "chevron", "chevron-left", "chevron-up", "chevron-down", "arrow-right", "arrow-left", "arrow-up", "arrow-down", "external-link", "more-horizontal", "more-vertical", "search", "filter"],
  },
  {
    title: "Actions",
    note: "Doing something to the user's own work.",
    names: ["plus", "minus", "check", "pencil", "trash", "copy", "share", "download", "upload", "refresh", "undo", "send", "attach", "link", "bookmark", "star", "settings", "sliders", "eye", "eye-off", "sign-in", "sign-out"],
  },
  {
    title: "Communication",
    note: "Messages, calls and alerts.",
    names: ["mail", "message", "bell", "phone", "mic", "video"],
  },
  {
    title: "People and places",
    note: "Who and where.",
    names: ["person", "people", "person-add", "briefcase", "building", "pin", "globe", "compass"],
  },
  {
    title: "Time and content",
    note: "What a row or card is about.",
    names: ["calendar", "clock", "document", "folder", "image", "briefing", "book", "flag", "target", "chart-bar", "trend-up", "lightbulb"],
  },
  {
    title: "Status",
    note: "Feedback. Always with words beside it: an icon alone never carries the message.",
    names: ["info", "warning", "error", "success", "help"],
  },
  {
    title: "Security",
    note: "Privacy and access.",
    names: ["lock", "unlock", "shield", "key"],
  },
  {
    title: "Brand",
    note: "LinkedIn, and ExecHQ's own marks: the advisor's spark and the open draft.",
    names: ["linkedin", "spark", "draft"],
  },
];

/** On a screen today. Everything else is in the library, ready before it is needed. */
const IN_USE = new Set<IconName>([
  "home", "menu", "close", "chevron", "check", "pencil", "trash", "download", "send", "attach",
  "link", "sign-out", "mail", "bell", "mic", "person", "globe", "calendar", "document",
  "briefing", "flag", "lock", "linkedin", "spark", "draft",
]);

/** The dock and hub's own icons: part of the prototype, not the product. */
const PROTOTYPE_ICONS: IconName[] = ["mobile", "tablet", "web", "hub", "contrast", "reset", "sidebar"];

const SIZES: { size: number; use: string }[] = [
  { size: 16, use: "Inside buttons and links, and beside small text." },
  { size: 20, use: "In rows, cards, icon chips and navigation." },
  { size: 24, use: "Standing alone: the tab bar and header controls." },
];

/** Where an icon sits decides its colour; an icon never picks a colour of its own. */
const COLOURS: { label: string; token: string; className: string }[] = [
  {
    label: "On its own",
    token: "--color-icon-default",
    className: "styleguide__icon-colour--default",
  },
  {
    label: "In an icon chip",
    token: "--color-icon on --color-icon-surface",
    className: "styleguide__icon-colour--chip",
  },
  {
    label: "On navy",
    token: "--color-text-inverse",
    className: "styleguide__icon-colour--inverse",
  },
];

function IconTile({ name, marked = false }: { name: IconName; marked?: boolean }) {
  const inUse = marked && IN_USE.has(name);
  return (
    <li className={inUse ? "styleguide__icon styleguide__icon--in-use" : "styleguide__icon"}>
      <Icon name={name} size={24} />
      <code className="styleguide__icon-name">{name}</code>
      {marked ? (
        <span className="styleguide__icon-use">{inUse ? "In use" : "Library"}</span>
      ) : null}
    </li>
  );
}

/**
 * The icon set as dev needs it: every product icon by name, the three sizes,
 * the line, and where colour comes from. Drawn from the real Icon component,
 * so it cannot differ from what ships.
 */
export function IconGuide() {
  return (
    <>
      <div className="styleguide__group">
        <h3 className="styleguide__scale-title">The line</h3>
        <ul className="styleguide__icon-rules">
          <li>Hand-drawn on a 20 × 20 grid, scaled to size.</li>
          <li>One 1.5 line, round ends and corners, no fills except where a fill carries meaning (the open draft, the dock&apos;s color switch).</li>
          <li>Stroked in <code>currentColor</code>: an icon takes the color of what it sits in.</li>
          <li>Never on its own: every icon has a visible label, or a hidden one that screen readers read. The icon itself is hidden from them.</li>
          <li>No icon libraries. The library below is drawn ahead of need; a new icon is added here first, drawn to match, before any screen uses it.</li>
          <li>Names say what an icon is, not what it is for (<code>trash</code>, not <code>delete-draft</code>), lowercase with hyphens, direction last (<code>arrow-left</code>).</li>
        </ul>
      </div>

      {ICON_GROUPS.map((group) => (
        <div className="styleguide__group" key={group.title}>
          <h3 className="styleguide__scale-title">{group.title}</h3>
          <p className="styleguide__group-note">{group.note}</p>
          <ul className="styleguide__icons">
            {group.names.map((name) => (
              <IconTile name={name} key={name} marked />
            ))}
          </ul>
        </div>
      ))}

      <div className="styleguide__group">
        <h3 className="styleguide__scale-title">Sizes</h3>
        <p className="styleguide__group-note">Three sizes, and nothing between them.</p>
        <ul className="styleguide__icon-sizes">
          {SIZES.map(({ size, use }) => (
            <li className="styleguide__icon-size" key={size}>
              <span className="styleguide__icon-size-stage">
                <Icon name="home" size={size} />
              </span>
              <span className="styleguide__step-name">{size}px</span>
              <span className="styleguide__token-note">{use}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="styleguide__group">
        <h3 className="styleguide__scale-title">Color</h3>
        <p className="styleguide__group-note">
          Where an icon sits decides its color. In a button it takes the label&apos;s color.
        </p>
        <ul className="styleguide__icon-colours">
          {COLOURS.map(({ label, token, className }) => (
            <li className="styleguide__step" key={label}>
              <span className={`styleguide__icon-colour ${className}`}>
                <span className="styleguide__icon-chip">
                  <Icon name="flag" size={20} />
                </span>
              </span>
              <div className="styleguide__step-body">
                <span className="styleguide__step-name">{label}</span>
                <code className="styleguide__step-value">{token}</code>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="styleguide__group">
        <h3 className="styleguide__scale-title">Prototype only</h3>
        <p className="styleguide__group-note">The review dock and hub. Not part of the product, so not for dev.</p>
        <ul className="styleguide__icons styleguide__icons--quiet">
          {PROTOTYPE_ICONS.map((name) => (
            <IconTile name={name} key={name} />
          ))}
        </ul>
      </div>
    </>
  );
}
