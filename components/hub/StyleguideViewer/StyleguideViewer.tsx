import { Notice, type NoticeTone } from "@/components/onboarding/Notice";
import { Badge, type FeedbackBadgeTone } from "@/components/primitives/Badge";
import { Logo, type LogoTone } from "@/components/primitives/Logo";
import { TextLink } from "@/components/primitives/TextLink";
import { getHubPage } from "@/lib/hub-pages";
import { IconGuide } from "./IconGuide";
import { Specimens } from "./Specimens";
import { StyleguideSections } from "./StyleguideSections";
import { TypeLab, type TypeLabRole } from "./TypeLab";
import {
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

/** The main brand colours, by role. Each points at a palette name in tokens.css. */
const BRAND_GROUPS: {
  title: string;
  role: string;
  colours: { token: string; name: string; role?: string }[];
}[] = [
  {
    title: "Primary",
    role: "The colors that make a screen ExecHQ.",
    colours: [
      { token: "--brand-navy", name: "Navy" },
      { token: "--brand-bright-yellow", name: "Bright yellow" },
    ],
  },
  {
    title: "Secondary",
    role: "Supporting colors, used in smaller amounts.",
    colours: [
      { token: "--brand-gold-yellow", name: "Gold yellow" },
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
      { token: "--brand-white", name: "White", role: "Cards and fields" },
    ],
  },
];

/** The semantic colour tokens, grouped by the job they do. First match wins. */
const ROLE_GROUPS: { title: string; note: string; prefixes: string[]; kind?: "samples" }[] = [
  {
    title: "Brand slots",
    note: "What the semantic tokens reach for. Swap a slot and every role built on it follows.",
    prefixes: ["--brand-primary", "--brand-accent", "--brand-secondary"],
  },
  {
    title: "Surfaces",
    note: "What a screen is built on, from the canvas up, and how surfaces respond to the pointer.",
    prefixes: ["--color-canvas", "--color-surface"],
  },
  {
    title: "Action and accent",
    note: "The primary button, gold accents and the soft secondary.",
    prefixes: ["--color-action", "--color-text-on-action", "--color-accent", "--color-text-on-accent", "--color-secondary"],
  },
  {
    title: "Text",
    note: "Primary for reading, secondary for support, muted for metadata. Inverse sits on navy.",
    prefixes: ["--color-text-"],
  },
  {
    title: "Borders",
    note: "Subtle and default are decorative; strong is the one controls use.",
    prefixes: ["--color-border"],
  },
  {
    title: "Focus, overlay and masks",
    note: "Focus rings, the scrim behind dialogs, the mic's listening pulse, and the mask that fades scrolling content at an edge.",
    prefixes: ["--color-focus", "--color-overlay", "--color-listening", "--color-mask"],
  },
  {
    title: "Feedback",
    note: "Each tone is a halo dot (a mid-tone centre in a bright ring), drawn here with the real notice and tag. Border and text are the field error; surface is the catalogue's problem box.",
    prefixes: ["--color-feedback-"],
    kind: "samples",
  },
  {
    title: "Status badges",
    note: "The draft, in-review and approved badges on the hub and in the catalogue.",
    prefixes: ["--color-status-"],
    kind: "samples",
  },
  {
    title: "Device frame",
    note: "The phone and tablet drawn around the canvas. Prototype chrome, not product.",
    prefixes: ["--color-device-"],
  },
];

/** Feedback and status tokens come in sets per tone. Feedback is drawn with
 *  the real Notice and Badge; status badges with their three tokens. */
const SAMPLE_SETS: {
  group: string;
  tone: string;
  label: string;
  prefix: string;
  notice?: NoticeTone;
}[] = [
  { group: "Feedback", tone: "info", label: "Info", prefix: "--color-feedback-info-", notice: "info" },
  { group: "Feedback", tone: "success", label: "Success", prefix: "--color-feedback-success-", notice: "success" },
  { group: "Feedback", tone: "warning", label: "Warning", prefix: "--color-feedback-warning-", notice: "explain" },
  { group: "Feedback", tone: "danger", label: "Danger", prefix: "--color-feedback-danger-", notice: "problem" },
  { group: "Status badges", tone: "draft", label: "Draft", prefix: "--color-status-draft-" },
  { group: "Status badges", tone: "review", label: "In review", prefix: "--color-status-review-" },
  { group: "Status badges", tone: "approved", label: "Approved", prefix: "--color-status-approved-" },
];

/** Where a token lands, in words: the scale step and its value, e.g. "Stone 900 · <hex>". */
function landsOn(name: string, tokens: Map<string, Token>): string {
  const step = resolve(name, tokens);
  if (!step) return "";
  if (VAR_REFERENCE.test(step.value)) return step.value;
  // A halo is its bright colour softened towards white.
  const mixed = /^color-mix\(in srgb, var\((--[\w-]+)\) (\d+)%/.exec(step.value);
  if (mixed) {
    const base = resolve(mixed[1], tokens);
    const baseLabel = base ? stepLabel(base.name) : undefined;
    return baseLabel ? `${baseLabel} at ${mixed[2]}%, softened with white` : step.value;
  }
  const label =
    stepLabel(step.name) ?? (step.name === "--brand-white" ? "White" : undefined);
  return label ? `${label} · ${step.value}` : step.value;
}

function RoleRow({ token, tokens }: { token: Token; tokens: Map<string, Token> }) {
  return (
    <li className="styleguide__role">
      <span
        className="styleguide__role-swatch"
        style={{ backgroundColor: `var(${token.name})` }}
      />
      <div className="styleguide__token-meta">
        <code className="styleguide__token-name">{token.name}</code>
        <span className="styleguide__token-value">{landsOn(token.name, tokens)}</span>
        {token.note ? <span className="styleguide__token-note">{token.note}</span> : null}
      </div>
    </li>
  );
}

function Sample({
  set,
  tokens,
}: {
  set: (typeof SAMPLE_SETS)[number];
  tokens: Map<string, Token>;
}) {
  const part = (end: string) => `${set.prefix}${end}`;
  const isBadge = set.group === "Status badges";
  if (set.notice) {
    return (
      <li className="styleguide__sample-item">
        <Notice tone={set.notice} label={set.label}>
          An example {set.label.toLowerCase()} notice.
        </Notice>
        <Badge tone={set.tone as FeedbackBadgeTone}>{set.label} tag</Badge>
        <ul className="styleguide__sample-tokens">
          {["dot", "halo", "border", "text", "surface"].map((end) =>
            tokens.has(part(end)) ? (
              <li key={end}>
                <code>{part(end)}</code>
                <span>{landsOn(part(end), tokens)}</span>
              </li>
            ) : null
          )}
        </ul>
      </li>
    );
  }
  return (
    <li className="styleguide__sample-item">
      <div
        className={isBadge ? "styleguide__sample styleguide__sample--badge" : "styleguide__sample"}
        style={{
          backgroundColor: `var(${part("surface")})`,
          borderColor: `var(${part("border")})`,
          color: `var(${part("text")})`,
        }}
      >
        {set.label}
      </div>
      <ul className="styleguide__sample-tokens">
        {["surface", "text", "border"].map((end) =>
          tokens.has(part(end)) ? (
            <li key={end}>
              <code>{part(end)}</code>
              <span>{landsOn(part(end), tokens)}</span>
            </li>
          ) : null
        )}
      </ul>
    </li>
  );
}

function ColourRoles({ roleTokens, tokens }: { roleTokens: Token[]; tokens: Map<string, Token> }) {
  const groupOf = (name: string) =>
    ROLE_GROUPS.find((group) => group.prefixes.some((prefix) => name.startsWith(prefix)))?.title ??
    "Other";
  const groups = [...ROLE_GROUPS, { title: "Other", note: "Color tokens no group above claims.", prefixes: [] }];
  return (
    <>
      {groups.map((group) => {
        const members = roleTokens.filter((token) => groupOf(token.name) === group.title);
        if (members.length === 0) return null;
        const sets = SAMPLE_SETS.filter((set) => set.group === group.title);
        return (
          <div className="styleguide__group" key={group.title}>
            <h3 className="styleguide__scale-title">{group.title}</h3>
            <p className="styleguide__group-note">{group.note}</p>
            {"kind" in group && group.kind === "samples" ? (
              <ul className="styleguide__samples">
                {sets.map((set) => (
                  <Sample set={set} tokens={tokens} key={set.tone} />
                ))}
              </ul>
            ) : (
              <ul className="styleguide__roles">
                {members.map((token) => (
                  <RoleRow token={token} tokens={tokens} key={token.name} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

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

/** The two logo versions, and every background each one may sit on. */
const LOGO_RULES: {
  tone: LogoTone;
  title: string;
  role: string;
  backgrounds: { token: string; name: string; use?: string }[];
}[] = [
  {
    tone: "dark",
    title: "Dark logo",
    role: "Gold and navy. Sits on stone and blue 100. Not on light blue (blue 200): the gold falls to 4.2:1 there.",
    backgrounds: [
      { token: "--brand-stone", name: "Stone" },
      { token: "--brand-blue-100", name: "Blue 100" },
    ],
  },
  {
    tone: "light",
    title: "Light logo",
    role: "Bright yellow and light blue. Sits on a dark color, and in most cases on navy or the darkest navy: the logo stays in some form of navy. Dark green is the secondary choice; stone 900 is kept but largely unused for now.",
    backgrounds: [
      { token: "--brand-navy", name: "Navy", use: "Primary" },
      { token: "--brand-blue-900", name: "Darkest navy", use: "Primary" },
      { token: "--brand-dark-green", name: "Dark green", use: "Secondary" },
      { token: "--brand-stone-900", name: "Stone 900", use: "Tertiary" },
    ],
  },
];

function LogoRules() {
  return (
    <>
      {LOGO_RULES.map((rule) => (
        <div className="styleguide__group" key={rule.tone}>
          <h3 className="styleguide__scale-title">{rule.title}</h3>
          <p className="styleguide__group-note">{rule.role}</p>
          <ul className="styleguide__logos">
            {rule.backgrounds.map((background) => (
              <li className="styleguide__step" key={background.token}>
                <div
                  className="styleguide__logo-stage"
                  style={{ backgroundColor: `var(${background.token})` }}
                >
                  <Logo tone={rule.tone} size="xl" />
                </div>
                <div className="styleguide__step-body">
                  {background.use ? (
                    <span className="styleguide__step-use">{background.use}</span>
                  ) : null}
                  <span className="styleguide__step-name">On {background.name.toLowerCase()}</span>
                  <code className="styleguide__step-value">{background.token}</code>
                </div>
              </li>
            ))}
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
    role: "Navy (800) carries links, focus rings, dark panels and the approved badge. Blue 900, the darkest navy, is its deep end: pressed navy and deep backgrounds. Light blue (200) is the soft secondary.",
  },
  {
    key: "green",
    title: "Green",
    role: "Success. Dark green (800) is its text and border, green 100 its surface.",
  },
  {
    key: "yellow",
    title: "Yellow",
    role: "Bright yellow (400) is the primary button, 500 on hover and 600 pressed. Gold yellow (700) is for small accents on light, and is the warning color.",
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
  { token: "--color-surface", role: "The default page: stone, the platform's own color." },
  { token: "--color-surface-raised", role: "Cards and fields above the page, in white." },
  { token: "--color-surface-muted", role: "Quiet areas that still read as the page." },
  { token: "--color-surface-sunken", role: "Wells, inset areas and code." },
  { token: "--color-surface-inverse", role: "The one dark moment on a screen.", inverse: true },
];

const TYPE_ROLES: { font: string; token: string; role: string }[] = [
  {
    font: "Kulim Park",
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

/** The type roles, in the order the lab lists them, with what each is for. */
const TYPE_LAB_ROLES: { key: string; name: string; job: string; phone?: boolean }[] = [
  { key: "display", name: "Display", job: "Welcome, privacy", phone: true },
  { key: "title", name: "Title", job: "One per screen", phone: true },
  { key: "heading", name: "Heading", job: "Sections, card titles", phone: true },
  { key: "subheading", name: "Subheading", job: "Rows, links, reads" },
  { key: "body", name: "Body", job: "Reading text" },
  { key: "body-sm", name: "Body small", job: "Supporting text" },
  { key: "label", name: "Label", job: "Buttons, field labels" },
  { key: "caption", name: "Caption", job: "Dates, hints, status" },
  { key: "eyebrow", name: "Eyebrow", job: "Capitals above a heading" },
  { key: "figure", name: "Figure", job: "Numbers shown as data" },
  { key: "editorial", name: "Editorial", job: "Quotes, welcome lines", phone: true },
];

function typeLabRoles(tokens: Map<string, Token>): TypeLabRole[] {
  const value = (name: string) => tokens.get(name)?.value ?? "";
  return TYPE_LAB_ROLES.map((role) => {
    const sizeToken = role.phone ? `--type-${role.key}-size-phone` : `--type-${role.key}-size`;
    return {
      key: role.key,
      name: role.name,
      job: role.job,
      sizeToken,
      values: {
        font: value(`--type-${role.key}-font`),
        size: value(sizeToken),
        weight: value(`--type-${role.key}-weight`),
        leading: value(`--type-${role.key}-leading`),
        tracking: value(`--type-${role.key}-tracking`),
        "word-spacing": value(`--type-${role.key}-word-spacing`),
      },
    };
  });
}

export function StyleguideViewer() {
  // The greyscale block at the foot of tokens.css restates some tokens for
  // when colour is off; the page shows each token once, as first declared.
  const allTokens = readTokens().filter(
    (token, index, list) => list.findIndex((other) => other.name === token.name) === index
  );
  const colourTokens = allTokens.filter(
    (token) =>
      (token.category === "palette" ||
        token.category === "brand" ||
        token.category === "colour") &&
      token.name !== "--shadow-rgb"
  );
  const tokenMap = new Map(allTokens.map((token) => [token.name, token]));
  const uses = colourUses(allTokens);
  const slots = ROLE_GROUPS[0].prefixes;
  const roleTokens = colourTokens.filter(
    (token) =>
      token.category === "colour" || slots.some((prefix) => token.name.startsWith(prefix))
  );
  const textSizes = tokensWithPrefix("--text-");
  const spacing = tokensIn("spacing");
  const radii = tokensIn("radii");
  const shadows = tokensIn("shadows").filter((token) => token.name !== "--shadow-rgb");
  const borderWidths = tokensWithPrefix("--border-width-");

  return (
    <StyleguideSections
      sections={[
        {
          id: "logo",
          label: "Logo",
          group: "Brand",
          description: "Two versions of one logo. The dark logo sits on stone and blue 100; the light logo sits on any dark color.",
          source: "components/primitives/Logo",
          content: (
          <div className="styleguide-layout__card">
            <LogoRules />
          </div>
          ),
        },
        {
          id: "brand-colors",
          label: "Brand colors",
          group: "Color",
          description: "The main colors, by role. Each sits on one of the scales below at its exact palette value.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
            <BrandColours tokens={tokenMap} />
          </div>
          ),
        },
        {
          id: "color-scales",
          label: "Color scales",
          group: "Color",
          description: "Five scales, 100 to 900, with the palette colors named. Everything else is built from them.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card styleguide-layout__card--plain">
            {SCALES.map((scale) => (
              <Scale scale={scale} tokens={tokenMap} uses={uses} key={scale.key} />
            ))}
          </div>
          ),
        },
        {
          id: "color-roles",
          label: "Color roles",
          group: "Color",
          description: `${roleTokens.length} tokens the interface actually uses, grouped by job. Each shows the scale step it lands on.`,
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
            <ColourRoles roleTokens={roleTokens} tokens={tokenMap} />
          </div>
          ),
        },
        {
          id: "typography",
          label: "Typefaces",
          group: "Type",
          description: "Three faces, three jobs. The scale below is rendered in each of them so the roles can be compared directly.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "type-roles",
          label: "Type roles",
          group: "Type",
          description: "Every piece of text is one of eleven roles. Change a role here to try it on real components at phone size; nothing is saved until it goes into styles/tokens.css.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
            <TypeLab roles={typeLabRoles(tokenMap)} />
          </div>
          ),
        },
        {
          id: "icons",
          label: "Icons",
          group: "Icons",
          description: "One hand-drawn set, one line weight, three sizes. Every icon here is the real Icon component, so this is the set as it ships.",
          source: "components/primitives/Icon",
          content: (
          <div className="styleguide-layout__card">
            <IconGuide />
          </div>
          ),
        },
        {
          id: "spacing",
          label: "Spacing",
          group: "Layout",
          description: "A 4px base. Every gap, padding and margin in the prototype comes from this scale.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "surfaces",
          label: "Surfaces",
          group: "Layout",
          description: "What a screen is built on, from the canvas up. Text on each is the color that belongs there.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "radii",
          label: "Radii",
          group: "Layout",
          description: "Corner rounding, from small controls up to the device frame.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "shadows",
          label: "Shadows",
          group: "Layout",
          description: "Depth, tinted with the darkest navy so it reads as depth rather than dirt.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "borders",
          label: "Borders",
          group: "Layout",
          description: "Three widths, and the composed border shorthands the stylesheet uses most.",
          source: "styles/tokens.css",
          content: (
          <div className="styleguide-layout__card">
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
          </div>
          ),
        },
        {
          id: "buttons",
          label: "Buttons",
          group: "Components",
          description: "Every button variant and state, rendered from the real component.",
          actions: (
            <TextLink href={getHubPage("components").href} tone="standalone">
                Every component in the catalogue
              </TextLink>
          ),
          source: "components/primitives/Button",
          content: (
          <div className="styleguide-layout__card">
            <Specimens id="button" />
            <Specimens id="textlink" />
          </div>
          ),
        },
        {
          id: "form-fields",
          label: "Form fields",
          group: "Components",
          description: "Text fields, choice chips and toggles, in each of their states.",
          source: "components/form",
          content: (
          <div className="styleguide-layout__card">
            <Specimens id="input" />
            <Specimens id="chipgroup" />
            <Specimens id="togglegroup" />
          </div>
          ),
        },
      ]}
    />
  );
}

export default StyleguideViewer;
