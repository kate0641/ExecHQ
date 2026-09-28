import type { Metadata } from "next";
import { FlowList } from "@/components/hub/FlowList";
import { HubNav } from "@/components/hub/HubNav";
import { PrototypeShell } from "@/components/layout/PrototypeShell";
import { ViewportProvider } from "@/lib/viewport-context";
import { bodyFont, displayFont, serifFont } from "@/styles/fonts";
import "./globals.css";

/* The typefaces are chosen in styles/fonts.ts (see CLAUDE.md, "Font roles");
   the layout only applies them. */

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
    displayFont.variable,
    serifFont.variable,
    bodyFont.variable,
  ].join(" ");

  return (
    <html lang="en-GB" className={fontVariables}>
      <body>
        <ViewportProvider>
          <a className="u-skip-link" href="#main">
            Skip to content
          </a>
          {/* Neither of these uses client hooks, so they render on the server
              here and slot into the client-side panel as children. */}
          <PrototypeShell
            hubIndex={
              <>
                <HubNav variant="stacked" label="Prototype pages" />
                <FlowList compact headingLevel={3} />
              </>
            }
          >
            {children}
          </PrototypeShell>
        </ViewportProvider>
      </body>
    </html>
  );
}
