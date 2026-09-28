import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav, AppNavSlot } from "@/components/layout/AppNav";
import { Wordmark } from "@/components/primitives/Wordmark";
import { navForChrome, type Flow } from "@/lib/manifest";

export interface AppChromeProps {
  flow: Flow;
  children: ReactNode;
  /** On a navigation concept's page: the concept to show, and the flow whose
   *  page it is wrapping, which is the current destination. */
  navConcept?: { slug: string; currentFlow: string };
}

/**
 * The navigation chrome a flow's pages render inside. Real and functional even
 * while the destinations are placeholders — every item is a working link.
 *
 * Which chrome a page gets is declared once, on the flow, in the manifest:
 *   minimal    — wordmark and flow context only (Onboarding, Login)
 *   app        — the signed-in app: top nav on web and tablet, tab bar on mobile
 *   enterprise — the separate enterprise surface (web only)
 *
 * In the `app` chrome the nav is whichever navigation concept the reviewer is
 * judging (`AppNav`). The enterprise chrome keeps its own list.
 *
 * The nav sits before `main` in the DOM in every chrome. On mobile it is moved
 * to the bottom of the screen visually with flex `order`, so reading order stays
 * navigation-then-content while the tab bar sits where a thumb expects it.
 */
export function AppChrome({ flow, children, navConcept }: AppChromeProps) {
  const nav = navForChrome(flow.chrome);
  // "Main", because assistive technology already announces it as navigation.
  const navLabel = flow.chrome === "app" ? "Main" : `${flow.title} navigation`;
  const navProps = {
    destinations: nav,
    currentFlow: navConcept?.currentFlow ?? flow.slug,
    label: navLabel,
    concept: navConcept?.slug,
  };

  return (
    <div className={`chrome chrome--${flow.chrome}`}>
      {flow.header === false ? null : (
        <header className="chrome__header">
          {flow.chrome === "app" ? <AppNavSlot part="headerStart" {...navProps} /> : null}
          <Wordmark
            size="md"
            suffix={flow.chrome === "enterprise" ? "Enterprise" : undefined}
          />
          {flow.chrome === "app" ? <AppNavSlot part="headerEnd" {...navProps} /> : null}
        </header>
      )}

      {flow.chrome === "app" ? (
        <AppNav {...navProps} />
      ) : nav.length > 0 ? (
        <nav className="chrome__nav" aria-label={navLabel}>
          <ul className="chrome__nav-list">
            {nav.map((item) => {
              const isCurrent = item.flowSlug === flow.slug;
              return (
                <li className="chrome__nav-item" key={item.flowSlug}>
                  <Link
                    href={item.href}
                    className="chrome__nav-link"
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <main className="chrome__main" id="main">
        {children}
      </main>

      {flow.privacyFooter === false ? null : (
        <footer className="chrome__footer">
          <p className="chrome__footer-text">
            Private by default. Your employer, your network and your colleagues
            never see this account.
          </p>
        </footer>
      )}
    </div>
  );
}

export default AppChrome;
