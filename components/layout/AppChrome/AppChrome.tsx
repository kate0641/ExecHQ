import Link from "next/link";
import type { ReactNode } from "react";
import { navForChrome, type Flow } from "@/lib/manifest";

export interface AppChromeProps {
  flow: Flow;
  children: ReactNode;
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
 * The nav sits before `main` in the DOM in every chrome. On mobile it is moved
 * to the bottom of the screen visually with flex `order`, so reading order stays
 * navigation-then-content while the tab bar sits where a thumb expects it.
 */
export function AppChrome({ flow, children }: AppChromeProps) {
  const nav = navForChrome(flow.chrome);

  return (
    <div className={`chrome chrome--${flow.chrome}`}>
      <header className="chrome__header">
        <p className="chrome__wordmark">
          ExecHQ
          {flow.chrome === "enterprise" ? (
            <span className="chrome__wordmark-suffix"> Enterprise</span>
          ) : null}
        </p>
        {flow.chrome === "minimal" ? (
          <p className="chrome__context">{flow.title}</p>
        ) : null}
      </header>

      {nav.length > 0 ? (
        <nav className="chrome__nav" aria-label={`${flow.title} navigation`}>
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
