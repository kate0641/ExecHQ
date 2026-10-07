import { Inter, Kulim_Park, Libre_Baskerville } from "next/font/google";

/**
 * The prototype's typefaces, one per role. This is the one place a typeface
 * is chosen: swapping one means changing it here and nothing else.
 *
 * Each face is exposed as a CSS variable named for its role, not its family,
 * and styles/tokens.css builds the font tokens on those, with fallbacks:
 *
 *   Kulim Park        → headings and UI labels   → --font-display-face → --font-display
 *   Libre Baskerville → pull quotes, editorial   → --font-serif-face   → --font-serif
 *   Inter             → body copy and interface  → --font-body-face    → --font-body
 *
 * Kulim Park is not a variable font, so its weights are listed: 200, 300,
 * 400, 600 and 700. It has no 500, so the type scale has no medium weight:
 * anything that would be medium is set in --weight-semibold instead.
 *
 * Only next/font/google may load a face — no new packages, no <link> tags,
 * no @import from Google Fonts. app/layout.tsx applies the `.variable`
 * classes to <html>.
 */

export const displayFont = Kulim_Park({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700"],
  variable: "--font-display-face",
});

export const serifFont = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-face",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-face",
});
