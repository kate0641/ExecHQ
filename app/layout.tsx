import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Red_Hat_Display } from "next/font/google";
import "./globals.css";

/**
 * Font roles (see CLAUDE.md):
 *   Red Hat Display  → headings and UI labels    → --font-display
 *   Libre Baskerville → pull quotes, editorial   → --font-serif
 *   Inter            → body copy and interface   → --font-body
 */
const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-red-hat-display",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ExecHQ prototype",
    template: "%s · ExecHQ prototype",
  },
  description:
    "Design prototype for ExecHQ — a private career advisor for senior managers through SVPs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVariables = [
    redHatDisplay.variable,
    libreBaskerville.variable,
    inter.variable,
  ].join(" ");

  return (
    <html lang="en-GB" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
