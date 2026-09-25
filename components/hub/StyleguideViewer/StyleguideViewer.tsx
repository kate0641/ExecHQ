import { Panel } from "@/components/layout/Panel";
import { TextLink } from "@/components/primitives/TextLink";
import { getHubPage } from "@/lib/hub-pages";
import { Specimens } from "./Specimens";
import {
  CATEGORY_LABELS,
  readTokens,
  tokensIn,
  tokensWithPrefix,
  type Token,
} from "@/lib/tokens";

/**
 * A visual rendering of the design system.
 *
 * Every value here is read from `styles/tokens.css` at build time and referenced
 * with `var()`, so this page shows the system as it actually is. Changing a
 * token changes this page; nothing is restated.
 *
 * The buttons and form fields at the end are the real components, taken from
 * their own `*.states.ts` files through the registry — the same source the
 * component catalogue reads — so they cannot differ from what ships.
 */

function TokenRow({ token, children }: { token: Token; children?: React.ReactNode }) {
  return (
    <li className="styleguide__token">
      {children}
      <div className="styleguide__token-meta">
        <code className="styleguide__token-name">{token.name}</code>
        <code className="styleguide__token-value">{token.value}</code>
        {token.note ? <span className="styleguide__token-note">{token.note}</span> : null}
      </div>
    </li>
  );
}

function Swatches({ tokens, label }: { tokens: Token[]; label: string }) {
  return (
    <div className="styleguide__group">
      <h3 className="styleguide__group-title">{label}</h3>
      <ul className="styleguide__swatches">
        {tokens.map((token) => (
          <TokenRow token={token} key={token.name}>
            <span
              className="styleguide__swatch"
              style={{ backgroundColor: `var(${token.name})` }}
            />
          </TokenRow>
        ))}
      </ul>
    </div>
  );
}

/** The surface tokens, in the order a page stacks them, with what each is for. */
const SURFACES: { token: string; role: string; inverse?: boolean }[] = [
  { token: "--color-canvas", role: "Behind the device frame." },
  { token: "--color-surface", role: "The default page." },
  { token: "--color-surface-raised", role: "Cards above the page. Paired with a shadow." },
  { token: "--color-surface-muted", role: "Quiet areas that still read as the page." },
  { token: "--color-surface-sunken", role: "Wells, inset areas and code." },
  { token: "--color-surface-inverse", role: "The one dark moment on a screen.", inverse: true },
];

const TYPE_ROLES: { font: string; token: string; role: string }[] = [
  {
    font: "Red Hat Display",
    token: "--font-display",
    role: "Headings and UI labels. The primary face.",
  },
  {
    font: "Libre Baskerville",
    token: "--font-serif",
    role: "Pull quotes and editorial moments. Used sparingly.",
  },
  {
    font: "Inter",
    token: "--font-body",
    role: "Body copy and interface text.",
  },
];

export function StyleguideViewer() {
  const allTokens = readTokens();
  const colourTokens = allTokens.filter(
    (token) =>
      (token.category === "palette" ||
        token.category === "brand" ||
        token.category === "colour") &&
      token.name !== "--shadow-rgb"
  );
  const textSizes = tokensWithPrefix("--text-");
  const spacing = tokensIn("spacing");
  const radii = tokensIn("radii");
  const shadows = tokensIn("shadows").filter((token) => token.name !== "--shadow-rgb");
  const borderWidths = tokensWithPrefix("--border-width-");

  return (
    <div className="styleguide">
      <Panel
        title="Colour"
        headingLevel={2}
        description={`${colourTokens.length} colour tokens, read from styles/tokens.css. Greyscale for this sprint. The raw palette and the brand slots are the only things that change when navy, gold and slate blue arrive.`}
      >
        <Swatches
          tokens={colourTokens.filter((token) => token.category === "palette")}
          label={CATEGORY_LABELS.palette}
        />
        <Swatches
          tokens={colourTokens.filter((token) => token.category === "brand")}
          label={CATEGORY_LABELS.brand}
        />
        <Swatches
          tokens={colourTokens.filter((token) => token.category === "colour")}
          label={CATEGORY_LABELS.colour}
        />
      </Panel>

      <Panel
        title="Typography"
        headingLevel={2}
        description="Three faces, three jobs. The scale below is rendered in each of them so the roles can be compared directly."
      >
        {TYPE_ROLES.map((role) => (
          <div className="styleguide__group" key={role.token}>
            <h3 className="styleguide__group-title">
              {role.font} <code>{role.token}</code>
            </h3>
            <p className="styleguide__group-note">{role.role}</p>
            <ul className="styleguide__type-scale">
              {textSizes.map((token) => (
                <TokenRow token={token} key={`${role.token}-${token.name}`}>
                  <span
                    className="styleguide__type-sample"
                    style={{
                      fontFamily: `var(${role.token})`,
                      fontSize: `var(${token.name})`,
                    }}
                  >
                    Your career doesn&apos;t pause
                  </span>
                </TokenRow>
              ))}
            </ul>
          </div>
        ))}
      </Panel>

      <Panel
        title="Spacing"
        headingLevel={2}
        description="A 4px base. Every gap, padding and margin in the prototype comes from this scale."
      >
        <ul className="styleguide__bars">
          {spacing.map((token) => (
            <TokenRow token={token} key={token.name}>
              <span
                className="styleguide__bar"
                style={{ width: `var(${token.name})` }}
              />
            </TokenRow>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Surfaces"
        headingLevel={2}
        description="What a screen is built on, from the canvas up. Text on each is the colour that belongs there."
      >
        <ul className="styleguide__surfaces">
          {SURFACES.map((surface) => (
            <li className="styleguide__token" key={surface.token}>
              <span
                className="styleguide__surface"
                style={{
                  backgroundColor: `var(${surface.token})`,
                  color: surface.inverse
                    ? "var(--color-text-inverse)"
                    : "var(--color-text-primary)",
                  boxShadow:
                    surface.token === "--color-surface-raised"
                      ? "var(--shadow-sm)"
                      : undefined,
                }}
              >
                Your next role, planned
              </span>
              <div className="styleguide__token-meta">
                <code className="styleguide__token-name">{surface.token}</code>
                <span className="styleguide__token-note">{surface.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Radii" headingLevel={2}>
        <ul className="styleguide__tiles">
          {radii.map((token) => (
            <TokenRow token={token} key={token.name}>
              <span
                className="styleguide__tile"
                style={{ borderRadius: `var(${token.name})` }}
              />
            </TokenRow>
          ))}
        </ul>
      </Panel>

      <Panel title="Shadows" headingLevel={2}>
        <ul className="styleguide__tiles">
          {shadows.map((token) => (
            <TokenRow token={token} key={token.name}>
              <span
                className="styleguide__tile styleguide__tile--plain"
                style={{ boxShadow: `var(${token.name})` }}
              />
            </TokenRow>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Borders"
        headingLevel={2}
        description="Three widths, and the composed border shorthands the stylesheet uses most."
      >
        <ul className="styleguide__bars">
          {borderWidths.map((token) => (
            <TokenRow token={token} key={token.name}>
              <span
                className="styleguide__rule"
                style={{ borderTopWidth: `var(${token.name})` }}
              />
            </TokenRow>
          ))}
        </ul>
        <ul className="styleguide__bars">
          {tokensWithPrefix("--border-")
            .filter((token) => !token.name.startsWith("--border-width-"))
            .map((token) => (
              <TokenRow token={token} key={token.name}>
                <span
                  className="styleguide__rule styleguide__rule--composed"
                  style={{ borderTop: `var(${token.name})` }}
                />
              </TokenRow>
            ))}
        </ul>
      </Panel>

      <Panel
        title="Buttons"
        headingLevel={2}
        description="Every button variant and state, rendered from the real component."
        actions={
          <TextLink href={getHubPage("components").href} tone="standalone">
            Every component in the catalogue
          </TextLink>
        }
      >
        <Specimens id="button" />
        <Specimens id="textlink" />
      </Panel>

      <Panel
        title="Form fields"
        headingLevel={2}
        description="Text fields, choice chips and toggles, in each of their states."
      >
        <Specimens id="input" />
        <Specimens id="chipgroup" />
        <Specimens id="togglegroup" />
      </Panel>
    </div>
  );
}

export default StyleguideViewer;
