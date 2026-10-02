import { Icon, type IconName } from "@/components/primitives/Icon";

/** The product icons, grouped by what they are for. */
const ICON_GROUPS: { title: string; note: string; names: IconName[] }[] = [
  {
    title: "Getting around",
    note: "Navigation, opening and closing.",
    names: ["home", "briefing", "calendar", "person", "compass", "menu", "chevron", "close", "sign-out"],
  },
  {
    title: "Doing",
    note: "Actions on the user's own work.",
    names: ["pencil", "draft", "link", "attach", "download", "trash", "send", "mic", "check"],
  },
  {
    title: "Things",
    note: "What a row or card is about.",
    names: ["document", "flag", "mail", "bell", "globe", "linkedin"],
  },
  {
    title: "Trust and brand",
    note: "Privacy, and the advisor's own mark.",
    names: ["lock", "shield", "spark"],
  },
];

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

function IconTile({ name }: { name: IconName }) {
  return (
    <li className="styleguide__icon">
      <Icon name={name} size={24} />
      <code className="styleguide__icon-name">{name}</code>
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
          <li>No icon libraries. A new icon is drawn to match this set.</li>
        </ul>
      </div>

      {ICON_GROUPS.map((group) => (
        <div className="styleguide__group" key={group.title}>
          <h3 className="styleguide__scale-title">{group.title}</h3>
          <p className="styleguide__group-note">{group.note}</p>
          <ul className="styleguide__icons">
            {group.names.map((name) => (
              <IconTile name={name} key={name} />
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
