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
    <html lang="en-GB" className={fontVariables} data-color="off" suppressHydrationWarning>
      <head>
        {/* Sets the colour mode before first paint so a reviewer who chose
            colour does not see a flash of grey. Same rule as lib/color-mode.tsx:
            greyscale unless colour was chosen, and always colour on the
            prototype's own pages. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var p=location.pathname,own=p==="/"||p==="/showroom"||p.indexOf("/showroom/")===0;' +
              'var on=own||localStorage.getItem("exechq.color")==="on";' +
              'document.documentElement.dataset.color=on?"on":"off"}catch(e){}})()',
          }}
        />
      </head>
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
