/**
 * Reads the design tokens out of `styles/tokens.css` at build time.
 *
 * The stylesheet viewer renders from this, so it shows what the tokens file
 * actually says rather than a second copy of the values that could drift.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type TokenCategory =
  | "palette"
  | "brand"
  | "colour"
  | "typography"
  | "spacing"
  | "radii"
  | "borders"
  | "shadows"
  | "motion"
  | "layout"
  | "other";

export interface Token {
  /** Full custom property name, including the leading dashes. */
  name: string;
  /** Value exactly as declared, which may itself be a var() reference. */
  value: string;
  /** Trailing comment on the declaration, where there is one. */
  note?: string;
  category: TokenCategory;
}

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  palette: "Raw palette",
  brand: "Brand slots",
  colour: "Semantic colour",
  typography: "Typography",
  spacing: "Spacing",
  radii: "Radii",
  borders: "Borders",
  shadows: "Shadows",
  motion: "Motion",
  layout: "Layout and device",
  other: "Other",
};

export const CATEGORY_ORDER: readonly TokenCategory[] = [
  "palette",
  "brand",
  "colour",
  "typography",
  "spacing",
  "radii",
  "shadows",
  "borders",
  "layout",
  "motion",
  "other",
];

function categorise(name: string): TokenCategory {
  if (name.startsWith("--grey-") || name === "--shadow-rgb") return "palette";
  if (name.startsWith("--brand-")) return "brand";
  if (name.startsWith("--color-")) return "colour";
  if (
    name.startsWith("--font-") ||
    name.startsWith("--text-") ||
    name.startsWith("--leading-") ||
    name.startsWith("--weight-") ||
    name.startsWith("--tracking-")
  ) {
    return "typography";
  }
  if (name.startsWith("--space-")) return "spacing";
  if (name.startsWith("--radius-")) return "radii";
  if (name.startsWith("--border-")) return "borders";
  if (name.startsWith("--shadow-")) return "shadows";
  if (name.startsWith("--duration-") || name.startsWith("--easing-")) return "motion";
  if (
    name.startsWith("--viewport-") ||
    name.startsWith("--device-") ||
    name.startsWith("--z-") ||
    name.startsWith("--focus-") ||
    name.startsWith("--devtools-") ||
    name.startsWith("--hub-") ||
    name.startsWith("--content-")
  ) {
    return "layout";
  }
  return "other";
}

const DECLARATION = /^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/;

let cache: Token[] | null = null;

export function readTokens(): Token[] {
  if (cache) return cache;

  const source = readFileSync(join(process.cwd(), "styles", "tokens.css"), "utf8");
  const tokens: Token[] = [];

  for (const line of source.split("\n")) {
    const match = DECLARATION.exec(line);
    if (!match) continue;
    const [, name, rawValue, note] = match;
    tokens.push({
      name,
      value: rawValue.trim(),
      note: note || undefined,
      category: categorise(name),
    });
  }

  cache = tokens;
  return tokens;
}

export function tokensByCategory(): { category: TokenCategory; tokens: Token[] }[] {
  const all = readTokens();
  return CATEGORY_ORDER.map((category) => ({
    category,
    tokens: all.filter((token) => token.category === category),
  })).filter((entry) => entry.tokens.length > 0);
}

/** Tokens in one category, in the order they are declared in the file. */
export function tokensIn(category: TokenCategory): Token[] {
  return readTokens().filter((token) => token.category === category);
}

/** Tokens in a category whose names start with one of the given prefixes. */
export function tokensWithPrefix(prefix: string): Token[] {
  return readTokens().filter((token) => token.name.startsWith(prefix));
}
