import { Inter, Libre_Baskerville, Red_Hat_Display } from "next/font/google";

/**
 * The prototype's typefaces, one per role. This is the one place a typeface
 * is chosen: swapping one means changing it here and nothing else.
 *
 * Each face is exposed as a CSS variable named for its role, not its family,
 * and styles/tokens.css builds the font tokens on those, with fallbacks:
 *
 *   Red Hat Display   → headings and UI labels   → --font-display-face → --font-display
 *   Libre Baskerville → pull quotes, editorial   → --font-serif-face   → --font-serif
 *   Inter             → body copy and interface  → --font-body-face    → --font-body
 *
 * Only next/font/google may load a face — no new packages, no <link> tags,
 * no @import from Google Fonts. app/layout.tsx applies the `.variable`
 * classes to <html>.
 */

export const displayFont = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
});

export const serifFont = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-face",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-face",
});
