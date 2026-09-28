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
  if (tokens.length === 0) return null;
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

/** The main brand colours, by role. Each points at a palette name in tokens.css. */
const BRAND_GROUPS: {
  title: string;
  role: string;
  colours: { token: string; name: string; role?: string }[];
}[] = [
  {
    title: "Primary",
    role: "The colours that make a screen ExecHQ.",
    colours: [
      { token: "--brand-navy", name: "Navy" },
      { token: "--brand-bright-yellow", name: "Bright yellow" },
      { token: "--brand-gold-yellow", name: "Gold yellow" },
    ],
  },
  {
    title: "Secondary",
    role: "Supporting colours, used in smaller amounts.",
    colours: [
      { token: "--brand-light-green", name: "Light green" },
      { token: "--brand-dark-green", name: "Dark green" },
      { token: "--brand-light-blue", name: "Light blue" },
      { token: "--brand-orange", name: "Orange" },
    ],
  },
  {
    title: "Neutral",
    role: "One neutral: stone. Its 100 is the page, its 900 the near-black used in place of black.",
    colours: [
      { token: "--brand-stone", name: "Stone", role: "Lights" },
      { token: "--brand-stone-900", name: "Stone 900", role: "Darks" },
    ],
  },
];

const VAR_REFERENCE = /^var\((--[\w-]+)\)$/;

/** Follows a token's var() references down to the scale step it lands on. */
function resolve(name: string, tokens: Map<string, Token>): Token | undefined {
  let token = tokens.get(name);
  let target = token && VAR_REFERENCE.exec(token.value)?.[1];
  while (target && tokens.has(target)) {
    token = tokens.get(target);
    target = token && VAR_REFERENCE.exec(token.value)?.[1];
  }
  return token;
}

/** "--brand-blue-800" → "Blue 800". */
function stepLabel(name: string): string | undefined {
  const match = /^--brand-([a-z]+)-(\d00)$/.exec(name);
  return match ? `${match[1][0].toUpperCase()}${match[1].slice(1)} ${match[2]}` : undefined;
}

function BrandColours({ tokens }: { tokens: Map<string, Token> }) {
  return (
    <>
      {BRAND_GROUPS.map((group) => (
        <div className="styleguide__group" key={group.title}>
          <h3 className="styleguide__scale-title">{group.title}</h3>
          <p className="styleguide__group-note">{group.role}</p>
          <ul className="styleguide__brand-colours">
            {group.colours.map((colour) => {
              const step = resolve(colour.token, tokens);
              if (!step) return null;
              return (
                <li className="styleguide__step" key={colour.token}>
                  <span
                    className="styleguide__step-swatch styleguide__step-swatch--large"
                    style={{ backgroundColor: `var(${colour.token})` }}
                  />
                  <div className="styleguide__step-body">
                    {colour.role ? <span className="t-eyebrow">{colour.role}</span> : null}
                    <span className="styleguide__step-name">{colour.name}</span>
                    <code className="styleguide__step-value">{step.value}</code>
                    <span className="styleguide__token-note">{stepLabel(step.name)}</span>
                    <code className="styleguide__step-value">{colour.token}</code>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

/** The five brand scales, in the order the page shows them, with what each is for. */
const SCALES: { key: string; title: string; role: string }[] = [
  {
    key: "blue",
    title: "Blue",
    role: "Navy (800) carries links, focus rings, dark panels and the approved badge. Slate (900) is its deep end: pressed navy and deep backgrounds. Light blue (200) is the soft secondary.",
  },
  {
    key: "green",
    title: "Green",
    role: "Success. Dark green (800) is its text and border, green 100 its surface.",
  },
  {
    key: "yellow",
    title: "Yellow",
    role: "Bright yellow (400) is the primary button, 500 on hover and 600 pressed. Gold yellow (700) is for small accents on light, and is the warning colour.",
  },
  {
    key: "orange",
    title: "Orange",
    role: "Orange into red. From 600 the scale turns red for danger (border 600, text 700). The palette orange (400) is too light for text on white.",
  },
  {
    key: "stone",
    title: "Stone",
    role: "The one neutral. 100 is the platform's page; 200 and 300 are quiet, hover and pressed surfaces; 400 to 600 are borders and secondary text; 900 is the near-black used in place of black.",
  },
];

const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

/** The semantic colour tokens that resolve to each token, through any aliases. */
function colourUses(tokens: Token[]): Map<string, string[]> {
  const values = new Map(tokens.map((token) => [token.name, token.value]));
  const uses = new Map<string, string[]>();
  for (const token of tokens) {
    if (!token.name.startsWith("--color-")) continue;
    let value = token.value;
    let target = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    while (target && values.has(target)) {
      uses.set(target, [...(uses.get(target) ?? []), token.name]);
      value = values.get(target) ?? "";
      target = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    }
  }
  return uses;
}

function Scale({
  scale,
  tokens,
  uses,
}: {
  scale: (typeof SCALES)[number];
  tokens: Map<string, Token>;
  uses: Map<string, string[]>;
}) {
  const steps = STEPS.flatMap((step) => {
    const token = tokens.get(`--brand-${scale.key}-${step}`);
    return token ? [{ step, token }] : [];
  });
  if (steps.length === 0) return null;
  return (
    <div className="styleguide__group">
      <h3 className="styleguide__scale-title">{scale.title}</h3>
      <p className="styleguide__group-note">
        {scale.role} Tokens <code>--brand-{scale.key}-100</code> to <code>-900</code>.
      </p>
      <ul className="styleguide__scale">
        {steps.map(({ step, token }) => (
          <li className="styleguide__step" key={token.name}>
            <span
              className="styleguide__step-swatch"
              style={{ backgroundColor: `var(${token.name})` }}
            />
            <div className="styleguide__step-body">
              <span className="styleguide__step-name">
                {scale.title} {step}
              </span>
              <code className="styleguide__step-value">{token.value}</code>
              {token.note ? <span className="styleguide__token-note">{token.note}</span> : null}
              {uses.get(token.name)?.length ? (
                <ul className="styleguide__step-uses" aria-label="Used by">
                  {uses.get(token.name)?.map((use) => (
                    <li key={use}>
                      <code>{use}</code>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The surface tokens, in the order a page stacks them, with what each is for. */
const SURFACES: { token: string; role: string; inverse?: boolean }[] = [
  { token: "--color-canvas", role: "Behind the device frame." },
  { token: "--color-surface", role: "The default page: stone, the platform's own colour." },
  { token: "--color-surface-raised", role: "Cards and fields above the page, in white." },
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
  const tokenMap = new Map(allTokens.map((token) => [token.name, token]));
  const uses = colourUses(allTokens);
  const scaleStep = new RegExp(`^--brand-(${SCALES.map((s) => s.key).join("|")})-\\d00$`);
  const textSizes = tokensWithPrefix("--text-");
  const spacing = tokensIn("spacing");
  const radii = tokensIn("radii");
  const shadows = tokensIn("shadows").filter((token) => token.name !== "--shadow-rgb");
  const borderWidths = tokensWithPrefix("--border-width-");

  return (
    <div className="styleguide">
      <Panel
        title="Brand colours"
        headingLevel={2}
        description="The main colours, by role. Each sits on one of the scales below; all but slate at their exact palette value."
      >
        <BrandColours tokens={tokenMap} />
      </Panel>

      <Panel
        title="Colour"
        headingLevel={2}
        description={`${colourTokens.length} colour tokens, read from styles/tokens.css. The five brand scales come first, 100 to 900, with the nine palette colours named; everything else is built from them.`}
      >
        <Swatches
          tokens={colourTokens.filter((token) => token.category === "palette")}
          label={CATEGORY_LABELS.palette}
        />
        {SCALES.map((scale) => (
          <Scale scale={scale} tokens={tokenMap} uses={uses} key={scale.key} />
        ))}
        <Swatches
          tokens={colourTokens.filter(
            (token) => token.category === "brand" && !scaleStep.test(token.name)
          )}
          label="White, palette names and brand slots"
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
